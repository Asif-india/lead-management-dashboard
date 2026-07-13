/**
 * Global Error Handler Middleware
 * Catches all errors and sends standardized error responses
 */

import AppError from '../utils/AppError.js';
import { sendError } from '../utils/responseFormatter.js';
import { HTTP_STATUS } from '../constants/index.js';

/**
 * Handle Mongoose CastError (invalid ObjectId)
 */
const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, HTTP_STATUS.BAD_REQUEST);
};

/**
 * Handle Mongoose duplicate key error
 */
const handleDuplicateFieldsDB = (err) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, HTTP_STATUS.CONFLICT);
};

/**
 * Handle Mongoose validation error
 */
const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, HTTP_STATUS.UNPROCESSABLE_ENTITY);
};

/**
 * Handle JWT errors
 */
const handleJWTError = () => {
  return new AppError('Invalid token. Please log in again!', HTTP_STATUS.UNAUTHORIZED);
};

const handleJWTExpiredError = () => {
  return new AppError('Your token has expired! Please log in again.', HTTP_STATUS.UNAUTHORIZED);
};

/**
 * Send error in development
 */
const sendErrorDev = (err, req, res) => {
  return sendError(
    res,
    err.message,
    err.statusCode,
    {
      error: err,
      stack: err.stack,
      errors: err.errors || null,
    }
  );
};

/**
 * Send error in production
 */
const sendErrorProd = (err, req, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    return sendError(res, err.message, err.statusCode, err.errors || null);
  }

  // Programming or other unknown error: don't leak details
  console.error('ERROR 💥:', err);
  return sendError(res, 'Something went wrong!', HTTP_STATUS.INTERNAL_SERVER_ERROR, null);
};

/**
 * Global Error Handler
 */
const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else {
    let error = { ...err };
    error.message = err.message;

    // Mongoose bad ObjectId
    if (err.name === 'CastError') {
      error = handleCastErrorDB(error);
    }

    // Mongoose duplicate key
    if (err.code === 11000) {
      error = handleDuplicateFieldsDB(error);
    }

    // Mongoose validation errors
    if (err.name === 'ValidationError') {
      error = handleValidationErrorDB(error);
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
      error = handleJWTError();
    }

    if (err.name === 'TokenExpiredError') {
      error = handleJWTExpiredError();
    }

    sendErrorProd(error, req, res);
  }
};

export default errorHandler;
