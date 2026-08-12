/**
 * User Management Controller
 * Handles HTTP requests for user management operations
 */

import { asyncHandler } from '../utils/index.js';
import { sendSuccess } from '../utils/responseFormatter.js';
import User from '../models/User.js';

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
    query.isActive = accountStatus === 'active';
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

  const statusMap = {
    active: true,
    inactive: false,
    suspended: false,
    terminated: false,
  };

  const user = await User.findByIdAndUpdate(
    id,
    { isActive: statusMap[accountStatus] || false },
    { new: true, runValidators: true }
  ).select('-password');

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found',
    });
  }

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
 * @desc    Change user role (Admin only)
 * @access  Private (Admin)
 */
export const changeUserRoleHandler = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  const user = await User.findByIdAndUpdate(
    id,
    { role },
    { new: true, runValidators: true }
  ).select('-password');

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found',
    });
  }

  sendSuccess(res, user, 'Role changed successfully');
});

/**
 * @route   POST /api/v1/users
 * @desc    Create a new user (Admin only)
 * @access  Private (Admin)
 */
export const createUserHandler = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password, role, phone } = req.body;

  const user = await User.create({
    firstName,
    lastName,
    email,
    password,
    role: role || 'employee',
    phone,
    isActive: true,
  });

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
