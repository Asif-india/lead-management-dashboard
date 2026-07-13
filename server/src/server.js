/**
 * Server Entry Point
 * Starts the Express server and connects to MongoDB
 */

// Load environment variables FIRST before any imports
import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import { connectDatabase } from './config/index.js';

// Connect to MongoDB
connectDatabase();

// Get port from environment or use default
const PORT = process.env.PORT || 5000;

// Start server
const server = app.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║  🚀 SaaS Lead Management Backend Server Started               ║
║                                                              ║
║  📡 Server running on port: ${PORT}                            ║
║  🌍 Environment: ${process.env.NODE_ENV || 'development'}      ║
║  📅 Started at: ${new Date().toISOString()}                ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
  `);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('💥 UNHANDLED REJECTION! Shutting down...');
  console.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('💥 UNCAUGHT EXCEPTION! Shutting down...');
  console.error(err.name, err.message);
  process.exit(1);
});

// Handle SIGTERM signal
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM RECEIVED. Shutting down gracefully...');
  server.close(() => {
    console.log('💥 Process terminated!');
  });
});
