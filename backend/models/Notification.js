const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  type: {
    type: String,
    enum: ['status_update', 'new_message', 'interview_scheduled', 'application_received'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  body: {
    type: String,
    default: ''
  },
  applicationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Application',
    default: null
  },
  link: {
    type: String,
    default: ''
  },
  read: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Notification', notificationSchema);
