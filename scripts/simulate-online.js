// Keeps a candidate socket connected so their Kanban dot shows online.
// Usage: node scripts/simulate-online.js <email> (runs until killed)
const { io } = require('socket.io-client');
const B = 'http://localhost:5000';
const email = process.argv[2] || 'aisha@demo.com';

(async () => {
  const res = await fetch(B + '/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password: 'demo123' }) });
  const user = await res.json();
  const sock = io(B, { transports: ['websocket'] });
  sock.on('connect', () => {
    sock.emit('join', user._id);
    console.log('ONLINE_SIM: joined as', user.email, user._id);
  });
  setInterval(() => {}, 1 << 30);
})().catch(e => { console.error(e); process.exit(1); });
