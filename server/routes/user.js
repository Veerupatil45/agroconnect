const express = require('express');
const router = express.Router();
const User = require('../models/User');
const multer = require('multer');
const path = require('path');

// image storage config
const storage = multer.diskStorage({
  destination: './uploads',
  filename: (req, file, cb) => {
    cb(null, `profile-${Date.now()}${path.extname(file.originalname)}`);
  }
});
const upload = multer({ storage });


// ✅ GET: Fetch user profile by ID
router.get('/profile/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ PUT: Update user profile and image
router.put('/profile/:id', upload.single('profileImage'), async (req, res) => {
  const { name, phone, location } = req.body;
  const updateData = { name, phone, location };
  if (req.file) {
    updateData.profileImage = `/uploads/${req.file.filename}`;
  }

  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).select('-password');
    res.json(user);
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ message: 'Update failed' });
  }
});

module.exports = router;
