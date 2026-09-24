const BASE = 'http://localhost:5000/api';
async function post(path, body, token) {
  const res = await fetch(BASE + path, { method: 'POST', headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) }, body: JSON.stringify(body) });
  return res.json();
}
async function get(path, token) {
  const res = await fetch(BASE + path, { headers: token ? { Authorization: `Bearer ${token}` } : {} });
  return res.json();
}
async function put(path, body, token) {
  const res = await fetch(BASE + path, { method: 'PUT', headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) }, body: JSON.stringify(body) });
  return res.json();
}

(async () => {
  const rec = await post('/auth/login', { email: 'rahul@demo.com', password: 'demo123' });
  if (!rec.token) { console.error('recruiter login fail', rec); process.exit(1); }

  // All applications to THIS recruiter's company's jobs
  const mine = await get('/applications/recruiter', rec.token);
  const apps = Array.isArray(mine) ? mine : (mine.data || mine.applications || []);
  console.log('recruiter applications:', apps.length);

  // Spread across the full pipeline, keeping some in "applied"
  const statuses = ['underReview', 'shortlisted', 'interview', 'selected', 'rejected'];
  let done = 0;
  for (let i = 0; i < apps.length && done < statuses.length; i++) {
    const a = apps[i];
    const status = a.status === 'applied' ? statuses[done++] : null;
    if (!status) continue;
    const r = await put(`/applications/${a._id}/status`, { status }, rec.token);
    console.log(String(a._id).slice(-6), '->', status, r.status || r.message || 'ok');
  }

  const dash = await get('/applications/dashboard/recruiter', rec.token);
  console.log('pipeline:', JSON.stringify(dash.pipelineData));
  console.log('DONE');
})().catch((e) => { console.error(e); process.exit(1); });
