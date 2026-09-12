const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { authenticate, requireAdmin } = require('../middleware/auth');
const { getCategories, adminListCategories, createCategory, updateCategory, deleteCategory } = require('../controllers/categoryController');

router.get('/', getCategories);
router.get('/admin/all', authenticate, requireAdmin, adminListCategories);
router.post('/', authenticate, requireAdmin, upload.single('image'), createCategory);
router.put('/:id', authenticate, requireAdmin, upload.single('image'), updateCategory);
router.delete('/:id', authenticate, requireAdmin, deleteCategory);

module.exports = router;
