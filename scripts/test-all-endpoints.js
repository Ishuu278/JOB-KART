// Comprehensive end-to-end endpoint test suite
const BASE = 'http://localhost:5000/api';

async function req(endpoint, opts = {}) {
  const headers = { 'Content-Type': 'application/json', ...opts.headers };
  const res = await fetch(BASE + endpoint, { ...opts, headers });
  const data = await res.json().catch(() => ({}));
  return { status: res.status, ok: res.ok, data };
}

async function runTests() {
  console.log('--- STARTING COMPREHENSIVE ENDPOINT AUDIT ---');
  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log('  PASS:', message);
      passed++;
    } else {
      console.error('  FAIL:', message);
      failed++;
    }
  }

  // 1. Auth & Credentials
  console.log('\n[1] Testing Auth Endpoints...');
  const testEmail = `testuser_${Date.now()}@test.com`;
  
  // Register short password
  const badPw = await req('/auth/register', { method: 'POST', body: JSON.stringify({ name: 'Short', email: testEmail, password: '123' }) });
  assert(badPw.status === 400, 'Rejects password shorter than 6 characters');

  // Register invalid email
  const badEmail = await req('/auth/register', { method: 'POST', body: JSON.stringify({ name: 'User', email: 'not-an-email', password: 'password123' }) });
  assert(badEmail.status === 400, 'Rejects invalid email format');

  // Register valid
  const reg = await req('/auth/register', { method: 'POST', body: JSON.stringify({ name: 'Audit User', email: testEmail, password: 'auditPassword123' }) });
  assert(reg.status === 201 && reg.data.token, 'Candidate registers and receives token');
  const userToken = reg.data.token;

  // Duplicate register
  const dup = await req('/auth/register', { method: 'POST', body: JSON.stringify({ name: 'Audit User', email: testEmail, password: 'auditPassword123' }) });
  assert(dup.status === 400, 'Rejects duplicate email registration');

  // Login
  const loginRes = await req('/auth/login', { method: 'POST', body: JSON.stringify({ email: testEmail, password: 'auditPassword123' }) });
  assert(loginRes.status === 200 && loginRes.data.token, 'Candidate logs in successfully');

  // Recruiter Login
  const recEmail = process.env.RECRUITER_EMAIL || 'recruiter@jobkart.in';
  const recPw = process.env.RECRUITER_PASSWORD || 'Recruit@2026';
  const recLogin = await req('/auth/login', { method: 'POST', body: JSON.stringify({ email: recEmail, password: recPw }) });
  assert(recLogin.status === 200 && recLogin.data.role === 'recruiter', 'Official recruiter logs in');
  const recToken = recLogin.data.token;

  // Profile get & update
  const me = await req('/auth/me', { headers: { Authorization: `Bearer ${userToken}` } });
  assert(me.status === 200 && me.data.email === testEmail, 'GET /auth/me returns candidate profile');

  const updateProf = await req('/auth/profile', {
    method: 'PUT',
    headers: { Authorization: `Bearer ${userToken}` },
    body: JSON.stringify({ skills: ['AuditSkill1', 'AuditSkill2'], experience: '2 years', education: 'B.S. CS' })
  });
  assert(updateProf.status === 200 && updateProf.data.skills.includes('AuditSkill1'), 'PUT /auth/profile updates profile');

  // 2. Jobs Endpoints
  console.log('\n[2] Testing Jobs Endpoints...');
  const jobs = await req('/jobs');
  assert(jobs.status === 200 && Array.isArray(jobs.data), 'GET /jobs returns job list');

  const jobsPaginated = await req('/jobs?page=1&limit=5');
  assert(jobsPaginated.status === 200 && jobsPaginated.data.jobs && jobsPaginated.data.total !== undefined, 'GET /jobs pagination works');

  const jobNames = await req('/jobs/names');
  assert(jobNames.status === 200 && Array.isArray(jobNames.data), 'GET /jobs/names returns lightweight names list');

  const firstJob = jobs.data[0];
  const jobById = await req(`/jobs/${firstJob._id}`);
  assert(jobById.status === 200 && jobById.data.title === firstJob.title, 'GET /jobs/:id returns correct job');

  const badJobId = await req('/jobs/invalid-id-string');
  assert(badJobId.status === 404, 'GET /jobs/:id with invalid id safely returns 404');

  // 3. Companies & Following
  console.log('\n[3] Testing Companies Endpoints...');
  const companies = await req('/companies');
  assert(companies.status === 200 && Array.isArray(companies.data) && companies.data.length > 0, 'GET /companies returns company list');

  const firstCo = companies.data[0];
  const follow1 = await req(`/companies/${firstCo._id}/follow`, { method: 'POST', headers: { Authorization: `Bearer ${userToken}` } });
  assert(follow1.status === 200 && follow1.data.following === true, 'POST /companies/:id/follow follows company');

  const follow2 = await req(`/companies/${firstCo._id}/follow`, { method: 'POST', headers: { Authorization: `Bearer ${userToken}` } });
  assert(follow2.status === 200 && follow2.data.following === false, 'POST /companies/:id/follow unfollows company cleanly');

  // 4. Reviews
  console.log('\n[4] Testing Reviews Endpoints...');
  const revPost = await req('/reviews', {
    method: 'POST',
    headers: { Authorization: `Bearer ${userToken}` },
    body: JSON.stringify({ companyId: firstCo._id, stars: 5, text: 'Great work culture and supportive team!', role: 'Software Engineer' })
  });
  assert(revPost.status === 201 && revPost.data._id, 'POST /reviews creates review');

  // Duplicate review should be rejected (one review per user per company)
  const revDup = await req('/reviews', {
    method: 'POST',
    headers: { Authorization: `Bearer ${userToken}` },
    body: JSON.stringify({ companyId: firstCo._id, stars: 4, text: 'Another review attempt.', role: 'Developer' })
  });
  assert(revDup.status === 409, 'POST /reviews rejects duplicate review for same company');

  const getRevs = await req(`/reviews/${firstCo._id}`);
  assert(getRevs.status === 200 && Array.isArray(getRevs.data) && getRevs.data.some(r => r._id === revPost.data._id), 'GET /reviews/:companyId returns created review');

  // Delete review
  const delRev = await req(`/reviews/${revPost.data._id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${userToken}` } });
  assert(delRev.status === 200, 'DELETE /reviews/:id deletes review');

  // 5. Contact Form
  console.log('\n[5] Testing Contact Endpoints...');
  const contactBad = await req('/contact', { method: 'POST', body: JSON.stringify({ name: 'Auditor', email: 'notvalid', message: 'Hello!' }) });
  assert(contactBad.status === 400, 'POST /contact rejects invalid email');

  const contactOk = await req('/contact', { method: 'POST', body: JSON.stringify({ name: 'Auditor', email: 'audit@jobkart.in', message: 'Testing contact submission' }) });
  assert(contactOk.status === 201, 'POST /contact submits valid contact message');

  const getContactsAnon = await req('/contact');
  assert(getContactsAnon.status === 401, 'GET /contact blocked for unauthenticated users');

  const getContactsRec = await req('/contact', { headers: { Authorization: `Bearer ${recToken}` } });
  assert(getContactsRec.status === 200 && Array.isArray(getContactsRec.data), 'GET /contact returns messages for recruiter');

  // 6. ATS Preview
  console.log('\n[6] Testing ATS Preview...');
  const atsPreview = await req('/ats/preview', {
    method: 'POST',
    headers: { Authorization: `Bearer ${userToken}` },
    body: JSON.stringify({
      text: 'Developed web applications using React, JavaScript, and Node.js. Built scalable REST APIs, optimized database queries reducing latency by 45%. Graduated in Computer Science in 2024. Contact: test@example.com, +91 9876543210.'
    })
  });
  assert(atsPreview.status === 200 && atsPreview.data.resume && atsPreview.data.resume.overall > 0, 'POST /ats/preview scores resume text');

  console.log(`\n=== AUDIT RESULTS: ${passed} PASSED, ${failed} FAILED ===`);
  if (failed > 0) process.exit(1);
}

runTests().catch(e => { console.error('Unexpected audit failure:', e); process.exit(1); });
