import React, { createContext, useContext, useState, useEffect } from 'react'
import { fetchDashboardData } from '../services/dashboardService'
import { useAuth } from './AuthContext'

/**
 * Analytics Context
 * 
 * Provides shared analytics data across the application.
 * Used by Sidebar, Dashboard, and Navbar to display badges and statistics.
 * Ensures only one API call is made and data is cached at the context level.
 */
const AnalyticsContext = createContext(null)

export const useAnalytics = () => {
  const context = useContext(AnalyticsContext)
  if (!context) {
    throw new Error('useAnalytics must be used within an AnalyticsProvider')
  }
  return context
}

export const AnalyticsProvider = ({ children }) => {
  const { token, loading: authLoading } = useAuth()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [data, setData] = useState({
    totalLeads: 0,
    approvedIncentives: 0,
    pendingIncentives: 0,
    processingIncentives: 0,
    rejectedIncentives: 0,
    totalEmployees: 0,
    newNotifications: 0,
    kpiStats: [],
    leadTrendData: [],
    leadSourcesData: [],
    conversionRateData: [],
    recentActivity: [],
    topPerformers: []
  })

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      setError(null)

      const analyticsData = await fetchDashboardData()
      setData(analyticsData)
    } catch (err) {
      console.error('Error fetching analytics data:', err)
      setError('Failed to load analytics data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Wait until AuthContext finishes loading
    if (authLoading) {
      return
    }

    // Don't call analytics API if user is not logged in
    if (!token) {
      setLoading(false)
      return
    }

    fetchAnalytics()

    // Listen for analytics refresh events (triggered after lead mutations)
    const handleRefresh = () => {
      fetchAnalytics()
    }

    window.addEventListener('analytics:refresh', handleRefresh)

    return () => {
      window.removeEventListener('analytics:refresh', handleRefresh)
    }
  }, [token, authLoading])

  const value = {
    loading,
    error,
    data,
    totalLeads: data.totalLeads,
    approvedIncentives: data.approvedIncentives,
    pendingIncentives: data.pendingIncentives,
    processingIncentives: data.processingIncentives,
    rejectedIncentives: data.rejectedIncentives,
    totalEmployees: data.totalEmployees,
    newNotifications: data.newNotifications,
    kpiStats: data.kpiStats,
    leadTrendData: data.leadTrendData,
    leadSourcesData: data.leadSourcesData,
    conversionRateData: data.conversionRateData,
    recentActivity: data.recentActivity,
    topPerformers: data.topPerformers
  }

  return (
    <AnalyticsContext.Provider value={value}>
      {children}
    </AnalyticsContext.Provider>
  )
}

export default AnalyticsContext
