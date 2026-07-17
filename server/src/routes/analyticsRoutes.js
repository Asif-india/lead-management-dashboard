/**
 * Analytics Routes
 * Defines all analytics-related API routes with API versioning
 */

import express from 'express';
import {
  getDashboardOverviewHandler,
  getLeadAnalyticsHandler,
  getEmployeePerformanceHandler,
  getDepartmentAnalyticsHandler,
  getPriorityAnalyticsHandler,
  getAnalyticsReportHandler,
  getComprehensiveLeadAnalyticsHandler,
} from '../controllers/index.js';
import { protect, restrictTo } from '../middleware/index.js';

const router = express.Router();

/**
 * @route   GET /api/v1/analytics/dashboard
 * @desc    Get dashboard overview statistics
 * @access  Private
 */
router.get(
  '/dashboard',
  protect,
  getDashboardOverviewHandler
);

/**
 * @route   GET /api/v1/analytics/leads
 * @desc    Get lead analytics over time
 * @access  Private
 */
router.get(
  '/leads',
  protect,
  getLeadAnalyticsHandler
);

/**
 * @route   GET /api/v1/analytics/employee-performance
 * @desc    Get employee performance analytics
 * @access  Private (Admin/Manager)
 */
router.get(
  '/employee-performance',
  protect,
  restrictTo('admin', 'manager'),
  getEmployeePerformanceHandler
);

/**
 * @route   GET /api/v1/analytics/departments
 * @desc    Get department-wise lead distribution
 * @access  Private
 */
router.get(
  '/departments',
  protect,
  getDepartmentAnalyticsHandler
);

/**
 * @route   GET /api/v1/analytics/priority
 * @desc    Get priority distribution analytics
 * @access  Private
 */
router.get(
  '/priority',
  protect,
  getPriorityAnalyticsHandler
);

/**
 * @route   GET /api/v1/analytics/report
 * @desc    Get comprehensive analytics report
 * @access  Private
 */
router.get(
  '/report',
  protect,
  getAnalyticsReportHandler
);

/**
 * @route   GET /api/v1/analytics/comprehensive
 * @desc    Get comprehensive lead analytics for frontend dashboard
 * @access  Private
 */
router.get(
  '/comprehensive',
  protect,
  getComprehensiveLeadAnalyticsHandler
);

export default router;
