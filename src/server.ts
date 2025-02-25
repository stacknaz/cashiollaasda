import express from 'express';
import { rateLimit } from 'express-rate-limit';
import cors from 'cors';
import helmet from 'helmet';
import { handlePostback } from './api/postback';

const app = express();
const port = process.env.PORT || 3000;

// Security headers
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});

// Apply rate limiting to postback endpoint
app.use('/api/postback', limiter);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS with specific origin
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://earnrewards.com', 'https://*.earnrewards.com']
    : '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Request logging
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url} ${res.statusCode} ${duration}ms`);
  });
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Postback endpoint
app.get('/api/postback', handlePostback);

// Global error handling
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  
  // Don't expose internal errors to clients
  res.status(500).json({
    error: 'Internal server error',
    requestId: req.id
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port} in ${process.env.NODE_ENV || 'development'} mode`);
});