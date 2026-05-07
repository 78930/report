require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');

const connectDB = require('./config/db');

const app = express();

// Connect to MongoDB
connectDB();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? ['https://admin.civicreport.in', 'https://civicreport.in']
    : '*',
  credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { success: false, message: 'Too many requests, please try again later.' },
});
app.use('/api/', limiter);

// OTP flow removed — no OTP-specific rate limiter needed.

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Catch invalid JSON body parse errors and return friendly message
// Better JSON parse error handling: catch SyntaxError from body-parser
app.use((err, req, res, next) => {
  if (!err) return next();
  // body-parser sets err.type === 'entity.parse.failed' for some failures
  const isBodyParserError = err.type === 'entity.parse.failed' || (err instanceof SyntaxError && err.status === 400 && 'body' in err);
  if (isBodyParserError) {
    console.warn('Invalid JSON payload received:', err.message);
    return res.status(400).json({ success: false, message: 'Invalid JSON payload' });
  }
  next(err);
});

// Logging
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Static uploads (fallback if not using Cloudinary)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString(), version: '1.0.0' });
});

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/issues', require('./routes/issues'));
app.use('/api/admin', require('./routes/admin'));

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);

  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ success: false, message: messages.join(', ') });
  }
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({ success: false, message: `${field} already exists` });
  }
  if (err.name === 'CastError') {
    return res.status(400).json({ success: false, message: 'Invalid ID format' });
  }

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

const PORT = parseInt(process.env.PORT, 10) || 5000;

const os = require('os');

const startServer = (port) => {
  const host = '0.0.0.0';
  const s = app.listen(port, host, () => {
    console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${port} (bound to ${host})`);

    // Log network interfaces for convenience
    const nets = os.networkInterfaces();
    const results = {};
    for (const name of Object.keys(nets)) {
      for (const net of nets[name]) {
        // Skip non-IPv4 and internal
        if (net.family === 'IPv4' && !net.internal) {
          if (!results[name]) results[name] = [];
          results[name].push(net.address);
        }
      }
    }
    console.log('Available network addresses:', JSON.stringify(results));
  });

  s.on('error', (err) => {
    if (err && err.code === 'EADDRINUSE') {
      console.error(`Port ${port} is already in use. Trying port ${port + 1}...`);
      // try the next port (simple retry strategy)
      startServer(port + 1);
    } else {
      console.error('Server error:', err);
      process.exit(1);
    }
  });

  return s;
};

const server = startServer(PORT);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err.message);
  server.close(() => process.exit(1));
});

module.exports = app;
