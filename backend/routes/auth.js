// routes/auth.js
const express = require('express');
const router = express.Router();
const { sendOtp, verifyOtp, completeRegistration, adminLogin, getMe, updateProfile } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);
router.post('/register-complete', completeRegistration);
router.post('/admin-login', adminLogin);
router.get('/me', protect, getMe);
router.put('/update-profile', protect, updateProfile);

module.exports = router;
