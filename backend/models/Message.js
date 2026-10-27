const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  conversationId: {
    type: String,
    required: true,
    index: true
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  text: {
    type: String,
    required: true,
    maxlength: 2000
  },
  read: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Fast history loading per conversation
messageSchema.index({ conversationId: 1, createdAt: 1 });

module.exports = mongoose.model('Message', messageSchema);
