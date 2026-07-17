import { asyncHandler } from "../utils/index.js";

import {
  createLead,
  getAllLeads,
  getLeadById,
  updateLead,
  deleteLead,
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

/**
 * Get Lead By ID
 */
export const getLeadByIdHandler = asyncHandler(
  async (req, res) => {
    const lead = await getLeadById(req.params.id);

    res.status(200).json({
      success: true,
      message: "Lead fetched successfully",
      data: lead,
    });
  }
);

/**
 * Update Lead
 */
export const updateLeadHandler = asyncHandler(
  async (req, res) => {
    const lead = await updateLead(req.params.id, req.body);

    res.status(200).json({
      success: true,
      message: "Lead updated successfully",
      data: lead,
    });
  }
);

/**
 * Delete Lead
 */
export const deleteLeadHandler = asyncHandler(
  async (req, res) => {
    await deleteLead(req.params.id);

    res.status(200).json({
      success: true,
      message: "Lead deleted successfully",
      data: null,
    });
  }
);
