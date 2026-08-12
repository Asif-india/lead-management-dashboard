/**
 * Audit Log Controller
 * Handles HTTP requests for audit log operations
 */

import { asyncHandler } from '../utils/index.js';
import { sendPaginated } from '../utils/responseFormatter.js';
import {
  getAuditLogs,
  getUserAuditLogs,
} from '../services/index.js';

/**
 * @route   GET /api/v1/audit-logs
 * @desc    Get all audit logs with filtering and pagination
 * @access  Private (Admin)
 */
export const getAllAuditLogsHandler = asyncHandler(async (req, res) => {
  const result = await getAuditLogs(req.query);
  sendPaginated(res, result.data, result.pagination, 'Audit logs fetched successfully');
});

/**
 * @route   GET /api/v1/audit-logs/user/:userId
 * @desc    Get audit logs for a specific user
 * @access  Private (Admin)
 */
export const getUserAuditLogsHandler = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const result = await getUserAuditLogs(userId, req.query);
  sendPaginated(res, result.data, result.pagination, 'User audit logs fetched successfully');
});
