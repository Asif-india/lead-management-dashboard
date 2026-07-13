/**
 * Employee Routes
 * Defines all employee-related API routes with API versioning
 */

import express from 'express';
import {
  createEmployeeHandler,
  getAllEmployeesHandler,
  getEmployeeByIdHandler,
  updateEmployeeHandler,
  deleteEmployeeHandler,
  getEmployeeStatisticsHandler,
  getEmployeesByManagerHandler,
  updateEmployeeStatusHandler,
} from '../controllers/index.js';
import { protect, restrictTo } from '../middleware/index.js';
import { validateBody, validateQuery } from '../middleware/index.js';
import { createEmployeeSchema, updateEmployeeSchema, employeeQuerySchema } from '../validations/index.js';

const router = express.Router();

/**
 * @route   POST /api/v1/employees
 * @desc    Create a new employee
 * @access  Private (Admin/Manager)
 */
router.post(
  '/',
  protect,
  restrictTo('admin', 'manager'),
  validateBody(createEmployeeSchema),
  createEmployeeHandler
);

/**
 * @route   GET /api/v1/employees
 * @desc    Get all employees with filtering and pagination
 * @access  Private
 */
router.get(
  '/',
  protect,
  validateQuery(employeeQuerySchema),
  getAllEmployeesHandler
);

/**
 * @route   GET /api/v1/employees/statistics/overview
 * @desc    Get employee statistics
 * @access  Private
 */
router.get(
  '/statistics/overview',
  protect,
  getEmployeeStatisticsHandler
);

/**
 * @route   GET /api/v1/employees/manager/:managerId
 * @desc    Get employees by manager
 * @access  Private
 */
router.get(
  '/manager/:managerId',
  protect,
  getEmployeesByManagerHandler
);

/**
 * @route   GET /api/v1/employees/:id
 * @desc    Get employee by ID
 * @access  Private
 */
router.get(
  '/:id',
  protect,
  getEmployeeByIdHandler
);

/**
 * @route   PATCH /api/v1/employees/:id
 * @desc    Update employee by ID
 * @access  Private
 */
router.patch(
  '/:id',
  protect,
  validateBody(updateEmployeeSchema),
  updateEmployeeHandler
);

/**
 * @route   PATCH /api/v1/employees/:id/status
 * @desc    Update employee status
 * @access  Private (Admin/Manager)
 */
router.patch(
  '/:id/status',
  protect,
  restrictTo('admin', 'manager'),
  updateEmployeeStatusHandler
);

/**
 * @route   DELETE /api/v1/employees/:id
 * @desc    Delete employee by ID
 * @access  Private (Admin)
 */
router.delete(
  '/:id',
  protect,
  restrictTo('admin'),
  deleteEmployeeHandler
);

export default router;
