const express = require('express');
const router = express.Router();
const { authenticate, requireAdmin } = require('../middleware/auth');
const { getDashboardMetrics } = require('../controllers/dashboardController');

router.get('/metrics', authenticate, requireAdmin, getDashboardMetrics);
router.get('/stats', authenticate, requireAdmin, getDashboardMetrics);
router.get('/', authenticate, requireAdmin, getDashboardMetrics);

module.exports = router;
