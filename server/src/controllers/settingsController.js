const db = require('../config/db');

async function getSettings(req, res, next) {
  try {
    const [settings] = await db.query('SELECT * FROM website_settings WHERE id = 1 LIMIT 1');
    if (settings.length === 0) {
      return res.json({
        success: true,
        settings: {
          company_name: 'GS Vision',
          tagline: 'Smart Vision.. Smart Security',
          phone: '+91 98765 43210',
          secondary_phone: '+91 98765 43211',
          email: 'sales@gsvision.com',
          support_email: 'support@gsvision.com',
          whatsapp_number: '919876543210',
          address: 'Plot No. 45, Industrial Area, Electronic City, Phase II, New Delhi - 110020, India',
          business_hours: 'Monday - Saturday: 9:30 AM - 7:00 PM (Sunday Closed)'
        }
      });
    }
    res.json({ success: true, settings: settings[0] });
  } catch (err) { next(err); }
}

async function updateSettings(req, res, next) {
  try {
    const {
      company_name, tagline, phone, secondary_phone, email, support_email,
      whatsapp_number, address, map_embed_url, business_hours, facebook_url,
      youtube_url, instagram_url, linkedin_url, about_short, about_full,
      vision_text, mission_text, quality_commitment
    } = req.body;

    await db.query(`
      UPDATE website_settings SET
        company_name = COALESCE(?, company_name),
        tagline = COALESCE(?, tagline),
        phone = COALESCE(?, phone),
        secondary_phone = COALESCE(?, secondary_phone),
        email = COALESCE(?, email),
        support_email = COALESCE(?, support_email),
        whatsapp_number = COALESCE(?, whatsapp_number),
        address = COALESCE(?, address),
        map_embed_url = COALESCE(?, map_embed_url),
        business_hours = COALESCE(?, business_hours),
        facebook_url = COALESCE(?, facebook_url),
        youtube_url = COALESCE(?, youtube_url),
        instagram_url = COALESCE(?, instagram_url),
        linkedin_url = COALESCE(?, linkedin_url),
        about_short = COALESCE(?, about_short),
        about_full = COALESCE(?, about_full),
        vision_text = COALESCE(?, vision_text),
        mission_text = COALESCE(?, mission_text),
        quality_commitment = COALESCE(?, quality_commitment)
      WHERE id = 1
    `, [
      company_name, tagline, phone, secondary_phone, email, support_email,
      whatsapp_number, address, map_embed_url, business_hours, facebook_url,
      youtube_url, instagram_url, linkedin_url, about_short, about_full,
      vision_text, mission_text, quality_commitment
    ]);

    const [updated] = await db.query('SELECT * FROM website_settings WHERE id = 1 LIMIT 1');
    res.json({ success: true, message: 'Settings updated successfully', settings: updated[0] });
  } catch (err) { next(err); }
}

module.exports = { getSettings, updateSettings };
