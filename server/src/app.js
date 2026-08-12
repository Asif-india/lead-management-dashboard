/**
 * Express App Configuration
 * Configures Express application with middleware, routes, and error handling
 */

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { connectDatabase } from './config/index.js';
import { errorHandler, requestLogger } from './middleware/index.js';
import { leadRoutes, employeeRoutes, authRoutes, analyticsRoutes, incentiveRoutes, userRoutes, leadSourceRoutes } from './routes/index.js';

const app = express();

// Trust proxy (for rate limiting behind proxies)
app.set('trust proxy', 1);

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
}));

// Body parser middleware
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// Compression middleware
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/api', limiter);

// Request logging middleware
app.use(requestLogger());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// API Routes with versioning
const API_VERSION = process.env.API_VERSION || 'v1';

app.use(`/api/${API_VERSION}/leads`, leadRoutes);
app.use(`/api/${API_VERSION}/employees`, employeeRoutes);
app.use(`/api/${API_VERSION}/auth`, authRoutes);
app.use(`/api/${API_VERSION}/analytics`, analyticsRoutes);
app.use(`/api/${API_VERSION}/incentives`, incentiveRoutes);
app.use(`/api/${API_VERSION}/users`, userRoutes);
app.use(`/api/${API_VERSION}/lead-sources`, leadSourceRoutes);

// 404 handler for undefined routes
app.all('*', (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Cannot find ${req.originalUrl} on this server!`,
    timestamp: new Date().toISOString(),
  });
});

// Global error handler (must be last)
app.use(errorHandler);

export default app;
