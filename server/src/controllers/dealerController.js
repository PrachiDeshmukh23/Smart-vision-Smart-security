const db = require('../config/db');

async function submitDealerApplication(req, res, next) {
  try {
    const {
      name, business_name, mobile, email, gst_number,
      address, city, state, pincode, current_business, interested_products, message
    } = req.body;

    if (!name || !business_name || !mobile || !city || !state) {
      return res.status(400).json({
        success: false,
        message: 'Name, Business Name, Mobile, City, and State are required fields.'
      });
    }

    const [result] = await db.query(`
      INSERT INTO dealer_applications (
        name, business_name, mobile, email, gst_number,
        address, city, state, pincode, current_business, interested_products, message, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pending')
    `, [
      name, business_name, mobile, email || null, gst_number || null,
      address || null, city, state, pincode || null,
      current_business || null, interested_products || null, message || null
    ]);

    res.status(201).json({
      success: true,
      message: 'Dealership application submitted successfully. Our partner manager will contact you soon.',
      id: result.insertId
    });
  } catch (err) { next(err); }
}

async function adminListDealers(req, res, next) {
  try {
    const { status, search } = req.query;
    let query = 'SELECT * FROM dealer_applications WHERE 1=1';
    const params = [];
    if (status && status !== 'All') {
      query += ' AND status = ?';
      params.push(status);
    }
    if (search) {
      query += ' AND (name LIKE ? OR business_name LIKE ? OR mobile LIKE ? OR city LIKE ? OR state LIKE ?)';
      const term = `%${search}%`;
      params.push(term, term, term, term, term);
    }
    query += ' ORDER BY id DESC';

    const [dealers] = await db.query(query, params);
    res.json({ success: true, dealers });
  } catch (err) { next(err); }
}

async function updateDealerStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const allowed = ['Pending', 'Contacted', 'Approved', 'Rejected'];
    if (!allowed.includes(status)) return res.status(400).json({ success: false, message: 'Invalid status' });
    await db.query('UPDATE dealer_applications SET status = ? WHERE id = ?', [status, id]);
    res.json({ success: true, message: 'Dealer status updated' });
  } catch (err) { next(err); }
}

async function deleteDealer(req, res, next) {
  try {
    await db.query('DELETE FROM dealer_applications WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Dealer application deleted' });
  } catch (err) { next(err); }
}

module.exports = { submitDealerApplication, adminListDealers, updateDealerStatus, deleteDealer };
