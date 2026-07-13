/**
 * Authentication Service
 * Business logic layer for authentication operations
 */

import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import AppError from '../utils/AppError.js';
import { HTTP_STATUS } from '../constants/index.js';

/**
 * Register a new user
 */
export const register = async (userData) => {
  try {
    const user = await User.create(userData);
    
    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
    });

    // Remove password from output
    user.password = undefined;

    return { user, token };
  } catch (error) {
    if (error.code === 11000) {
      throw new AppError('Email already exists', HTTP_STATUS.CONFLICT);
    }
    throw error;
  }
};

/**
 * Login user
 */
export const login = async (email, password) => {
  // Find user by email and include password for comparison
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    throw new AppError('Invalid email or password', HTTP_STATUS.UNAUTHORIZED);
  }

  if (!user.isActive) {
    throw new AppError('Your account has been deactivated', HTTP_STATUS.FORBIDDEN);
  }

  // Update last login
  user.lastLogin = new Date();
  await user.save({ validateBeforeSave: false });

  // Generate JWT token
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });

  // Remove password from output
  user.password = undefined;

  return { user, token };
};

/**
 * Get current user profile
 */
export const getMe = async (userId) => {
  const user = await User.findById(userId)
    .populate('employeeId', 'firstName lastName employeeId department designation');

  if (!user) {
    throw new AppError('User not found', HTTP_STATUS.NOT_FOUND);
  }

  return user;
};

/**
 * Update user profile
 */
export const updateProfile = async (userId, updateData) => {
  const user = await User.findByIdAndUpdate(userId, updateData, {
    new: true,
    runValidators: true,
  }).populate('employeeId', 'firstName lastName employeeId department designation');

  if (!user) {
    throw new AppError('User not found', HTTP_STATUS.NOT_FOUND);
  }

  return user;
};

/**
 * Update password
 */
export const updatePassword = async (userId, currentPassword, newPassword) => {
  const user = await User.findById(userId).select('+password');

  if (!user) {
    throw new AppError('User not found', HTTP_STATUS.NOT_FOUND);
  }

  // Check current password
  if (!(await user.correctPassword(currentPassword, user.password))) {
    throw new AppError('Current password is incorrect', HTTP_STATUS.UNAUTHORIZED);
  }

  // Update password
  user.password = newPassword;
  user.changedPasswordAt = Date.now();
  await user.save();

  // Generate new token
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });

  return { user, token };
};

/**
 * Forgot password
 */
export const forgotPassword = async (email) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new AppError('No user found with this email', HTTP_STATUS.NOT_FOUND);
  }

  // Generate reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // In production, send email with reset token
  // For now, return the token
  return resetToken;
};

/**
 * Reset password
 */
export const resetPassword = async (token, password) => {
  // Find user by reset token
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    throw new AppError('Token is invalid or has expired', HTTP_STATUS.BAD_REQUEST);
  }

  // Update password
  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  user.changedPasswordAt = Date.now();
  await user.save();

  // Generate new token
  const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });

  return { user, token: jwtToken };
};

/**
 * Verify JWT token
 */
export const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    throw new AppError('Invalid or expired token', HTTP_STATUS.UNAUTHORIZED);
  }
};
