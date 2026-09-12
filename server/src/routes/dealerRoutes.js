const express = require('express');
const router = express.Router();
const { authenticate, requireAdmin } = require('../middleware/auth');
const { submitDealerApplication, adminListDealers, updateDealerStatus, deleteDealer } = require('../controllers/dealerController');

router.post('/', submitDealerApplication);
router.get('/admin/all', authenticate, requireAdmin, adminListDealers);
router.put('/:id/status', authenticate, requireAdmin, updateDealerStatus);
router.delete('/:id', authenticate, requireAdmin, deleteDealer);

module.exports = router;
