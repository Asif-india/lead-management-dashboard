import { asyncHandler } from "../utils/index.js";

import {
  createLead,
  getAllLeads,
  getLeadById,
  updateLead,
  deleteLead,
} from "../services/leadService.js";
import { createAuditLog } from "../services/auditLogService.js";

/**
 * Create Lead
 */
export const createLeadHandler = asyncHandler(
  async (req, res) => {
    const lead = await createLead(req.body);

    // Log lead creation to AuditLog for Recent Activity
    if (req.user && lead._id) {
      await createAuditLog({
        action: 'LEAD_CREATED',
        performedBy: req.user._id,
        entityType: 'Lead',
        entityId: lead._id,
        newValue: {
          studentName: lead.studentName,
          leadStatus: lead.leadStatus,
          source: lead.source
        },
        description: `New lead: ${lead.studentName}`,
      });
    }

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
    const oldLead = await getLeadById(req.params.id);
    const lead = await updateLead(req.params.id, req.body);

    // Log lead status changes to AuditLog for Recent Activity
    if (req.user && lead._id && oldLead.leadStatus !== lead.leadStatus) {
      await createAuditLog({
        action: 'LEAD_UPDATED',
        performedBy: req.user._id,
        entityType: 'Lead',
        entityId: lead._id,
        oldValue: { leadStatus: oldLead.leadStatus },
        newValue: { leadStatus: lead.leadStatus, studentName: lead.studentName },
        description: `${lead.studentName} status updated to ${lead.leadStatus}`,
      });
    }

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
