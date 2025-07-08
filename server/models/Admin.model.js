const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  email: String,
  password: String, // You should hash this with bcrypt in production
});

module.exports = mongoose.model('Admin', adminSchema);
