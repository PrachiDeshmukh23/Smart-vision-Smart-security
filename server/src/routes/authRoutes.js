const express = require('express');
const router = express.Router();
const { login, getProfile, updateProfile, listUsers, createUser, deleteUser } = require('../controllers/authController');
const { authenticate, requireAdmin } = require('../middleware/auth');

router.post('/login', login);
router.get('/me', authenticate, getProfile);
router.put('/profile', authenticate, updateProfile);
router.get('/users', authenticate, requireAdmin, listUsers);
router.post('/users', authenticate, requireAdmin, createUser);
router.delete('/users/:id', authenticate, requireAdmin, deleteUser);

module.exports = router;
