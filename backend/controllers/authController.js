const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '30d' });

// OTP-based endpoints removed — using direct login instead.

// @POST /api/auth/login
// Direct login without OTP: accepts `phone` and optional `name`.
exports.loginDirect = async (req, res) => {
  try {
    const { phone, name } = req.body;
    if (!phone || !/^[6-9]\d{9}$/.test(phone)) {
      return res.status(400).json({ success: false, message: 'Invalid phone number' });
    }

    // Find or create user
    let user = await User.findOne({ phone });
    let isNewUser = false;
    if (!user) {
      user = await User.create({ phone, name: name || 'Anonymous', isVerified: true });
      isNewUser = true;
    } else {
      // Update name if provided and not empty
      if (name && name.trim()) {
        user.name = name.trim();
      }
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

// Registration completion via OTP removed; direct login handles registration.

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
