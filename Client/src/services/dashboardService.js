import {
  kpiStats,
  leadTrendData,
  leadSourcesData,
  conversionRateData,
  recentActivity,
  topPerformers
} from '../data/dashboardData'

/**
 * Dashboard Service
 *
 * Service layer for dashboard data management.
 * Follows MERN architecture: Controller → Service → API
 * Currently returns static data synchronously.
 *
 * TODO: When backend APIs are implemented:
 * 1. Add axios import: import axios from 'axios'
 * 2. Create axios instance with Vite env: import.meta.env.VITE_API_BASE_URL
 * 3. Convert functions to async with actual API calls
 * 4. Update useDashboard hook to handle async data (React Query, useEffect, etc.)
 */

/**
 * Get dashboard KPI statistics
 * @returns {Array} KPI stats data
 */
export const getDashboardStats = () => {
  return kpiStats
}

/**
 * Get lead generation trend data
 * @returns {Array} Lead trend data
 */
export const getLeadTrend = () => {
  return leadTrendData
}

/**
 * Get lead sources distribution data
 * @returns {Array} Lead sources data
 */
export const getLeadSources = () => {
  return leadSourcesData
}

/**
 * Get conversion rate by channel data
 * @returns {Array} Conversion rate data
 */
export const getConversionRates = () => {
  return conversionRateData
}

/**
 * Get recent activities
 * @returns {Array} Recent activity data
 */
export const getRecentActivities = () => {
  return recentActivity
}

/**
 * Get top performers
 * @returns {Array} Top performers data
 */
export const getTopPerformers = () => {
  return topPerformers
}
