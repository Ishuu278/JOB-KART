const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true
  },
  candidateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['applied', 'underReview', 'shortlisted', 'interviewScheduled', 'selected', 'rejected'],
    default: 'applied'
  },
  resume: {
    type: String,
    default: ''
  },
  coverNote: {
    type: String,
    default: '',
    maxlength: 500
  },
  appliedDate: {
    type: Date,
    default: Date.now
  },
  interviewDate: {
    type: Date,
    default: null
  },
  interviewLink: {
    type: String,
    default: ''
  },
  recruiterNote: {
    type: String,
    default: ''
  },
  statusHistory: [{
    status: String,
    changedAt: { type: Date, default: Date.now },
    note: { type: String, default: '' }
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Application', applicationSchema);
