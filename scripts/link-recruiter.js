// REST-only: link recruiter to Leadjen Media + seed applications for that company.
const BASE = 'http://localhost:5000/api';
async function req(method, path, body, token) {
  const res = await fetch(BASE + path, { method, headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) }, body: body ? JSON.stringify(body) : undefined });
  let data = null;
  try { data = await res.json(); } catch (e) {}
  return { status: res.status, data };
}

(async () => {
  const companies = await req('GET', '/companies');
  const list = Array.isArray(companies.data) ? companies.data : (companies.data?.data || companies.data || []);
  const leadjen = list.find(c => c.name === 'Leadjen Media');
  console.log('company:', leadjen && leadjen.name, leadjen && leadjen._id);

  const rec = (await req('POST', '/auth/login', { email: 'rahul@demo.com', password: 'demo123' })).data;
  const linked = await req('PUT', '/auth/profile', { companyId: leadjen._id }, rec.token);
  console.log('link status:', linked.status);

  // Register second candidate (ignore duplicate error)
  const priyaReg = await req('POST', '/auth/register', { name: 'Priya Patel', email: 'priya@demo.com', password: 'demo123', role: 'candidate', phone: '+91 91234 56780' });
  const priya = priyaReg.data && priyaReg.data.token ? priyaReg.data : (await req('POST', '/auth/login', { email: 'priya@demo.com', password: 'demo123' })).data;
  const aisha = (await req('POST', '/auth/login', { email: 'aisha@demo.com', password: 'demo123' })).data;

  const jobs = await req('GET', `/companies/${leadjen._id}/jobs`);
  const jlist = Array.isArray(jobs.data) ? jobs.data : (jobs.data?.data || []);
  console.log('leadjen jobs:', jlist.length);

  for (const c of [priya, aisha]) {
    if (!c || !c.token) { console.log('candidate missing, skip'); continue; }
    const mine = await req('GET', '/applications/my', null, c.token);
    const mlist = Array.isArray(mine.data) ? mine.data : (mine.data?.data || []);
    const have = new Set(mlist.map(a => String(a.jobId && (a.jobId._id || a.jobId))));
    for (const j of jlist) {
      if (!have.has(String(j._id))) {
        const r = await req('POST', '/applications/apply', { jobId: String(j._id) }, c.token);
        if (r.status !== 201) console.log('apply fail', r.status, r.data);
      }
    }
  }

  const all = await req('GET', '/applications/recruiter', null, rec.token);
  const apps = Array.isArray(all.data) ? all.data : (all.data?.data || []);
  console.log('recruiter sees applications:', apps.length);
  const flow = ['shortlisted', 'interview', 'selected', 'underReview', 'shortlisted', 'interview'];
  let i = 0;
  for (const a of apps) {
    if (i < flow.length && a.status === 'applied') {
      await req('PUT', `/applications/${a._id}/status`, { status: flow[i++] }, rec.token);
    }
  }

  const dash = await req('GET', '/applications/dashboard/recruiter', null, rec.token);
  console.log('recruiter dashboard:', JSON.stringify(dash.data).slice(0, 400));
  console.log('DONE');
})().catch(e => { console.error(e); process.exit(1); });
