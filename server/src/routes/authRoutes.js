/**
 * Authentication Routes
 * Defines all authentication-related API routes with API versioning
 */

import express from 'express';
import {
  registerHandler,
  loginHandler,
  getMeHandler,
  updateProfileHandler,
  updatePasswordHandler,
  forgotPasswordHandler,
  resetPasswordHandler,
} from '../controllers/index.js';
import { protect } from '../middleware/index.js';
import { validateBody } from '../middleware/index.js';
import {
  registerSchema,
  loginSchema,
  updatePasswordSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from '../validations/index.js';

const router = express.Router();

/**
 * @route   POST /api/v1/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post(
  '/register',
  validateBody(registerSchema),
  registerHandler
);

/**
 * @route   POST /api/v1/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post(
  '/login',
  validateBody(loginSchema),
  loginHandler
);

/**
 * @route   GET /api/v1/auth/me
 * @desc    Get current user profile
 * @access  Private
 */
router.get(
  '/me',
  protect,
  getMeHandler
);

/**
 * @route   PATCH /api/v1/auth/update-profile
 * @desc    Update user profile
 * @access  Private
 */
router.patch(
  '/update-profile',
  protect,
  updateProfileHandler
);

/**
 * @route   PATCH /api/v1/auth/update-password
 * @desc    Update user password
 * @access  Private
 */
router.patch(
  '/update-password',
  protect,
  validateBody(updatePasswordSchema),
  updatePasswordHandler
);

/**
 * @route   POST /api/v1/auth/forgot-password
 * @desc    Request password reset
 * @access  Public
 */
router.post(
  '/forgot-password',
  validateBody(forgotPasswordSchema),
  forgotPasswordHandler
);

/**
 * @route   POST /api/v1/auth/reset-password
 * @desc    Reset password with token
 * @access  Public
 */
router.post(
  '/reset-password',
  validateBody(resetPasswordSchema),
  resetPasswordHandler
);

export default router;
