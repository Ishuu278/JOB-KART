const express = require('express');
const router = express.Router();
const { getMessages, sendMessage, markRead, getConversations } = require('../controllers/messageController');
const { protect } = require('../middleware/auth');

router.get('/conversations', protect, getConversations);
router.get('/:conversationId', protect, getMessages);
router.post('/', protect, sendMessage);
router.put('/:conversationId/read', protect, markRead);

module.exports = router;
