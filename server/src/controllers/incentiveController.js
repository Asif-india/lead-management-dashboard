import { asyncHandler } from "../utils/index.js";

import {
  createIncentive,
  getAllIncentives,
  getIncentiveById,
  updateIncentive,
  deleteIncentive,
  getComprehensiveIncentiveAnalytics,
} from "../services/incentiveService.js";
import { logIncentiveCreated } from "../services/auditLogService.js";

/**
 * Create Incentive
 */
export const createIncentiveHandler = asyncHandler(
  async (req, res) => {
    const incentive = await createIncentive(req.body);

    // Log incentive creation to AuditLog for Recent Activity
    if (req.user && incentive._id) {
      await logIncentiveCreated(
        req.user._id,
        incentive._id,
        req.user._id,
        {
          employeeName: incentive.employeeName,
          incentiveType: incentive.incentiveType,
          amount: incentive.amount,
          status: incentive.status
        }
      );
    }

    res.status(201).json({
      success: true,
      message: "Incentive created successfully",
      data: incentive,
    });
  }
);

/**
 * Get All Incentives
 */
export const getAllIncentivesHandler = asyncHandler(
  async (req, res) => {
    const result = await getAllIncentives(req.query);

    res.status(200).json({
      success: true,
      message: "Incentives fetched successfully",
      ...result,
    });
  }
);

/**
 * Get Incentive By ID
 */
export const getIncentiveByIdHandler = asyncHandler(
  async (req, res) => {
    const incentive = await getIncentiveById(req.params.id);

    res.status(200).json({
      success: true,
      message: "Incentive fetched successfully",
      data: incentive,
    });
  }
);

/**
 * Update Incentive
 */
export const updateIncentiveHandler = asyncHandler(
  async (req, res) => {
    const incentive = await updateIncentive(req.params.id, req.body);

    res.status(200).json({
      success: true,
      message: "Incentive updated successfully",
      data: incentive,
    });
  }
);

/**
 * Delete Incentive
 */
export const deleteIncentiveHandler = asyncHandler(
  async (req, res) => {
    await deleteIncentive(req.params.id);

    res.status(200).json({
      success: true,
      message: "Incentive deleted successfully",
      data: null,
    });
  }
);

/**
 * Get Comprehensive Incentive Analytics
 */
export const getIncentiveAnalyticsHandler = asyncHandler(
  async (req, res) => {
    const analytics = await getComprehensiveIncentiveAnalytics();

    res.status(200).json({
      success: true,
      message: "Incentive analytics fetched successfully",
      data: analytics,
    });
  }
);
