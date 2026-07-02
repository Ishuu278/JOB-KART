const express = require('express');
const router = express.Router();
const { getCompanies, getCompanyById, getCompanyJobs, followCompany, createCompany, updateCompany } = require('../controllers/companyController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', getCompanies);
router.get('/:id', getCompanyById);
router.get('/:id/jobs', getCompanyJobs);
router.post('/:id/follow', protect, followCompany);
router.post('/', protect, authorize('recruiter'), createCompany);
router.put('/:id', protect, authorize('recruiter'), updateCompany);

module.exports = router;
