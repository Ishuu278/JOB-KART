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

(async () => {
  // Register demo users
  const cand = await post('/auth/register', {
    name: 'Aisha Sharma', email: 'aisha@demo.com', password: 'demo123',
    role: 'candidate', phone: '+91 98765 43210',
  });
  const rec = await post('/auth/register', {
    name: 'Rahul Verma', email: 'rahul@demo.com', password: 'demo123',
    role: 'recruiter', phone: '+91 90000 11122',
  });
  if (!cand.token || !rec.token) { console.error('register fail', cand, rec); process.exit(1); }
  console.log('users created');

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
  for (const j of list) {
    const a = await post('/applications/apply', { jobId: j._id || j.id }, cand.token);
    if (a.application || a.data) appIds.push((a.application || a.data)._id);
  }
  console.log('applications:', appIds.length);

  // Recruiter moves some along the pipeline
  const statuses = ['underReview', 'shortlisted', 'interview', 'selected', 'rejected'];
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
