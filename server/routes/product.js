const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const Product = require('../models/Product.model'); 

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // make sure this folder exists
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

// Route to add product
router.post('/add-product', upload.single('image'), async (req, res) => {
  try {
    const { name, description, price, category, quantity } = req.body;
    console.log('Received quantity:', quantity); 
    const imagePath = req.file ? `/uploads/${req.file.filename}` : '';

    // Save to DB
    const packets = JSON.parse(req.body.packets);
    const newProduct = new Product({
    name,
    description,
    category,
    packets,
    image: imagePath,
  });

    await newProduct.save();
    res.status(200).json({ message: 'Product added' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong' });
  }
});


router.get('/', async (req, res) => {
  try {
    const products = await Product.find(); // ✅ fetch all products
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});


router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error while deleting product' });
  }
});
module.exports = router;
