import {
  getDashboardStats,
  getLeadTrend,
  getLeadSources,
  getConversionRates,
  getRecentActivities,
  getTopPerformers
} from '../services/dashboardService'

/**
 * useDashboard Hook
 *
 * Custom hook for dashboard data management.
 * Acts as the single data provider for the dashboard component.
 * Consumes dashboardService for data fetching.
 * When backend APIs are available, only dashboardService needs to change.
 *
 * @returns {Object} Dashboard data arrays
 */
export const useDashboard = () => {
  // Call service functions synchronously (they return static data)
  // In the future, when dashboardService becomes async, this can be replaced with React Query:
  // const { data: kpiStats } = useQuery('kpiStats', getDashboardStats)
  
  const kpiStats = getDashboardStats()
  const leadTrendData = getLeadTrend()
  const leadSourcesData = getLeadSources()
  const conversionRateData = getConversionRates()
  const recentActivity = getRecentActivities()
  const topPerformers = getTopPerformers()
  
  return {
    kpiStats,
    leadTrendData,
    leadSourcesData,
    conversionRateData,
    recentActivity,
    topPerformers
  }
}
