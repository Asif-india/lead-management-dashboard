/**
 * Audit Log Routes
 * Defines all audit log API routes with API versioning
 */

import express from 'express';
import {
  getAllAuditLogsHandler,
  getUserAuditLogsHandler,
} from '../controllers/index.js';
import { protect, restrictTo } from '../middleware/index.js';

const router = express.Router();

/**
 * @route   GET /api/v1/audit-logs
 * @desc    Get all audit logs with filtering and pagination
 * @access  Private (Admin)
 */
router.get(
  '/',
  protect,
  restrictTo('administrator'),
  getAllAuditLogsHandler
);

/**
 * @route   GET /api/v1/audit-logs/user/:userId
 * @desc    Get audit logs for a specific user
 * @access  Private (Admin)
 */
router.get(
  '/user/:userId',
  protect,
  restrictTo('administrator'),
  getUserAuditLogsHandler
);

export default router;
