/**
 * Response Formatter Utility
 * Standardizes API response format across all endpoints
 */

import { HTTP_STATUS } from '../constants/index.js';

/**
 * Success Response Formatter
 * @param {Object} res - Express response object
 * @param {*} data - Response data
 * @param {String} message - Success message
 * @param {Number} statusCode - HTTP status code
 */
export const sendSuccess = (res, data = null, message = 'Success', statusCode = HTTP_STATUS.OK) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    timestamp: new Date().toISOString(),
  });
};

/**
 * Error Response Formatter
 * @param {Object} res - Express response object
 * @param {String} message - Error message
 * @param {Number} statusCode - HTTP status code
 * @param {*} errors - Validation errors or additional error details
 */
export const sendError = (res, message = 'Error', statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR, errors = null) => {
  const response = {
    success: false,
    message,
    timestamp: new Date().toISOString(),
  };

  if (errors) {
    response.errors = errors;
  }

  return res.status(statusCode).json(response);
};

/**
 * Paginated Response Formatter
 * @param {Object} res - Express response object
 * @param {*} data - Response data
 * @param {Object} pagination - Pagination metadata
 * @param {String} message - Success message
 */
export const sendPaginated = (res, data, pagination, message = 'Success') => {
  return res.status(HTTP_STATUS.OK).json({
    success: true,
    message,
    data,
    pagination: {
      page: pagination.page,
      limit: pagination.limit,
      total: pagination.total,
      totalPages: Math.ceil(pagination.total / pagination.limit),
      hasNextPage: pagination.page < Math.ceil(pagination.total / pagination.limit),
      hasPrevPage: pagination.page > 1,
    },
    timestamp: new Date().toISOString(),
  });
};
