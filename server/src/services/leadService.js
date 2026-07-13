// /**
//  * Lead Service
//  * Business logic layer for lead operations
//  */

// import Lead from '../models/Lead.js';
// import AppError from '../utils/AppError.js';
// import { HTTP_STATUS } from '../constants/index.js';

// /**
//  * Create a new lead
//  */
// export const createLead = async (leadData) => {
//   try {
//     const lead = await Lead.create(leadData);
//     return lead;
//   } catch (error) {
//     if (error.code === 11000) {
//       throw new AppError('Employee ID already exists', HTTP_STATUS.CONFLICT);
//     }
//     throw error;
//   }
// };

// /**
//  * Get all leads with filtering, pagination, and search
//  */
// export const getAllLeads = async (query) => {
//   const {
//     page = 1,
//     limit = 10,
//     sort = '-createdAt',
//     leadStatus,
//     priority,
//     department,
//     search,
//     assignedTo,
//     startDate,
//     endDate,
//   } = query;

//   // Build query
//   const queryObj = {};

//   if (leadStatus) queryObj.leadStatus = leadStatus;
//   if (priority) queryObj.priority = priority;
//   if (department) queryObj.department = department;
//   if (assignedTo) queryObj.assignedTo = assignedTo;

//   // Date range filter
//   if (startDate || endDate) {
//     queryObj.createdAt = {};
//     if (startDate) queryObj.createdAt.$gte = new Date(startDate);
//     if (endDate) queryObj.createdAt.$lte = new Date(endDate);
//   }

//   // Search filter
//   if (search) {
//     queryObj.$or = [
//       { employeeName: { $regex: search, $options: 'i' } },
//       { email: { $regex: search, $options: 'i' } },
//       { studentName: { $regex: search, $options: 'i' } },
//       { employeeId: { $regex: search, $options: 'i' } },
//     ];
//   }

//   // Pagination
//   const skip = (page - 1) * limit;

//   // Execute query
//   const [leads, total] = await Promise.all([
//     Lead.find(queryObj)
//       .populate('assignedTo', 'firstName lastName email')
//       .sort(sort)
//       .skip(skip)
//       .limit(parseInt(limit)),
//     Lead.countDocuments(queryObj),
//   ]);

//   return {
//     data: leads,
//     pagination: {
//       page: parseInt(page),
//       limit: parseInt(limit),
//       total,
//     },
//   };
// };

// /**
//  * Get lead by ID
//  */
// export const getLeadById = async (id) => {
//   const lead = await Lead.findById(id).populate('assignedTo', 'firstName lastName email');
  
//   if (!lead) {
//     throw new AppError('Lead not found', HTTP_STATUS.NOT_FOUND);
//   }
  
//   return lead;
// };

// /**
//  * Update lead by ID
//  */
// export const updateLead = async (id, updateData) => {
//   const lead = await Lead.findByIdAndUpdate(id, updateData, {
//     new: true,
//     runValidators: true,
//   }).populate('assignedTo', 'firstName lastName email');

//   if (!lead) {
//     throw new AppError('Lead not found', HTTP_STATUS.NOT_FOUND);
//   }

//   return lead;
// };

// /**
//  * Delete lead by ID
//  */
// export const deleteLead = async (id) => {
//   const lead = await Lead.findByIdAndDelete(id);

//   if (!lead) {
//     throw new AppError('Lead not found', HTTP_STATUS.NOT_FOUND);
//   }

//   return lead;
// };

// /**
//  * Get lead statistics
//  */
// export const getLeadStatistics = async () => {
//   const [
//     totalLeads,
//     statusDistribution,
//     priorityDistribution,
//     departmentDistribution,
//     recentLeads,
//   ] = await Promise.all([
//     Lead.countDocuments(),
//     Lead.aggregate([
//       {
//         $group: {
//           _id: '$leadStatus',
//           count: { $sum: 1 },
//         },
//       },
//     ]),
//     Lead.aggregate([
//       {
//         $group: {
//           _id: '$priority',
//           count: { $sum: 1 },
//         },
//       },
//     ]),
//     Lead.aggregate([
//       {
//         $group: {
//           _id: '$department',
//           count: { $sum: 1 },
//         },
//       },
//     ]),
//     Lead.find().sort('-createdAt').limit(5),
//   ]);

//   return {
//     totalLeads,
//     statusDistribution,
//     priorityDistribution,
//     departmentDistribution,
//     recentLeads,
//   };
// };

// /**
//  * Bulk update lead status
//  */
// export const bulkUpdateLeadStatus = async (leadIds, newStatus) => {
//   const result = await Lead.updateMany(
//     { _id: { $in: leadIds } },
//     { leadStatus: newStatus, lastContactDate: new Date() }
//   );

//   return result;
// };

// /**
//  * Assign lead to user
//  */
// export const assignLead = async (leadId, userId) => {
//   const lead = await Lead.findByIdAndUpdate(
//     leadId,
//     { assignedTo: userId },
//     { new: true, runValidators: true }
//   ).populate('assignedTo', 'firstName lastName email');

//   if (!lead) {
//     throw new AppError('Lead not found', HTTP_STATUS.NOT_FOUND);
//   }

//   return lead;
// };


/**
 * Lead Service
 */

import Lead from "../models/Lead.js";
import AppError from "../utils/AppError.js";
import { HTTP_STATUS } from "../constants/index.js";

/**
 * Create Lead
 */
export const createLead = async (leadData) => {
  try {
    const lead = await Lead.create(leadData);

    return lead;
  } catch (error) {
    // Duplicate Key Error
    if (error.code === 11000) {
      throw new AppError(
        "Employee ID or Email already exists",
        HTTP_STATUS.CONFLICT
      );
    }

    // Validation Error
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map(
        (err) => err.message
      );

      throw new AppError(errors.join(", "), 422);
    }

    throw error;
  }
};

/**
 * Get All Leads
 */
export const getAllLeads = async (query) => {
  const {
    page = 1,
    limit = 10,
    sort = "-createdAt",
    leadStatus,
    priority,
    department,
    search,
  } = query;

  const queryObj = {};

  if (leadStatus) queryObj.leadStatus = leadStatus;

  if (priority) queryObj.priority = priority;

  if (department) queryObj.department = department;

  if (search) {
    queryObj.$or = [
      {
        employeeName: {
          $regex: search,
          $options: "i",
        },
      },

      {
        email: {
          $regex: search,
          $options: "i",
        },
      },

      {
        studentName: {
          $regex: search,
          $options: "i",
        },
      },

      {
        employeeId: {
          $regex: search,
          $options: "i",
        },
      },
    ];
  }

  const skip = (page - 1) * limit;

  const [leads, total] = await Promise.all([
    Lead.find(queryObj)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit)),

    Lead.countDocuments(queryObj),
  ]);

  return {
    data: leads,

    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
    },
  };
};