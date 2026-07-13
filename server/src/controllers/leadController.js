// /**
//  * Lead Controller
//  * Handles HTTP requests for lead operations
//  */

// import { asyncHandler } from '../utils/index.js';
// import { sendSuccess, sendPaginated } from '../utils/responseFormatter.js';
// import {
//   createLead,
//   getAllLeads,
//   getLeadById,
//   updateLead,
//   deleteLead,
//   getLeadStatistics,
//   bulkUpdateLeadStatus,
//   assignLead,
// } from '../services/index.js';

// /**
//  * @route   POST /api/v1/leads
//  * @desc    Create a new lead
//  * @access  Private
//  */
// export const createLeadHandler = asyncHandler(async (req, res) => {
//   const lead = await createLead(req.body);
//   sendSuccess(res, lead, 'Lead created successfully', 201);
// });

// /**
//  * @route   GET /api/v1/leads
//  * @desc    Get all leads with filtering and pagination
//  * @access  Private
//  */
// export const getAllLeadsHandler = asyncHandler(async (req, res) => {
//   const result = await getAllLeads(req.query);
//   sendPaginated(res, result.data, result.pagination, 'Leads fetched successfully');
// });

// /**
//  * @route   GET /api/v1/leads/:id
//  * @desc    Get lead by ID
//  * @access  Private
//  */
// export const getLeadByIdHandler = asyncHandler(async (req, res) => {
//   const lead = await getLeadById(req.params.id);
//   sendSuccess(res, lead, 'Lead fetched successfully');
// });

// /**
//  * @route   PATCH /api/v1/leads/:id
//  * @desc    Update lead by ID
//  * @access  Private
//  */
// export const updateLeadHandler = asyncHandler(async (req, res) => {
//   const lead = await updateLead(req.params.id, req.body);
//   sendSuccess(res, lead, 'Lead updated successfully');
// });

// /**
//  * @route   DELETE /api/v1/leads/:id
//  * @desc    Delete lead by ID
//  * @access  Private
//  */
// export const deleteLeadHandler = asyncHandler(async (req, res) => {
//   await deleteLead(req.params.id);
//   sendSuccess(res, null, 'Lead deleted successfully');
// });

// /**
//  * @route   GET /api/v1/leads/statistics/overview
//  * @desc    Get lead statistics
//  * @access  Private
//  */
// export const getLeadStatisticsHandler = asyncHandler(async (req, res) => {
//   const statistics = await getLeadStatistics();
//   sendSuccess(res, statistics, 'Lead statistics fetched successfully');
// });

// /**
//  * @route   PATCH /api/v1/leads/bulk/status
//  * @desc    Bulk update lead status
//  * @access  Private
//  */
// export const bulkUpdateLeadStatusHandler = asyncHandler(async (req, res) => {
//   const { leadIds, newStatus } = req.body;
//   const result = await bulkUpdateLeadStatus(leadIds, newStatus);
//   sendSuccess(res, result, 'Lead status updated successfully');
// });

// /**
//  * @route   PATCH /api/v1/leads/:id/assign
//  * @desc    Assign lead to user
//  * @access  Private
//  */
// export const assignLeadHandler = asyncHandler(async (req, res) => {
//   const { userId } = req.body;
//   const lead = await assignLead(req.params.id, userId);
//   sendSuccess(res, lead, 'Lead assigned successfully');
// });

/**
 * Lead Controller
 */

import { asyncHandler } from "../utils/index.js";

import {
  createLead,
  getAllLeads,
} from "../services/leadService.js";

/**
 * Create Lead
 */
export const createLeadHandler = asyncHandler(
  async (req, res) => {
    const lead = await createLead(req.body);

    res.status(201).json({
      success: true,
      message: "Lead created successfully",
      data: lead,
    });
  }
);

/**
 * Get All Leads
 */
export const getAllLeadsHandler = asyncHandler(
  async (req, res) => {
    const result = await getAllLeads(req.query);

    res.status(200).json({
      success: true,
      message: "Leads fetched successfully",
      ...result,
    });
  }
);
