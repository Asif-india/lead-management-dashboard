/**
 * Lead Source Validation Schemas
 * Joi validation schemas for lead source-related requests
 */

import Joi from 'joi';

/**
 * Create Lead Source Validation Schema
 */
export const createLeadSourceSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required().messages({
    'string.empty': 'Lead source name is required',
    'string.min': 'Lead source name must be at least 2 characters',
    'string.max': 'Lead source name cannot exceed 100 characters',
  }),
  description: Joi.string().trim().max(500).allow('').optional().messages({
    'string.max': 'Description cannot exceed 500 characters',
  }),
  status: Joi.string().valid('active', 'inactive').default('active').messages({
    'any.only': 'Status must be either active or inactive',
  }),
});

/**
 * Update Lead Source Validation Schema
 */
export const updateLeadSourceSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).optional().messages({
    'string.min': 'Lead source name must be at least 2 characters',
    'string.max': 'Lead source name cannot exceed 100 characters',
  }),
  description: Joi.string().trim().max(500).allow('').optional().messages({
    'string.max': 'Description cannot exceed 500 characters',
  }),
  status: Joi.string().valid('active', 'inactive').optional().messages({
    'any.only': 'Status must be either active or inactive',
  }),
}).min(1).messages({
  'object.min': 'At least one field must be provided for update',
});

/**
 * Get Lead Sources Query Validation Schema
 */
export const getLeadSourcesQuerySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1).messages({
    'number.base': 'Page must be a number',
    'number.min': 'Page must be at least 1',
  }),
  limit: Joi.number().integer().min(1).max(100).default(10).messages({
    'number.base': 'Limit must be a number',
    'number.min': 'Limit must be at least 1',
    'number.max': 'Limit cannot exceed 100',
  }),
  status: Joi.string().valid('active', 'inactive').optional().messages({
    'any.only': 'Status must be either active or inactive',
  }),
  search: Joi.string().trim().optional().messages({
    'string.base': 'Search must be a string',
  }),
});
