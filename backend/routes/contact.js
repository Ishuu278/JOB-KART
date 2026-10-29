const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const { submitContact, getContacts } = require('../controllers/contactController');
const { protect, authorize } = require('../middleware/auth');

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  message: { message: 'Too many contact messages sent from this IP. Please try again after 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false
});

router.post('/', contactLimiter, submitContact);
// Contact submissions contain personal data — recruiters only.
router.get('/', protect, authorize('recruiter'), getContacts);

module.exports = router;
