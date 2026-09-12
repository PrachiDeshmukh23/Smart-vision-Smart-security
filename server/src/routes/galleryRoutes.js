const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { authenticate, requireAdmin } = require('../middleware/auth');
const { getGallery, createGalleryItem, deleteGalleryItem } = require('../controllers/galleryController');

router.get('/', getGallery);
router.post('/', authenticate, requireAdmin, upload.single('image'), createGalleryItem);
router.delete('/:id', authenticate, requireAdmin, deleteGalleryItem);

module.exports = router;
