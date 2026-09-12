const db = require('../config/db');

async function getGallery(req, res, next) {
  try {
    const { category } = req.query;
    let query = 'SELECT * FROM gallery';
    const params = [];
    if (category && category !== 'All') {
      query += ' WHERE category = ?';
      params.push(category);
    }
    query += ' ORDER BY id DESC';
    const [items] = await db.query(query, params);
    res.json({ success: true, gallery: items });
  } catch (err) { next(err); }
}

async function createGalleryItem(req, res, next) {
  try {
    const { title, category } = req.body;
    let image = req.file ? `/uploads/gallery/${req.file.filename}` : (req.body.image || null);
    if (!title || !image) return res.status(400).json({ success: false, message: 'Title and image are required' });

    const [result] = await db.query('INSERT INTO gallery (title, category, image) VALUES (?, ?, ?)', [title, category || 'Products', image]);
    res.status(201).json({ success: true, message: 'Gallery item added', id: result.insertId });
  } catch (err) { next(err); }
}

async function deleteGalleryItem(req, res, next) {
  try {
    await db.query('DELETE FROM gallery WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Gallery item deleted' });
  } catch (err) { next(err); }
}

module.exports = { getGallery, createGalleryItem, deleteGalleryItem };
