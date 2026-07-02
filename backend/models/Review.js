const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  author: {
    type: String,
    required: true
  },
  role: {
    type: String,
    default: ''
  },
  stars: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  text: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Review', reviewSchema);
