const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { authenticate, requireAdmin } = require('../middleware/auth');
const { getDownloads, trackDownload, adminListDownloads, createDownload, updateDownload, deleteDownload } = require('../controllers/downloadController');

router.get('/', getDownloads);
router.post('/:id/track', trackDownload);
router.get('/admin/all', authenticate, requireAdmin, adminListDownloads);
router.post('/', authenticate, requireAdmin, upload.fields([
  { name: 'pdf_file', maxCount: 1 },
  { name: 'thumbnail', maxCount: 1 }
]), createDownload);
router.put('/:id', authenticate, requireAdmin, upload.fields([
  { name: 'pdf_file', maxCount: 1 },
  { name: 'thumbnail', maxCount: 1 }
]), updateDownload);
router.delete('/:id', authenticate, requireAdmin, deleteDownload);

module.exports = router;
