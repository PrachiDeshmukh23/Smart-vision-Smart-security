const express = require('express');
const router = express.Router();
const { authenticate, requireAdmin } = require('../middleware/auth');
const { submitContactMessage, adminListMessages, updateMessageStatus, deleteMessage } = require('../controllers/contactController');

router.post('/', submitContactMessage);
router.get('/admin/all', authenticate, requireAdmin, adminListMessages);
router.put('/:id/status', authenticate, requireAdmin, updateMessageStatus);
router.delete('/:id', authenticate, requireAdmin, deleteMessage);

module.exports = router;
