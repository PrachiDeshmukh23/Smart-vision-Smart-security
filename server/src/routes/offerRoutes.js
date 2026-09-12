const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { authenticate, requireAdmin } = require('../middleware/auth');
const { getActiveOffers, adminListOffers, createOffer, updateOffer, deleteOffer } = require('../controllers/offerController');

router.get('/', getActiveOffers);
router.get('/admin/all', authenticate, requireAdmin, adminListOffers);
router.post('/', authenticate, requireAdmin, upload.fields([
  { name: 'desktop_poster', maxCount: 1 },
  { name: 'mobile_poster', maxCount: 1 }
]), createOffer);
router.put('/:id', authenticate, requireAdmin, upload.fields([
  { name: 'desktop_poster', maxCount: 1 },
  { name: 'mobile_poster', maxCount: 1 }
]), updateOffer);
router.delete('/:id', authenticate, requireAdmin, deleteOffer);

module.exports = router;
