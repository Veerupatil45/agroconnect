const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  image: String,
  category: String,
  packets: {
    type: Map,
    of: String, // You can use `Number` if you're sure all prices will be numeric
    required: true
  }
});

module.exports = mongoose.model('Product', productSchema);
