const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const http = require('http');
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');

const jwt = require('jsonwebtoken');
const app = express();
const httpServer = http.createServer(app);
const { Server } = require('socket.io');
const io = new Server(httpServer, { cors: { origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : '*' } });

const PORT = process.env.PORT || 5000;

// Reverse proxy support
app.set('trust proxy', 1);

// Security Headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

// CORS Configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : '*',
  credentials: true
};
app.use(cors(corsOptions));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

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

// ===== Socket.io: authenticated personal rooms + presence =====
const User = require('./models/User');

// Reject unauthenticated sockets: the JWT is the only source of identity.
io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth && socket.handshake.auth.token;
    if (!token) return next(new Error('Unauthorized'));
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('_id role');
    if (!user) return next(new Error('Unauthorized'));
    socket.data.userId = String(user._id);
    socket.data.role = user.role;
    next();
  } catch (e) {
    next(new Error('Unauthorized'));
  }
});

const broadcastPresence = async (userId, isOnline) => {
  try {
    const recruiter = await User.findOne({ role: 'recruiter' }).select('_id');
    if (recruiter) {
      io.to(String(recruiter._id)).emit('user:online', { userId, isOnline });
    }
  } catch (e) { /* non-fatal */ }
};

io.on('connection', async (socket) => {
  const userId = socket.data.userId;

  // Always join the verified user's private room; client-supplied ids are ignored.
  socket.join(userId);

  try {
    await User.findByIdAndUpdate(userId, { isOnline: true, lastSeen: new Date() });
    broadcastPresence(userId, true);
  } catch (e) { /* non-fatal */ }

  // Backwards-compatible no-op for older clients that still emit `join`.
  socket.on('join', () => socket.join(userId));

  socket.on('typing:start', ({ conversationId, to }) => {
    if (to) io.to(String(to)).emit('typing:start', { conversationId, from: userId });
  });
  socket.on('typing:stop', ({ conversationId, to }) => {
    if (to) io.to(String(to)).emit('typing:stop', { conversationId, from: userId });
  });

  socket.on('disconnect', async () => {
    try {
      // only mark offline if no other sockets in the room
      const room = io.sockets.adapter.rooms.get(userId);
      if (!room || room.size === 0) {
        await User.findByIdAndUpdate(userId, { isOnline: false, lastSeen: new Date() });
        broadcastPresence(userId, false);
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
  app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
    setHeaders: (res) => {
      res.setHeader('X-Content-Type-Options', 'nosniff');
    }
  }));

  // 404 for unknown API routes
  app.use('/api', (req, res) => res.status(404).json({ message: 'Route not found' }));

  // Central error handler
  app.use((err, req, res, next) => {
    if (process.env.NODE_ENV !== 'production') {
      console.error(err.stack);
    }
    const isProd = process.env.NODE_ENV === 'production';
    res.status(err.status || 500).json({
      message: isProd ? 'Internal server error' : (err.message || 'Server error')
    });
  });

  httpServer.listen(PORT, () => {
    console.log(`Server (HTTP + Socket.io) running on port ${PORT}`);
  });
});
