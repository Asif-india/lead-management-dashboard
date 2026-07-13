/**
 * Lead Validation Schemas
 * Joi validation schemas for lead-related requests
 */

import Joi from 'joi';
import { LEAD_STATUS, LEAD_PRIORITY } from '../constants/index.js';

/**
 * Create Lead Validation Schema
 */
export const createLeadSchema = Joi.object({
  employeeName: Joi.string().trim().max(100).required().messages({
    'string.empty': 'Employee name is required',
    'string.max': 'Employee name cannot exceed 100 characters',
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
  studentName: Joi.string().trim().max(100).required().messages({
    'string.empty': 'Student name is required',
    'string.max': 'Student name cannot exceed 100 characters',
  }),
  course: Joi.string().trim().required().messages({
    'string.empty': 'Course is required',
  }),
  university: Joi.string().trim().required().messages({
    'string.empty': 'University is required',
  }),
  leadStatus: Joi.string()
    .valid(...Object.values(LEAD_STATUS))
    .default(LEAD_STATUS.NEW),
  priority: Joi.string()
    .valid(...Object.values(LEAD_PRIORITY))
    .default(LEAD_PRIORITY.MEDIUM),
  notes: Joi.string().trim().max(1000).messages({
    'string.max': 'Notes cannot exceed 1000 characters',
  }),
  assignedTo: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).messages({
    'string.pattern.base': 'Invalid user ID format',
  }),
  followUpDate: Joi.date().iso(),
});

/**
 * Update Lead Validation Schema
 */
export const updateLeadSchema = Joi.object({
  employeeName: Joi.string().trim().max(100).messages({
    'string.max': 'Employee name cannot exceed 100 characters',
  }),
  email: Joi.string().trim().email().messages({
    'string.email': 'Please provide a valid email address',
  }),
  phone: Joi.string().trim(),
  employeeId: Joi.string().trim(),
  department: Joi.string()
    .valid('Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations', 'IT', 'Legal')
    .messages({
    'any.only': 'Please select a valid department',
  }),
  country: Joi.string().trim(),
  state: Joi.string().trim(),
  city: Joi.string().trim(),
  address: Joi.string().trim(),
  zipCode: Joi.string().trim(),
  studentName: Joi.string().trim().max(100).messages({
    'string.max': 'Student name cannot exceed 100 characters',
  }),
  course: Joi.string().trim(),
  university: Joi.string().trim(),
  leadStatus: Joi.string().valid(...Object.values(LEAD_STATUS)),
  priority: Joi.string().valid(...Object.values(LEAD_PRIORITY)),
  notes: Joi.string().trim().max(1000).messages({
    'string.max': 'Notes cannot exceed 1000 characters',
  }),
  assignedTo: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).messages({
    'string.pattern.base': 'Invalid user ID format',
  }),
  followUpDate: Joi.date().iso(),
}).min(1); // At least one field must be present

/**
 * Lead Query Validation Schema
 */
export const leadQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  sort: Joi.string().default('-createdAt'),
  leadStatus: Joi.string().valid(...Object.values(LEAD_STATUS)),
  priority: Joi.string().valid(...Object.values(LEAD_PRIORITY)),
  department: Joi.string(),
  search: Joi.string().trim(),
  assignedTo: Joi.string().pattern(/^[0-9a-fA-F]{24}$/),
  startDate: Joi.date().iso(),
  endDate: Joi.date().iso(),
});
