const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');

const app = express();
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
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
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

// Rate Limiting for API Endpoints
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: { success: false, message: 'Too many requests from this IP, please try again after 15 minutes' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', apiLimiter);

// Connect to Database and start server
connectDB().then(() => {
  const authRoutes = require('./routes/auth');
  const jobRoutes = require('./routes/jobs');
  const companyRoutes = require('./routes/companies');
  const applicationRoutes = require('./routes/applications');
  const reviewRoutes = require('./routes/reviews');
  const contactRoutes = require('./routes/contact');

  // API Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/jobs', jobRoutes);
  app.use('/api/companies', companyRoutes);
  app.use('/api/applications', applicationRoutes);
  app.use('/api/reviews', reviewRoutes);
  app.use('/api/contact', contactRoutes);

  // Serve frontend static files
  app.use(express.static(path.join(__dirname, '../frontend')));

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});

