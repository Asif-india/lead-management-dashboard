/**
 * Incentive Routes
 * Defines all incentive-related API routes with API versioning
 */

import express from 'express';
import {
  createIncentiveHandler,
  getAllIncentivesHandler,
  getIncentiveByIdHandler,
  updateIncentiveHandler,
  deleteIncentiveHandler,
  getIncentiveAnalyticsHandler,
} from '../controllers/index.js';
import { protect, restrictTo } from '../middleware/index.js';
import { validateBody, validateQuery, validateParams } from '../middleware/index.js';
import { createIncentiveSchema, updateIncentiveSchema, incentiveQuerySchema } from '../validations/index.js';

const router = express.Router();

/**
 * @route   POST /api/v1/incentives
 * @desc    Create a new incentive
 * @access  Private
 */
router.post(
  '/',
  protect,
  restrictTo('administrator', 'manager'),
  validateBody(createIncentiveSchema),
  createIncentiveHandler
);

/**
 * @route   GET /api/v1/incentives
 * @desc    Get all incentives with filtering and pagination
 * @access  Private
 */
router.get(
  '/',
  protect,
  validateQuery(incentiveQuerySchema),
  getAllIncentivesHandler
);

/**
 * @route   GET /api/v1/incentives/analytics
 * @desc    Get comprehensive incentive analytics
 * @access  Private
 */
router.get(
  '/analytics',
  protect,
  getIncentiveAnalyticsHandler
);

/**
 * @route   GET /api/v1/incentives/:id
 * @desc    Get incentive by ID
 * @access  Private
 */
router.get(
  '/:id',
  protect,
  getIncentiveByIdHandler
);

/**
 * @route   PATCH /api/v1/incentives/:id
 * @desc    Update incentive by ID
 * @access  Private
 */
router.patch(
  '/:id',
  protect,
  restrictTo('administrator', 'manager'),
  validateBody(updateIncentiveSchema),
  updateIncentiveHandler
);

/**
 * @route   DELETE /api/v1/incentives/:id
 * @desc    Delete incentive by ID
 * @access  Private
 */
router.delete(
  '/:id',
  protect,
  restrictTo('administrator'),
  deleteIncentiveHandler
);

export default router;
