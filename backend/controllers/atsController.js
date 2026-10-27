const User = require('../models/User');
const Job = require('../models/Job');
const { scanResume, buildResumeProfile, buildSuggestions } = require('../services/atsEngine');

// GET /api/ats/report — full ATS analysis of the user's stored resume
exports.getReport = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('resume resumeText skills');
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (!user.resume || !user.resumeText) {
      return res.status(404).json({
        code: 'NO_RESUME',
        message: 'Upload a PDF resume first — the scanner analyzes the text inside it.'
      });
    }

    if (!user.resumeText.trim()) {
      return res.status(422).json({
        code: 'SCANNED_PDF',
        message: 'Your resume has no readable text (likely a scanned image). Re-upload a text-based PDF to get scanned.'
      });
    }

    const report = await scanResume(user.resumeText, user.skills || [], Job);
    res.json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/ats/preview — score arbitrary pasted text (no resume file needed)
exports.previewText = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || typeof text !== 'string' || text.trim().length < 80) {
      return res.status(400).json({ message: 'Provide at least 80 characters of resume text to preview' });
    }
    const profile = buildResumeProfile(text);
    res.json({
      resume: { overall: profile.overall, sections: profile.sections, wordCount: text.split(/\s+/).filter(Boolean).length },
      suggestions: buildSuggestions(profile),
      note: 'Preview mode — upload your real PDF for job matching.'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
