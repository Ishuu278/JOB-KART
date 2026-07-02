const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6
  },
  role: {
    type: String,
    enum: ['candidate', 'recruiter'],
    default: 'candidate'
  },
  phone: {
    type: String,
    default: ''
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    default: null
  },
  profilePhoto: {
    type: String,
    default: ''
  },
  resume: {
    type: String,
    default: ''
  },
  skills: [{
    type: String
  }],
  experience: {
    type: String,
    default: ''
  },
  education: {
    type: String,
    default: ''
  },
  portfolioUrl: {
    type: String,
    default: ''
  },
  profileCompletion: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);
