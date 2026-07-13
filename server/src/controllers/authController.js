/**
 * Authentication Controller
 * Handles HTTP requests for authentication operations
 */

import { asyncHandler } from '../utils/index.js';
import { sendSuccess } from '../utils/responseFormatter.js';
import {
  register,
  login,
  getMe,
  updateProfile,
  updatePassword,
  forgotPassword,
  resetPassword,
} from '../services/index.js';

/**
 * @route   POST /api/v1/auth/register
 * @desc    Register a new user
 * @access  Public
 */
export const registerHandler = asyncHandler(async (req, res) => {
  const { user, token } = await register(req.body);
  sendSuccess(res, { user, token }, 'User registered successfully', 201);
});

/**
 * @route   POST /api/v1/auth/login
 * @desc    Login user
 * @access  Public
 */
export const loginHandler = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const { user, token } = await login(email, password);
  sendSuccess(res, { user, token }, 'Login successful');
});

/**
 * @route   GET /api/v1/auth/me
 * @desc    Get current user profile
 * @access  Private
 */
export const getMeHandler = asyncHandler(async (req, res) => {
  const user = await getMe(req.user.id);
  sendSuccess(res, user, 'User profile fetched successfully');
});

/**
 * @route   PATCH /api/v1/auth/update-profile
 * @desc    Update user profile
 * @access  Private
 */
export const updateProfileHandler = asyncHandler(async (req, res) => {
  const user = await updateProfile(req.user.id, req.body);
  sendSuccess(res, user, 'Profile updated successfully');
});

/**
 * @route   PATCH /api/v1/auth/update-password
 * @desc    Update user password
 * @access  Private
 */
export const updatePasswordHandler = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const { user, token } = await updatePassword(req.user.id, currentPassword, newPassword);
  sendSuccess(res, { user, token }, 'Password updated successfully');
});

/**
 * @route   POST /api/v1/auth/forgot-password
 * @desc    Request password reset
 * @access  Public
 */
export const forgotPasswordHandler = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const resetToken = await forgotPassword(email);
  // In production, send email with reset token
  sendSuccess(res, { resetToken }, 'Password reset token sent to email');
});

/**
 * @route   POST /api/v1/auth/reset-password
 * @desc    Reset password with token
 * @access  Public
 */
export const resetPasswordHandler = asyncHandler(async (req, res) => {
  const { token, password } = req.body;
  const { user, token: newToken } = await resetPassword(token, password);
  sendSuccess(res, { user, token: newToken }, 'Password reset successfully');
});
