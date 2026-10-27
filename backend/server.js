const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const http = require('http');
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');

const app = express();
const httpServer = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(httpServer, { cors: { origin: '*' } });

const PORT = process.env.PORT || 5000;

// CORS Configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : '*',
  credentials: true
};
app.use(cors(corsOptions));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Custom XSS Sanitization Middleware
const sanitizeXSS = (obj) => {
  if (typeof obj === 'string') {
    return obj
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;');
  }
  if (Array.isArray(obj)) {
    return obj.map(sanitizeXSS);
  }
  if (obj !== null && typeof obj === 'object') {
    const newObj = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        newObj[key] = sanitizeXSS(obj[key]);
      }
    }
    return newObj;
  }
  return obj;
};

const xssMiddleware = (req, res, next) => {
  if (req.body) req.body = sanitizeXSS(req.body);
  if (req.query) req.query = sanitizeXSS(req.query);
  if (req.params) req.params = sanitizeXSS(req.params);
  next();
};
app.use(xssMiddleware);

// Attach io so controllers can emit real-time events
app.use((req, res, next) => { req.io = io; next(); });

// Rate Limiting for API Endpoints
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // real-time app polls more often now
  message: { success: false, message: 'Too many requests from this IP, please try again after 15 minutes' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', apiLimiter);

// ===== Socket.io: personal rooms + presence =====
const User = require('./models/User');

io.on('connection', (socket) => {
  socket.on('join', async (userId) => {
    if (!userId) return;
    socket.join(String(userId));
    socket.data.userId = String(userId);
    try {
      await User.findByIdAndUpdate(userId, { isOnline: true, lastSeen: new Date() });
      const recruiter = await User.findOne({ role: 'recruiter' }).select('_id');
      if (recruiter) {
        io.to(String(recruiter._id)).emit('user:online', { userId, isOnline: true });
      }
    } catch (e) { /* non-fatal */ }
  });

  socket.on('typing:start', ({ conversationId, to }) => {
    if (to) io.to(String(to)).emit('typing:start', { conversationId, from: socket.data.userId });
  });
  socket.on('typing:stop', ({ conversationId, to }) => {
    if (to) io.to(String(to)).emit('typing:stop', { conversationId, from: socket.data.userId });
  });

  socket.on('disconnect', async () => {
    const uid = socket.data.userId;
    if (!uid) return;
    try {
      // only mark offline if no other sockets in the room
      const room = io.sockets.adapter.rooms.get(uid);
      if (!room || room.size === 0) {
        await User.findByIdAndUpdate(uid, { isOnline: false, lastSeen: new Date() });
        const recruiter = await User.findOne({ role: 'recruiter' }).select('_id');
        if (recruiter) {
          io.to(String(recruiter._id)).emit('user:online', { userId: uid, isOnline: false });
        }
      }
    } catch (e) { /* non-fatal */ }
  });
});

// Connect to Database and start server
connectDB().then(() => {
  const authRoutes = require('./routes/auth');
  const jobRoutes = require('./routes/jobs');
  const companyRoutes = require('./routes/companies');
  const applicationRoutes = require('./routes/applications');
  const messageRoutes = require('./routes/messages');
  const notificationRoutes = require('./routes/notifications');
  const reviewRoutes = require('./routes/reviews');
  const atsRoutes = require('./routes/ats');
  const contactRoutes = require('./routes/contact');

  // API Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/jobs', jobRoutes);
  app.use('/api/companies', companyRoutes);
  app.use('/api/applications', applicationRoutes);
  app.use('/api/messages', messageRoutes);
  app.use('/api/notifications', notificationRoutes);
  app.use('/api/reviews', reviewRoutes);
  app.use('/api/ats', atsRoutes);
  app.use('/api/contact', contactRoutes);

  // Serve frontend static files
  app.use(express.static(path.join(__dirname, '../frontend')));

  // Serve uploaded user files (resumes, profile photos)
  app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

  // 404 for unknown API routes
  app.use('/api', (req, res) => res.status(404).json({ message: 'Route not found' }));

  // Socket-related error guard
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: err.message || 'Server error' });
  });

  httpServer.listen(PORT, () => {
    console.log(`Server (HTTP + Socket.io) running on port ${PORT}`);
  });
});
