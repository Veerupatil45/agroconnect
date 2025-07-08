const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const Resource = require('../models/Resources');

// ✅ Setup storage with auto-create folder
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = 'uploads/resources';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true }); // ensure directory exists
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // e.g. 168572389.pdf
  },
});

// ✅ Create upload middleware AFTER storage setup
const upload = multer({ storage });

// ✅ POST route for uploading resource
router.post('/upload', upload.single('file'), async (req, res) => {
  const { title, description, type } = req.body;

  let fileUrl = '';
  if (type === 'link') {
    fileUrl = req.body.link;
  } else if (req.file) {
    fileUrl = `/uploads/resources/${req.file.filename}`;
  } else {
    return res.status(400).json({ msg: 'File is required for PDF or video' });
  }

  try {
    const newResource = new Resource({
      title,
      description,
      type,
      fileUrl,
    });

    await newResource.save();
    res.status(201).json({ msg: 'Resource uploaded successfully' });
  } catch (err) {
    console.error('Upload Error:', err);
    res.status(500).json({ msg: 'Upload failed' });
  }
});

// ✅ GET route to fetch resources
router.get('/', async (req, res) => {
  try {
    const resources = await Resource.find().sort({ uploadedAt: -1 });
    res.json(resources);
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching resources' });
  }
});

module.exports = router;
