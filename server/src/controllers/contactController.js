const db = require('../config/db');

async function submitContactMessage(req, res, next) {
  try {
    const { name, mobile, email, subject, message } = req.body;
    if (!name || !email || !message) return res.status(400).json({ success: false, message: 'Name, Email and Message are required.' });

    const [result] = await db.query(
      'INSERT INTO contact_messages (name, mobile, email, subject, message, status) VALUES (?, ?, ?, ?, ?, "Unread")',
      [name, mobile || null, email, subject || 'General Inquiry', message]
    );
    res.status(201).json({
      success: true,
      message: 'Your message has been sent successfully! Our GS Vision team will connect with you soon.',
      id: result.insertId
    });
  } catch (err) { next(err); }
}

async function adminListMessages(req, res, next) {
  try {
    const { status, search } = req.query;
    let query = 'SELECT * FROM contact_messages WHERE 1=1';
    const params = [];
    if (status && status !== 'All') {
      query += ' AND status = ?';
      params.push(status);
    }
    if (search) {
      query += ' AND (name LIKE ? OR email LIKE ? OR subject LIKE ? OR message LIKE ?)';
      const term = `%${search}%`;
      params.push(term, term, term, term);
    }
    query += ' ORDER BY id DESC';
    const [messages] = await db.query(query, params);
    res.json({ success: true, messages });
  } catch (err) { next(err); }
}

async function updateMessageStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status } = req.body;
    await db.query('UPDATE contact_messages SET status = ? WHERE id = ?', [status, id]);
    res.json({ success: true, message: 'Message status updated' });
  } catch (err) { next(err); }
}

async function deleteMessage(req, res, next) {
  try {
    await db.query('DELETE FROM contact_messages WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Message deleted' });
  } catch (err) { next(err); }
}

module.exports = { submitContactMessage, adminListMessages, updateMessageStatus, deleteMessage };
