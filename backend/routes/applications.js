const express = require('express');
const router = express.Router();
const {
  applyToJob, getMyApplications, getAllApplications, getJobApplicants,
  getCandidateApplications, getCandidateProfile, getApplication, updateApplicationStatus,
  withdrawApplication, getDashboardStats, getRecruiterStats, getSavedLeads
} = require('../controllers/applicationController');
const { protect, authorize } = require('../middleware/auth');

// Candidate
router.post('/', protect, authorize('candidate'), applyToJob);
router.post('/apply', protect, authorize('candidate'), applyToJob); // legacy alias
router.get('/mine', protect, authorize('candidate'), getMyApplications);
router.get('/my', protect, authorize('candidate'), getMyApplications); // legacy alias
router.put('/mine/:id/withdraw', protect, authorize('candidate'), withdrawApplication);
router.get('/dashboard/candidate', protect, authorize('candidate'), getDashboardStats);

// Recruiter
router.get('/all', protect, authorize('recruiter'), getAllApplications);
router.get('/recruiter', protect, authorize('recruiter'), getAllApplications); // legacy alias
router.get('/job/:jobId', protect, authorize('recruiter'), getJobApplicants);
router.get('/candidate/:candidateId', protect, authorize('recruiter'), getCandidateApplications);
router.get('/candidate/:candidateId/profile', protect, authorize('recruiter'), getCandidateProfile);
router.get('/saved-leads', protect, authorize('recruiter'), getSavedLeads);
router.get('/dashboard/recruiter', protect, authorize('recruiter'), getRecruiterStats);
router.put('/:id/status', protect, authorize('recruiter'), updateApplicationStatus);

// Any authenticated role
router.get('/:id', protect, getApplication);

module.exports = router;
