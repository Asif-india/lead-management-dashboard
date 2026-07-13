/**
 * Analytics Controller
 * Handles HTTP requests for analytics operations
 */

import { asyncHandler } from '../utils/index.js';
import { sendSuccess } from '../utils/responseFormatter.js';
import {
  getDashboardOverview,
  getLeadAnalytics,
  getEmployeePerformance,
  getDepartmentAnalytics,
  getPriorityAnalytics,
  getAnalyticsReport,
} from '../services/index.js';

/**
 * @route   GET /api/v1/analytics/dashboard
 * @desc    Get dashboard overview statistics
 * @access  Private
 */
export const getDashboardOverviewHandler = asyncHandler(async (req, res) => {
  const overview = await getDashboardOverview();
  sendSuccess(res, overview, 'Dashboard overview fetched successfully');
});

/**
 * @route   GET /api/v1/analytics/leads
 * @desc    Get lead analytics over time
 * @access  Private
 */
export const getLeadAnalyticsHandler = asyncHandler(async (req, res) => {
  const { period = '30d' } = req.query;
  const analytics = await getLeadAnalytics(period);
  sendSuccess(res, analytics, 'Lead analytics fetched successfully');
});

/**
 * @route   GET /api/v1/analytics/employee-performance
 * @desc    Get employee performance analytics
 * @access  Private (Admin/Manager)
 */
export const getEmployeePerformanceHandler = asyncHandler(async (req, res) => {
  const performance = await getEmployeePerformance();
  sendSuccess(res, performance, 'Employee performance fetched successfully');
});

/**
 * @route   GET /api/v1/analytics/departments
 * @desc    Get department-wise lead distribution
 * @access  Private
 */
export const getDepartmentAnalyticsHandler = asyncHandler(async (req, res) => {
  const analytics = await getDepartmentAnalytics();
  sendSuccess(res, analytics, 'Department analytics fetched successfully');
});

/**
 * @route   GET /api/v1/analytics/priority
 * @desc    Get priority distribution analytics
 * @access  Private
 */
export const getPriorityAnalyticsHandler = asyncHandler(async (req, res) => {
  const analytics = await getPriorityAnalytics();
  sendSuccess(res, analytics, 'Priority analytics fetched successfully');
});

/**
 * @route   GET /api/v1/analytics/report
 * @desc    Get comprehensive analytics report
 * @access  Private
 */
export const getAnalyticsReportHandler = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;
  const report = await getAnalyticsReport(startDate, endDate);
  sendSuccess(res, report, 'Analytics report fetched successfully');
});
