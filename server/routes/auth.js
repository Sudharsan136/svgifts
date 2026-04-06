const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

// @route  POST /api/auth/login
// @desc   Admin login
// @access Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(401).json({ message: 'Invalid email or password' });

    const isMatch = await admin.matchPassword(password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid email or password' });

    res.json({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      token: generateToken(admin._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @route  GET /api/auth/me
// @desc   Get current admin info
// @access Private
const { protect } = require('../middleware/auth');
router.get('/me', protect, async (req, res) => {
  res.json(req.admin);
});

module.exports = router;
