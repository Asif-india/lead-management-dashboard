/**
 * Analytics Service
 * Business logic layer for analytics operations
 */

import Lead from '../models/Lead.js';
import Employee from '../models/Employee.js';
import User from '../models/User.js';

/**
 * Get dashboard overview statistics
 */
export const getDashboardOverview = async () => {
  const [
    totalLeads,
    totalEmployees,
    totalUsers,
    activeLeads,
    newLeadsThisMonth,
    wonLeadsThisMonth,
    conversionRate,
  ] = await Promise.all([
    Lead.countDocuments(),
    Employee.countDocuments(),
    User.countDocuments(),
    Lead.countDocuments({ leadStatus: 'active' }),
    Lead.countDocuments({
      leadStatus: 'new',
      createdAt: { $gte: new Date(new Date().setDate(1)) },
    }),
    Lead.countDocuments({
      leadStatus: 'won',
      updatedAt: { $gte: new Date(new Date().setDate(1)) },
    }),
    Lead.aggregate([
      {
        $match: {
          updatedAt: { $gte: new Date(new Date().setDate(1)) },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          won: {
            $sum: { $cond: [{ $eq: ['$leadStatus', 'won'] }, 1, 0] },
          },
        },
      },
      {
        $project: {
          conversionRate: {
            $multiply: [{ $divide: ['$won', '$total'] }, 100],
          },
        },
      },
    ]),
  ]);

  return {
    totalLeads,
    totalEmployees,
    totalUsers,
    activeLeads,
    newLeadsThisMonth,
    wonLeadsThisMonth,
    conversionRate: conversionRate[0]?.conversionRate || 0,
  };
};

/**
 * Get lead analytics over time
 */
export const getLeadAnalytics = async (period = '30d') => {
  const startDate = new Date();
  
  switch (period) {
    case '7d':
      startDate.setDate(startDate.getDate() - 7);
      break;
    case '30d':
      startDate.setDate(startDate.getDate() - 30);
      break;
    case '90d':
      startDate.setDate(startDate.getDate() - 90);
      break;
    case '1y':
      startDate.setFullYear(startDate.getFullYear() - 1);
      break;
    default:
      startDate.setDate(startDate.getDate() - 30);
  }

  const leadTrends = await Lead.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate },
      },
    },
    {
      $group: {
        _id: {
          date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          status: '$leadStatus',
        },
        count: { $sum: 1 },
      },
    },
    {
      $sort: { '_id.date': 1 },
    },
  ]);

  return leadTrends;
};

/**
 * Get employee performance analytics
 */
export const getEmployeePerformance = async () => {
  const performance = await Lead.aggregate([
    {
      $lookup: {
        from: 'users',
        localField: 'assignedTo',
        foreignField: '_id',
        as: 'user',
      },
    },
    {
      $unwind: {
        path: '$user',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $group: {
        _id: '$assignedTo',
        user: { $first: '$user' },
        totalLeads: { $sum: 1 },
        wonLeads: {
          $sum: { $cond: [{ $eq: ['$leadStatus', 'won'] }, 1, 0] },
        },
        lostLeads: {
          $sum: { $cond: [{ $eq: ['$leadStatus', 'lost'] }, 1, 0] },
        },
      },
    },
    {
      $project: {
        _id: 1,
        user: 1,
        totalLeads: 1,
        wonLeads: 1,
        lostLeads: 1,
        conversionRate: {
          $multiply: [
            { $divide: ['$wonLeads', '$totalLeads'] },
            100,
          ],
        },
      },
    },
    {
      $sort: { conversionRate: -1 },
    },
  ]);

  return performance;
};

/**
 * Get department-wise lead distribution
 */
export const getDepartmentAnalytics = async () => {
  const departmentStats = await Lead.aggregate([
    {
      $group: {
        _id: '$department',
        totalLeads: { $sum: 1 },
        wonLeads: {
          $sum: { $cond: [{ $eq: ['$leadStatus', 'won'] }, 1, 0] },
        },
        lostLeads: {
          $sum: { $cond: [{ $eq: ['$leadStatus', 'lost'] }, 1, 0] },
        },
        avgLeadAge: {
          $avg: {
            $subtract: [
              new Date(),
              '$createdAt',
            ],
          },
        },
      },
    },
    {
      $project: {
        _id: 1,
        totalLeads: 1,
        wonLeads: 1,
        lostLeads: 1,
        conversionRate: {
          $multiply: [
            { $divide: ['$wonLeads', '$totalLeads'] },
            100,
          ],
        },
        avgLeadAge: {
          $divide: ['$avgLeadAge', 1000 * 60 * 60 * 24], // Convert to days
        },
      },
    },
  ]);

  return departmentStats;
};

/**
 * Get priority distribution analytics
 */
export const getPriorityAnalytics = async () => {
  const priorityStats = await Lead.aggregate([
    {
      $group: {
        _id: '$priority',
        count: { $sum: 1 },
        wonLeads: {
          $sum: { $cond: [{ $eq: ['$leadStatus', 'won'] }, 1, 0] },
        },
      },
    },
    {
      $sort: { count: -1 },
    },
  ]);

  return priorityStats;
};

/**
 * Get comprehensive analytics report
 */
export const getAnalyticsReport = async (startDate, endDate) => {
  const dateFilter = {};
  if (startDate) dateFilter.$gte = new Date(startDate);
  if (endDate) dateFilter.$lte = new Date(endDate);

  const [
    totalLeads,
    statusBreakdown,
    priorityBreakdown,
    departmentBreakdown,
    conversionFunnel,
  ] = await Promise.all([
    Lead.countDocuments(dateFilter.createdAt ? { createdAt: dateFilter } : {}),
    Lead.aggregate([
      ...(dateFilter.createdAt ? [{ $match: { createdAt: dateFilter } }] : []),
      {
        $group: {
          _id: '$leadStatus',
          count: { $sum: 1 },
        },
      },
    ]),
    Lead.aggregate([
      ...(dateFilter.createdAt ? [{ $match: { createdAt: dateFilter } }] : []),
      {
        $group: {
          _id: '$priority',
          count: { $sum: 1 },
        },
      },
    ]),
    Lead.aggregate([
      ...(dateFilter.createdAt ? [{ $match: { createdAt: dateFilter } }] : []),
      {
        $group: {
          _id: '$department',
          count: { $sum: 1 },
        },
      },
    ]),
    Lead.aggregate([
      ...(dateFilter.createdAt ? [{ $match: { createdAt: dateFilter } }] : []),
      {
        $group: {
          _id: '$leadStatus',
          count: { $sum: 1 },
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
    ]),
  ]);

  return {
    totalLeads,
    statusBreakdown,
    priorityBreakdown,
    departmentBreakdown,
    conversionFunnel,
  };
};
