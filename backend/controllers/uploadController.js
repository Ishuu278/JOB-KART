const User = require('../models/User');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const { detectSkills, extractEmail, extractPhone, extractEducation, skillKey } = require('../services/skillService');
const { buildResumeProfile, buildSuggestions } = require('../services/atsEngine');

const UPLOAD_DIR = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

// ===== Multer engines =====
const RESUME_MAX = 5 * 1024 * 1024;  // 5 MB
const PHOTO_MAX = 3 * 1024 * 1024;   // 3 MB

const safeName = (orig) =>
  orig.replace(/[^a-zA-Z0-9._-]/g, '_').slice(-40);

const MIME_PHOTO_MAP = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp'
};

const resumeUpload = multer({
  storage: multer.diskStorage({
    destination: UPLOAD_DIR,
    filename: (req, file, cb) =>
      cb(null, `resume-${req.user._id}-${Date.now()}-${crypto.randomBytes(4).toString('hex')}.pdf`)
  }),
  limits: { fileSize: RESUME_MAX },
  fileFilter: (req, file, cb) => {
    const isPdf = file.mimetype === 'application/pdf' || /\.pdf$/i.test(file.originalname);
    if (!isPdf) return cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', 'resume'));
    cb(null, true);
  }
});

const photoUpload = multer({
  storage: multer.diskStorage({
    destination: UPLOAD_DIR,
    filename: (req, file, cb) => {
      let ext = MIME_PHOTO_MAP[file.mimetype];
      if (!ext) {
        const m = String(file.originalname).match(/\.(jpe?g|png|webp)$/i);
        ext = m ? m[0].toLowerCase() : '.jpg';
      }
      cb(null, `photo-${req.user._id}-${Date.now()}-${crypto.randomBytes(4).toString('hex')}${ext}`);
    }
  }),
  limits: { fileSize: PHOTO_MAX },
  fileFilter: (req, file, cb) => {
    const ok = ['image/jpeg', 'image/png', 'image/webp'].includes(file.mimetype) ||
               /\.(jpe?g|png|webp)$/i.test(file.originalname);
    if (!ok) return cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', 'photo'));
    cb(null, true);
  }
});

// Extract text from a PDF buffer using pdfjs-dist (legacy build, ESM) —
// lazily imported because the package is ESM-only while this file is CJS.
// Item joining preserves line structure (newlines at vertical gaps / EOL flags).
async function extractPdfText(buf) {
  const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
  const data = new Uint8Array(buf);
  const doc = await pdfjs.getDocument({ data, useSystemFonts: true }).promise;
  const parts = [];
  for (let p = 1; p <= doc.numPages; p++) {
    const page = await doc.getPage(p);
    const tc = await page.getTextContent();
    // join items, inserting newlines at large vertical gaps so line structure survives
    let lastY = null;
    for (const item of tc.items) {
      if (!item.str) continue;
      const y = item.transform ? item.transform[5] : null;
      if (lastY !== null && y !== null && Math.abs(y - lastY) > 4) parts.push('\n');
      parts.push(item.str);
      if (item.hasEOL) parts.push('\n');
      if (y !== null) lastY = y;
    }
  }
  return parts.join(' ');
}

// ===== Helpers =====

function extractName(text) {
  // take up to the first 12 non-empty lines, find the first short line of 2-4 capitalized words
  const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean).slice(0, 12);
  for (const line of lines) {
    if (line.includes('@') || /\d{6,}/.test(line)) continue;
    if (line.length < 4 || line.length > 40) continue;
    const words = line.split(/\s+/);
    if (words.length >= 2 && words.length <= 4 &&
        words.every(w => /^[A-Z][a-zA-Z.'-]*$/.test(w))) {
      return line;
    }
  }
  return null;
}

// compute profile completion (must mirror authController.updateProfile)
function computeCompletion(user) {
  let completion = 0;
  if (user.name) completion += 20;
  if (user.email) completion += 20;
  if (user.phone) completion += 15;
  if (user.skills && user.skills.length > 0) completion += 15;
  if (user.experience) completion += 15;
  if (user.education) completion += 15;
  return completion;
}

// ===== Controllers =====

// POST /api/auth/resume  (multipart: resume)
exports.uploadResumeHandler = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No PDF file received' });
  }

  const user = await User.findById(req.user._id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  // delete previous resume file if it was a local upload
  if (user.resume && /^\/uploads\/resume-/.test(user.resume)) {
    const old = path.join(UPLOAD_DIR, path.basename(user.resume));
    if (fs.existsSync(old)) fs.unlinkSync(old);
  }

  const relPath = '/uploads/' + req.file.filename;
  user.resume = relPath;

  let extracted = {
    skills: [], newSkills: [], email: null, phone: null,
    education: null, name: null, textLength: 0
  };

  let rawText = '';
  try {
    const buf = fs.readFileSync(req.file.path);
    rawText = (await extractPdfText(buf)).replace(/\u0000/g, '');
    extracted.textLength = rawText.length;
  } catch (err) {
    // Not a readable PDF at all (corrupt or renamed non-PDF) — reject and delete
    fs.unlinkSync(req.file.path);
    return res.status(400).json({ message: 'This file is not a valid PDF. Please upload a real PDF resume.' });
  }

  // Always store extracted text so the ATS scanner can analyze it later
  user.resumeText = rawText.trim();

  if (rawText.trim().length > 0) {
    const text = rawText;
    extracted.skills = detectSkills(text);
    extracted.email = extractEmail(text);
    extracted.phone = extractPhone(text);
    extracted.education = extractEducation(text);
    extracted.name = extractName(text);

    // merge skills (union, dedupe case-insensitive)
    const existing = user.skills || [];
    const existingKeys = new Set(existing.map(skillKey));
    extracted.newSkills = extracted.skills.filter(s => !existingKeys.has(skillKey(s)));
    user.skills = existing.concat(extracted.newSkills);

    // fill-only-if-empty — never overwrite data the user set manually
    const updates = {};
    if (!user.name && extracted.name) { user.name = extracted.name; updates.name = extracted.name; }
    if (!user.phone && extracted.phone) { user.phone = extracted.phone; updates.phone = extracted.phone; }
    if (!user.education && extracted.education) { user.education = extracted.education; updates.education = extracted.education; }
    extracted.updated = updates;

    user.markModified('skills');
  } else {
    extracted.failed = true; // scanned/image PDF — saved, but nothing to extract
  }

  user.profileCompletion = computeCompletion(user);
  await user.save();

  res.json({
    message: extracted.failed
      ? 'Resume uploaded — but we couldn\'t read its text (scanned PDF?). Skills were not auto-filled.'
      : 'Resume parsed and profile updated',
    resume: user.resume,
    resumeName: req.file.originalname,
    profileCompletion: user.profileCompletion,
    user: {
      name: user.name, phone: user.phone, skills: user.skills,
      education: user.education, profileCompletion: user.profileCompletion
    },
    extracted
  });
};

// POST /api/auth/photo  (multipart: photo)
exports.uploadPhotoHandler = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No image file received' });
  }

  const user = await User.findById(req.user._id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  // delete previous local photo
  if (user.profilePhoto && /^\/uploads\/photo-/.test(user.profilePhoto)) {
    const old = path.join(UPLOAD_DIR, path.basename(user.profilePhoto));
    if (fs.existsSync(old)) fs.unlinkSync(old);
  }

  user.profilePhoto = '/uploads/' + req.file.filename;
  await user.save();

  res.json({
    message: 'Profile photo updated',
    profilePhoto: user.profilePhoto,
    user: { profilePhoto: user.profilePhoto }
  });
};

// Multer error translator — used by the router
exports.resumeUpload = resumeUpload;
exports.photoUpload = photoUpload;

exports.multerErrorHandler = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({ message: 'File too large (max 5 MB for resume, 3 MB for photo)' });
    }
    return res.status(400).json({ message: 'Invalid file: ' + err.message });
  }
  next(err);
};

exports.UPLOAD_DIR = UPLOAD_DIR;
