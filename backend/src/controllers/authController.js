const { registerUser, loginUser } = require('../services/authService');

const register = async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required' });
    }

const safeRole = role === 'admin' ? 'customer' : role; // prevent public admin signup
const user = await registerUser({ name, email, password, phone, role: safeRole });
    res.status(201).json({
      success: true,
      data: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const { user, token } = await loginUser({ email, password });

    res.status(200).json({
      success: true,
      data: { id: user._id, name: user.name, email: user.email, role: user.role, token },
    });
  } catch (err) {
    res.status(401).json({ success: false, message: err.message });
  }
};

const getMe = async (req, res) => {
  try {
    const User = require('../models/User');
    const user = await User.findById(req.user.id).select('-password');
    res.status(200).json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { register, login, getMe };