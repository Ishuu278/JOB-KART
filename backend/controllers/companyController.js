const mongoose = require('mongoose');
const Company = require('../models/Company');
const Job = require('../models/Job');
const User = require('../models/User');

exports.getCompanyNames = async (req, res) => {
  try {
    const companies = await Company.find({}, 'name logo logoText industry hq').sort({ name: 1 });
    res.json(companies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCompanies = async (req, res) => {
  try {
    const companies = await Company.find();
    res.json(companies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCompanyById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ message: 'Company not found' });
    }
    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }
    res.json(company);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCompanyJobs = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ message: 'Company not found' });
    }
    const jobs = await Job.find({ companyId: req.params.id, status: 'active' });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.followCompany = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ message: 'Company not found' });
    }
    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    const index = (company.followers || []).findIndex(id => String(id) === String(req.user._id));
    if (index === -1) {
      company.followers.push(req.user._id);
    } else {
      company.followers.splice(index, 1);
    }

    await company.save();
    res.json({ following: index === -1, followersCount: company.followers.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createCompany = async (req, res) => {
  try {
    if (req.user.companyId) {
      return res.status(400).json({ message: 'This recruiter account is already linked to a company' });
    }

    const company = await Company.create(req.body);
    await User.findByIdAndUpdate(req.user._id, { companyId: company._id });
    res.status(201).json(company);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateCompany = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ message: 'Company not found' });
    }
    if (!req.user.companyId || String(req.user.companyId) !== String(req.params.id)) {
      return res.status(403).json({ message: 'You can only update your own company profile' });
    }

    const company = await Company.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }
    res.json(company);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
