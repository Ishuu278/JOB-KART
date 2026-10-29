/* E2E socket test: apply → recruiter sees it live; chat both ways; status → candidate sees it live */
const { io } = require('socket.io-client');
const B = 'http://localhost:5000';

async function login(email, password) {
  const res = await fetch(B + '/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) });
  return res.json();
}

(async () => {
  const cand = await login('aisha@demo.com', 'demo123');
  const rec = await login('recruiter@jobkart.in', 'Recruit@2026');
  console.log('candidate login:', cand._id ? 'OK' : cand);
  console.log('official recruiter login:', rec._id ? 'OK (' + rec.email + ')' : rec);

  const cSock = io(B, { transports: ['websocket'], auth: { token: cand.token } });
  const rSock = io(B, { transports: ['websocket'], auth: { token: rec.token } });

  const received = { statusUpdate: null, notifCand: null, appNew: null, notifRec: null, msgCand: null, msgRec: null, readReceipt: null };

  cSock.on('connect', () => cSock.emit('join', cand._id));
  rSock.on('connect', () => rSock.emit('join', rec._id));

  cSock.on('status:updated', d => { received.statusUpdate = d; });
  cSock.on('notification:new', d => { received.notifCand = d.notification; });
  cSock.on('message:new', d => { received.msgCand = d.message; });
  rSock.on('application:new', d => { received.appNew = d; });
  rSock.on('notification:new', d => { received.notifRec = d.notification; });
  rSock.on('message:new', d => { received.msgRec = d.message; });
  rSock.on('message:read', d => { received.readReceipt = d; });

  await new Promise(r => setTimeout(r, 1200));

  // 1. Candidate applies to a job she has NOT applied to
  const mine = await (await fetch(B + '/api/applications/mine', { headers: { Authorization: 'Bearer ' + cand.token } })).json();
  const appliedJobIds = new Set(mine.map(a => String(typeof a.jobId === 'object' ? a.jobId._id : a.jobId)));
  const jobs = await (await fetch(B + '/api/jobs')).json();
  const job = (Array.isArray(jobs) ? jobs : jobs.data).find(j => !appliedJobIds.has(String(j._id)));
  if (!job) { console.error('no fresh job available'); process.exit(1); }
  console.log('applying to:', job.title);

  const appRes = await fetch(B + '/api/applications/apply', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + cand.token }, body: JSON.stringify({ jobId: job._id, coverNote: 'E2E cover note' }) });
  const app = await appRes.json();
  console.log('apply:', appRes.status, app._id ? 'OK' : app);

  // 2. Recruiter sends chat message
  const convId = cand._id + '_' + job._id;
  const msgRes = await fetch(B + '/api/messages', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + rec.token }, body: JSON.stringify({ conversationId: convId, text: 'E2E test message — hello!' }) });
  console.log('recruiter message:', msgRes.status);

  // 3. Candidate reads → read receipt to recruiter
  await fetch(B + '/api/messages/' + convId + '/read', { method: 'PUT', headers: { Authorization: 'Bearer ' + cand.token } });

  // 4. Candidate replies
  await fetch(B + '/api/messages', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + cand.token }, body: JSON.stringify({ conversationId: convId, text: 'Thanks! E2E reply.' }) });

  // 5. Recruiter schedules interview
  const stRes = await fetch(B + '/api/applications/' + app._id + '/status', { method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + rec.token }, body: JSON.stringify({ status: 'interviewScheduled', note: 'E2E interview', interviewDate: '2026-10-01T15:00:00', interviewLink: 'https://meet.google.com/test-e2e' }) });
  const st = await stRes.json();
  console.log('status update:', stRes.status, st.status, '| interview:', st.interviewLink);

  await new Promise(r => setTimeout(r, 1800));
  console.log('--- EVENTS RECEIVED ---');
  console.log('recruiter application:new:', !!received.appNew, received.appNew ? '(' + received.appNew.candidate.name + ' → ' + received.appNew.job.title + ')' : '');
  console.log('recruiter notification:', !!received.notifRec, received.notifRec ? received.notifRec.body : '');
  console.log('recruiter message:new (candidate reply):', !!received.msgRec, received.msgRec ? received.msgRec.text : '');
  console.log('recruiter message:read receipt:', !!received.readReceipt);
  console.log('candidate status:updated:', !!received.statusUpdate, received.statusUpdate ? '(' + received.statusUpdate.newStatus + ', link: ' + received.statusUpdate.interviewLink + ')' : '');
  console.log('candidate notification:', !!received.notifCand, received.notifCand ? received.notifCand.body : '');
  console.log('candidate message:new:', !!received.msgCand, received.msgCand ? received.msgCand.text : '');

  cSock.close(); rSock.close();
  const wd = await fetch(B + '/api/applications/mine/' + app._id + '/withdraw', { method: 'PUT', headers: { Authorization: 'Bearer ' + cand.token } });
  console.log('cleanup withdraw:', wd.status);
  process.exit(0);
})().catch(e => { console.error(e); process.exit(1); });
