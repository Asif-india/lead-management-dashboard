/**
 * Authentication Validation Schemas
 * Joi validation schemas for authentication-related requests
 */

import Joi from 'joi';
import { USER_ROLES } from '../constants/index.js';

/**
 * Register Validation Schema
 */
export const registerSchema = Joi.object({
  email: Joi.string().trim().email().required().messages({
    'string.empty': 'Email is required',
    'string.email': 'Please provide a valid email address',
  }),
  password: Joi.string()
    .min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .required()
    .messages({
      'string.empty': 'Password is required',
      'string.min': 'Password must be at least 8 characters',
      'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
    }),
  firstName: Joi.string().trim().max(50).required().messages({
    'string.empty': 'First name is required',
    'string.max': 'First name cannot exceed 50 characters',
  }),
  lastName: Joi.string().trim().max(50).required().messages({
    'string.empty': 'Last name is required',
    'string.max': 'Last name cannot exceed 50 characters',
  }),
  role: Joi.string().valid(...Object.values(USER_ROLES)).default(USER_ROLES.EMPLOYEE),
  phone: Joi.string().trim(),
});

/**
 * Login Validation Schema
 */
export const loginSchema = Joi.object({
  email: Joi.string().trim().email().required().messages({
    'string.empty': 'Email is required',
    'string.email': 'Please provide a valid email address',
  }),
  password: Joi.string().required().messages({
    'string.empty': 'Password is required',
  }),
});

/**
 * Update Password Validation Schema
 */
export const updatePasswordSchema = Joi.object({
  currentPassword: Joi.string().required().messages({
    'string.empty': 'Current password is required',
  }),
  newPassword: Joi.string()
    .min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .required()
    .messages({
      'string.empty': 'New password is required',
      'string.min': 'Password must be at least 8 characters',
      'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
    }),
  passwordConfirm: Joi.string()
    .valid(Joi.ref('newPassword'))
    .required()
    .messages({
      'any.only': 'Passwords do not match',
      'string.empty': 'Password confirmation is required',
    }),
});

/**
 * Forgot Password Validation Schema
 */
export const forgotPasswordSchema = Joi.object({
  email: Joi.string().trim().email().required().messages({
    'string.empty': 'Email is required',
    'string.email': 'Please provide a valid email address',
  }),
});

/**
 * Reset Password Validation Schema
 */
export const resetPasswordSchema = Joi.object({
  token: Joi.string().required().messages({
    'string.empty': 'Reset token is required',
  }),
  password: Joi.string()
    .min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .required()
    .messages({
      'string.empty': 'Password is required',
      'string.min': 'Password must be at least 8 characters',
      'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
    }),
  passwordConfirm: Joi.string()
    .valid(Joi.ref('password'))
    .required()
    .messages({
      'any.only': 'Passwords do not match',
      'string.empty': 'Password confirmation is required',
    }),
});
