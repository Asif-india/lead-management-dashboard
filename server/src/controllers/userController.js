/**
 * User Management Controller
 * Handles HTTP requests for user management operations
 */

import { asyncHandler } from '../utils/index.js';
import { sendSuccess } from '../utils/responseFormatter.js';
import User from '../models/User.js';
import Employee from '../models/Employee.js';
import { logAccountStatusChanged } from '../services/auditLogService.js';
import { USER_ROLES } from '../constants/index.js';

/**
 * @route   GET /api/v1/users
 * @desc    Get all users with filtering and pagination
 * @access  Private (Admin)
 */
export const getAllUsersHandler = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, search = '', role = '', accountStatus = '' } = req.query;

  const query = {};

  // Role filter
  if (role) {
    query.role = role;
  }

  // Account status filter
  if (accountStatus) {
    query.accountStatus = accountStatus;
  }

  // Search filter (name or email)
  if (search) {
    query.$or = [
      { firstName: { $regex: search, $options: 'i' } },
      { lastName: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [users, total] = await Promise.all([
    User.find(query)
      .select('-password')
      .populate('employeeId', 'employeeId firstName lastName')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit)),
    User.countDocuments(query),
  ]);

  sendSuccess(
    res,
    {
      data: users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    },
    'Users fetched successfully'
  );
});

/**
 * @route   PATCH /api/v1/users/:id/status
 * @desc    Update user account status (active/inactive/suspended/terminated)
 * @access  Private (Admin)
 */
export const updateUserAccountStatusHandler = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { accountStatus } = req.body;

  const validStatuses = ['active', 'inactive', 'suspended', 'terminated'];
  if (!validStatuses.includes(accountStatus)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid account status. Must be one of: active, inactive, suspended, terminated',
    });
  }

  const user = await User.findById(id).select('-password');

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found',
    });
  }

  const oldStatus = user.accountStatus;
  user.accountStatus = accountStatus;
  await user.save({ runValidators: true });

  // Log the status change
  await logAccountStatusChanged(req.user.id, id, oldStatus, accountStatus);

  sendSuccess(res, user, 'Account status updated successfully');
});

/**
 * @route   PATCH /api/v1/users/:id/password
 * @desc    Change user password (Admin only)
 * @access  Private (Admin)
 */
export const changeUserPasswordHandler = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { password } = req.body;

  const user = await User.findById(id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found',
    });
  }

  user.password = password;
  await user.save();

  sendSuccess(res, { id: user._id }, 'Password changed successfully');
});

/**
 * @route   PATCH /api/v1/users/:id/role
 * @desc    Change user role (Admin only) - Manager ↔ Employee only
 * @access  Private (Admin)
 */
export const changeUserRoleHandler = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;
  const currentUser = req.user;

  // Validate target role
  const validRoles = Object.values(USER_ROLES);
  if (!validRoles.includes(role)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid role',
    });
  }

  // Fetch the target user
  const user = await User.findById(id).select('-password');
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found',
    });
  }

  const currentRole = user.role;
  const targetRole = role;

  // BLOCK: Administrator → Manager/Employee (use Promote flow instead)
  if (currentRole === USER_ROLES.ADMIN && targetRole !== USER_ROLES.ADMIN) {
    return res.status(403).json({
      success: false,
      message: 'Cannot demote Administrator through normal role change. Use the dedicated demotion flow if available.',
    });
  }

  // BLOCK: Manager/Employee → Administrator (use Promote flow instead)
  if ((currentRole === USER_ROLES.MANAGER || currentRole === USER_ROLES.EMPLOYEE) && targetRole === USER_ROLES.ADMIN) {
    return res.status(403).json({
      success: false,
      message: 'Cannot promote to Administrator through normal role change. Use the "Promote to Administrator" action.',
    });
  }

  // ALLOW: Manager ↔ Employee (preserve existing Employee link)
  // No employee linking/unlinking needed - just change the role
  const updatedUser = await User.findByIdAndUpdate(
    id,
    { role },
    { new: true, runValidators: true }
  ).select('-password');

  sendSuccess(res, updatedUser, 'Role changed successfully');
});

/**
 * @route   POST /api/v1/users/:id/promote
 * @desc    Promote user to Administrator (Admin only)
 * @access  Private (Admin)
 */
export const promoteToAdministratorHandler = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const currentUser = req.user;

  // Verify current user is an Administrator
  if (currentUser.role !== USER_ROLES.ADMIN) {
    return res.status(403).json({
      success: false,
      message: 'Only Administrators can promote users to Administrator',
    });
  }

  // Fetch the target user
  const user = await User.findById(id).select('-password');
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found',
    });
  }

  // Cannot promote self
  if (user._id.toString() === currentUser._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'You cannot promote yourself',
    });
  }

  // User is already an Administrator
  if (user.role === USER_ROLES.ADMIN) {
    return res.status(400).json({
      success: false,
      message: 'User is already an Administrator',
    });
  }

  // Promote to Administrator - preserve existing Employee relationship
  const updatedUser = await User.findByIdAndUpdate(
    id,
    { role: USER_ROLES.ADMIN },
    { new: true, runValidators: true }
  ).select('-password');

  sendSuccess(res, updatedUser, 'User promoted to Administrator successfully');
});

/**
 * @route   POST /api/v1/users
 * @desc    Create a new user (Admin only)
 * @access  Private (Admin)
 */
export const createUserHandler = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password, role, phone, accountStatus, employeeId } = req.body;

  // Role-based employee validation
  if (role !== 'admin' && !employeeId) {
    return res.status(400).json({
      success: false,
      message: 'Employee selection is required for Manager and Employee roles',
    });
  }

  // If employeeId is provided, validate it
  if (employeeId) {
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(400).json({
        success: false,
        message: 'Employee not found',
      });
    }

    // Check if employee is already linked to a user
    if (employee.userId) {
      return res.status(400).json({
        success: false,
        message: 'This employee is already linked to a user account',
      });
    }
  }

  // Create the user
  const user = await User.create({
    firstName,
    lastName,
    email,
    password,
    role: role || 'employee',
    phone,
    accountStatus: accountStatus || 'active',
    employeeId: role === 'admin' ? undefined : employeeId,
  });

  // Link the employee to the user if employeeId was provided
  if (employeeId && role !== 'admin') {
    try {
      await Employee.findByIdAndUpdate(employeeId, { userId: user._id });
    } catch (error) {
      // If employee update fails, rollback user creation
      await User.findByIdAndDelete(user._id);
      return res.status(500).json({
        success: false,
        message: 'Failed to link employee to user. User creation rolled back.',
      });
    }
  }

  sendSuccess(
    res,
    {
      ...user.toObject(),
      password: undefined,
    },
    'User created successfully'
  );
});

/**
 * @route   PATCH /api/v1/users/:id/email
 * @desc    Change user email (Admin only)
 * @access  Private (Admin)
 */
export const changeUserEmailHandler = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { email } = req.body;

  const user = await User.findByIdAndUpdate(
    id,
    { email },
    { new: true, runValidators: true }
  ).select('-password');

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found',
    });
  }

  sendSuccess(res, user, 'Email changed successfully');
});

/**
 * @route   DELETE /api/v1/users/:id
 * @desc    Delete a user (Admin only)
 * @access  Private (Admin)
 */
export const deleteUserHandler = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const currentUser = req.user;

  // Verify current user is an Administrator
  if (currentUser.role !== USER_ROLES.ADMIN) {
    return res.status(403).json({
      success: false,
      message: 'Only Administrators can delete users',
    });
  }

  // Fetch the target user
  const user = await User.findById(id).select('-password');
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found',
    });
  }

  // Cannot delete self
  if (user._id.toString() === currentUser._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'You cannot delete your own account',
    });
  }

  // Cannot delete the last administrator
  if (user.role === USER_ROLES.ADMIN) {
    const adminCount = await User.countDocuments({ role: USER_ROLES.ADMIN });
    if (adminCount <= 1) {
      return res.status(403).json({
        success: false,
        message: 'Cannot delete the last administrator in the system',
      });
    }
  }

  // If user is linked to an employee, unlink the employee
  if (user.employeeId) {
    await Employee.findByIdAndUpdate(user.employeeId, { userId: null });
  }

  // Delete the user
  await User.findByIdAndDelete(id);

  sendSuccess(res, null, 'User deleted successfully');
});
