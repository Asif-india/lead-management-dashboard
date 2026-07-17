import mongoose from "mongoose";

const incentiveSchema = new mongoose.Schema(
  {
    // Employee Information
    employeeName: {
      type: String,
      required: [true, "Employee name is required"],
      trim: true,
      maxlength: [100, "Employee name cannot exceed 100 characters"],
    },

    employeeId: {
      type: String,
      required: [true, "Employee ID is required"],
      trim: true,
    },

    department: {
      type: String,
      required: [true, "Department is required"],
      trim: true,
      enum: {
        values: [
          "Engineering",
          "Marketing",
          "Sales",
          "HR",
          "Finance",
          "Operations",
          "IT",
          "Legal",
          "Customer Success",
        ],
        message: "Please select a valid department",
      },
    },

    // Incentive Details
    incentiveType: {
      type: String,
      required: [true, "Incentive type is required"],
      trim: true,
      enum: {
        values: [
          "Performance Bonus",
          "Sales Commission",
          "Referral Bonus",
          "Recognition Award",
          "Team Bonus",
          "Campaign Success",
          "Customer Satisfaction",
        ],
        message: "Please select a valid incentive type",
      },
    },

    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [0, "Amount cannot be negative"],
    },

    status: {
      type: String,
      required: [true, "Status is required"],
      enum: {
        values: ["pending", "processing", "approved", "rejected"],
        message: "Please select a valid status",
      },
      default: "pending",
    },

    // Additional Information
    quarter: {
      type: String,
      trim: true,
    },

    calculatedBy: {
      type: String,
      trim: true,
      enum: {
        values: ["System", "Manager", "Admin"],
        message: "Please select a valid calculator",
      },
      default: "System",
    },

    notes: {
      type: String,
      trim: true,
      maxlength: [1000, "Notes cannot exceed 1000 characters"],
    },

    // Performance Metrics (for leaderboard)
    performance: {
      type: Number,
      min: [0, "Performance cannot be negative"],
      max: [100, "Performance cannot exceed 100"],
      default: 0,
    },

    totalEarned: {
      type: Number,
      min: [0, "Total earned cannot be negative"],
      default: 0,
    },

    currentMonth: {
      type: Number,
      min: [0, "Current month earnings cannot be negative"],
      default: 0,
    },

    totalIncentives: {
      type: Number,
      min: [0, "Total incentives cannot be negative"],
      default: 0,
    },

    // Badges/achievements
    badges: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
incentiveSchema.index({ employeeId: 1 });
incentiveSchema.index({ department: 1 });
incentiveSchema.index({ status: 1 });
incentiveSchema.index({ incentiveType: 1 });
incentiveSchema.index({ createdAt: -1 });

const Incentive = mongoose.model("Incentive", incentiveSchema);

export default Incentive;
