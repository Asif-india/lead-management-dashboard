/**
 * Audit Log Model
 * Tracks all sensitive operations across the system
 * Reusable for future modules (Leads, Incentives, etc.)
 */

import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema(
  {
    // Action performed
    action: {
      type: String,
      required: [true, 'Action is required'],
      enum: [
        'USER_CREATED',
        'USER_ACTIVATED',
        'USER_DEACTIVATED',
        'USER_SUSPENDED',
        'USER_REACTIVATED',
        'USER_STATUS_CHANGED',
        'PASSWORD_CHANGED',
        'PASSWORD_RESET',
        'ROLE_CHANGED',
        'EMAIL_CHANGED',
        'EMPLOYEE_CREATED',
        'EMPLOYEE_UPDATED',
        'EMPLOYEE_TERMINATED',
        'EMPLOYEE_STATUS_CHANGED',
        'LEAD_CREATED',
        'LEAD_UPDATED',
        'LEAD_DELETED',
        'INCENTIVE_CREATED',
        'INCENTIVE_UPDATED',
        'INCENTIVE_DELETED',
      ],
    },

    // Who performed the action
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Performed by is required'],
    },

    // Target user/employee affected
    targetUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },

    targetEmployee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Employee',
    },

    // Target entity details (for non-user entities)
    entityType: {
      type: String,
      enum: ['User', 'Employee', 'Lead', 'Incentive', 'LeadSource', 'Other'],
    },

    entityId: {
      type: mongoose.Schema.Types.ObjectId,
    },

    // Change tracking
    oldValue: {
      type: mongoose.Schema.Types.Mixed,
    },

    newValue: {
      type: mongoose.Schema.Types.Mixed,
    },

    // Additional context
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },

    // IP address and user agent
    ipAddress: {
      type: String,
    },

    userAgent: {
      type: String,
    },

    // Request metadata
    requestId: {
      type: String,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for better query performance
auditLogSchema.index({ action: 1, createdAt: -1 });
auditLogSchema.index({ performedBy: 1, createdAt: -1 });
auditLogSchema.index({ targetUser: 1, createdAt: -1 });
auditLogSchema.index({ targetEmployee: 1, createdAt: -1 });
auditLogSchema.index({ entityType: 1, entityId: 1, createdAt: -1 });
auditLogSchema.index({ createdAt: -1 }); // For time-based queries

// Compound index for common queries
auditLogSchema.index({ performedBy: 1, action: 1, createdAt: -1 });

const AuditLog = mongoose.model('AuditLog', auditLogSchema);

export default AuditLog;
