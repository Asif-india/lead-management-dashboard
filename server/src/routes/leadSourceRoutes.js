/**
 * Lead Source Routes
 * API routes for lead source management
 */

import express from 'express';
import { protect, restrictTo } from '../middleware/auth.js';
import {
  createLeadSourceSchema,
  updateLeadSourceSchema,
  getLeadSourcesQuerySchema,
} from '../validations/leadSourceValidation.js';
import { validateBody, validateQuery } from '../middleware/validation.js';
import {
  createLeadSourceHandler,
  getAllLeadSourcesHandler,
  getActiveLeadSourcesHandler,
  getLeadSourceByIdHandler,
  updateLeadSourceHandler,
  updateLeadSourceStatusHandler,
  deleteLeadSourceHandler,
} from '../controllers/leadSourceController.js';

const router = express.Router();

/**
 * @route   POST /api/v1/lead-sources
 * @desc    Create a new lead source
 * @access  Private (Admin/Manager)
 */
router.post(
  '/',
  protect,
  restrictTo('administrator', 'manager'),
  validateBody(createLeadSourceSchema),
  createLeadSourceHandler
);

/**
 * @route   GET /api/v1/lead-sources
 * @desc    Get all lead sources with pagination and filters
 * @access  Private
 */
router.get(
  '/',
  protect,
  validateQuery(getLeadSourcesQuerySchema),
  getAllLeadSourcesHandler
);

/**
 * @route   GET /api/v1/lead-sources/active
 * @desc    Get all active lead sources (for dropdowns)
 * @access  Private
 */
router.get(
  '/active',
  protect,
  getActiveLeadSourcesHandler
);

/**
 * @route   GET /api/v1/lead-sources/:id
 * @desc    Get lead source by ID
 * @access  Private
 */
router.get(
  '/:id',
  protect,
  getLeadSourceByIdHandler
);

/**
 * @route   PUT /api/v1/lead-sources/:id
 * @desc    Update lead source by ID
 * @access  Private (Admin/Manager)
 */
router.put(
  '/:id',
  protect,
  restrictTo('administrator', 'manager'),
  validateBody(updateLeadSourceSchema),
  updateLeadSourceHandler
);

/**
 * @route   PATCH /api/v1/lead-sources/:id/status
 * @desc    Update lead source status
 * @access  Private (Admin/Manager)
 */
router.patch(
  '/:id/status',
  protect,
  restrictTo('administrator', 'manager'),
  updateLeadSourceStatusHandler
);

/**
 * @route   DELETE /api/v1/lead-sources/:id
 * @desc    Delete lead source by ID (soft delete)
 * @access  Private (Admin/Manager)
 */
router.delete(
  '/:id',
  protect,
  restrictTo('administrator', 'manager'),
  deleteLeadSourceHandler
);

export default router;
