const mongoose = require('mongoose');
const Job = require('../models/Job');
const Company = require('../models/Company');

exports.getJobs = async (req, res) => {
  try {
    const { search, type, fresher, company, location, sort, minSal } = req.query;
    let query = { status: 'active' };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { skills: { $regex: search, $options: 'i' } }
      ];
    }
    if (type) query.type = type;
    if (fresher === 'true') query.fresher = true;
    if (company) query.companyId = company;
    if (location) query.location = { $regex: location, $options: 'i' };

    let dbQuery = Job.find(query).populate('companyId', 'name logo logoText');

    if (sort === 'salary') {
      dbQuery = dbQuery.collation({ locale: 'en', numericOrdering: true }).sort({ sal: -1 });
    } else if (sort === 'oldest') {
      dbQuery = dbQuery.sort({ postedDate: 1 });
    } else {
      dbQuery = dbQuery.sort({ postedDate: -1 });
    }

    const jobs = await dbQuery;
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Lightweight list for dropdowns — must be declared BEFORE '/:id' route
exports.getJobNames = async (req, res) => {
  try {
    const jobs = await Job.find({ status: 'active' }, 'title companyId location type sal exp')
      .populate('companyId', 'name logo logoText')
      .sort({ postedDate: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getJobById = async (req, res) => {
  try {
    // Guard against invalid ObjectId formats (e.g. 'featured', 'names')
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ message: 'Job not found' });
    }
    const job = await Job.findById(req.params.id).populate('companyId');
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createJob = async (req, res) => {
  try {
    const job = await Job.create({
      ...req.body,
      companyId: req.user.companyId || undefined
    });
    res.status(201).json(job);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.json({ message: 'Job deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.compareJobs = async (req, res) => {
  try {
    const { ids } = req.query;
    if (!ids) {
      return res.status(400).json({ message: 'Please provide job IDs' });
    }
    const idArray = ids.split(',').filter(id => mongoose.Types.ObjectId.isValid(id));
    if (idArray.length === 0) {
      return res.json([]);
    }
    const jobs = await Job.find({ _id: { $in: idArray } }).populate('companyId', 'name logo');
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
