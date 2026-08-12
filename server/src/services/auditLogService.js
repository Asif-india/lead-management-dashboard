/**
 * Audit Log Service
 * Reusable service for logging sensitive operations across all modules
 */

import AuditLog from '../models/AuditLog.js';

/**
 * Create an audit log entry
 * @param {Object} logData - Log entry data
 * @param {string} logData.action - Action performed
 * @param {string} logData.performedBy - User ID who performed the action
 * @param {string} logData.targetUser - Target user ID (optional)
 * @param {string} logData.targetEmployee - Target employee ID (optional)
 * @param {string} logData.entityType - Entity type (optional)
 * @param {string} logData.entityId - Entity ID (optional)
 * @param {Object} logData.oldValue - Old value before change (optional)
 * @param {Object} logData.newValue - New value after change (optional)
 * @param {string} logData.description - Description (optional)
 * @param {string} logData.ipAddress - IP address (optional)
 * @param {string} logData.userAgent - User agent (optional)
 * @param {string} logData.requestId - Request ID (optional)
 * @returns {Promise<AuditLog>} Created audit log entry
 */
export const createAuditLog = async (logData) => {
  try {
    const auditLog = await AuditLog.create(logData);
    return auditLog;
  } catch (error) {
    // Log errors but don't throw - audit logging should not break the main operation
    console.error('Failed to create audit log:', error.message);
    return null;
  }
};

/**
 * Get audit logs with filtering and pagination
 * @param {Object} query - Query parameters
 * @returns {Promise<Object>} Audit logs with pagination
 */
export const getAuditLogs = async (query) => {
  const {
    page = 1,
    limit = 50,
    sort = '-createdAt',
    action,
    performedBy,
    targetUser,
    targetEmployee,
    entityType,
    entityId,
    startDate,
    endDate,
  } = query;

  const queryObj = {};

  if (action) queryObj.action = action;
  if (performedBy) queryObj.performedBy = performedBy;
  if (targetUser) queryObj.targetUser = targetUser;
  if (targetEmployee) queryObj.targetEmployee = targetEmployee;
  if (entityType) queryObj.entityType = entityType;
  if (entityId) queryObj.entityId = entityId;

  // Date range filter
  if (startDate || endDate) {
    queryObj.createdAt = {};
    if (startDate) queryObj.createdAt.$gte = new Date(startDate);
    if (endDate) queryObj.createdAt.$lte = new Date(endDate);
  }

  const skip = (page - 1) * limit;

  const [logs, total] = await Promise.all([
    AuditLog.find(queryObj)
      .populate('performedBy', 'firstName lastName email role')
      .populate('targetUser', 'firstName lastName email')
      .populate('targetEmployee', 'firstName lastName employeeId')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit)),
    AuditLog.countDocuments(queryObj),
  ]);

  return {
    data: logs,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
    },
  };
};

/**
 * Get audit logs for a specific user
 * @param {string} userId - User ID
 * @param {Object} query - Additional query parameters
 * @returns {Promise<Object>} Audit logs for the user
 */
export const getUserAuditLogs = async (userId, query = {}) => {
  const {
    page = 1,
    limit = 50,
    sort = '-createdAt',
  } = query;

  const queryObj = {
    $or: [
      { performedBy: userId },
      { targetUser: userId },
    ],
  };

  const skip = (page - 1) * limit;

  const [logs, total] = await Promise.all([
    AuditLog.find(queryObj)
      .populate('performedBy', 'firstName lastName email role')
      .populate('targetUser', 'firstName lastName email')
      .populate('targetEmployee', 'firstName lastName employeeId')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit)),
    AuditLog.countDocuments(queryObj),
  ]);

  return {
    data: logs,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
    },
  };
};

/**
 * Helper: Log user creation
 */
export const logUserCreated = async (performedBy, targetUser, additionalData = {}) => {
  return createAuditLog({
    action: 'USER_CREATED',
    performedBy,
    targetUser,
    entityType: 'User',
    entityId: targetUser,
    newValue: additionalData,
    description: 'User account created',
  });
};

/**
 * Helper: Log user activation
 */
export const logUserActivated = async (performedBy, targetUser, oldValue) => {
  return createAuditLog({
    action: 'USER_ACTIVATED',
    performedBy,
    targetUser,
    entityType: 'User',
    entityId: targetUser,
    oldValue: { isActive: oldValue },
    newValue: { isActive: true },
    description: 'User account activated',
  });
};

/**
 * Helper: Log user deactivation
 */
export const logUserDeactivated = async (performedBy, targetUser, oldValue) => {
  return createAuditLog({
    action: 'USER_DEACTIVATED',
    performedBy,
    targetUser,
    entityType: 'User',
    entityId: targetUser,
    oldValue: { isActive: oldValue },
    newValue: { isActive: false },
    description: 'User account deactivated',
  });
};

/**
 * Helper: Log user suspension
 */
export const logUserSuspended = async (performedBy, targetUser, oldValue) => {
  return createAuditLog({
    action: 'USER_SUSPENDED',
    performedBy,
    targetUser,
    entityType: 'User',
    entityId: targetUser,
    oldValue: { accountStatus: oldValue },
    newValue: { accountStatus: 'suspended' },
    description: 'User account suspended',
  });
};

/**
 * Helper: Log user reactivation
 */
export const logUserReactivated = async (performedBy, targetUser, oldValue) => {
  return createAuditLog({
    action: 'USER_REACTIVATED',
    performedBy,
    targetUser,
    entityType: 'User',
    entityId: targetUser,
    oldValue: { accountStatus: oldValue },
    newValue: { accountStatus: 'active' },
    description: 'User account reactivated',
  });
};

/**
 * Helper: Log password change
 */
export const logPasswordChanged = async (performedBy, targetUser) => {
  return createAuditLog({
    action: 'PASSWORD_CHANGED',
    performedBy,
    targetUser,
    entityType: 'User',
    entityId: targetUser,
    description: 'User password changed',
  });
};

/**
 * Helper: Log password reset
 */
export const logPasswordReset = async (performedBy, targetUser) => {
  return createAuditLog({
    action: 'PASSWORD_RESET',
    performedBy,
    targetUser,
    entityType: 'User',
    entityId: targetUser,
    description: 'User password reset by administrator',
  });
};

/**
 * Helper: Log role change
 */
export const logRoleChanged = async (performedBy, targetUser, oldValue, newValue) => {
  return createAuditLog({
    action: 'ROLE_CHANGED',
    performedBy,
    targetUser,
    entityType: 'User',
    entityId: targetUser,
    oldValue: { role: oldValue },
    newValue: { role: newValue },
    description: `User role changed from ${oldValue} to ${newValue}`,
  });
};

/**
 * Helper: Log email change
 */
export const logEmailChanged = async (performedBy, targetUser, oldValue, newValue) => {
  return createAuditLog({
    action: 'EMAIL_CHANGED',
    performedBy,
    targetUser,
    entityType: 'User',
    entityId: targetUser,
    oldValue: { email: oldValue },
    newValue: { email: newValue },
    description: `User email changed from ${oldValue} to ${newValue}`,
  });
};

/**
 * Helper: Log employee creation
 */
export const logEmployeeCreated = async (performedBy, targetEmployee, targetUser, additionalData = {}) => {
  return createAuditLog({
    action: 'EMPLOYEE_CREATED',
    performedBy,
    targetEmployee,
    targetUser,
    entityType: 'Employee',
    entityId: targetEmployee,
    newValue: additionalData,
    description: 'Employee record created',
  });
};

/**
 * Helper: Log employee termination
 */
export const logEmployeeTerminated = async (performedBy, targetEmployee, oldValue) => {
  return createAuditLog({
    action: 'EMPLOYEE_TERMINATED',
    performedBy,
    targetEmployee,
    entityType: 'Employee',
    entityId: targetEmployee,
    oldValue: { employmentStatus: oldValue },
    newValue: { employmentStatus: 'terminated' },
    description: 'Employee terminated',
  });
};

/**
 * Helper: Log employee status change
 */
export const logEmployeeStatusChanged = async (performedBy, targetEmployee, oldValue, newValue) => {
  return createAuditLog({
    action: 'EMPLOYEE_STATUS_CHANGED',
    performedBy,
    targetEmployee,
    entityType: 'Employee',
    entityId: targetEmployee,
    oldValue: { employmentStatus: oldValue },
    newValue: { employmentStatus: newValue },
    description: `Employee status changed from ${oldValue} to ${newValue}`,
  });
};
