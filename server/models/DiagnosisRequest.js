const mongoose = require('mongoose');

const diagnosisRequestSchema = new mongoose.Schema({
  farmerName: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  imagePath: { 
    type: String, 
    required: true 
  },
  status: {
    type: String,
    enum: ['Pending', 'Reviewed'],
    default: 'Pending',
  },
  suggestion: {
    type: String, // Officer's response
    default: '',
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
  reviewedAt: {
    type: Date,
    default: null,
  },
});

module.exports = mongoose.model('DiagnosisRequest', diagnosisRequestSchema);
