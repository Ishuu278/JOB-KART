const Application = require('../models/Application');
const Job = require('../models/Job');
const User = require('../models/User');
const { createAndEmit } = require('../utils/notify');

const VALID_STATUSES = ['applied', 'underReview', 'shortlisted', 'interviewScheduled', 'selected', 'rejected'];

// Ordered pipeline for "move to next stage"
const NEXT_STAGE = {
  applied: 'underReview',
  underReview: 'shortlisted',
  shortlisted: 'interviewScheduled',
  interviewScheduled: 'selected'
};

const STATUS_TEXT = {
  applied: 'was received',
  underReview: 'is now under review',
  shortlisted: "— congratulations, you've been shortlisted",
  interviewScheduled: '— interview scheduled',
  selected: '— you have been selected',
  rejected: 'was not taken forward this time'
};

// ---------- Candidate: apply ----------
exports.applyToJob = async (req, res) => {
  try {
    const { jobId, coverNote } = req.body;

    if (!jobId || !/^[0-9a-fA-F]{24}$/.test(String(jobId))) {
      return res.status(400).json({ message: 'A valid jobId is required' });
    }

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: 'Job not found' });
    if (job.status === 'closed') return res.status(400).json({ message: 'This job is closed and no longer accepting applications' });

    const existing = await Application.findOne({ jobId, candidateId: req.user._id });
    if (existing) {
      return res.status(400).json({ message: 'Already applied' });
    }

    const application = await Application.create({
      jobId,
      candidateId: req.user._id,
      resume: req.body.resume || req.user.resume || '',
      coverNote: (coverNote || '').slice(0, 500),
      statusHistory: [{ status: 'applied', changedAt: new Date(), note: 'Application submitted' }]
    });

    // Real-time: notify recruiter (single-admin room = the recruiter's userId)
    const recruiter = await User.findOne({ role: 'recruiter' });
    if (recruiter && req.io) {
      req.io.to(String(recruiter._id)).emit('application:new', {
        application: { _id: application._id, jobId: application.jobId, status: application.status, appliedDate: application.appliedDate, coverNote: application.coverNote },
        candidate: { _id: req.user._id, name: req.user.name, email: req.user.email, profileCompletion: req.user.profileCompletion, profilePhoto: req.user.profilePhoto },
        job: { _id: job._id, title: job.title }
      });
      await createAndEmit(req.io, {
        userId: recruiter._id,
        type: 'application_received',
        title: 'New application',
        body: `${req.user.name} applied for ${job.title}.`,
        applicationId: application._id,
        link: 'recruiter-dashboard.html'
      });
    }

    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ---------- Candidate: my applications ----------
exports.getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ candidateId: req.user._id })
      .populate({ path: 'jobId', populate: { path: 'companyId', select: 'name logo' } })
      .sort({ appliedDate: -1 });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ---------- Recruiter: all applications (filters) ----------
exports.getAllApplications = async (req, res) => {
  try {
    const { status, jobId, search, page = 1, limit = 50 } = req.query;
    const filter = {};
    if (status && VALID_STATUSES.includes(status)) filter.status = status;
    if (jobId) filter.jobId = jobId;

    const query = Application.find(filter)
      .populate('candidateId', 'name email profilePhoto profileCompletion skills experience education portfolioUrl resume isOnline lastSeen')
      .populate({ path: 'jobId', select: 'title companyId', populate: { path: 'companyId', select: 'name' } })
      .sort({ appliedDate: -1 });

    if (search) {
      const apps = await query;
      const filtered = apps.filter(a => (a.candidateId && a.candidateId.name || '').toLowerCase().includes(String(search).toLowerCase()));
      return res.json({ applications: filtered, total: filtered.length, page: 1, pages: 1 });
    }

    const total = await Application.countDocuments(filter);
    const applications = await query
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));
    res.json({ applications, total, page: Number(page), pages: Math.ceil(total / Number(limit)), hasMore: Number(page) * Number(limit) < total });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ---------- Recruiter: applicants for one job ----------
exports.getJobApplicants = async (req, res) => {
  try {
    const applications = await Application.find({ jobId: req.params.jobId })
      .populate('candidateId', 'name email profilePhoto profileCompletion skills experience education portfolioUrl resume isOnline lastSeen')
      .sort({ appliedDate: -1 });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ---------- Recruiter: one candidate's applications ----------
exports.getCandidateApplications = async (req, res) => {
  try {
    const applications = await Application.find({ candidateId: req.params.candidateId })
      .populate({ path: 'jobId', select: 'title companyId', populate: { path: 'companyId', select: 'name' } })
      .sort({ appliedDate: -1 });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ---------- Any party: single application ----------
exports.getApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate({ path: 'jobId', populate: { path: 'companyId', select: 'name logo' } })
      .populate('candidateId', 'name email profilePhoto profileCompletion skills experience education portfolioUrl resume isOnline lastSeen');
    if (!application) return res.status(404).json({ message: 'Application not found' });

    // Candidates may only view their own
    if (req.user.role === 'candidate' && String(application.candidateId._id) !== String(req.user._id)) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    // Strip recruiter-only note from candidate view
    if (req.user.role === 'candidate') {
      application.recruiterNote = undefined;
    }
    res.json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ---------- Recruiter: update status (the pipeline engine) ----------
exports.updateApplicationStatus = async (req, res) => {
  try {
    const { status, note, interviewDate, interviewLink } = req.body;

    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({ message: 'Invalid status. Must be one of: ' + VALID_STATUSES.join(', ') });
    }

    const application = await Application.findById(req.params.id);
    if (!application) return res.status(404).json({ message: 'Application not found' });

    const job = await Job.findById(application.jobId);
    if (!job) return res.status(404).json({ message: 'Application job not found' });

    // Single-admin model: the recruiter manages everything
    if (req.user.role !== 'recruiter') {
      return res.status(403).json({ message: 'Not authorized to update this application' });
    }

    application.status = status;
    if (note) application.recruiterNote = note;
    if (status === 'interviewScheduled') {
      application.interviewDate = interviewDate ? new Date(interviewDate) : null;
      application.interviewLink = interviewLink || '';
    }

    application.statusHistory.push({
      status,
      changedAt: new Date(),
      note: note || ''
    });

    await application.save();

    // Notify + push to the candidate live
    await createAndEmit(req.io, {
      userId: application.candidateId,
      type: status === 'interviewScheduled' ? 'interview_scheduled' : 'status_update',
      title: 'Application update',
      body: `Your application for ${job.title} ${STATUS_TEXT[status]}.`,
      applicationId: application._id,
      link: 'candidate-dashboard.html'
    });

    if (req.io) {
      req.io.to(String(application.candidateId)).emit('status:updated', {
        applicationId: application._id,
        jobId: application.jobId,
        jobTitle: job.title,
        newStatus: status,
        note: note || '',
        interviewDate: application.interviewDate,
        interviewLink: application.interviewLink,
        statusHistory: application.statusHistory
      });
    }

    res.json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ---------- Candidate: withdraw ----------
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

// ---------- Dashboards (legacy-compatible stats) ----------
async function buildMonthlySeries(match) {
  const months = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({ start: d, end: new Date(d.getFullYear(), d.getMonth() + 1, 1), label: d.toLocaleString('en', { month: 'short' }) });
  }
  const data = await Application.aggregate([
    { $match: { ...match, appliedDate: { $gte: months[0].start } } },
    {
      $group: {
        _id: { y: { $year: '$appliedDate' }, m: { $month: '$appliedDate' } },
        count: { $sum: 1 }
      }
    }
  ]);
  return months.map(m => ({
    month: m.label,
    count: data.find(x => x._id.m === m.start.getMonth() + 1 && x._id.y === m.start.getFullYear())?.count || 0
  }));
}

exports.getDashboardStats = async (req, res) => {
  try {
    const userId = req.user._id;
    const totalApplied = await Application.countDocuments({ candidateId: userId });
    const underReview = await Application.countDocuments({ candidateId: userId, status: 'underReview' });
    const interviews = await Application.countDocuments({ candidateId: userId, status: 'interviewScheduled' });
    const selected = await Application.countDocuments({ candidateId: userId, status: 'selected' });
    const monthlyData = await buildMonthlySeries({ candidateId: userId });
    const statusData = await Application.aggregate([
      { $match: { candidateId: userId } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    res.json({ totalApplied, underReview, interviews, selected, monthlyData, statusData });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getRecruiterStats = async (req, res) => {
  try {
    const totalApplications = await Application.countDocuments({});
    const activeJobs = await Job.countDocuments({ status: 'active' });
    const shortlisted = await Application.countDocuments({ status: 'shortlisted' });
    const pipelineData = await Application.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    const applicationsByJob = await Application.aggregate([
      { $group: { _id: '$jobId', count: { $sum: 1 } } },
      { $lookup: { from: 'jobs', localField: '_id', foreignField: '_id', as: 'job' } },
      { $unwind: '$job' },
      { $project: { title: '$job.title', count: 1 } },
      { $sort: { count: -1 } },
      { $limit: 8 }
    ]);
    const recentActivity = await Application.find({})
      .populate('candidateId', 'name')
      .populate('jobId', 'title')
      .sort({ appliedDate: -1 })
      .limit(8);

    res.json({
      activeJobs,
      totalApplications,
      shortlisted,
      pipelineData,
      applicationsByJob,
      hiringData: pipelineData.filter(p => p._id !== 'applied'),
      recentActivity: recentActivity.map(a => ({
        _id: a._id,
        candidateName: a.candidateId ? a.candidateId.name : 'Unknown',
        jobTitle: a.jobId ? a.jobId.title : 'Unknown',
        status: a.status,
        appliedDate: a.appliedDate
      }))
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ---------- Recruiter: full candidate profile + cross-job history ----------
exports.getCandidateProfile = async (req, res) => {
  try {
    const candidate = await User.findById(req.params.candidateId).select(
      'name email phone profilePhoto profileCompletion skills experience education portfolioUrl resume resumeText isOnline lastSeen createdAt'
    );
    if (!candidate) return res.status(404).json({ message: 'Candidate not found' });

    const applications = await Application.find({ candidateId: candidate._id })
      .populate({ path: 'jobId', select: 'title type location sal companyId', populate: { path: 'companyId', select: 'name' } })
      .sort({ appliedDate: -1 });

    res.json({
      candidate,
      applications: applications.map(a => ({
        _id: a._id,
        status: a.status,
        appliedDate: a.appliedDate,
        interviewDate: a.interviewDate,
        job: a.jobId ? { _id: a.jobId._id, title: a.jobId.title, type: a.jobId.type, location: a.jobId.location, sal: a.jobId.sal, company: a.jobId.companyId } : null
      })),
      stats: {
        total: applications.length,
        selected: applications.filter(a => a.status === 'selected').length,
        active: applications.filter(a => !['selected', 'rejected'].includes(a.status)).length
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ---------- Recruiter: saved-but-not-applied leads ----------
exports.getSavedLeads = async (req, res) => {
  try {
    // users who saved at least one job
    const savers = await User.find({ savedJobs: { $exists: true, $ne: [] } })
      .select('name email profilePhoto profileCompletion savedJobs')
      .populate('savedJobs', 'title status');

    const leads = [];
    for (const u of savers) {
      const appliedJobIds = (await Application.find({ candidateId: u._id }).distinct('jobId')).map(String);
      const notApplied = (u.savedJobs || []).filter(j => !appliedJobIds.includes(String(j._id)));
      if (notApplied.length) {
        leads.push({
          candidate: { _id: u._id, name: u.name, email: u.email, profilePhoto: u.profilePhoto, profileCompletion: u.profileCompletion },
          savedNotApplied: notApplied
        });
      }
    }
    res.json({ leads });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
