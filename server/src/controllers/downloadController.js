const db = require('../config/db');

async function getDownloads(req, res, next) {
  try {
    const { category } = req.query;
    let query = 'SELECT * FROM downloads WHERE status = "active"';
    const params = [];
    if (category && category !== 'All') {
      query += ' AND category = ?';
      params.push(category);
    }
    query += ' ORDER BY id DESC';
    const [downloads] = await db.query(query, params);
    res.json({ success: true, downloads });
  } catch (err) { next(err); }
}

async function trackDownload(req, res, next) {
  try {
    const { id } = req.params;
    await db.query('UPDATE downloads SET download_count = download_count + 1 WHERE id = ?', [id]);
    const [item] = await db.query('SELECT pdf_file, title FROM downloads WHERE id = ?', [id]);
    if (item.length === 0) return res.status(404).json({ success: false, message: 'File not found' });
    res.json({ success: true, url: item[0].pdf_file, title: item[0].title });
  } catch (err) { next(err); }
}

async function adminListDownloads(req, res, next) {
  try {
    const [downloads] = await db.query('SELECT * FROM downloads ORDER BY id DESC');
    res.json({ success: true, downloads });
  } catch (err) { next(err); }
}

async function createDownload(req, res, next) {
  try {
    const { title, category, description, status } = req.body;
    let pdfFile = req.body.pdf_file || null;
    let thumbnail = req.body.thumbnail || null;
    if (req.files && req.files['pdf_file']) pdfFile = `/uploads/downloads/${req.files['pdf_file'][0].filename}`;
    if (req.files && req.files['thumbnail']) thumbnail = `/uploads/downloads/${req.files['thumbnail'][0].filename}`;

    if (!title || (!pdfFile && !req.body.pdf_file)) {
      return res.status(400).json({ success: false, message: 'Title and PDF file required' });
    }

    const [result] = await db.query(
      'INSERT INTO downloads (title, category, description, pdf_file, thumbnail, status) VALUES (?, ?, ?, ?, ?, ?)',
      [title, category || 'Product Brochure', description || null, pdfFile, thumbnail, status || 'active']
    );
    res.status(201).json({ success: true, message: 'Download item created', id: result.insertId });
  } catch (err) { next(err); }
}

async function updateDownload(req, res, next) {
  try {
    const { id } = req.params;
    const { title, category, description, status, pdf_file, thumbnail } = req.body;
    let pdf = pdf_file;
    let thumb = thumbnail;
    if (req.files && req.files['pdf_file']) pdf = `/uploads/downloads/${req.files['pdf_file'][0].filename}`;
    if (req.files && req.files['thumbnail']) thumb = `/uploads/downloads/${req.files['thumbnail'][0].filename}`;

    await db.query(`
      UPDATE downloads SET
        title = COALESCE(?, title),
        category = COALESCE(?, category),
        description = ?,
        pdf_file = COALESCE(?, pdf_file),
        thumbnail = COALESCE(?, thumbnail),
        status = COALESCE(?, status)
      WHERE id = ?
    `, [title, category, description || null, pdf, thumb, status, id]);
    res.json({ success: true, message: 'Download updated' });
  } catch (err) { next(err); }
}

async function deleteDownload(req, res, next) {
  try {
    await db.query('DELETE FROM downloads WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Download deleted' });
  } catch (err) { next(err); }
}

module.exports = { getDownloads, trackDownload, adminListDownloads, createDownload, updateDownload, deleteDownload };
