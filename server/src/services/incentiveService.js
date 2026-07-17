import Incentive from '../models/Incentive.js';

/**
 * Create a new incentive
 */
export const createIncentive = async (data) => {
  const incentive = await Incentive.create(data);
  return incentive;
};

/**
 * Get all incentives with filtering, pagination, and search
 */
export const getAllIncentives = async (query) => {
  const {
    page = 1,
    limit = 10,
    search = '',
    status = 'all',
    department = 'all',
    incentiveType = 'all',
    startDate,
    endDate,
    sortBy = 'createdAt',
    sortOrder = 'desc',
  } = query;

  // Build filter
  const filter = {};

  // Search filter
  if (search) {
    filter.$or = [
      { employeeName: { $regex: search, $options: 'i' } },
      { employeeId: { $regex: search, $options: 'i' } },
    ];
  }

  // Status filter
  if (status && status !== 'all') {
    filter.status = status;
  }

  // Department filter
  if (department && department !== 'all') {
    filter.department = department;
  }

  // Incentive type filter
  if (incentiveType && incentiveType !== 'all') {
    filter.incentiveType = incentiveType;
  }

  // Date range filter
  if (startDate || endDate) {
    filter.createdAt = {};
    if (startDate) {
      filter.createdAt.$gte = new Date(startDate);
    }
    if (endDate) {
      filter.createdAt.$lte = new Date(endDate);
    }
  }

  // Build sort
  const sort = {};
  sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

  // Execute query with pagination
  const [incentives, total] = await Promise.all([
    Incentive.find(filter)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(parseInt(limit)),
    Incentive.countDocuments(filter),
  ]);

  return {
    data: incentives,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

/**
 * Get incentive by ID
 */
export const getIncentiveById = async (id) => {
  const incentive = await Incentive.findById(id);
  if (!incentive) {
    throw new Error('Incentive not found');
  }
  return incentive;
};

/**
 * Update incentive by ID
 */
export const updateIncentive = async (id, data) => {
  const incentive = await Incentive.findByIdAndUpdate(
    id,
    data,
    { new: true, runValidators: true }
  );
  if (!incentive) {
    throw new Error('Incentive not found');
  }
  return incentive;
};

/**
 * Delete incentive by ID
 */
export const deleteIncentive = async (id) => {
  const incentive = await Incentive.findByIdAndDelete(id);
  if (!incentive) {
    throw new Error('Incentive not found');
  }
  return incentive;
};

/**
 * Get incentive statistics for dashboard
 */
export const getIncentiveStats = async () => {
  const [
    totalIncentives,
    totalPayout,
    totalParticipants,
    avgIncentive,
    statusBreakdown,
  ] = await Promise.all([
    Incentive.countDocuments({ status: { $in: ['pending', 'processing', 'approved'] } }),
    Incentive.aggregate([
      {
        $match: { status: 'approved' },
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$amount' },
        },
      },
    ]),
    Incentive.distinct('employeeId'),
    Incentive.aggregate([
      {
        $group: {
          _id: null,
          avgAmount: { $avg: '$amount' },
        },
      },
    ]),
    Incentive.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]),
  ]);

  const payout = totalPayout[0]?.total || 0;
  const avg = avgIncentive[0]?.avgAmount || 0;

  return {
    activeIncentives: totalIncentives,
    totalPayout: payout,
    totalParticipants: totalParticipants.length,
    averageIncentive: avg,
    statusBreakdown,
  };
};

/**
 * Get monthly incentive trends
 */
export const getMonthlyIncentiveTrends = async () => {
  const trends = await Incentive.aggregate([
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
        },
        total: { $sum: '$amount' },
        claimed: {
          $sum: {
            $cond: [{ $eq: ['$status', 'approved'] }, '$amount', 0],
          },
        },
        pending: {
          $sum: {
            $cond: [{ $eq: ['$status', 'pending'] }, '$amount', 0],
          },
        },
        participants: { $addToSet: '$employeeId' },
      },
    },
    {
      $project: {
        month: {
          $concat: [
            {
              $arrayElemAt: [
                [
                  'Jan',
                  'Feb',
                  'Mar',
                  'Apr',
                  'May',
                  'Jun',
                  'Jul',
                  'Aug',
                  'Sep',
                  'Oct',
                  'Nov',
                  'Dec',
                ],
                { $subtract: ['$_id.month', 1] },
              ],
            },
          ],
        },
        total: 1,
        claimed: 1,
        pending: 1,
        participants: { $size: '$participants' },
      },
    },
    {
      $sort: { '_id.year': 1, '_id.month': 1 },
    },
    {
      $limit: 6,
    },
  ]);

  return trends;
};

/**
 * Get incentive distribution by type
 */
export const getIncentiveDistribution = async () => {
  const distribution = await Incentive.aggregate([
    {
      $group: {
        _id: '$incentiveType',
        count: { $sum: 1 },
        totalAmount: { $sum: '$amount' },
      },
    },
    {
      $sort: { totalAmount: -1 },
    },
  ]);

  const totalAmount = distribution.reduce((sum, item) => sum + item.totalAmount, 0);

  const colors = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'];

  return distribution.map((item, index) => ({
    type: item._id,
    value: totalAmount > 0 ? Math.round((item.totalAmount / totalAmount) * 100) : 0,
    amount: item.totalAmount,
    color: colors[index % colors.length],
  }));
};

/**
 * Get employee leaderboard
 */
export const getEmployeeLeaderboard = async () => {
  const leaderboard = await Incentive.aggregate([
    {
      $group: {
        _id: {
          employeeId: '$employeeId',
          employeeName: '$employeeName',
          department: '$department',
        },
        totalIncentives: { $sum: 1 },
        totalEarned: { $sum: '$amount' },
        currentMonth: {
          $sum: {
            $cond: [
              {
                $and: [
                  { $eq: [{ $month: '$createdAt' }, new Date().getMonth() + 1] },
                  { $eq: [{ $year: '$createdAt' }, new Date().getFullYear()] },
                ],
              },
              '$amount',
              0,
            ],
          },
        },
        avgPerformance: { $avg: '$performance' },
        allBadges: { $push: '$badges' },
      },
    },
    {
      $project: {
        employeeId: '$_id.employeeId',
        employeeName: '$_id.employeeName',
        department: '$_id.department',
        totalIncentives: 1,
        totalEarned: 1,
        currentMonth: 1,
        performance: { $round: ['$avgPerformance', 0] },
        badges: {
          $reduce: {
            input: '$allBadges',
            initialValue: [],
            in: { $concatArrays: ['$$value', '$$this'] },
          },
        },
      },
    },
    {
      $sort: { totalEarned: -1 },
    },
    {
      $limit: 5,
    },
  ]);

  return leaderboard.map((item, index) => ({
    id: index + 1,
    name: item.employeeName,
    avatar: item.employeeName
      .split(' ')
      .map((n) => n[0])
      .join(''),
    department: item.department,
    totalIncentives: item.totalIncentives,
    totalEarned: item.totalEarned,
    currentMonth: item.currentMonth,
    rank: index + 1,
    trend: 'up',
    performance: item.performance || 75,
    badges: [...new Set(item.badges)].slice(0, 3),
  }));
};

/**
 * Get comprehensive incentive analytics
 */
export const getComprehensiveIncentiveAnalytics = async () => {
  const [
    stats,
    monthlyTrends,
    distribution,
    leaderboard,
  ] = await Promise.all([
    getIncentiveStats(),
    getMonthlyIncentiveTrends(),
    getIncentiveDistribution(),
    getEmployeeLeaderboard(),
  ]);

  return {
    ...stats,
    monthlyTrends,
    distribution,
    leaderboard,
  };
};
