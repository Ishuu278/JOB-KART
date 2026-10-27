// ===== ATS Scanner Engine =====
// Deterministic, explainable resume scoring + job fit ranking.
// Three scored sections (0-100 overall):
//   1. Skills & Keywords  — breadth of detectable skills + action verbs + quantified impact
//   2. Structure & Format — contact info, section headings, length, formatting hygiene
//   3. Experience Depth   — internships/jobs/projects/evidence of real work
// Job fit: skill overlap + title relevance + fresher-friendliness → 0-100 match
// Suggestions: concrete, prioritized fixes derived from what's missing.

const { SKILL_DICTIONARY, skillKey, detectSkills, extractEmail, extractPhone, extractEducation } = require('./skillService');

const ACTION_VERBS = [
  'built', 'developed', 'designed', 'led', 'managed', 'created', 'implemented', 'improved',
  'optimized', 'launched', 'delivered', 'automated', 'analyzed', 'increased', 'reduced',
  'achieved', 'collaborated', 'owned', 'migrated', 'architected', 'mentored', 'shipped'
];

const SECTION_HEADINGS = {
  experience: /(^|\n)\s*(work\s+)?(experience|employment|professional experience|internship(s)?)\s*:?(\n|$)/i,
  education: /(^|\n)\s*education|academic(s)?\s*:?(\n|$)/i,
  skills: /(^|\n)\s*(technical\s+)?(skills|technologies|tech stack)\s*:?(\n|$)/i,
  projects: /(^|\n)\s*(projects?|personal projects?)\s*:?(\n|$)/i
};

// Weights per scored section
const W = { skills: 0.4, structure: 0.35, experience: 0.25 };

function clamp(n, lo, hi) { return Math.max(lo, Math.min(hi, n)); }

// ---------- Section 1: skills & keywords ----------
function scoreSkills(text) {
  const detected = detectSkills(text);
  const checks = [];
  let score = 0;

  // breadth (0-60): 1 skill ≈ 4 pts, saturating at 15
  const breadth = clamp(detected.length * 4, 0, 60);
  score += breadth;
  checks.push({ id: 'skill-breadth', label: 'Recognized skills', value: detected.length, note: detected.length >= 12 ? 'strong keyword coverage' : detected.length >= 6 ? 'decent, could add more' : 'too few — recruiters search by keywords' });

  // action verbs (0-20)
  const lower = text.toLowerCase();
  const verbs = ACTION_VERBS.filter(v => new RegExp('\\b' + v + '\\b').test(lower));
  const verbPts = clamp(verbs.length * 2.5, 0, 20);
  score += verbPts;
  checks.push({ id: 'action-verbs', label: 'Action verbs', value: verbs.length, note: verbs.length >= 6 ? 'good impact language' : 'use verbs like built/led/improved' });

  // quantified impact (0-20): numbers with %, x, or counts
  const metrics = (text.match(/\b\d+(?:\.\d+)?\s?(?:%|percent|x\b|k\b|\+)/gi) || []).length;
  const metricPts = clamp(metrics * 5, 0, 20);
  score += metricPts;
  checks.push({ id: 'quantified-impact', label: 'Quantified results', value: metrics, note: metrics >= 3 ? 'impact is measurable — great' : 'add numbers (%, ₹, users, time saved)' });

  return { score: Math.round(clamp(score, 0, 100)), detected, checks };
}

// ---------- Section 2: structure & format ----------
function scoreStructure(text, extractedMeta) {
  const checks = [];
  let score = 0;

  // contact info (0-40)
  const hasEmail = !!extractEmail(text) || !!extractedMeta.hasEmail;
  const hasPhone = !!extractPhone(text) || !!extractedMeta.hasPhone;
  const contactPts = (hasEmail ? 20 : 0) + (hasPhone ? 20 : 0);
  score += contactPts;
  checks.push({ id: 'email', label: 'Email address', ok: hasEmail });
  checks.push({ id: 'phone', label: 'Phone number', ok: hasPhone });

  // section headings (0-30): 7.5 per key section
  const headings = [];
  for (const [key, re] of Object.entries(SECTION_HEADINGS)) {
    const ok = re.test(text);
    if (ok) headings.push(key);
    checks.push({ id: 'section-' + key, label: key[0].toUpperCase() + key.slice(1) + ' section', ok });
  }
  score += headings.length * 7.5;

  // length (0-20): good zone 1800-6000 chars (~0.7–2.5 pages)
  const len = text.length;
  if (len >= 1800 && len <= 6000) { score += 20; checks.push({ id: 'length', label: 'Resume length', ok: true, note: Math.round(len / 2600) + ' page(s) — right size' }); }
  else if (len >= 1000 && len < 1800) { score += 12; checks.push({ id: 'length', label: 'Resume length', ok: false, note: 'a bit thin — add project/achievement detail' }); }
  else if (len > 6000) { score += 12; checks.push({ id: 'length', label: 'Resume length', ok: false, note: 'very long — trim to 1-2 pages' }); }
  else { score += 4; checks.push({ id: 'length', label: 'Resume length', ok: false, note: 'too short — needs substance' }); }

  // hygiene (0-10): penalize weird artifacts
  let hygiene = 10;
  if (/\uFFFD|\u0000/.test(text)) { hygiene -= 4; checks.push({ id: 'encoding', label: 'Text encoding', ok: false, note: 'odd characters found — export cleanly' }); }
  if (/( ){4,}|\t{2,}/.test(text)) { hygiene -= 2; checks.push({ id: 'spacing', label: 'Spacing', ok: false, note: 'big whitespace runs — use bullet lists' }); }
  checks.push({ id: 'hygiene', label: 'Formatting hygiene', ok: hygiene >= 8 });
  score += hygiene;

  return { score: Math.round(clamp(score, 0, 100)), checks };
}

// ---------- Section 3: experience depth ----------
function scoreExperience(text) {
  const lower = text.toLowerCase();
  const checks = [];
  let score = 0;

  const internships = (lower.match(/intern(ship)?/g) || []).length;
  const jobs = /(^|\n)\s*(work\s+)?(experience|employment)\s*:?(\n|$)/i.test(text) && /(20\d\d|19\d\d)/.test(text);
  const projects = /(^|\n)\s*(projects?|personal projects?)\s*:?(\n|$)/i.test(text);
  const projCount = projects ? Math.min((text.match(/(^|\n)\s*[•\-*]|\bproject\b/gi) || []).length, 8) : 0;

  // internships/jobs (0-45)
  const jobPts = clamp(internships * 15 + (jobs ? 15 : 0), 0, 45);
  score += jobPts;
  checks.push({ id: 'work-evidence', label: 'Work / internship evidence', value: internships + (jobs ? 1 : 0), note: internships || jobs ? 'real experience found' : 'add internships or part-time work' });

  // projects (0-35)
  const projPts = clamp(projCount * 5, 0, 35);
  score += projPts;
  checks.push({ id: 'projects', label: 'Projects listed', value: projects ? Math.max(projCount, 1) : 0, note: projects ? 'good — projects prove skills' : 'add 2-3 projects with outcomes' });

  // dates/timeline (0-20)
  const yearMentions = (text.match(/\b(19|20)\d\d\b/g) || []).length;
  const datePts = clamp(yearMentions * 4, 0, 20);
  score += datePts;
  checks.push({ id: 'dates', label: 'Clear dates/timeline', value: yearMentions, note: yearMentions >= 3 ? 'timeline is clear' : 'add dates for each role/education' });

  return { score: Math.round(clamp(score, 0, 100)), checks };
}

// ---------- Overall ----------
function buildResumeProfile(text) {
  const skills = scoreSkills(text);
  const structure = scoreStructure(text, {
    hasEmail: !!extractEmail(text),
    hasPhone: !!extractPhone(text)
  });
  const experience = scoreExperience(text);
  const overall = Math.round(skills.score * W.skills + structure.score * W.structure + experience.score * W.experience);

  return {
    overall,
    sections: {
      skills: { score: skills.score, weight: W.skills, detected: skills.detected, checks: skills.checks },
      structure: { score: structure.score, weight: W.structure, checks: structure.checks },
      experience: { score: experience.score, weight: W.experience, checks: experience.checks }
    }
  };
}

// ---------- Job fit ----------
function titleTokens(title) {
  return (title || '').toLowerCase().split(/[^a-z0-9+#.]+/).filter(t => t.length > 2);
}

function scoreJobFit(job, resumeProfile, userSkills) {
  const jobText = [job.title, job.description, (job.skills || []).join(' ')].join('\n');
  const jobSkills = detectSkills(jobText);

  const resumeKeys = new Set(resumeProfile.sections.skills.detected.map(skillKey));
  const userKeys = new Set((userSkills || []).map(skillKey));
  const jobKeys = jobSkills.map(skillKey);
  const jobKeySet = new Set(jobKeys);

  // 1. skill overlap (0-60): matched / required
  const matched = jobKeys.filter(k => resumeKeys.has(k) || userKeys.has(k));
  const overlap = jobKeys.length ? matched.length / jobKeys.length : 0;
  const skillPts = overlap * 60;

  // 2. title relevance (0-25): overlap between resume skill names and title words,
  //    plus generic fit when title words appear in the resume text
  const titleWords = titleTokens(job.title);
  const allResumeText = new Set([...resumeProfile.sections.skills.detected.map(s => s.toLowerCase()), ...(userSkills || []).map(s => s.toLowerCase())]);
  const titleHits = titleWords.filter(t => allResumeText.has(t)).length;
  const titlePts = titleWords.length ? (titleHits / titleWords.length) * 25 : 0;

  // 3. fresher friendliness (0-15): freshers-only or low experience requirement is a bonus for juniors
  let fresherPts = 6;
  if (job.fresher) fresherPts = 15;

  const fit = Math.round(clamp(skillPts + titlePts + fresherPts, 0, 100));
  return {
    jobId: job._id,
    fit,
    matchedSkills: matched.map(k => jobSkills.find(s => skillKey(s) === k)).filter(Boolean),
    missingSkills: jobSkills.filter(s => !resumeKeys.has(skillKey(s)) && !userKeys.has(skillKey(s))),
    reasons: [
      { label: 'Skill match', detail: matched.length + ' of ' + (jobKeys.length || 0) + ' required skills' },
      { label: 'Title relevance', detail: titleHits + ' of ' + (titleWords.length || 0) + ' title keywords in your profile' },
      { label: job.fresher ? 'Open to freshers' : 'Experience expected', detail: job.fresher ? 'freshers encouraged' : 'role expects some experience' }
    ]
  };
}

// ---------- Suggestions ----------
function buildSuggestions(resumeProfile) {
  const tips = [];
  const S = resumeProfile.sections;

  S.skills.checks.forEach(c => {
    if (c.id === 'skill-breadth' && c.value < 12) tips.push({ priority: c.value < 6 ? 'high' : 'medium', area: 'Skills', text: 'Add more relevant skills — ATS filters search for keywords. Currently only ' + c.value + ' recognized.' });
    if (c.id === 'action-verbs' && c.value < 6) tips.push({ priority: 'medium', area: 'Impact', text: 'Start bullet points with strong verbs (built, led, improved, automated) instead of responsibilities.' });
    if (c.id === 'quantified-impact' && c.value < 3) tips.push({ priority: 'high', area: 'Impact', text: 'Quantify achievements — e.g. "improved load time by 40%", "grew reach by 2x". Numbers catch recruiter attention.' });
  });

  S.structure.checks.forEach(c => {
    if (c.id === 'email' && c.ok === false) tips.push({ priority: 'high', area: 'Format', text: 'Add a professional email address at the top — many ATS auto-reject resumes without one.' });
    if (c.id === 'phone' && c.ok === false) tips.push({ priority: 'high', area: 'Format', text: 'Include a phone number in standard format (e.g. +91 98765 43210).' });
    if (c.id === 'section-experience' && c.ok === false) tips.push({ priority: 'medium', area: 'Structure', text: 'Add a clear "Experience" or "Internships" heading — ATS parsers look for it.' });
    if (c.id === 'section-education' && c.ok === false) tips.push({ priority: 'medium', area: 'Structure', text: 'Add an "Education" section with degree, institution and year.' });
    if (c.id === 'section-skills' && c.ok === false) tips.push({ priority: 'medium', area: 'Structure', text: 'Add a dedicated "Skills" section so keywords are easy to find.' });
    if (c.id === 'section-projects' && c.ok === false) tips.push({ priority: 'low', area: 'Structure', text: 'A "Projects" section helps freshers prove practical ability.' });
    if (c.id === 'length' && c.ok === false) tips.push({ priority: 'low', area: 'Format', text: c.note });
  });

  S.experience.checks.forEach(c => {
    if (c.id === 'work-evidence' && (c.value || 0) === 0) tips.push({ priority: 'high', area: 'Experience', text: 'No work or internship evidence found — add internships, freelance or part-time roles.' });
    if (c.id === 'projects' && (c.value || 0) === 0) tips.push({ priority: 'medium', area: 'Experience', text: 'List 2-3 concrete projects with the tech used and the outcome achieved.' });
    if (c.id === 'dates' && (c.value || 0) < 3) tips.push({ priority: 'medium', area: 'Experience', text: 'Add dates (month/year) to every role and degree — missing timelines confuse ATS parsing.' });
  });

  const order = { high: 0, medium: 1, low: 2 };
  tips.sort((a, b) => order[a.priority] - order[b.priority]);
  return tips;
}

// ---------- Top-level: scan stored resume text against live jobs ----------
async function scanResume(text, userSkills, Job) {
  const resumeProfile = buildResumeProfile(text);
  const suggestions = buildSuggestions(resumeProfile);

  const jobs = await Job.find({ status: 'active' }).populate('companyId', 'name').lean();
  const matches = jobs
    .map(j => scoreJobFit(j, resumeProfile, userSkills))
    .map(m => {
      const job = jobs.find(j => String(j._id) === String(m.jobId));
      return {
        jobId: job._id, title: job.title, type: job.type, location: job.location,
        sal: job.sal, fresher: job.fresher,
        companyId: job.companyId ? { _id: job.companyId._id, name: job.companyId.name } : null,
        ...m
      };
    })
    .sort((a, b) => b.fit - a.fit);

  return {
    scannedAt: new Date(),
    resume: {
      overall: resumeProfile.overall,
      sections: resumeProfile.sections,
      wordCount: text.split(/\s+/).filter(Boolean).length,
      charCount: text.length
    },
    suggestions,
    jobMatches: matches.slice(0, 6),
    scannedJobs: matches.length
  };
}

module.exports = { buildResumeProfile, scoreJobFit, buildSuggestions, scanResume };
