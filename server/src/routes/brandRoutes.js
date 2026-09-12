const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { authenticate, requireAdmin } = require('../middleware/auth');
const { getBrands, createBrand, updateBrand, deleteBrand } = require('../controllers/brandController');

router.get('/', getBrands);
router.post('/', authenticate, requireAdmin, upload.single('logo'), createBrand);
router.put('/:id', authenticate, requireAdmin, upload.single('logo'), updateBrand);
router.delete('/:id', authenticate, requireAdmin, deleteBrand);

module.exports = router;
