const db = require('../config/db');
const { makeSlug } = require('../utils/slugify');

async function getCategories(req, res, next) {
  try {
    const [all] = await db.query('SELECT * FROM categories WHERE status = "active" ORDER BY sort_order ASC, name ASC');
    const parents = all.filter(c => !c.parent_id);
    const result = parents.map(parent => ({
      ...parent,
      subcategories: all.filter(c => c.parent_id === parent.id)
    }));
    res.json({ success: true, categories: result, all });
  } catch (err) { next(err); }
}

async function adminListCategories(req, res, next) {
  try {
    const [categories] = await db.query(`
      SELECT c.*, p.name as parent_name
      FROM categories c
      LEFT JOIN categories p ON c.parent_id = p.id
      ORDER BY c.sort_order ASC, c.name ASC
    `);
    res.json({ success: true, categories });
  } catch (err) { next(err); }
}

async function createCategory(req, res, next) {
  try {
    const { name, parent_id, slug, description, sort_order, status } = req.body;
    if (!name) return res.status(400).json({ success: false, message: 'Category name is required' });
    const finalSlug = slug ? makeSlug(slug) : makeSlug(name);
    let image = req.file ? `/uploads/categories/${req.file.filename}` : (req.body.image || null);
    const [result] = await db.query(
      'INSERT INTO categories (parent_id, name, slug, description, image, sort_order, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [parent_id ? parseInt(parent_id, 10) : null, name, finalSlug, description || null, image, sort_order || 0, status || 'active']
    );
    res.status(201).json({ success: true, message: 'Category created', id: result.insertId });
  } catch (err) { next(err); }
}

async function updateCategory(req, res, next) {
  try {
    const { id } = req.params;
    const { name, parent_id, slug, description, sort_order, status } = req.body;
    const finalSlug = slug ? makeSlug(slug) : (name ? makeSlug(name) : undefined);
    let image = req.file ? `/uploads/categories/${req.file.filename}` : req.body.image;

    await db.query(`
      UPDATE categories SET
        parent_id = ?,
        name = COALESCE(?, name),
        slug = COALESCE(?, slug),
        description = ?,
        image = COALESCE(?, image),
        sort_order = ?,
        status = ?
      WHERE id = ?
    `, [parent_id ? parseInt(parent_id, 10) : null, name, finalSlug || null, description || null, image || null, sort_order || 0, status || 'active', id]);

    res.json({ success: true, message: 'Category updated successfully' });
  } catch (err) { next(err); }
}

async function deleteCategory(req, res, next) {
  try {
    const { id } = req.params;
    const [products] = await db.query('SELECT id FROM products WHERE category_id = ? LIMIT 1', [id]);
    if (products.length > 0) return res.status(400).json({ success: false, message: 'Cannot delete category that has products' });
    await db.query('DELETE FROM categories WHERE id = ?', [id]);
    res.json({ success: true, message: 'Category deleted' });
  } catch (err) { next(err); }
}

module.exports = { getCategories, adminListCategories, createCategory, updateCategory, deleteCategory };
