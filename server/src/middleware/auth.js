/**
 * Authentication Middleware
 * Verifies JWT tokens and protects routes
 */

import jwt from 'jsonwebtoken';
import { asyncHandler } from '../utils/index.js';
import AppError from '../utils/AppError.js';
import { HTTP_STATUS } from '../constants/index.js';
import User from '../models/User.js';

/**
 * Protect Routes - Verify JWT Token
 */
export const protect = asyncHandler(async (req, res, next) => {
  // 1. Get token from header
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new AppError('You are not logged in! Please log in to get access.', HTTP_STATUS.UNAUTHORIZED));
  }

  // 2. Verify token
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  // 3. Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(new AppError('The user belonging to this token no longer exists.', HTTP_STATUS.UNAUTHORIZED));
  }

  // 4. Check if user changed password after token was issued
  if (currentUser.changedPasswordAfter && currentUser.changedPasswordAfter(decoded.iat)) {
    return next(new AppError('User recently changed password! Please log in again.', HTTP_STATUS.UNAUTHORIZED));
  }

  // Grant access to protected route
  req.user = currentUser;
  next();
});

/**
 * Restrict Access to Specific Roles
 * @param  {...String} roles - Allowed roles
 */
export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to perform this action.', HTTP_STATUS.FORBIDDEN));
    }
    next();
  };
};

/**
 * Optional Auth - Attach user if token exists, but don't require it
 */
export const optionalAuth = asyncHandler(async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const currentUser = await User.findById(decoded.id);
      if (currentUser) {
        req.user = currentUser;
      }
    } catch (error) {
      // Token invalid, but we don't block the request
      req.user = null;
    }
  }

  next();
});
