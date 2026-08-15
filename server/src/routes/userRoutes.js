/**
 * User Management Routes
 * Defines all user management API routes with API versioning
 * Separated from authentication routes for enterprise architecture
 */

import express from 'express';
import {
  getAllUsersHandler,
  createUserHandler,
  updateUserAccountStatusHandler,
  changeUserPasswordHandler,
  changeUserRoleHandler,
  changeUserEmailHandler,
  promoteToAdministratorHandler,
  deleteUserHandler,
} from '../controllers/index.js';
import { protect, restrictTo } from '../middleware/index.js';
import { validateQuery } from '../middleware/index.js';

const router = express.Router();

/**
 * @route   POST /api/v1/users
 * @desc    Create a new user (Admin only)
 * @access  Private (Admin)
 */
router.post(
  '/',
  protect,
  restrictTo('administrator'),
  createUserHandler
);

/**
 * @route   GET /api/v1/users
 * @desc    Get all users with filtering and pagination
 * @access  Private (Admin)
 */
router.get(
  '/',
  protect,
  restrictTo('administrator'),
  getAllUsersHandler
);

/**
 * @route   PATCH /api/v1/users/:id/status
 * @desc    Update user account status (active/inactive/suspended/terminated)
 * @access  Private (Admin)
 */
router.patch(
  '/:id/status',
  protect,
  restrictTo('administrator'),
  updateUserAccountStatusHandler
);

/**
 * @route   PATCH /api/v1/users/:id/password
 * @desc    Change user password (Admin only)
 * @access  Private (Admin)
 */
router.patch(
  '/:id/password',
  protect,
  restrictTo('administrator'),
  changeUserPasswordHandler
);

/**
 * @route   PATCH /api/v1/users/:id/role
 * @desc    Change user role (Admin only)
 * @access  Private (Admin)
 */
router.patch(
  '/:id/role',
  protect,
  restrictTo('administrator'),
  changeUserRoleHandler
);

/**
 * @route   POST /api/v1/users/:id/promote
 * @desc    Promote user to Administrator (Admin only)
 * @access  Private (Admin)
 */
router.post(
  '/:id/promote',
  protect,
  restrictTo('administrator'),
  promoteToAdministratorHandler
);

/**
 * @route   PATCH /api/v1/users/:id/email
 * @desc    Change user email (Admin only)
 * @access  Private (Admin)
 */
router.patch(
  '/:id/email',
  protect,
  restrictTo('administrator'),
  changeUserEmailHandler
);

/**
 * @route   DELETE /api/v1/users/:id
 * @desc    Delete a user (Admin only)
 * @access  Private (Admin)
 */
router.delete(
  '/:id',
  protect,
  restrictTo('administrator'),
  deleteUserHandler
);

export default router;
