const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const { register, login, getProfile, updateProfile, switchRole } = require('../controllers/authController');
const { resumeUpload, photoUpload, uploadResumeHandler, uploadPhotoHandler, multerErrorHandler } = require('../controllers/uploadController');
const { protect } = require('../middleware/auth');

// Tighter limit on credential endpoints (brute-force protection)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: { message: 'Too many attempts — try again in 15 minutes' },
  standardHeaders: true,
  legacyHeaders: false
});

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.post('/switch-role', protect, switchRole);
router.get('/me', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.post('/resume', protect, resumeUpload.single('resume'), uploadResumeHandler, multerErrorHandler);
router.post('/photo', protect, photoUpload.single('photo'), uploadPhotoHandler, multerErrorHandler);

module.exports = router;
