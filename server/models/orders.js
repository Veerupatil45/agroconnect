const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  buyer: { type: String, required: true },
  address: { type: String, required: true },
  paymentMethod: { type: String, required: true }, // razorpay or cod

  items: [
    {
      cropId: { type: mongoose.Schema.Types.ObjectId, ref: 'Crop' },
      name: String,
      price: Number,
      seller: String
    }
  ],

  total: { type: Number, required: true },
  status: { type: String, default: 'Pending' }, // Pending, Completed, Failed
  completedAt: { type: Date, default: null },

  // ✅ Razorpay fields
  razorpayOrderId: { type: String },     // rzp_order_...
  razorpayPaymentId: { type: String },   // rzp_payment_...
  razorpaySignature: { type: String },   // signature for verification
}, { timestamps: true }); // createdAt, updatedAt

module.exports = mongoose.model('Order', orderSchema);
