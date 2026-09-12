const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { authenticate, requireAdmin } = require('../middleware/auth');
const {
  getAllProducts,
  getProductBySlug,
  adminListProducts,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');

// Public
router.get('/', getAllProducts);
router.get('/slug/:slug', getProductBySlug);

// Admin
router.get('/admin/all', authenticate, requireAdmin, adminListProducts);
router.post('/', authenticate, requireAdmin, upload.fields([
  { name: 'main_image', maxCount: 1 },
  { name: 'brochure', maxCount: 1 },
  { name: 'gallery_images', maxCount: 8 }
]), createProduct);
router.put('/:id', authenticate, requireAdmin, upload.fields([
  { name: 'main_image', maxCount: 1 },
  { name: 'brochure', maxCount: 1 },
  { name: 'gallery_images', maxCount: 8 }
]), updateProduct);
router.delete('/:id', authenticate, requireAdmin, deleteProduct);

module.exports = router;
