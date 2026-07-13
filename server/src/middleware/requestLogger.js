/**
 * Request Logger Middleware
 * Logs incoming requests with detailed information
 */

import morgan from 'morgan';

/**
 * Custom Morgan Token for Request ID
 */
morgan.token('req-id', (req) => req.id || '-');

/**
 * Custom Morgan Token for User ID (if authenticated)
 */
morgan.token('user-id', (req) => req.user?.id || '-');

/**
 * Development Log Format
 */
const devLogFormat = ':req-id [:date[clf]] :method :url :status :response-time ms - :res[content-length] - :user-id';

/**
 * Production Log Format (simplified)
 */
const prodLogFormat = ':method :url :status :response-time ms';

/**
 * Request Logger Middleware
 */
const requestLogger = () => {
  if (process.env.NODE_ENV === 'production') {
    return morgan(prodLogFormat, {
      skip: (req, res) => res.statusCode < 400, // Only log errors in production
    });
  }
  return morgan(devLogFormat);
};

export default requestLogger;
