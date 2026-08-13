import { analyticsApi, leadsApi } from './api'
import { formatCurrency } from '../utils/currencyFormatter'
import { formatRelativeTime } from '../utils/timeFormatter'
import {
  Users,
  CheckCircle,
  Clock,
  Award,
  Target,
  AlertCircle,
  UserPlus,
  FileText
} from 'lucide-react'

/**
 * Dashboard Service
 *
 * Service layer for dashboard data management.
 * Follows MERN architecture: Controller → Service → API
 * Refactored to use single API call with central mapping layer.
 */

/**
 * Color map for lead sources pie chart
 */
const LEAD_SOURCE_COLORS = [
  '#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444',
  '#06b6d4', '#ec4899', '#14b8a6', '#f97316', '#84cc16'
]

/**
 * Activity icon mapping
 */
const ACTIVITY_ICONS = {
  'lead_converted': CheckCircle,
  'new_lead': Users,
  'incentive_earned': Award,
  'lead_pending': AlertCircle,
  'milestone_reached': Target,
  'lead_assigned': UserPlus,
  'status_updated': FileText
}

/**
 * Activity color mapping
 */
const ACTIVITY_COLORS = {
  'lead_converted': 'text-green-400',
  'new_lead': 'text-blue-400',
  'incentive_earned': 'text-purple-400',
  'lead_pending': 'text-orange-400',
  'milestone_reached': 'text-green-400',
  'lead_assigned': 'text-blue-400',
  'status_updated': 'text-yellow-400'
}

/**
 * Map backend API response to frontend dashboard structure
 * Central mapping layer for all dashboard data transformations
 *
 * @param {Object} apiData - Raw backend API response
 * @param {Array} leadsData - Raw leads data for accurate conversion rate calculation
 * @param {Object} incentivesData - Incentives analytics data for total payout
 * @returns {Object} Mapped dashboard data
 */
const mapDashboardResponse = (apiData, leadsData = [], incentivesData = null) => {
  const data = apiData?.data || apiData

  // Map KPI Stats
  const kpiStats = [
    {
      title: 'Total Leads',
      value: (data.totalLeads || 0).toLocaleString(),
      change: '+0%',
      trend: 'up',
      icon: Users,
      color: 'from-blue-500 to-cyan-600',
      bgColor: 'bg-blue-500/10',
      description: 'Total leads in system'
    },
    {
      title: 'Converted Leads',
      value: (data.wonLeads || 0).toLocaleString(),
      change: '+0%',
      trend: 'up',
      icon: CheckCircle,
      color: 'from-green-500 to-emerald-600',
      bgColor: 'bg-green-500/10',
      description: 'Successfully converted'
    },
    {
      title: 'Pending Leads',
      value: ((data.newLeads || 0) + (data.contactedLeads || 0) + (data.qualifiedLeads || 0) + (data.proposalLeads || 0) + (data.negotiationLeads || 0)).toLocaleString(),
      change: '+0%',
      trend: 'down',
      icon: Clock,
      color: 'from-orange-500 to-amber-600',
      bgColor: 'bg-orange-500/10',
      description: 'Awaiting follow-up'
    },
    {
      title: 'Total Incentives',
      value: formatCurrency(incentivesData?.totalPayout || 0),
      change: '+0%',
      trend: 'up',
      icon: Award,
      color: 'from-purple-500 to-pink-600',
      bgColor: 'bg-purple-500/10',
      description: 'Paid out this quarter'
    }
  ]

  // Map Lead Trend Data
  // Backend: month, totalLeads, qualifiedLeads, convertedLeads, target
  // Frontend: month, totalLeads, converted, pending
  const leadTrendData = (data.monthlyLeadTrend || []).map(item => ({
    month: item.month,
    totalLeads: item.totalLeads,
    convertedLeads: item.convertedLeads,
    pendingLeads: item.totalLeads - item.convertedLeads
  }))

  // Map Lead Sources Data (Pie Chart)
  // Backend: source, leads, conversion, revenue, cost
  // Frontend: name, value (percentage), color, rawCount
  const totalLeads = (data.leadSourceAnalytics || []).reduce((sum, item) => sum + (item.leads || 0), 0)
  const leadSourcesData = (data.leadSourceAnalytics || []).map((item, index) => {
    const sourceLeads = item.leads || 0
    const percentage = totalLeads > 0 ? (sourceLeads / totalLeads) * 100 : 0
    return {
      name: item.source || 'Unknown',
      value: percentage,
      rawCount: sourceLeads,
      color: LEAD_SOURCE_COLORS[index % LEAD_SOURCE_COLORS.length]
    }
  }).sort((a, b) => {
    // Sort by percentage descending, then by name for deterministic order
    if (b.value !== a.value) {
      return b.value - a.value
    }
    return a.name.localeCompare(b.name)
  })

  // Map Conversion Rate Data
  // Calculate actual conversion rate per source from real leads data
  // Frontend: channel, rate (2 decimal places), leads, convertedLeads
  const conversionRateData = (() => {
    // Group leads by source and count total/converted
    const sourceStats = new Map()

    leadsData.forEach(lead => {
      const source = lead.source || 'Unknown'
      const status = lead.status || lead.leadStatus || ''

      if (!sourceStats.has(source)) {
        sourceStats.set(source, { total: 0, converted: 0 })
      }

      const stats = sourceStats.get(source)
      stats.total++

      // Count as converted if status is 'converted' or 'won'
      if (status.toLowerCase() === 'converted' || status.toLowerCase() === 'won') {
        stats.converted++
      }
    })

    // Calculate conversion rate per source
    return (data.leadSourceAnalytics || []).map(item => {
      const source = item.source || 'Unknown'
      const stats = sourceStats.get(source) || { total: 0, converted: 0 }
      const totalLeads = stats.total
      const convertedLeads = stats.converted

      // Calculate conversion rate: (converted / total) * 100
      const rate = totalLeads > 0 ? (convertedLeads / totalLeads) * 100 : 0

      return {
        channel: source,
        conversionRate: Number(rate.toFixed(2)),
        totalLeads: totalLeads,
        convertedLeads: convertedLeads
      }
    })
  })()

  // Map Recent Activities
  const recentActivity = (data.recentActivities || []).map((item, index) => {
    // Format relative time from backend timestamp
    const timestamp = item.timestamp
    const formattedTime = timestamp ? formatRelativeTime(timestamp) : 'Time unavailable'

    return {
      id: item.id || index + 1,
      type: item.type,
      message: item.message,
      value: item.value || null, // Keep null for no amount, don't show fake value
      time: formattedTime,
      timestamp: timestamp,
      icon: ACTIVITY_ICONS[item.type] || Users,
      color: ACTIVITY_COLORS[item.type] || 'text-blue-400'
    }
  })

  // Map Top Performers
  // Backend: name, leadsGenerated, conversionRate, customerSatisfaction, targetAchievement
  // Frontend: id, name, avatar, leads, conversions, conversionRate, earnings, trend
  const topPerformers = (data.employeePerformance || []).map((item, index) => {
    const nameParts = item.name?.split(' ') || ['User']
    const avatar = nameParts.map(n => n[0]).join('').toUpperCase().slice(0, 2)
    const conversions = Math.floor(item.leadsGenerated * (item.conversionRate / 100))
    const earnings = Math.floor(conversions * 100 * (item.conversionRate / 100))

    return {
      id: index + 1,
      name: item.name || 'Unassigned',
      avatar: avatar || 'NA',
      leads: item.leadsGenerated,
      conversions: conversions,
      conversionRate: item.conversionRate,
      earnings: formatCurrency(earnings),
      trend: item.targetAchievement >= 100 ? 'up' : 'down'
    }
  }).sort((a, b) => {
    // Sort by: 1) conversions (desc), 2) conversion rate (desc), 3) leads (desc), 4) earnings (desc)
    if (b.conversions !== a.conversions) {
      return b.conversions - a.conversions
    }
    if (b.conversionRate !== a.conversionRate) {
      return b.conversionRate - a.conversionRate
    }
    if (b.leads !== a.leads) {
      return b.leads - a.leads
    }
    // Sort by earnings as final tiebreaker (parse numeric value from formatted string)
    const earningsA = parseFloat(a.earnings.replace(/[^\d.-]/g, '')) || 0
    const earningsB = parseFloat(b.earnings.replace(/[^\d.-]/g, '')) || 0
    return earningsB - earningsA
  }).map((performer, index) => ({
    ...performer,
    rank: index + 1
  }))

  return {
    kpiStats,
    leadTrendData,
    leadSourcesData,
    conversionRateData,
    recentActivity,
    topPerformers,
    // Badge data for Sidebar
    totalLeads: data.totalLeads || 0,
    approvedIncentives: data.approvedIncentives || 0,
    pendingIncentives: data.pendingIncentives || 0,
    processingIncentives: data.processingIncentives || 0,
    rejectedIncentives: data.rejectedIncentives || 0,
    totalEmployees: data.totalEmployees || 0,
    newNotifications: data.newNotifications || 0
  }
}

/**
 * Fetch all dashboard data with single API call
 * This is the primary function that should be used by the dashboard
 *
 * @returns {Promise<Object>} All dashboard data
 */
export const fetchDashboardData = async () => {
  try {
    const response = await analyticsApi.getComprehensive()

    // Fetch incentives analytics for Total Incentives KPI
    let incentivesData = null
    try {
      const { incentivesApi } = await import('./api')
      const incentivesResponse = await incentivesApi.getAnalytics()
      incentivesData = incentivesResponse?.data || null
    } catch (incentivesError) {
      console.warn('Failed to fetch incentives analytics:', incentivesError)
      // Continue with analytics data if incentives fetch fails
    }

    // Fetch leads data to calculate accurate conversion rates per source
    let leadsData = []
    try {
      const leadsResponse = await leadsApi.getList()
      leadsData = Array.isArray(leadsResponse) ? leadsResponse : (leadsResponse?.data?.data || leadsResponse?.data || [])
    } catch (leadsError) {
      console.warn('Failed to fetch leads for conversion rate calculation:', leadsError)
      // Continue with analytics data if leads fetch fails
    }

    return mapDashboardResponse(response, leadsData, incentivesData)
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
    throw error
  }
}

/**
 * Legacy functions for backward compatibility
 * These are deprecated but kept for potential migration
 */
export const getDashboardStats = async () => {
  const data = await fetchDashboardData()
  return data.kpiStats
}

export const getLeadTrend = async () => {
  const data = await fetchDashboardData()
  return data.leadTrendData
}

export const getLeadSources = async () => {
  const data = await fetchDashboardData()
  return data.leadSourcesData
}

export const getConversionRates = async () => {
  const data = await fetchDashboardData()
  return data.conversionRateData
}

export const getRecentActivities = async () => {
  const data = await fetchDashboardData()
  return data.recentActivity
}

export const getTopPerformers = async () => {
  const data = await fetchDashboardData()
  return data.topPerformers
}
