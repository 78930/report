const jwt = require('jsonwebtoken');
const User = require('../models/User');
const OTP = require('../models/OTP');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '30d' });

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Send OTP via Twilio (or mock in dev)
const sendOTP = async (phone, otp) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`📱 DEV OTP for ${phone}: ${otp}`);
    return true;
  }
  try {
    const twilio = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    await twilio.messages.create({
      body: `Your CivicReport OTP is: ${otp}. Valid for 10 minutes. Do not share.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: `+91${phone}`,
    });
    return true;
  } catch (err) {
    console.error('Twilio error:', err.message);
    return false;
  }
};

// @POST /api/auth/send-otp
exports.sendOtp = async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone || !/^[6-9]\d{9}$/.test(phone)) {
      return res.status(400).json({ success: false, message: 'Invalid phone number' });
    }

    // Rate limit: max 3 OTPs per 10 minutes
    const recentOtps = await OTP.countDocuments({
      phone,
      expiresAt: { $gt: new Date() },
    });
    if (recentOtps >= 3) {
      return res.status(429).json({ success: false, message: 'Too many OTP requests. Try after 10 minutes.' });
    }

    const otp = generateOTP();
    await OTP.deleteMany({ phone }); // Clear old OTPs
    await OTP.create({ phone, otp });

    const sent = await sendOTP(phone, otp);
    if (!sent && process.env.NODE_ENV !== 'development') {
      return res.status(500).json({ success: false, message: 'Failed to send OTP' });
    }

    res.json({ success: true, message: 'OTP sent successfully', ...(process.env.NODE_ENV === 'development' && { otp }) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @POST /api/auth/verify-otp
exports.verifyOtp = async (req, res) => {
  try {
    const { phone, otp, name } = req.body;

    const otpRecord = await OTP.findOne({ phone, verified: false, expiresAt: { $gt: new Date() } }).sort({ createdAt: -1 });

    if (!otpRecord) {
      return res.status(400).json({ success: false, message: 'OTP expired or not found. Request a new OTP.' });
    }

    otpRecord.attempts += 1;
    if (otpRecord.attempts > 5) {
      await OTP.deleteOne({ _id: otpRecord._id });
      return res.status(429).json({ success: false, message: 'Too many failed attempts. Request a new OTP.' });
    }

    if (otpRecord.otp !== otp) {
      await otpRecord.save();
      return res.status(400).json({ success: false, message: 'Invalid OTP', attemptsLeft: 5 - otpRecord.attempts });
    }

    otpRecord.verified = true;
    await otpRecord.save();

    // Find or create user
    let user = await User.findOne({ phone });
    let isNewUser = false;

    if (!user) {
      if (!name) {
        return res.json({ success: true, message: 'OTP verified', phoneVerified: true, requiresRegistration: true });
      }
      user = await User.create({ phone, name, isVerified: true });
      isNewUser = true;
    } else {
      user.isVerified = true;
      await user.save();
    }

    const token = generateToken(user._id);
    res.json({
      success: true,
      message: isNewUser ? 'Registration successful' : 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        email: user.email,
        role: user.role,
        ward: user.ward,
        profilePic: user.profilePic,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @POST /api/auth/register-complete (after OTP verified)
exports.completeRegistration = async (req, res) => {
  try {
    const { phone, name, email, ward, address } = req.body;

    const otpRecord = await OTP.findOne({ phone, verified: true });
    if (!otpRecord) {
      return res.status(400).json({ success: false, message: 'Phone not verified' });
    }

    let user = await User.findOne({ phone });
    if (user) {
      user.name = name || user.name;
      user.email = email || user.email;
      user.ward = ward || user.ward;
      user.address = address || user.address;
    } else {
      user = await User.create({ phone, name, email, ward, address, isVerified: true });
    }
    await user.save();

    const token = generateToken(user._id);
    res.json({ success: true, token, user: { id: user._id, name: user.name, phone: user.phone, role: user.role } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @POST /api/auth/admin-login
exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, role: 'admin' }).select('+password');
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    const token = generateToken(user._id);
    res.json({ success: true, token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @GET /api/auth/me
exports.getMe = async (req, res) => {
  res.json({ success: true, user: req.user });
};

// @PUT /api/auth/update-profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, email, ward, address, pushToken } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, email, ward, address, pushToken },
      { new: true, runValidators: true }
    );
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
