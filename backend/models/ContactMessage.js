const mongoose = require('mongoose');

const contactMessageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add your name']
  },
  email: {
    type: String,
    required: [true, 'Please add your email']
  },
  phone: {
    type: String,
    default: ''
  },
  service: {
    type: String,
    default: ''
  },
  message: {
    type: String,
    required: [true, 'Please add a message']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('ContactMessage', contactMessageSchema);
