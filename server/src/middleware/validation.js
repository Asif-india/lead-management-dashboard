/**
 * Validation Middleware
 * Validates request data using Joi schemas
 */

import { asyncHandler } from '../utils/index.js';
import AppError from '../utils/AppError.js';
import { HTTP_STATUS } from '../constants/index.js';

/**
 * Validate Request Body
 * @param {Object} schema - Joi validation schema
 */
export const validateBody = (schema) => {
  return asyncHandler(async (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false, // Return all errors
      stripUnknown: true, // Remove unknown properties
    });

    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message,
      }));

      console.log('Validation Error Details:', errors);
      console.log('Received Body:', req.body);
      console.log('Validated Value:', value);

      return next(new AppError('Validation failed', HTTP_STATUS.UNPROCESSABLE_ENTITY, true, '', errors));
    }

    next();
  });
};

/**
 * Validate Request Query Parameters
 * @param {Object} schema - Joi validation schema
 */
export const validateQuery = (schema) => {
  return asyncHandler(async (req, res, next) => {
    const { error } = schema.validate(req.query, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message,
      }));

      return next(new AppError('Invalid query parameters', HTTP_STATUS.BAD_REQUEST, true, '', errors));
    }

    next();
  });
};

/**
 * Validate Request Parameters
 * @param {Object} schema - Joi validation schema
 */
export const validateParams = (schema) => {
  return asyncHandler(async (req, res, next) => {
    const { error } = schema.validate(req.params, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message,
      }));

      return next(new AppError('Invalid parameters', HTTP_STATUS.BAD_REQUEST, true, '', errors));
    }

    next();
  });
};
