const express = require('express');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const router = express.Router();

const razorpay = new Razorpay({
  key_id: 'rzp_test_UThAL9MCeKDZvE',
  key_secret: 'erSCJq7lN3OQHAjB4yr9WUqh', // Keep this secret!
});

// ✅ Create Razorpay order
router.post('/create-order', async (req, res) => {
  const { amount } = req.body;
  const options = {
    amount: amount * 100, // Razorpay works in paise
    currency: 'INR',
    receipt: `rcptid_${Math.floor(Math.random() * 10000)}`,
  };

  try {
    const order = await razorpay.orders.create(options);
    res.status(200).json(order);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create Razorpay order' });
  }
});
module.exports = router;