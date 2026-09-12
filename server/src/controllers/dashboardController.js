const db = require('../config/db');

async function getDashboardMetrics(req, res, next) {
  try {
    const [products] = await db.query('SELECT * FROM products');
    const [categories] = await db.query('SELECT * FROM categories');
    const [enquiries] = await db.query('SELECT * FROM enquiries');
    const [dealers] = await db.query('SELECT * FROM dealer_applications');
    const [offers] = await db.query('SELECT * FROM offers');
    const [downloads] = await db.query('SELECT * FROM downloads');
    const [messages] = await db.query('SELECT * FROM contact_messages');

    const total_products = Array.isArray(products) ? products.length : 0;
    const total_categories = Array.isArray(categories) ? categories.length : 0;
    const new_enquiries = Array.isArray(enquiries) ? enquiries.filter(e => e.status === 'pending' || e.status === 'New').length : 0;
    const pending_dealers = Array.isArray(dealers) ? dealers.filter(d => d.status === 'pending' || d.status === 'Pending').length : 0;
    const active_offers = Array.isArray(offers) ? offers.filter(o => o.is_active || o.status === 'active').length : 0;
    const total_downloads = Array.isArray(downloads) ? downloads.reduce((acc, d) => acc + (d.download_count || 0), 0) : 0;
    const unread_messages = Array.isArray(messages) ? messages.filter(m => m.status === 'unread' || m.status === 'Unread').length : 0;

    const recent_enquiries = Array.isArray(enquiries) ? enquiries.slice(0, 5) : [];
    const recent_dealers = Array.isArray(dealers) ? dealers.slice(0, 5) : [];
    const latest_products = Array.isArray(products) ? products.slice(0, 5) : [];

    res.json({
      success: true,
      metrics: {
        total_products,
        total_categories,
        new_enquiries,
        pending_dealers,
        active_offers,
        total_downloads,
        unread_messages,
        estimated_visitors: 1284
      },
      recent_enquiries,
      recent_dealers,
      latest_products
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { getDashboardMetrics };
