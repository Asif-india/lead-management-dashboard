/**
 * Employee Service
 * Business logic layer for employee operations
 */

import Employee from '../models/Employee.js';
import AppError from '../utils/AppError.js';
import { HTTP_STATUS } from '../constants/index.js';

/**
 * Create a new employee
 */
export const createEmployee = async (employeeData) => {
  try {
    const employee = await Employee.create(employeeData);
    return employee;
  } catch (error) {
    if (error.code === 11000) {
      throw new AppError('Employee ID or email already exists', HTTP_STATUS.CONFLICT);
    }
    throw error;
  }
};

/**
 * Get all employees with filtering, pagination, and search
 */
export const getAllEmployees = async (query) => {
  const {
    page = 1,
    limit = 10,
    sort = '-createdAt',
    department,
    employmentStatus,
    search,
    managerId,
  } = query;

  // Build query
  const queryObj = {};

  if (department) queryObj.department = department;
  if (employmentStatus) queryObj.employmentStatus = employmentStatus;
  if (managerId) queryObj.managerId = managerId;

  // Search filter
  if (search) {
    queryObj.$or = [
      { firstName: { $regex: search, $options: 'i' } },
      { lastName: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { employeeId: { $regex: search, $options: 'i' } },
    ];
  }

  // Pagination
  const skip = (page - 1) * limit;

  // Execute query
  const [employees, total] = await Promise.all([
    Employee.find(queryObj)
      .populate('managerId', 'firstName lastName email')
      .populate('userId', 'firstName lastName email role')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit)),
    Employee.countDocuments(queryObj),
  ]);

  return {
    data: employees,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
    },
  };
};

/**
 * Get employee by ID
 */
export const getEmployeeById = async (id) => {
  const employee = await Employee.findById(id)
    .populate('managerId', 'firstName lastName email')
    .populate('userId', 'firstName lastName email role');
  
  if (!employee) {
    throw new AppError('Employee not found', HTTP_STATUS.NOT_FOUND);
  }
  
  return employee;
};

/**
 * Update employee by ID
 */
export const updateEmployee = async (id, updateData) => {
  const employee = await Employee.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  }).populate('managerId', 'firstName lastName email')
   .populate('userId', 'firstName lastName email role');

  if (!employee) {
    throw new AppError('Employee not found', HTTP_STATUS.NOT_FOUND);
  }

  return employee;
};

/**
 * Delete employee by ID
 */
export const deleteEmployee = async (id) => {
  const employee = await Employee.findByIdAndDelete(id);

  if (!employee) {
    throw new AppError('Employee not found', HTTP_STATUS.NOT_FOUND);
  }

  return employee;
};

/**
 * Get employee statistics
 */
export const getEmployeeStatistics = async () => {
  const [
    totalEmployees,
    departmentDistribution,
    statusDistribution,
    recentHires,
  ] = await Promise.all([
    Employee.countDocuments(),
    Employee.aggregate([
      {
        $group: {
          _id: '$department',
          count: { $sum: 1 },
        },
      },
    ]),
    Employee.aggregate([
      {
        $group: {
          _id: '$employmentStatus',
          count: { $sum: 1 },
        },
      },
    ]),
    Employee.find().sort('-dateOfJoining').limit(5),
  ]);

  return {
    totalEmployees,
    departmentDistribution,
    statusDistribution,
    recentHires,
  };
};

/**
 * Get employees by manager
 */
export const getEmployeesByManager = async (managerId) => {
  const employees = await Employee.find({ managerId })
    .populate('managerId', 'firstName lastName email')
    .populate('userId', 'firstName lastName email role');

  return employees;
};

/**
 * Update employee status
 */
export const updateEmployeeStatus = async (id, newStatus) => {
  const employee = await Employee.findByIdAndUpdate(
    id,
    { employmentStatus: newStatus },
    { new: true, runValidators: true }
  );

  if (!employee) {
    throw new AppError('Employee not found', HTTP_STATUS.NOT_FOUND);
  }

  return employee;
};
