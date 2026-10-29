const mongoose = require('mongoose');
const Job = require('../models/Job');
const Company = require('../models/Company');

// Escape user input before it reaches a MongoDB $regex.
const escapeRegex = (value) => String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&').slice(0, 100);

// A recruiter may only manage postings that belong to their own company.
const canManageJob = (user, job) =>
  !!user.companyId && String(job.companyId) === String(user.companyId);

// A posting is only publicly listable while its application window is open
// (deadline = end of the applyBefore day). Jobs without a deadline stay open.
const openWindow = () => {
  const cutoff = new Date();
  cutoff.setHours(0, 0, 0, 0);
  return { $or: [{ applyBefore: null }, { applyBefore: { $gte: cutoff } }] };
};

exports.getJobs = async (req, res) => {
  try {
    const { search, type, fresher, company, location, sort, minSal } = req.query;
    let query = { status: 'active', ...openWindow() };

    if (search) {
      const safeSearch = escapeRegex(search);
      // Keep the deadline window in $or and scope keyword search under $and
      // so the two conditions do not overwrite each other.
      query.$and = [{
        $or: [
          { title: { $regex: safeSearch, $options: 'i' } },
          { description: { $regex: safeSearch, $options: 'i' } },
          { skills: { $regex: safeSearch, $options: 'i' } }
        ]
      }];
    }
    if (type) query.type = type;
    if (fresher === 'true') query.fresher = true;
    if (company) query.companyId = company;
    if (location) query.location = { $regex: escapeRegex(location), $options: 'i' };

    let dbQuery = Job.find(query).populate('companyId', 'name logo logoText');

    if (sort === 'salary') {
      dbQuery = dbQuery.collation({ locale: 'en', numericOrdering: true }).sort({ sal: -1 });
    } else if (sort === 'oldest') {
      dbQuery = dbQuery.sort({ postedDate: 1 });
    } else {
      dbQuery = dbQuery.sort({ postedDate: -1 });
    }

    // Server-side pagination (?page=1&limit=10). limit=0 / 'all' → return everything (legacy).
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limitParam = req.query.limit;
    const wantsAll = limitParam === undefined || limitParam === 'all' || limitParam === '0';

    if (wantsAll) {
      const jobs = await dbQuery;
      return res.json(jobs);
    }

    const limit = Math.min(50, Math.max(1, parseInt(limitParam, 10) || 10));
    const total = await Job.countDocuments(query);
    const jobs = await dbQuery.skip((page - 1) * limit).limit(limit);
    res.json({
      jobs,
      total,
      page,
      pages: Math.ceil(total / limit),
      hasMore: page * limit < total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Lightweight list for dropdowns — must be declared BEFORE '/:id' route
exports.getJobNames = async (req, res) => {
  try {
    const jobs = await Job.find({ status: 'active', ...openWindow() }, 'title companyId location type sal exp')
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
    if (!req.user.companyId) {
      return res.status(400).json({ message: 'Recruiter account is not linked to a company' });
    }

    const job = await Job.create({
      ...req.body,
      companyId: req.user.companyId
    });
    res.status(201).json(job);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateJob = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ message: 'Job not found' });
    }

    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    if (!canManageJob(req.user, job)) {
      return res.status(403).json({ message: 'You can only manage jobs for your own company' });
    }

    const editable = ['title', 'description', 'responsibilities', 'skills', 'benefits',
      'exp', 'sal', 'type', 'location', 'fresher', 'postedDate', 'applyBefore', 'status'];
    editable.forEach((field) => {
      if (req.body[field] !== undefined) job[field] = req.body[field];
    });

    await job.save();
    res.json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteJob = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ message: 'Job not found' });
    }

    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    if (!canManageJob(req.user, job)) {
      return res.status(403).json({ message: 'You can only manage jobs for your own company' });
    }

    await Job.deleteOne({ _id: job._id });
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
