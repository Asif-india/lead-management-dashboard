/**
 * Custom Application Error Class
 * Extends native Error class for better error handling
 */

class AppError extends Error {
  constructor(message, statusCode, isOperational = true, stack = '', errors = null) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.errors = errors;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default AppError;
