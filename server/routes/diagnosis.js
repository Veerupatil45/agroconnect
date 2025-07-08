// routes/diagnosis.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const DiagnosisRequest = require('../models/DiagnosisRequest');


const storage = multer.diskStorage({
  destination: 'uploads/diagnosis',
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  }
});
const upload = multer({ storage });

router.post('/submit', upload.single('image'), async (req, res) => {
  const { message, farmerName } = req.body;
  const imagePath = req.file ? `/uploads/diagnosis/${req.file.filename}` : '';

  try {
    const newRequest = new DiagnosisRequest({
      farmerName,
      message,
      imagePath
    });

    await newRequest.save(); //  Save to MongoDB
   // console.log(' Diagnosis saved:', newRequest);

    res.status(200).json({ msg: 'Request submitted successfully' });
  } catch (err) {
    console.error(' Save failed:', err);
    res.status(500).json({ msg: 'Failed to submit request' });
  }
});


router.get('/', async (req, res) => {
  try {
    const requests = await DiagnosisRequest.find().sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

// PUT /api/diagnosis/:id/reply
router.put('/:id/reply', async (req, res) => {
  const { suggestion } = req.body;
  try {
    const request = await DiagnosisRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ msg: 'Request not found' });

    request.suggestion = suggestion;
    request.status = 'Reviewed';
    request.reviewedAt = new Date();

    await request.save();
    res.json({ msg: 'Suggestion submitted' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});


module.exports = router;
