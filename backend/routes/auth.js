// routes/auth.js
const express = require('express');
const router = express.Router();
const { adminLogin, getMe, updateProfile, loginDirect } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/login', loginDirect);
router.post('/admin-login', adminLogin);
router.get('/me', protect, getMe);
router.put('/update-profile', protect, updateProfile);

module.exports = router;
