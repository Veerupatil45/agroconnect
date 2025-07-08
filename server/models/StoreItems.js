const mongoose = require('mongoose');

const storeItemSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  category: String, // "Seeds" or "Pesticides"
  image: String
});

module.exports = mongoose.model('StoreItem', storeItemSchema);
