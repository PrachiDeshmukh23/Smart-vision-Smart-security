const db = require('../config/db');
const { makeSlug } = require('../utils/slugify');

async function getBrands(req, res, next) {
  try {
    const [brands] = await db.query('SELECT * FROM brands WHERE status = "active" ORDER BY name ASC');
    res.json({ success: true, brands });
  } catch (err) { next(err); }
}

async function createBrand(req, res, next) {
  try {
    const { name, slug, status } = req.body;
    if (!name) return res.status(400).json({ success: false, message: 'Brand name required' });
    const finalSlug = slug ? makeSlug(slug) : makeSlug(name);
    let logo = req.file ? `/uploads/products/${req.file.filename}` : (req.body.logo || null);
    const [result] = await db.query('INSERT INTO brands (name, slug, logo, status) VALUES (?, ?, ?, ?)', [name, finalSlug, logo, status || 'active']);
    res.status(201).json({ success: true, message: 'Brand created', id: result.insertId });
  } catch (err) { next(err); }
}

async function updateBrand(req, res, next) {
  try {
    const { id } = req.params;
    const { name, slug, status } = req.body;
    let logo = req.file ? `/uploads/products/${req.file.filename}` : req.body.logo;
    await db.query('UPDATE brands SET name = COALESCE(?, name), slug = COALESCE(?, slug), logo = COALESCE(?, logo), status = COALESCE(?, status) WHERE id = ?', [name, slug ? makeSlug(slug) : null, logo, status, id]);
    res.json({ success: true, message: 'Brand updated' });
  } catch (err) { next(err); }
}

async function deleteBrand(req, res, next) {
  try {
    await db.query('DELETE FROM brands WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Brand deleted' });
  } catch (err) { next(err); }
}

module.exports = { getBrands, createBrand, updateBrand, deleteBrand };
