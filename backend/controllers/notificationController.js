const Notification = require('../models/Notification');

// GET /notifications
exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(30);
    const unread = await Notification.countDocuments({ userId: req.user._id, read: false });
    res.json({ notifications, unread });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /notifications/:id/read
exports.markRead = async (req, res) => {
  try {
    const n = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { $set: { read: true } },
      { new: true }
    );
    if (!n) return res.status(404).json({ message: 'Notification not found' });
    res.json(n);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /notifications/read-all
exports.markAllRead = async (req, res) => {
  try {
    const result = await Notification.updateMany(
      { userId: req.user._id, read: false },
      { $set: { read: true } }
    );
    res.json({ modified: result.modifiedCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
