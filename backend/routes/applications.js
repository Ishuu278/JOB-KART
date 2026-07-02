const express = require('express');
const router = express.Router();
const { applyToJob, getMyApplications, getRecruiterApplications, updateApplicationStatus, getDashboardStats, getRecruiterStats } = require('../controllers/applicationController');
const { protect, authorize } = require('../middleware/auth');

router.post('/apply', protect, authorize('candidate'), applyToJob);
router.get('/my', protect, authorize('candidate'), getMyApplications);
router.get('/recruiter', protect, authorize('recruiter'), getRecruiterApplications);
router.put('/:id/status', protect, authorize('recruiter'), updateApplicationStatus);
router.get('/dashboard/candidate', protect, authorize('candidate'), getDashboardStats);
router.get('/dashboard/recruiter', protect, authorize('recruiter'), getRecruiterStats);

module.exports = router;
