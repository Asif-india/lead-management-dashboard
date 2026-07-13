/**
 * Employee Controller
 * Handles HTTP requests for employee operations
 */

import { asyncHandler } from '../utils/index.js';
import { sendSuccess, sendPaginated } from '../utils/responseFormatter.js';
import {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
  getEmployeeStatistics,
  getEmployeesByManager,
  updateEmployeeStatus,
} from '../services/index.js';

/**
 * @route   POST /api/v1/employees
 * @desc    Create a new employee
 * @access  Private (Admin/Manager)
 */
export const createEmployeeHandler = asyncHandler(async (req, res) => {
  const employee = await createEmployee(req.body);
  sendSuccess(res, employee, 'Employee created successfully', 201);
});

/**
 * @route   GET /api/v1/employees
 * @desc    Get all employees with filtering and pagination
 * @access  Private
 */
export const getAllEmployeesHandler = asyncHandler(async (req, res) => {
  const result = await getAllEmployees(req.query);
  sendPaginated(res, result.data, result.pagination, 'Employees fetched successfully');
});

/**
 * @route   GET /api/v1/employees/:id
 * @desc    Get employee by ID
 * @access  Private
 */
export const getEmployeeByIdHandler = asyncHandler(async (req, res) => {
  const employee = await getEmployeeById(req.params.id);
  sendSuccess(res, employee, 'Employee fetched successfully');
});

/**
 * @route   PATCH /api/v1/employees/:id
 * @desc    Update employee by ID
 * @access  Private
 */
export const updateEmployeeHandler = asyncHandler(async (req, res) => {
  const employee = await updateEmployee(req.params.id, req.body);
  sendSuccess(res, employee, 'Employee updated successfully');
});

/**
 * @route   DELETE /api/v1/employees/:id
 * @desc    Delete employee by ID
 * @access  Private (Admin)
 */
export const deleteEmployeeHandler = asyncHandler(async (req, res) => {
  await deleteEmployee(req.params.id);
  sendSuccess(res, null, 'Employee deleted successfully');
});

/**
 * @route   GET /api/v1/employees/statistics/overview
 * @desc    Get employee statistics
 * @access  Private
 */
export const getEmployeeStatisticsHandler = asyncHandler(async (req, res) => {
  const statistics = await getEmployeeStatistics();
  sendSuccess(res, statistics, 'Employee statistics fetched successfully');
});

/**
 * @route   GET /api/v1/employees/manager/:managerId
 * @desc    Get employees by manager
 * @access  Private
 */
export const getEmployeesByManagerHandler = asyncHandler(async (req, res) => {
  const employees = await getEmployeesByManager(req.params.managerId);
  sendSuccess(res, employees, 'Employees fetched successfully');
});

/**
 * @route   PATCH /api/v1/employees/:id/status
 * @desc    Update employee status
 * @access  Private (Admin/Manager)
 */
export const updateEmployeeStatusHandler = asyncHandler(async (req, res) => {
  const { newStatus } = req.body;
  const employee = await updateEmployeeStatus(req.params.id, newStatus);
  sendSuccess(res, employee, 'Employee status updated successfully');
});
