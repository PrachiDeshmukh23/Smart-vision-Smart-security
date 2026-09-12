const db = require('../config/db');

async function getActiveOffers(req, res, next) {
  try {
    const [offers] = await db.query(`
      SELECT o.*, p.name as product_name, p.slug as product_slug, p.main_image as product_image
      FROM offers o
      LEFT JOIN products p ON o.related_product_id = p.id
      WHERE o.status = 'active'
        AND (o.end_date IS NULL OR o.end_date >= CURDATE())
      ORDER BY o.id DESC
    `);
    res.json({ success: true, offers });
  } catch (err) { next(err); }
}

async function adminListOffers(req, res, next) {
  try {
    const [offers] = await db.query(`
      SELECT o.*, p.name as product_name
      FROM offers o
      LEFT JOIN products p ON o.related_product_id = p.id
      ORDER BY o.id DESC
    `);
    res.json({ success: true, offers });
  } catch (err) { next(err); }
}

async function createOffer(req, res, next) {
  try {
    const { title, description, start_date, end_date, cta_text, cta_link, related_product_id, status } = req.body;
    let desktopPoster = req.body.desktop_poster || null;
    let mobilePoster = req.body.mobile_poster || desktopPoster;
    if (req.files && req.files['desktop_poster']) desktopPoster = `/uploads/offers/${req.files['desktop_poster'][0].filename}`;
    if (req.files && req.files['mobile_poster']) mobilePoster = `/uploads/offers/${req.files['mobile_poster'][0].filename}`;

    const [result] = await db.query(
      'INSERT INTO offers (title, description, desktop_poster, mobile_poster, start_date, end_date, cta_text, cta_link, related_product_id, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [title, description || null, desktopPoster, mobilePoster, start_date || null, end_date || null, cta_text || 'Enquire Now', cta_link || '/contact', related_product_id ? parseInt(related_product_id, 10) : null, status || 'active']
    );
    res.status(201).json({ success: true, message: 'Offer created', id: result.insertId });
  } catch (err) { next(err); }
}

async function updateOffer(req, res, next) {
  try {
    const { id } = req.params;
    const { title, description, start_date, end_date, cta_text, cta_link, related_product_id, status, desktop_poster, mobile_poster } = req.body;
    let desktopImg = desktop_poster;
    let mobileImg = mobile_poster;
    if (req.files && req.files['desktop_poster']) desktopImg = `/uploads/offers/${req.files['desktop_poster'][0].filename}`;
    if (req.files && req.files['mobile_poster']) mobileImg = `/uploads/offers/${req.files['mobile_poster'][0].filename}`;

    await db.query(`
      UPDATE offers SET
        title = COALESCE(?, title),
        description = ?,
        desktop_poster = COALESCE(?, desktop_poster),
        mobile_poster = COALESCE(?, mobile_poster),
        start_date = ?,
        end_date = ?,
        cta_text = COALESCE(?, cta_text),
        cta_link = COALESCE(?, cta_link),
        related_product_id = ?,
        status = COALESCE(?, status)
      WHERE id = ?
    `, [title, description || null, desktopImg, mobileImg, start_date || null, end_date || null, cta_text, cta_link, related_product_id ? parseInt(related_product_id, 10) : null, status, id]);
    res.json({ success: true, message: 'Offer updated' });
  } catch (err) { next(err); }
}

async function deleteOffer(req, res, next) {
  try {
    await db.query('DELETE FROM offers WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Offer deleted' });
  } catch (err) { next(err); }
}

module.exports = { getActiveOffers, adminListOffers, createOffer, updateOffer, deleteOffer };
