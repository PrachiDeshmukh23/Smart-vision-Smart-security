const express = require('express');
const router = express.Router();
const { authenticate, requireAdmin } = require('../middleware/auth');
const { submitEnquiry, adminListEnquiries, updateEnquiryStatus, deleteEnquiry } = require('../controllers/enquiryController');

router.post('/', submitEnquiry);
router.get('/admin/all', authenticate, requireAdmin, adminListEnquiries);
router.put('/:id/status', authenticate, requireAdmin, updateEnquiryStatus);
router.delete('/:id', authenticate, requireAdmin, deleteEnquiry);

module.exports = router;
