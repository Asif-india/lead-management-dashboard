/**
 * Lead Routes
 * Defines all lead-related API routes with API versioning
 */

import express from 'express';
import {
  createLeadHandler,
  getAllLeadsHandler,
  getLeadByIdHandler,
  updateLeadHandler,
  deleteLeadHandler,
  // getLeadStatisticsHandler,
  // bulkUpdateLeadStatusHandler,
  // assignLeadHandler,
} from '../controllers/index.js';
import { protect, restrictTo } from '../middleware/index.js';
import { validateBody, validateQuery, validateParams } from '../middleware/index.js';
import { createLeadSchema, updateLeadSchema, leadQuerySchema } from '../validations/index.js';

const router = express.Router();

/**
 * @route   POST /api/v1/leads
 * @desc    Create a new lead
 * @access  Private
 */
// router.post(
//   '/',
//   protect,
//   restrictTo('admin', 'manager'),
//   validateBody(createLeadSchema),
//   createLeadHandler
// );


router.post(
  '/',
  validateBody(createLeadSchema),
  createLeadHandler
);

/**
 * @route   GET /api/v1/leads
 * @desc    Get all leads with filtering and pagination
 * @access  Private
 */
router.get(
  '/',
  protect,
  validateQuery(leadQuerySchema),
  getAllLeadsHandler
);

/**
 * @route   GET /api/v1/leads/statistics/overview
 * @desc    Get lead statistics
 * @access  Private
 */
// router.get(
//   '/statistics/overview',
//   protect,
//   getLeadStatisticsHandler
// );

/**
 * @route   PATCH /api/v1/leads/bulk/status
 * @desc    Bulk update lead status
 * @access  Private
 */
// router.patch(
//   '/bulk/status',
//   protect,
//   restrictTo('admin', 'manager'),
//   bulkUpdateLeadStatusHandler
// );

/**
 * @route   GET /api/v1/leads/:id
 * @desc    Get lead by ID
 * @access  Private
 */
router.get(
  '/:id',
  protect,
  getLeadByIdHandler
);

/**
 * @route   PATCH /api/v1/leads/:id
 * @desc    Update lead by ID
 * @access  Private
 */
router.patch(
  '/:id',
  protect,
  validateBody(updateLeadSchema),
  updateLeadHandler
);

/**
 * @route   PATCH /api/v1/leads/:id/assign
 * @desc    Assign lead to user
 * @access  Private
 */
router.patch(
  '/:id/assign',
  protect,
  restrictTo('admin', 'manager'),
  // assignLeadHandler
);

/**
 * @route   DELETE /api/v1/leads/:id
 * @desc    Delete lead by ID
 * @access  Private
 */
router.delete(
  '/:id',
  protect,
  restrictTo('admin'),
  deleteLeadHandler
);

export default router;
