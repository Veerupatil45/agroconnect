const express = require('express');
const router = express.Router();
const Scheme = require('../models/Scheme');

// Add new scheme (AEO/admin use)
router.post('/add', async (req, res) => {
  const { title, description, state, link } = req.body;

  try {
    const newScheme = new Scheme({ title, description, state, link });
    await newScheme.save();
    res.status(201).json({ msg: 'Scheme added successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Failed to add scheme' });
  }
});


// Get schemes with optional filters
router.get('/', async (req, res) => {
  const { state, crop } = req.query;

  let filter = {};
  if (state) filter.state = state;
  

  try {
    const schemes = await Scheme.find(filter).sort({ createdAt: -1 });
    res.json(schemes);
  } catch {
    res.status(500).json({ msg: 'Failed to fetch schemes' });
  }
});

module.exports = router;
