/**
 * Application Constants
 * Centralized constants for the application
 */

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
};

// Lead Status
export const LEAD_STATUS = {
  NEW: 'new',
  CONTACTED: 'contacted',
  QUALIFIED: 'qualified',
  PROPOSAL: 'proposal',
  NEGOTIATION: 'negotiation',
  WON: 'won',
  LOST: 'lost',
};

// Lead Priority
export const LEAD_PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent',
};

// User Roles
export const USER_ROLES = {
  ADMIN: 'administrator',
  MANAGER: 'manager',
  EMPLOYEE: 'employee',
};

// Pagination Defaults
export const PAGINATION = {
  DEFAULT_PAGE: parseInt(process.env.DEFAULT_PAGE) || 1,
  DEFAULT_LIMIT: parseInt(process.env.DEFAULT_LIMIT) || 10,
  MAX_LIMIT: parseInt(process.env.MAX_LIMIT) || 100,
};

// Sort Options
export const SORT_OPTIONS = {
  ASC: 'asc',
  DESC: 'desc',
};

// Error Messages
export const ERROR_MESSAGES = {
  UNAUTHORIZED: 'Unauthorized access',
  FORBIDDEN: 'Access forbidden',
  NOT_FOUND: 'Resource not found',
  VALIDATION_ERROR: 'Validation failed',
  DUPLICATE_ENTRY: 'Duplicate entry',
  INTERNAL_ERROR: 'Internal server error',
  INVALID_CREDENTIALS: 'Invalid credentials',
  TOKEN_EXPIRED: 'Token expired',
  TOKEN_INVALID: 'Invalid token',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  CREATED: 'Resource created successfully',
  UPDATED: 'Resource updated successfully',
  DELETED: 'Resource deleted successfully',
  FETCHED: 'Resource fetched successfully',
};
