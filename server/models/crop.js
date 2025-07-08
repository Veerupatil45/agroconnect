const mongoose = require('mongoose');

const cropSchema = new mongoose.Schema({
  name: String,
  description: String,
  quantity: String,
  price: String,
  location: String,
  image: String,
  seller: String,
  available: {
    type: Boolean,
    default: true,
  },
  approved: {
    type: Boolean,
    default: false,
  },
  rejected: { type: Boolean, default: false },

  createdAt: {
    type: Date,
    default: Date.now, // Automatically sets current date when listed
  },
  approvedAt: {
    type: Date, // Set when admin approves
    default: null,
  },
});

module.exports = mongoose.model('Crop', cropSchema);
