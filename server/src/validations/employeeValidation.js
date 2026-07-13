/**
 * Employee Validation Schemas
 * Joi validation schemas for employee-related requests
 */

import Joi from 'joi';

/**
 * Create Employee Validation Schema
 */
export const createEmployeeSchema = Joi.object({
  firstName: Joi.string().trim().max(50).required().messages({
    'string.empty': 'First name is required',
    'string.max': 'First name cannot exceed 50 characters',
  }),
  lastName: Joi.string().trim().max(50).required().messages({
    'string.empty': 'Last name is required',
    'string.max': 'Last name cannot exceed 50 characters',
  }),
  email: Joi.string().trim().email().required().messages({
    'string.empty': 'Email is required',
    'string.email': 'Please provide a valid email address',
  }),
  phone: Joi.string().trim().required().messages({
    'string.empty': 'Phone number is required',
  }),
  employeeId: Joi.string().trim().required().messages({
    'string.empty': 'Employee ID is required',
  }),
  department: Joi.string()
    .valid('Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations', 'IT', 'Legal')
    .required()
    .messages({
      'string.empty': 'Department is required',
      'any.only': 'Please select a valid department',
    }),
  designation: Joi.string().trim().required().messages({
    'string.empty': 'Designation is required',
  }),
  managerId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).messages({
    'string.pattern.base': 'Invalid manager ID format',
  }),
  country: Joi.string().trim().required().messages({
    'string.empty': 'Country is required',
  }),
  state: Joi.string().trim().required().messages({
    'string.empty': 'State is required',
  }),
  city: Joi.string().trim().required().messages({
    'string.empty': 'City is required',
  }),
  address: Joi.string().trim().required().messages({
    'string.empty': 'Address is required',
  }),
  zipCode: Joi.string().trim().required().messages({
    'string.empty': 'Zip code is required',
  }),
  dateOfJoining: Joi.date().iso().required().messages({
    'date.empty': 'Date of joining is required',
  }),
  employmentStatus: Joi.string()
    .valid('active', 'inactive', 'on-leave', 'terminated')
    .default('active'),
  salary: Joi.number().min(0).messages({
    'number.min': 'Salary cannot be negative',
  }),
  bio: Joi.string().trim().max(500).messages({
    'string.max': 'Bio cannot exceed 500 characters',
  }),
  skills: Joi.array().items(Joi.string().trim()),
});

/**
 * Update Employee Validation Schema
 */
export const updateEmployeeSchema = Joi.object({
  firstName: Joi.string().trim().max(50).messages({
    'string.max': 'First name cannot exceed 50 characters',
  }),
  lastName: Joi.string().trim().max(50).messages({
    'string.max': 'Last name cannot exceed 50 characters',
  }),
  email: Joi.string().trim().email().messages({
    'string.email': 'Please provide a valid email address',
  }),
  phone: Joi.string().trim(),
  department: Joi.string()
    .valid('Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations', 'IT', 'Legal')
    .messages({
    'any.only': 'Please select a valid department',
  }),
  designation: Joi.string().trim(),
  managerId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).messages({
    'string.pattern.base': 'Invalid manager ID format',
  }),
  country: Joi.string().trim(),
  state: Joi.string().trim(),
  city: Joi.string().trim(),
  address: Joi.string().trim(),
  zipCode: Joi.string().trim(),
  employmentStatus: Joi.string()
    .valid('active', 'inactive', 'on-leave', 'terminated'),
  salary: Joi.number().min(0).messages({
    'number.min': 'Salary cannot be negative',
  }),
  bio: Joi.string().trim().max(500).messages({
    'string.max': 'Bio cannot exceed 500 characters',
  }),
  skills: Joi.array().items(Joi.string().trim()),
}).min(1);

/**
 * Employee Query Validation Schema
 */
export const employeeQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  sort: Joi.string().default('-createdAt'),
  department: Joi.string(),
  employmentStatus: Joi.string().valid('active', 'inactive', 'on-leave', 'terminated'),
  search: Joi.string().trim(),
  managerId: Joi.string().pattern(/^[0-9a-fA-F]{24}$/),
});
