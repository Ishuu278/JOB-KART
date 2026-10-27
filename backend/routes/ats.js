const express = require('express');
const router = express.Router();
const { getReport, previewText } = require('../controllers/atsController');
const { protect, authorize } = require('../middleware/auth');

router.get('/report', protect, authorize('candidate'), getReport);
router.post('/preview', protect, authorize('candidate'), previewText);

module.exports = router;
