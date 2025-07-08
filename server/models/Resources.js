const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  title: String,
  description: String,
  type: {
    type: String,
    enum: ['pdf', 'video', 'link'],
    required: true
  },
  fileUrl: String, // URL to file or YouTube link
  uploadedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Resource', resourceSchema);
