const db = require('../config/db');

async function getTestimonials(req, res, next) {
  try {
    const [testimonials] = await db.query('SELECT * FROM testimonials WHERE status = "active" ORDER BY id DESC');
    res.json({ success: true, testimonials });
  } catch (err) { next(err); }
}

async function adminListTestimonials(req, res, next) {
  try {
    const [testimonials] = await db.query('SELECT * FROM testimonials ORDER BY id DESC');
    res.json({ success: true, testimonials });
  } catch (err) { next(err); }
}

async function createTestimonial(req, res, next) {
  try {
    const { client_name, company, rating, comment, status } = req.body;
    let avatar = req.file ? `/uploads/products/${req.file.filename}` : (req.body.avatar || null);
    if (!client_name || !comment) return res.status(400).json({ success: false, message: 'Name and comment are required' });

    const [result] = await db.query(
      'INSERT INTO testimonials (client_name, company, rating, comment, avatar, status) VALUES (?, ?, ?, ?, ?, ?)',
      [client_name, company || null, parseInt(rating, 10) || 5, comment, avatar, status || 'active']
    );
    res.status(201).json({ success: true, message: 'Testimonial created', id: result.insertId });
  } catch (err) { next(err); }
}

async function updateTestimonial(req, res, next) {
  try {
    const { id } = req.params;
    const { client_name, company, rating, comment, status, avatar } = req.body;
    let av = req.file ? `/uploads/products/${req.file.filename}` : avatar;

    await db.query(`
      UPDATE testimonials SET
        client_name = COALESCE(?, client_name),
        company = ?,
        rating = COALESCE(?, rating),
        comment = COALESCE(?, comment),
        avatar = COALESCE(?, avatar),
        status = COALESCE(?, status)
      WHERE id = ?
    `, [client_name, company || null, rating ? parseInt(rating, 10) : null, comment, av, status, id]);
    res.json({ success: true, message: 'Testimonial updated' });
  } catch (err) { next(err); }
}

async function deleteTestimonial(req, res, next) {
  try {
    await db.query('DELETE FROM testimonials WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Testimonial deleted' });
  } catch (err) { next(err); }
}

module.exports = { getTestimonials, adminListTestimonials, createTestimonial, updateTestimonial, deleteTestimonial };
