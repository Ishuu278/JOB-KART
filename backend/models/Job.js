const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Please add a job title'],
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  responsibilities: [String],
  skills: [String],
  benefits: [String],
  exp: {
    type: String,
    default: ''
  },
  sal: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    enum: ['Full-Time', 'Part-Time', 'Contract', 'Internship', 'Remote'],
    default: 'Full-Time'
  },
  location: {
    type: String,
    default: ''
  },
  fresher: {
    type: Boolean,
    default: false
  },
  postedDate: {
    type: Date,
    default: Date.now
  },
  applyBefore: {
    type: Date
  },
  status: {
    type: String,
    enum: ['active', 'closed'],
    default: 'active'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Job', jobSchema);
