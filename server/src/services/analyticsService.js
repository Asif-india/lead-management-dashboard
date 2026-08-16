/**
 * Analytics Service
 * Business logic layer for analytics operations
 */

import Lead from '../models/Lead.js';
import Employee from '../models/Employee.js';
import User from '../models/User.js';
import Incentive from '../models/Incentive.js';
import AuditLog from '../models/AuditLog.js';

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

/**
 * Get comprehensive lead analytics for frontend dashboard
 */
export const getComprehensiveLeadAnalytics = async () => {
  const [
    totalLeads,
    statusDistribution,
    countryDistribution,
    monthlyTrend,
    recentAuditLogs,
    recentLeads,
    recentIncentives,
    incentiveStatusCounts,
  ] = await Promise.all([
    Lead.countDocuments(),
    Lead.aggregate([
      {
        $group: {
          _id: '$leadStatus',
          count: { $sum: 1 },
        },
      },
    ]),
    Lead.aggregate([
      {
        $group: {
          _id: '$country',
          count: { $sum: 1 },
          wonLeads: {
            $sum: { $cond: [{ $eq: ['$leadStatus', 'won'] }, 1, 0] },
          },
        },
      },
      {
        $project: {
          country: '$_id',
          leads: '$count',
          conversion: {
            $multiply: [
              { $divide: ['$wonLeads', '$count'] },
              100,
            ],
          },
        },
      },
      {
        $sort: { count: -1 },
      },
      {
        $limit: 6,
      },
    ]),
    Lead.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          totalLeads: { $sum: 1 },
          qualifiedLeads: {
            $sum: { $cond: [{ $eq: ['$leadStatus', 'qualified'] }, 1, 0] },
          },
          wonLeads: {
            $sum: { $cond: [{ $eq: ['$leadStatus', 'won'] }, 1, 0] },
          },
        },
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 },
      },
      {
        $limit: 7,
      },
    ]),
    AuditLog.find({
      action: {
        $in: [
          'LEAD_CREATED',
          'LEAD_UPDATED',
          'LEAD_DELETED',
          'EMPLOYEE_CREATED',
        ]
      }
    })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('performedBy', 'firstName lastName email role')
      .populate('targetUser', 'firstName lastName email')
      .populate('targetEmployee', 'firstName lastName employeeId'),
    Lead.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select('studentName leadStatus createdAt updatedAt assignedTo source'),
    Incentive.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select('employeeName amount status incentiveType createdAt updatedAt'),
    Incentive.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]),
  ]);

  // Calculate conversion rate
  const conversionRate = totalLeads > 0 
    ? ((statusDistribution.find(s => s._id === 'won')?.count || 0) / totalLeads) * 100 
    : 0;

  // Format monthly trend data
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthlyLeadTrend = monthlyTrend.map(item => ({
    month: monthNames[item._id.month - 1],
    totalLeads: item.totalLeads,
    qualifiedLeads: item.qualifiedLeads,
    convertedLeads: item.wonLeads,
    target: Math.floor(item.totalLeads * 0.8), // Simple target calculation
  }));

  // Format status distribution
  const statusCounts = {
    new: 0,
    contacted: 0,
    qualified: 0,
    proposal: 0,
    negotiation: 0,
    won: 0,
    lost: 0,
  };
  statusDistribution.forEach(item => {
    if (statusCounts.hasOwnProperty(item._id)) {
      statusCounts[item._id] = item.count;
    }
  });

  // Format country distribution
  const countryWiseLeads = countryDistribution.map(item => ({
    country: item.country || 'Unknown',
    leads: item.leads,
    conversion: parseFloat(item.conversion.toFixed(1)),
    growth: 0, // Would need historical data for this
  }));

  // Format conversion funnel
  const conversionAnalytics = [
    { stage: 'Lead Generated', count: totalLeads, conversionRate: 100, dropOff: 0 },
    { stage: 'Contacted', count: statusCounts.contacted, conversionRate: totalLeads > 0 ? (statusCounts.contacted / totalLeads) * 100 : 0, dropOff: totalLeads > 0 ? 100 - ((statusCounts.contacted / totalLeads) * 100) : 0 },
    { stage: 'Qualified', count: statusCounts.qualified, conversionRate: totalLeads > 0 ? (statusCounts.qualified / totalLeads) * 100 : 0, dropOff: totalLeads > 0 ? 100 - ((statusCounts.qualified / totalLeads) * 100) : 0 },
    { stage: 'Proposal', count: statusCounts.proposal, conversionRate: totalLeads > 0 ? (statusCounts.proposal / totalLeads) * 100 : 0, dropOff: totalLeads > 0 ? 100 - ((statusCounts.proposal / totalLeads) * 100) : 0 },
    { stage: 'Negotiation', count: statusCounts.negotiation, conversionRate: totalLeads > 0 ? (statusCounts.negotiation / totalLeads) * 100 : 0, dropOff: totalLeads > 0 ? 100 - ((statusCounts.negotiation / totalLeads) * 100) : 0 },
    { stage: 'Closed Won', count: statusCounts.won, conversionRate: totalLeads > 0 ? (statusCounts.won / totalLeads) * 100 : 0, dropOff: totalLeads > 0 ? 100 - ((statusCounts.won / totalLeads) * 100) : 0 },
  ];

  // Lead source analytics (using source field)
  const leadSourceData = await Lead.aggregate([
    {
      $group: {
        _id: '$source',
        count: { $sum: 1 },
        wonLeads: {
          $sum: { $cond: [{ $eq: ['$leadStatus', 'won'] }, 1, 0] },
        },
      },
    },
    {
      $project: {
        source: '$_id',
        leads: '$count',
        conversion: {
          $multiply: [
            { $divide: ['$wonLeads', '$count'] },
            100,
          ],
        },
        revenue: { $multiply: ['$wonLeads', 1000] }, // Simplified revenue calculation
        cost: { $multiply: ['$count', 50] }, // Simplified cost calculation
      },
    },
    {
      $sort: { conversion: -1, source: 1 },
    },
  ]);

  const leadSourceAnalytics = leadSourceData.map(item => ({
    source: item.source || 'Unknown',
    leads: item.leads,
    conversion: parseFloat(item.conversion.toFixed(1)),
    revenue: item.revenue,
    cost: item.cost,
  }));

  // Performance radar data (simplified)
  const performanceRadar = [
    { metric: 'Lead Generation', actual: totalLeads > 0 ? Math.min(100, (totalLeads / 100) * 100) : 0, target: 100 },
    { metric: 'Conversion Rate', actual: Math.min(100, conversionRate), target: 100 },
    { metric: 'Customer Satisfaction', actual: 88, target: 100 }, // Would need customer satisfaction data
    { metric: 'Revenue Growth', actual: 78, target: 100 }, // Would need revenue data
    { metric: 'Cost Efficiency', actual: 85, target: 100 }, // Would need cost data
    { metric: 'Team Productivity', actual: 82, target: 100 }, // Would need team data
  ];

  // Employee performance (simplified - would need user data)
  const employeePerformance = await Lead.aggregate([
    {
      $group: {
        _id: '$assignedTo',
        leadsGenerated: { $sum: 1 },
        wonLeads: {
          $sum: { $cond: [{ $eq: ['$leadStatus', 'won'] }, 1, 0] },
        },
      },
    },
    {
      $project: {
        name: '$_id',
        leadsGenerated: '$leadsGenerated',
        conversionRate: {
          $multiply: [
            { $divide: ['$wonLeads', '$leadsGenerated'] },
            100,
          ],
        },
        customerSatisfaction: 90, // Default value
        targetAchievement: {
          $multiply: [
            { $divide: ['$leadsGenerated', 100] },
            100,
          ],
        },
      },
    },
    {
      $sort: { leadsGenerated: -1 },
    },
    {
      $limit: 5,
    },
  ]);

  const formattedEmployeePerformance = employeePerformance.map(item => ({
    name: item.name || 'Unassigned',
    leadsGenerated: item.leadsGenerated,
    conversionRate: parseFloat(item.conversionRate.toFixed(1)),
    customerSatisfaction: item.customerSatisfaction,
    targetAchievement: Math.min(150, Math.floor(item.targetAchievement)),
  }));

  // Format incentive status counts for sidebar badges
  const incentiveCounts = {
    pending: 0,
    processing: 0,
    approved: 0,
    rejected: 0
  };
  incentiveStatusCounts.forEach(item => {
    if (incentiveCounts.hasOwnProperty(item._id)) {
      incentiveCounts[item._id] = item.count;
    }
  });

  // Format recent activities from AuditLog business events and Incentives
  const auditActivities = recentAuditLogs.map(log => {
    // Map AuditLog action to activity type
    const activityTypeMap = {
      'LEAD_CREATED': 'new_lead',
      'LEAD_UPDATED': 'status_updated',
      'LEAD_DELETED': 'status_updated',
      'EMPLOYEE_CREATED': 'employee_created',
    };

    const activityType = activityTypeMap[log.action] || 'status_updated';

    // Build message from AuditLog data - business-friendly format for dashboard
    let message = '';

    if (log.action === 'LEAD_UPDATED' && log.newValue && log.newValue.leadStatus) {
      // Try to get studentName from AuditLog first, then from recentLeads by entityId
      let studentName = log.newValue.studentName || log.oldValue?.studentName;
      if (!studentName && log.entityId) {
        const lead = recentLeads.find(l => l._id.toString() === log.entityId.toString());
        if (lead) {
          studentName = lead.studentName;
        }
      }
      studentName = studentName || 'Lead';
      const status = log.newValue.leadStatus.charAt(0).toUpperCase() + log.newValue.leadStatus.slice(1);
      message = `${studentName}'s lead status changed to ${status}`;
    } else if (log.action === 'EMPLOYEE_CREATED') {
      const employeeName = log.targetEmployee?.firstName && log.targetEmployee?.lastName
        ? `${log.targetEmployee.firstName} ${log.targetEmployee.lastName}`
        : log.newValue?.firstName && log.newValue?.lastName
        ? `${log.newValue.firstName} ${log.newValue.lastName}`
        : null;
      message = employeeName ? `New employee added: ${employeeName}` : 'New employee added';
    } else if (log.action === 'LEAD_CREATED') {
      const studentName = log.newValue?.studentName || 'New lead';
      message = `New lead: ${studentName}`;
    } else {
      message = log.description || `${log.action.replace(/_/g, ' ').toLowerCase()}`;
    }

    // Extract value from newValue if it contains amount
    let value = null;
    if (log.newValue && typeof log.newValue === 'object') {
      if (log.newValue.amount) {
        value = `₹${log.newValue.amount}`;
      }
    }

    return {
      id: `audit-${log._id?.toString()}`,
      type: activityType,
      message,
      value: value || null,
      timestamp: log.createdAt,
    };
  });

  // Format incentive activities from recent Incentives
  const incentiveActivities = recentIncentives.map(incentive => {
    let activityType = 'incentive_earned';
    let message = '';
    const employeeName = incentive.employeeName || 'Unknown';
    const incentiveType = incentive.incentiveType || 'incentive';

    // Map message based on incentive status
    switch (incentive.status) {
      case 'pending':
        message = `${employeeName} was awarded ${incentiveType}`;
        break;
      case 'processing':
        message = `${incentiveType} for ${employeeName} is being processed`;
        break;
      case 'approved':
        message = `${employeeName} earned ${incentiveType}`;
        break;
      case 'rejected':
        message = `${incentiveType} for ${employeeName} was rejected`;
        break;
      default:
        message = `${employeeName} was awarded ${incentiveType}`;
    }

    // Show amount for any status if amount exists
    let value = null;
    if (incentive.amount) {
      value = `₹${incentive.amount}`;
    }

    return {
      id: `incentive-${incentive._id?.toString()}`,
      type: activityType,
      message,
      value: value || null,
      timestamp: incentive.createdAt,
    };
  });

  // Combine and sort all activities by timestamp descending
  const allActivities = [...auditActivities, ...incentiveActivities]
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, 5);

  const recentActivities = allActivities;

  return {
    totalLeads,
    newLeads: statusCounts.new,
    contactedLeads: statusCounts.contacted,
    qualifiedLeads: statusCounts.qualified,
    proposalLeads: statusCounts.proposal,
    negotiationLeads: statusCounts.negotiation,
    wonLeads: statusCounts.won,
    lostLeads: statusCounts.lost,
    conversionRate: parseFloat(conversionRate.toFixed(1)),
    activeCountries: countryDistribution.length,
    monthlyLeadTrend,
    leadStatusDistribution: statusCounts,
    countryWiseLeads,
    conversionAnalytics,
    leadSourceAnalytics,
    performanceRadar,
    employeePerformance: formattedEmployeePerformance,
    recentActivities,
    approvedIncentives: incentiveCounts.approved,
    pendingIncentives: incentiveCounts.pending,
    processingIncentives: incentiveCounts.processing,
    rejectedIncentives: incentiveCounts.rejected,
  };
};
