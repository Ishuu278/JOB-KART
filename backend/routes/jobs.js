const express = require('express');
const router = express.Router();
const { getJobs, getJobById, createJob, updateJob, deleteJob, compareJobs } = require('../controllers/jobController');
const { protect, authorize } = require('../middleware/auth');

router.get('/compare', compareJobs);
router.get('/', getJobs);
router.get('/:id', getJobById);
router.post('/', protect, authorize('recruiter'), createJob);
router.put('/:id', protect, authorize('recruiter'), updateJob);
router.delete('/:id', protect, authorize('recruiter'), deleteJob);

module.exports = router;
