// Seeds demo users + applications so dashboards render rich data.
const BASE = 'http://localhost:5000/api';

async function post(path, body, token) {
  const res = await fetch(BASE + path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: JSON.stringify(body),
  });
  return res.json();
}
async function put(path, body, token) {
  const res = await fetch(BASE + path, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: JSON.stringify(body),
  });
  return res.json();
}
async function get(path, token) {
  const res = await fetch(BASE + path, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
  return res.json();
}

// Registration is candidate-only (recruiter accounts come from scripts/seed-v2.js),
// so this script registers-or-logs-in the candidate and logs in the provisioned recruiter.
async function registerOrLogin(user, password) {
  const created = await post('/auth/register', user);
  if (created.token) return created;
  return post('/auth/login', { email: user.email, password });
}

(async () => {
  const cand = await registerOrLogin({
    name: 'Aisha Sharma', email: 'aisha@demo.com', password: 'demo123',
    role: 'candidate', phone: '+91 98765 43210',
  }, 'demo123');
  const recEmail = process.env.RECRUITER_EMAIL || 'recruiter@jobkart.in';
  const recPassword = process.env.RECRUITER_PASSWORD || 'Recruit@2026';
  const rec = await post('/auth/login', { email: recEmail, password: recPassword });
  if (!cand.token || !rec.token) {
    console.error('seed-demo: sign-in failed', { candidate: cand, recruiter: rec });
    console.error('hint: run `node scripts/seed-v2.js` first to provision the recruiter account');
    process.exit(1);
  }
  console.log('users ready');

  // Enrich candidate profile
  await put('/auth/profile', {
    skills: ['React', 'Node.js', 'JavaScript', 'SEO', 'Content Strategy', 'Figma'],
    experience: '3 years',
    education: 'B.Tech CEST, KIIT University',
    portfolioUrl: 'https://aisha.dev',
  }, cand.token);

  // Candidate applies to a spread of jobs
  const jobs = await get('/jobs');
  const list = (jobs.data || jobs).slice(0, 9);
  const appIds = [];
  // /applications/apply answers with the application object itself (201), or 400 "Already applied".
  const mine = await get('/applications/mine', cand.token);
  const existingByJob = new Map(
    (Array.isArray(mine) ? mine : mine.applications || mine.data || [])
      .map(x => [String((x.jobId && x.jobId._id) || x.jobId), x._id])
  );
  for (const j of list) {
    const jobId = j._id || j.id;
    const a = await post('/applications/apply', { jobId }, cand.token);
    if (a && a._id) appIds.push(a._id);
    else if (existingByJob.has(String(jobId))) appIds.push(existingByJob.get(String(jobId)));
  }
  console.log('applications:', appIds.length);

  // Recruiter moves some along the pipeline
  const statuses = ['underReview', 'shortlisted', 'interviewScheduled', 'selected', 'rejected'];
  for (let i = 0; i < appIds.length && i < statuses.length; i++) {
    await put(`/applications/${appIds[i]}/status`, { status: statuses[i] }, rec.token);
  }

  // Check dashboards
  const cd = await get('/applications/dashboard/candidate', cand.token);
  const rd = await get('/applications/dashboard/recruiter', rec.token);
  console.log('candidate dashboard keys:', Object.keys(cd).join(','));
  console.log('recruiter dashboard keys:', Object.keys(rd).join(','));
  console.log('DONE');
})().catch((e) => { console.error(e); process.exit(1); });
