const Message = require('../models/Message');
const User = require('../models/User');
const Application = require('../models/Application');
const { createAndEmit } = require('../utils/notify');

// conversationId format: "{candidateId}_{jobId}"
const buildConversationId = (candidateId, jobId) => `${candidateId}_${jobId}`;

// Validate membership of a conversation
async function authorizeConversation(conversationId, user) {
  const [candidateId, jobId] = conversationId.split('_');
  if (user.role === 'candidate') {
    return String(candidateId) === String(user._id);
  }
  // recruiter can access any conversation (single-admin)
  return user.role === 'recruiter';
}

// GET /messages/conversations
exports.getConversations = async (req, res) => {
  try {
    let filter;
    if (req.user.role === 'recruiter') {
      filter = { receiverId: req.user._id };
      // recruiter is receiver OR sender in various conversations; use $or
      filter = { $or: [{ senderId: req.user._id }, { receiverId: req.user._id }] };
    } else {
      filter = { $or: [{ senderId: req.user._id }, { receiverId: req.user._id }] };
    }

    const msgs = await Message.find(filter).sort({ createdAt: -1 }).lean();

    // group by conversation
    const convMap = new Map();
    for (const m of msgs) {
      if (!convMap.has(m.conversationId)) {
        convMap.set(m.conversationId, {
          conversationId: m.conversationId,
          lastMessage: m.text,
          lastAt: m.createdAt,
          unread: 0,
          candidateId: m.senderId.toString() === String(req.user._id) ? m.receiverId : m.senderId
        });
      }
      // count unread where I'm the receiver
      if (m.receiverId.toString() === String(req.user._id) && !m.read) {
        convMap.get(m.conversationId).unread++;
      }
    }

    // enrich with candidate + job info
    const conversations = [];
    for (const [convId, c] of convMap) {
      const [candidateId, jobId] = convId.split('_');
      const [candidate, job] = await Promise.all([
        User.findById(candidateId).select('name profilePhoto'),
        Application.findById(jobId).populate('jobId', 'title') // jobId here is actually applicationId
      ]);
      // conversationId embeds the JOB id, not application id — re-lookup
      const Job = require('../models/Job');
      const jobDoc = await Job.findById(jobId).select('title');
      conversations.push({
        ...c,
        candidate: candidate ? { _id: candidate._id, name: candidate.name, profilePhoto: candidate.profilePhoto } : { name: 'Unknown' },
        job: jobDoc ? { _id: jobDoc._id, title: jobDoc.title } : { title: 'General' },
        unread: c.unread
      });
    }

    res.json({ conversations });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /messages/:conversationId
exports.getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    if (!(await authorizeConversation(conversationId, req.user))) {
      return res.status(403).json({ message: 'Not authorized to view this conversation' });
    }
    const messages = await Message.find({ conversationId }).sort({ createdAt: 1 }).lean();
    res.json({ messages });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /messages  { conversationId, text }
exports.sendMessage = async (req, res) => {
  try {
    const { conversationId, text } = req.body;
    if (!text || !text.trim()) return res.status(400).json({ message: 'Message text is required' });
    if (text.length > 2000) return res.status(400).json({ message: 'Message too long (max 2000 chars)' });

    if (!(await authorizeConversation(conversationId, req.user))) {
      return res.status(403).json({ message: 'Not authorized to post to this conversation' });
    }

    const [candidateId, jobId] = conversationId.split('_');
    const receiverId = String(req.user._id) === String(candidateId)
      ? (await User.findOne({ role: 'recruiter' }))._id
      : candidateId;

    const message = await Message.create({
      conversationId,
      senderId: req.user._id,
      receiverId,
      text: text.trim()
    });

    // notify + push live
    await createAndEmit(req.io, {
      userId: receiverId,
      type: 'new_message',
      title: 'New message',
      body: `${req.user.name} sent you a message.`,
      link: req.user.role === 'candidate' ? 'recruiter-dashboard.html' : 'candidate-dashboard.html'
    });

    if (req.io) {
      req.io.to(String(receiverId)).emit('message:new', {
        message: message.toObject(),
        sender: { _id: req.user._id, name: req.user.name, profilePhoto: req.user.profilePhoto }
      });
    }

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /messages/:conversationId/read
exports.markRead = async (req, res) => {
  try {
    const { conversationId } = req.params;
    if (!(await authorizeConversation(conversationId, req.user))) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    const result = await Message.updateMany(
      { conversationId, receiverId: req.user._id, read: false },
      { $set: { read: true } }
    );
    // tell the sender their messages were read
    const other = await Message.findOne({ conversationId, senderId: { $ne: req.user._id } }).select('senderId');
    if (other && req.io) {
      req.io.to(String(other.senderId)).emit('message:read', { conversationId });
    }
    res.json({ modified: result.modifiedCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
