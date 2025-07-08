const express = require('express');
const router = express.Router();
const Order = require('../models/orders');
const sendEmail = require('../utils/sendEmail');
const User = require('../models/User');

// 🔹 Create Order
router.post('/create', async (req, res) => {
 const { buyer, address, paymentMethod, items, total, razorpay_payment_id, razorpay_order_id } = req.body;

  try {
    const order = new Order({
    buyer,
    address,
    paymentMethod,
    items,
    total,
    razorpay_payment_id,
    razorpay_order_id,
    });
    await order.save()
    // ✅ Find buyer email
    const buyerUser = await User.findOne({ name: buyer });
    if (buyerUser?.email) {
      await sendEmail(
        buyerUser.email,
        '✅ Order Placed - AgroConnect',
        `<p>Hi ${buyer},</p><p>Your order has been successfully placed. Total: ₹${total}</p><p>Thanks for shopping with AgroConnect.</p>`
      );
    }

    res.status(200).json({ message: 'Order placed successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Order creation failed' });
  }
});
// 🔹 Get Orders by Buyer
router.get('/buyer/:buyerName', async (req, res) => {
  try {
    const orders = await Order.find({ buyer: req.params.buyerName });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get buyer orders' });
  }
});

// 🔹 Get Orders by Seller
router.get('/seller/:sellerName', async (req, res) => {
  try {
    const orders = await Order.find({ 'items.seller': req.params.sellerName });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get seller orders' });
  }
});

// 🔹 Get All Orders (admin)
router.get('/all', async (req, res) => {
  try {
    const allOrders = await Order.find();
    res.json(allOrders);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching all orders' });
  }
});

// 🔹 Mark Order Completed
router.put('/:orderId/complete', async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) return res.status(404).json({ error: 'Order not found' });

    order.status = 'Completed';
    order.completedAt = new Date(); // ✅ Add timestamp
    await order.save();

    const uniqueSellers = [...new Set(order.items.map(item => item.seller))];
    for (const sellerName of uniqueSellers) {
      const sellerUser = await User.findOne({ name: sellerName });
      if (sellerUser?.email) {
        await sendEmail(
          sellerUser.email,
          '🎉 Your Crop Has Been Sold!',
          `<p>Hi ${sellerUser.name},</p><p>Your crop(s) included in a recent order have been marked as completed.</p><p>Thanks for using AgroConnect!</p>`
        );
      }
    }

    res.json({ message: 'Order marked as completed and seller notified' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

module.exports = router;
