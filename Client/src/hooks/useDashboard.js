import React from 'react'
import { useAnalytics } from '../context/AnalyticsContext'

/**
 * useDashboard Hook
 *
 * Custom hook for dashboard data management.
 * Consumes data from AnalyticsContext to avoid duplicate API calls.
 * Ensures data is available after auth completes.
 *
 * @returns {Object} Dashboard data arrays and loading state
 */
export const useDashboard = () => {
  const { loading, error, data, ...analyticsData } = useAnalytics()

  return {
    kpiStats: analyticsData.kpiStats || [],
    leadTrendData: analyticsData.leadTrendData || [],
    leadSourcesData: analyticsData.leadSourcesData || [],
    conversionRateData: analyticsData.conversionRateData || [],
    recentActivity: analyticsData.recentActivity || [],
    topPerformers: analyticsData.topPerformers || [],
    loading,
    error
  }
}
