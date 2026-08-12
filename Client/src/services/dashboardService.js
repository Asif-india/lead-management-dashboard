import { analyticsApi } from './api'
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
 * @returns {Object} Mapped dashboard data
 */
const mapDashboardResponse = (apiData) => {
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
      value: formatCurrency(data.totalIncentives || 0),
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
  // Frontend: name, value, color
  const leadSourcesData = (data.leadSourceAnalytics || []).map((item, index) => ({
    name: item.source || 'Unknown',
    value: item.leads,
    color: LEAD_SOURCE_COLORS[index % LEAD_SOURCE_COLORS.length]
  }))

  // Map Conversion Rate Data
  // Backend: source, leads, conversion, revenue, cost
  // Frontend: channel, rate, leads
  const conversionRateData = (data.leadSourceAnalytics || []).map(item => ({
    channel: item.source || 'Unknown',
    conversionRate: item.conversion || 0,
    totalLeads: item.leads || 0
  }))

  // Map Recent Activities
  const recentActivity = (data.recentActivities || []).map((item, index) => {
    // Format relative time from backend timestamp
    const timestamp = item.timestamp
    const formattedTime = timestamp ? formatRelativeTime(timestamp) : 'Time unavailable'

    return {
      id: item.id || index + 1,
      type: item.type,
      message: item.message,
      value: item.value,
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
  })

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
    return mapDashboardResponse(response)
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
