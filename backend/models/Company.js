const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a company name'],
    trim: true
  },
  industry: {
    type: String,
    default: ''
  },
  hq: {
    type: String,
    default: ''
  },
  founded: {
    type: String,
    default: ''
  },
  size: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'Private Company'
  },
  website: {
    type: String,
    default: ''
  },
  email: {
    type: String,
    default: ''
  },
  logo: {
    type: String,
    default: ''
  },
  logoText: {
    type: String,
    default: ''
  },
  cover: {
    type: String,
    default: ''
  },
  about: {
    type: String,
    default: ''
  },
  mission: {
    type: String,
    default: ''
  },
  vision: {
    type: String,
    default: ''
  },
  mvv: [{
    icon: String,
    label: String,
    desc: String
  }],
  coreValues: [String],
  gallery: [{
    url: String,
    label: String
  }],
  benefits: [{
    icon: String,
    label: String
  }],
  stats: [{
    label: String,
    val: String,
    target: Number
  }],
  rating: {
    score: { type: String, default: '0' },
    total: { type: String, default: '0 Reviews' },
    bars: [Number]
  },
  socials: [{
    label: String,
    icon: String,
    url: String
  }],
  followers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Company', companySchema);
