const db = require('../config/db');

async function submitEnquiry(req, res, next) {
  try {
    const { name, mobile, email, city, company, product_id, quantity, message } = req.body;
    if (!name || !mobile) return res.status(400).json({ success: false, message: 'Name and mobile number are required.' });

    const [result] = await db.query(`
      INSERT INTO enquiries (product_id, name, mobile, email, city, company, quantity, message, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'New')
    `, [product_id ? parseInt(product_id, 10) : null, name, mobile, email || null, city || null, company || null, quantity || '1', message || null]);

    res.status(201).json({
      success: true,
      message: 'Thank you for your enquiry. Our GS Vision security specialist will contact you shortly.',
      id: result.insertId
    });
  } catch (err) { next(err); }
}

async function adminListEnquiries(req, res, next) {
  try {
    const { status, search } = req.query;
    let query = `
      SELECT e.*, p.name as product_name, p.model_number as product_model, p.main_image as product_image
      FROM enquiries e
      LEFT JOIN products p ON e.product_id = p.id
      WHERE 1=1
    `;
    const params = [];
    if (status && status !== 'All') {
      query += ' AND e.status = ?';
      params.push(status);
    }
    if (search) {
      query += ' AND (e.name LIKE ? OR e.mobile LIKE ? OR e.email LIKE ? OR e.city LIKE ? OR e.company LIKE ?)';
      const term = `%${search}%`;
      params.push(term, term, term, term, term);
    }
    query += ' ORDER BY e.id DESC';

    const [enquiries] = await db.query(query, params);
    res.json({ success: true, enquiries });
  } catch (err) { next(err); }
}

async function updateEnquiryStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const allowed = ['New', 'Contacted', 'Follow-up', 'Completed', 'Cancelled'];
    if (!allowed.includes(status)) return res.status(400).json({ success: false, message: 'Invalid status' });
    await db.query('UPDATE enquiries SET status = ? WHERE id = ?', [status, id]);
    res.json({ success: true, message: 'Status updated successfully' });
  } catch (err) { next(err); }
}

async function deleteEnquiry(req, res, next) {
  try {
    await db.query('DELETE FROM enquiries WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Enquiry deleted' });
  } catch (err) { next(err); }
}

module.exports = { submitEnquiry, adminListEnquiries, updateEnquiryStatus, deleteEnquiry };
