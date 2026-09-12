const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { authenticate, requireAdmin } = require('../middleware/auth');
const { getTestimonials, adminListTestimonials, createTestimonial, updateTestimonial, deleteTestimonial } = require('../controllers/testimonialController');

router.get('/', getTestimonials);
router.get('/admin/all', authenticate, requireAdmin, adminListTestimonials);
router.post('/', authenticate, requireAdmin, upload.single('avatar'), createTestimonial);
router.put('/:id', authenticate, requireAdmin, upload.single('avatar'), updateTestimonial);
router.delete('/:id', authenticate, requireAdmin, deleteTestimonial);

module.exports = router;
