const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Crop = require('../models/crop');

  

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) =>
    cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({ storage });

// Add crop
router.post('/add', upload.single('image'), async (req, res) => {
  const { name, description, quantity, price, location, seller } = req.body;
  const imagePath = req.file ? `/uploads/${req.file.filename}` : '';

  const crop = new Crop({
    name,
    description,
    quantity,
    price,
    location,
    image: imagePath,
    seller,
    approved: false, // ❗ Not approved yet
  });

  try {
    await crop.save();
    res.json({ message: 'Crop uploaded. Awaiting admin approval.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add crop' });
  }
});

// Get all crops (only available ones)
router.get('/', async (req, res) => {
  const { search = '', location = '' } = req.query;

  try {
    const query = {
      approved: true,
      available: true,
    };

    if (search) {
      query.name = { $regex: search, $options: 'i' }; // case-insensitive search
    }

    if (location) {
      query.location = { $regex: `^${location}$`, $options: 'i' }; // exact match case-insensitive
    }

    const crops = await Crop.find(query);
    res.json(crops);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});



// Delete crop by ID
router.delete('/:id', async (req, res) => {
  try {
    await Crop.findByIdAndDelete(req.params.id);
    res.json({ message: 'Crop deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Error deleting crop' });
  }
});

router.get('/all', async (req, res) => {
  const crops = await Crop.find({});
  console.log("All Crops:", crops.map(c => c.seller));
  res.json(crops);
});


// ✅ Mark crop as sold
router.put('/:id/mark-sold', async (req, res) => {
  try {
    const crop = await Crop.findById(req.params.id);
    if (!crop) return res.status(404).json({ error: 'Crop not found' });

    crop.available = false;
    await crop.save();

    res.json({ message: 'Crop marked as sold' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to mark crop as sold' });
  }
});

// GET crops by seller
router.get('/seller/:email', async (req, res) => {
  try {
    const crops = await Crop.find({ seller: req.params.email });
    res.json(crops);
  } catch (err) {
    console.error('Fetch seller crops error:', err);
    res.status(500).json({ error: 'Failed to fetch seller crops' });
  }
});

//filter route
router.get('/location/:location', async (req, res) => {
  try {
    const crops = await Crop.find({ location: req.params.location, approved: true });
    res.json(crops);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch crops by location' });
  }
});

module.exports = router;
