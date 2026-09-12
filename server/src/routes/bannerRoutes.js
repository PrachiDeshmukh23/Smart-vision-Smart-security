const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { authenticate, requireAdmin } = require('../middleware/auth');
const { getActiveBanners, adminListBanners, createBanner, updateBanner, deleteBanner } = require('../controllers/bannerController');

router.get('/', getActiveBanners);
router.get('/admin/all', authenticate, requireAdmin, adminListBanners);
router.post('/', authenticate, requireAdmin, upload.fields([
  { name: 'desktop_image', maxCount: 1 },
  { name: 'mobile_image', maxCount: 1 }
]), createBanner);
router.put('/:id', authenticate, requireAdmin, upload.fields([
  { name: 'desktop_image', maxCount: 1 },
  { name: 'mobile_image', maxCount: 1 }
]), updateBanner);
router.delete('/:id', authenticate, requireAdmin, deleteBanner);

module.exports = router;
