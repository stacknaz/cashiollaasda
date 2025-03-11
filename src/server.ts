import dotenv from 'dotenv';
// Load environment variables first
dotenv.config();

import express from 'express';
import { rateLimit } from 'express-rate-limit';
import cors from 'cors';
import helmet from 'helmet';
import { handlePostback } from './api/postback';
import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';

// Verify environment variables
console.log('Environment Check:');
console.log('- NODE_ENV:', process.env.NODE_ENV);
console.log('- VITE_SUPABASE_URL exists:', !!process.env.VITE_SUPABASE_URL);
console.log('- SUPABASE_SERVICE_ROLE_KEY exists:', !!process.env.SUPABASE_SERVICE_ROLE_KEY);

const app = express();
const port = process.env.PORT || 3000;

// Security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:", "http:"],
      connectSrc: ["'self'", "https:", "http:"],
      fontSrc: ["'self'", "https:", "data:"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'self'"],
    },
  },
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests from this IP, please try again later.' }
});

// Apply rate limiting to postback endpoint
app.use('/api/postback', limiter);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS with specific origin for production, but allow all in development
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://app.winappio.com', 'https://*.winappio.com']
    : '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Request logging (only in development)
if (process.env.NODE_ENV !== 'production') {
  app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
      const duration = Date.now() - start;
      console.log(`${new Date().toISOString()} - ${req.method} ${req.url} ${res.statusCode} ${duration}ms`);
    });
    next();
  });
}

// Health check endpoint
app.get('/health', (_, res) => {
  res.json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Postback endpoints - support both GET and POST
app.get('/api/postback', handlePostback);
app.post('/api/postback', handlePostback);

// Global error handling
app.use((err: Error, _: Request, res: Response, next: NextFunction) => {
  // Only log errors in development
  if (process.env.NODE_ENV !== 'production') {
    console.error('Server error:', err);
  }
  
  // Don't expose internal errors to clients
  res.status(500).json({
    error: 'Internal server error'
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port} in ${process.env.NODE_ENV || 'development'} mode`);
});