const db = require('../config/db');

async function getActiveBanners(req, res, next) {
  try {
    const [banners] = await db.query('SELECT * FROM banners WHERE active = 1 ORDER BY sort_order ASC, id ASC');
    res.json({ success: true, banners });
  } catch (err) { next(err); }
}

async function adminListBanners(req, res, next) {
  try {
    const [banners] = await db.query('SELECT * FROM banners ORDER BY sort_order ASC, id DESC');
    res.json({ success: true, banners });
  } catch (err) { next(err); }
}

async function createBanner(req, res, next) {
  try {
    const { title, subtitle, cta_text, cta_url, position, sort_order, active } = req.body;
    let desktopImage = req.body.desktop_image || '/assets/banners/hero-1.jpg';
    let mobileImage = req.body.mobile_image || desktopImage;
    if (req.files && req.files['desktop_image']) desktopImage = `/uploads/banners/${req.files['desktop_image'][0].filename}`;
    if (req.files && req.files['mobile_image']) mobileImage = `/uploads/banners/${req.files['mobile_image'][0].filename}`;

    const [result] = await db.query(
      'INSERT INTO banners (title, subtitle, desktop_image, mobile_image, cta_text, cta_url, position, sort_order, active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [title, subtitle || null, desktopImage, mobileImage, cta_text || 'Explore Products', cta_url || '/products', position || 'home_hero', sort_order || 0, active !== undefined ? (active ? 1 : 0) : 1]
    );
    res.status(201).json({ success: true, message: 'Banner created', id: result.insertId });
  } catch (err) { next(err); }
}

async function updateBanner(req, res, next) {
  try {
    const { id } = req.params;
    const { title, subtitle, cta_text, cta_url, position, sort_order, active, desktop_image, mobile_image } = req.body;
    let desktopImg = desktop_image;
    let mobileImg = mobile_image;
    if (req.files && req.files['desktop_image']) desktopImg = `/uploads/banners/${req.files['desktop_image'][0].filename}`;
    if (req.files && req.files['mobile_image']) mobileImg = `/uploads/banners/${req.files['mobile_image'][0].filename}`;

    await db.query(`
      UPDATE banners SET
        title = COALESCE(?, title),
        subtitle = ?,
        desktop_image = COALESCE(?, desktop_image),
        mobile_image = COALESCE(?, mobile_image),
        cta_text = COALESCE(?, cta_text),
        cta_url = COALESCE(?, cta_url),
        position = COALESCE(?, position),
        sort_order = COALESCE(?, sort_order),
        active = COALESCE(?, active)
      WHERE id = ?
    `, [title, subtitle || null, desktopImg, mobileImg, cta_text, cta_url, position, sort_order, active !== undefined ? (active ? 1 : 0) : null, id]);
    res.json({ success: true, message: 'Banner updated' });
  } catch (err) { next(err); }
}

async function deleteBanner(req, res, next) {
  try {
    await db.query('DELETE FROM banners WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Banner deleted' });
  } catch (err) { next(err); }
}

module.exports = { getActiveBanners, adminListBanners, createBanner, updateBanner, deleteBanner };
