const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin.model');
const Product = require('../models/Product.model');
const mongoose = require('mongoose');
const Crop = require('../models/crop');
const User = require('../models/User'); // ✅ User model
const Order = require('../models/orders');


// Admin login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const admin = await Admin.findOne({ email });
  if (admin && admin.password === password) {
    res.status(200).json({ message: 'Login successful', isAdmin: true });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

// Add a new product (seed or pesticide)
router.post('/add-product', async (req, res) => {
  const { name, description, price, image, category } = req.body;
  const newProduct = new Product({ name, description, price, image, category });
  await newProduct.save();
  res.status(201).json({ message: 'Product added successfully' });
});

// Get all products
router.get('/products', async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

router.put('/:id/approve', async (req, res) => {
  try {
    const crop = await Crop.findById(req.params.id);
    if (!crop) return res.status(404).json({ error: 'Crop not found' });

    crop.approved = true;
    crop.approvedAt = new Date(); // Set approval time
    await crop.save();

    res.json({ message: 'Crop approved successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Approval failed' });
  }
});

// PUT /api/admin/:id/reject
router.put('/:id/reject', async (req, res) => {
  try {
    const crop = await Crop.findById(req.params.id);
    if (!crop) return res.status(404).send('Crop not found');

    crop.rejected = true;
    crop.approved = false;
    await crop.save();

    res.send({ message: 'Crop rejected successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});


router.get('/dashboard-stats', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const allOrders = await Order.find();
    const totalRevenue = allOrders.reduce((acc, order) => acc + order.total, 0);
    const totalOrders = allOrders.length;
    const completedOrders = allOrders.filter(o => o.status === 'Completed').length;
    const pendingOrders = totalOrders - completedOrders;

    // Daily analytics - last 7 days
    const last7Days = new Array(7).fill(0);
    const today = new Date();
    allOrders.forEach(order => {
      const createdDate = new Date(order.createdAt);
      const dayDiff = Math.floor((today - createdDate) / (1000 * 60 * 60 * 24));
      if (dayDiff >= 0 && dayDiff < 7) {
        last7Days[6 - dayDiff] += order.total;
      }
    });

    res.json({
      totalUsers,
      totalOrders,
      totalRevenue,
      completedOrders,
      pendingOrders,
      last7DaysRevenue: last7Days // latest day at the end
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Dashboard stats fetch failed' });
  }
});

module.exports = router;
