import Joi from "joi";

/**
 * Incentive Validation Schemas
 */

export const createIncentiveSchema = Joi.object({
  employeeName: Joi.string()
    .required()
    .min(2)
    .max(100)
    .messages({
      "string.empty": "Employee name is required",
      "string.min": "Employee name must be at least 2 characters",
      "string.max": "Employee name cannot exceed 100 characters",
    }),

  employeeId: Joi.string()
    .required()
    .messages({
      "string.empty": "Employee ID is required",
    }),

  department: Joi.string()
    .required()
    .valid(
      "Engineering",
      "Marketing",
      "Sales",
      "HR",
      "Finance",
      "Operations",
      "IT",
      "Legal",
      "Customer Success"
    )
    .messages({
      "string.empty": "Department is required",
      "any.only": "Please select a valid department",
    }),

  incentiveType: Joi.string()
    .required()
    .valid(
      "Performance Bonus",
      "Sales Commission",
      "Referral Bonus",
      "Recognition Award",
      "Team Bonus",
      "Campaign Success",
      "Customer Satisfaction"
    )
    .messages({
      "string.empty": "Incentive type is required",
      "any.only": "Please select a valid incentive type",
    }),

  amount: Joi.number()
    .required()
    .min(0)
    .messages({
      "number.base": "Amount must be a number",
      "number.min": "Amount cannot be negative",
      "any.required": "Amount is required",
    }),

  status: Joi.string()
    .optional()
    .valid("pending", "processing", "approved", "rejected")
    .default("pending")
    .messages({
      "any.only": "Please select a valid status",
    }),

  quarter: Joi.string()
    .optional()
    .allow("")
    .messages({
      "string.base": "Quarter must be a string",
    }),

  calculatedBy: Joi.string()
    .optional()
    .valid("System", "Manager", "Admin")
    .default("System")
    .messages({
      "any.only": "Please select a valid calculator",
    }),

  notes: Joi.string()
    .optional()
    .allow("")
    .max(1000)
    .messages({
      "string.max": "Notes cannot exceed 1000 characters",
    }),

  performance: Joi.number()
    .optional()
    .min(0)
    .max(100)
    .messages({
      "number.min": "Performance cannot be negative",
      "number.max": "Performance cannot exceed 100",
    }),

  totalEarned: Joi.number()
    .optional()
    .min(0)
    .messages({
      "number.min": "Total earned cannot be negative",
    }),

  currentMonth: Joi.number()
    .optional()
    .min(0)
    .messages({
      "number.min": "Current month earnings cannot be negative",
    }),

  totalIncentives: Joi.number()
    .optional()
    .min(0)
    .messages({
      "number.min": "Total incentives cannot be negative",
    }),

  badges: Joi.array()
    .optional()
    .items(Joi.string())
    .messages({
      "array.base": "Badges must be an array",
    }),
});

export const updateIncentiveSchema = Joi.object({
  employeeName: Joi.string()
    .optional()
    .min(2)
    .max(100)
    .messages({
      "string.min": "Employee name must be at least 2 characters",
      "string.max": "Employee name cannot exceed 100 characters",
    }),

  employeeId: Joi.string()
    .optional()
    .messages({
      "string.base": "Employee ID must be a string",
    }),

  department: Joi.string()
    .optional()
    .valid(
      "Engineering",
      "Marketing",
      "Sales",
      "HR",
      "Finance",
      "Operations",
      "IT",
      "Legal",
      "Customer Success"
    )
    .messages({
      "any.only": "Please select a valid department",
    }),

  incentiveType: Joi.string()
    .optional()
    .valid(
      "Performance Bonus",
      "Sales Commission",
      "Referral Bonus",
      "Recognition Award",
      "Team Bonus",
      "Campaign Success",
      "Customer Satisfaction"
    )
    .messages({
      "any.only": "Please select a valid incentive type",
    }),

  amount: Joi.number()
    .optional()
    .min(0)
    .messages({
      "number.min": "Amount cannot be negative",
    }),

  status: Joi.string()
    .optional()
    .valid("pending", "processing", "approved", "rejected")
    .messages({
      "any.only": "Please select a valid status",
    }),

  quarter: Joi.string()
    .optional()
    .allow("")
    .messages({
      "string.base": "Quarter must be a string",
    }),

  calculatedBy: Joi.string()
    .optional()
    .valid("System", "Manager", "Admin")
    .messages({
      "any.only": "Please select a valid calculator",
    }),

  notes: Joi.string()
    .optional()
    .allow("")
    .max(1000)
    .messages({
      "string.max": "Notes cannot exceed 1000 characters",
    }),

  performance: Joi.number()
    .optional()
    .min(0)
    .max(100)
    .messages({
      "number.min": "Performance cannot be negative",
      "number.max": "Performance cannot exceed 100",
    }),

  totalEarned: Joi.number()
    .optional()
    .min(0)
    .messages({
      "number.min": "Total earned cannot be negative",
    }),

  currentMonth: Joi.number()
    .optional()
    .min(0)
    .messages({
      "number.min": "Current month earnings cannot be negative",
    }),

  totalIncentives: Joi.number()
    .optional()
    .min(0)
    .messages({
      "number.min": "Total incentives cannot be negative",
    }),

  badges: Joi.array()
    .optional()
    .items(Joi.string())
    .messages({
      "array.base": "Badges must be an array",
    }),
});

export const incentiveQuerySchema = Joi.object({
  page: Joi.number().optional().min(1).default(1),
  limit: Joi.number().optional().min(1).max(100).default(10),
  search: Joi.string().optional().allow(""),
  status: Joi.string()
    .optional()
    .valid("pending", "processing", "approved", "rejected", "all"),
  department: Joi.string()
    .optional()
    .valid(
      "Engineering",
      "Marketing",
      "Sales",
      "HR",
      "Finance",
      "Operations",
      "IT",
      "Legal",
      "Customer Success",
      "all"
    ),
  incentiveType: Joi.string()
    .optional()
    .valid(
      "Performance Bonus",
      "Sales Commission",
      "Referral Bonus",
      "Recognition Award",
      "Team Bonus",
      "Campaign Success",
      "Customer Satisfaction",
      "all"
    ),
  startDate: Joi.date().optional(),
  endDate: Joi.date().optional(),
  sortBy: Joi.string()
    .optional()
    .valid("employeeName", "amount", "status", "createdAt", "department"),
  sortOrder: Joi.string().optional().valid("asc", "desc").default("desc"),
});
