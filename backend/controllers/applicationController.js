const Application = require('../models/Application');
const Job = require('../models/Job');

// Reusable helper: monthly counts for the last N months (ending current month)
function buildMonthlySeries(match, dateField, months = 6) {
  const start = new Date();
  start.setDate(1);
  start.setHours(0, 0, 0, 0);
  start.setMonth(start.getMonth() - (months - 1));

  return Application.aggregate([
    { $match: { ...match, createdAt: { $gte: start } } },
    {
      $group: {
        _id: { y: { $year: '$createdAt' }, m: { $month: '$createdAt' } },
        count: { $sum: 1 }
      }
    },
    { $sort: { '_id.y': 1, '_id.m': 1 } }
  ]).then(rows => {
    const now = new Date();
    const series = [];
    for (let i = months - 1; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const row = rows.find(r => r._id.y === d.getFullYear() && r._id.m === d.getMonth() + 1);
      series.push({ month: d.toLocaleString('en', { month: 'short' }), count: row ? row.count : 0 });
      if (i === 0) break;
    }
    return series;
  });
}

exports.applyToJob = async (req, res) => {
  try {
    const { jobId } = req.body;

    const existing = await Application.findOne({ jobId, candidateId: req.user._id });
    if (existing) {
      return res.status(400).json({ message: 'Already applied to this job' });
    }

    const application = await Application.create({
      jobId,
      candidateId: req.user._id,
      resume: req.body.resume || ''
    });

    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ candidateId: req.user._id })
      .populate({ path: 'jobId', populate: { path: 'companyId', select: 'name logo' } });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getRecruiterApplications = async (req, res) => {
  try {
    const { status, search, page = 1, limit = 10 } = req.query;

    if (!req.user.companyId) {
      return res.json({ applications: [], total: 0, page: 1, pages: 0 });
    }

    const jobs = await Job.find({ companyId: req.user.companyId });
    const jobIds = jobs.map(j => j._id);

    let query = { jobId: { $in: jobIds } };
    if (status) query.status = status;

    const applications = await Application.find(query)
      .populate('candidateId', 'name email phone skills profilePhoto')
      .populate({ path: 'jobId', select: 'title' })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Application.countDocuments(query);

    res.json({ applications, total, page: parseInt(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const VALID_STATUSES = ['applied', 'underReview', 'shortlisted', 'interview', 'selected', 'rejected'];

exports.updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({ message: 'Invalid status. Must be one of: ' + VALID_STATUSES.join(', ') });
    }

    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // Ownership check: the job must belong to the recruiter's company
    const job = await Job.findById(application.jobId);
    if (!job || String(job.companyId) !== String(req.user.companyId)) {
      return res.status(403).json({ message: 'Not authorized to update this application' });
    }

    application.status = status;
    await application.save();
    res.json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Candidate withdraws their own application
exports.withdrawApplication = async (req, res) => {
  try {
    const application = await Application.findOne({
      _id: req.params.id,
      candidateId: req.user._id
    });
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    await Application.deleteOne({ _id: application._id });
    res.json({ message: 'Application withdrawn successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getDashboardStats = async (req, res) => {
  try {
    const userId = req.user._id;

    const totalApplied = await Application.countDocuments({ candidateId: userId });
    const underReview = await Application.countDocuments({ candidateId: userId, status: 'underReview' });
    const interviews = await Application.countDocuments({ candidateId: userId, status: 'interview' });
    const selected = await Application.countDocuments({ candidateId: userId, status: 'selected' });

    const monthlyData = await buildMonthlySeries({ candidateId: userId });

    const statusData = await Application.aggregate([
      { $match: { candidateId: userId } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      totalApplied,
      underReview,
      interviews,
      selected,
      monthlyData,
      statusData
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getRecruiterStats = async (req, res) => {
  try {
    if (!req.user.companyId) {
      return res.json({
        activeJobs: 0,
        totalApplications: 0,
        shortlisted: 0,
        pipelineData: [],
        applicationsByJob: [],
        hiringData: []
      });
    }

    const jobs = await Job.find({ companyId: req.user.companyId });
    const jobIds = jobs.map(j => j._id);

    const activeJobs = await Job.countDocuments({ companyId: req.user.companyId, status: 'active' });
    const totalApplications = await Application.countDocuments({ jobId: { $in: jobIds } });
    const shortlisted = await Application.countDocuments({ jobId: { $in: jobIds }, status: 'shortlisted' });

    const pipelineData = await Application.aggregate([
      { $match: { jobId: { $in: jobIds } } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const applicationsByJob = await Application.aggregate([
      { $match: { jobId: { $in: jobIds } } },
      {
        $group: {
          _id: '$jobId',
          count: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'jobs',
          localField: '_id',
          foreignField: '_id',
          as: 'job'
        }
      },
      { $unwind: '$job' },
      {
        $project: {
          title: '$job.title',
          count: 1
        }
      }
    ]);

    res.json({
      activeJobs,
      totalApplications,
      shortlisted,
      pipelineData,
      applicationsByJob,
      // Status breakdown excluding new 'applied' — drives the hiring donut chart
      hiringData: pipelineData.filter(p => p._id !== 'applied')
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
