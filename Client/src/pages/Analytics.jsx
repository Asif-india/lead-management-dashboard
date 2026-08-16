import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Users,
  TrendingUp,
  TrendingDown,
  IndianRupee,
  Target,
  Globe,
  Award,
  Download,
  PieChart,
  UserCheck,
  Loader2,
  AlertCircle,
  Calendar,
} from 'lucide-react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ComposedChart
} from 'recharts'
import { containerVariants, itemVariants } from '../constants/formAnimations'
import { analyticsApi } from '../services/api'
import { formatCurrency } from '../utils/currencyFormatter'

const Analytics = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [analyticsData, setAnalyticsData] = useState(null)

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await analyticsApi.getComprehensive()

      // Handle different response structures
      let data = null
      if (response?.data) {
        data = response.data
      } else if (response?.success && response?.data) {
        data = response.data
      } else if (typeof response === 'object' && response !== null) {
        data = response
      }

      setAnalyticsData(data)

      if (!data || typeof data !== 'object') {
        setError('Invalid analytics data received from server')
      }
    } catch (err) {
      console.error('Error fetching analytics:', err)
      setError('Failed to load analytics data. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const iconMap = {
    Users,
    Target,
    IndianRupee,
    Globe
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-xl">
          <p className="text-foreground font-medium mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value.toLocaleString()}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  if (loading) {
    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex items-center justify-center min-h-[400px]"
      >
        <Loader2 className="w-8 h-8 text-muted-foreground animate-spin" />
      </motion.div>
    )
  }

  if (error) {
    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex items-center justify-center min-h-[400px]"
      >
        <AlertCircle className="w-8 h-8 text-red-500 mb-4" />
        <p className="text-foreground">{error}</p>
      </motion.div>
    )
  }

  if (!analyticsData || typeof analyticsData !== 'object') {
    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex items-center justify-center min-h-[400px]"
      >
        <AlertCircle className="w-8 h-8 text-red-500 mb-4" />
        <p className="text-foreground">No analytics data available</p>
      </motion.div>
    )
  }

  // Format analytics data for display with defensive checks
  const totalLeads = Number(analyticsData?.totalLeads) || 0
  const conversionRate = Number(analyticsData?.conversionRate) || 0
  const wonLeads = Number(analyticsData?.wonLeads) || 0
  const activeCountries = Number(analyticsData?.activeCountries) || 0

  // Don't render if critical data is missing
  if (totalLeads === 0 && conversionRate === 0 && wonLeads === 0 && activeCountries === 0) {
    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex items-center justify-center min-h-[400px]"
      >
        <AlertCircle className="w-8 h-8 text-yellow-500 mb-4" />
        <p className="text-foreground">No lead data available. Create some leads to see analytics.</p>
      </motion.div>
    )
  }

  const analyticsStats = [
    {
      title: 'Total Leads',
      value: totalLeads.toLocaleString(),
      change: '+12.5%',
      trend: 'up',
      icon: 'Users',
      color: 'from-blue-500 to-cyan-600',
      description: 'Generated this month'
    },
    {
      title: 'Conversion Rate',
      value: `${conversionRate.toFixed(1)}%`,
      change: '+3.2%',
      trend: 'up',
      icon: 'Target',
      color: 'from-green-500 to-emerald-600',
      description: 'Overall conversion'
    },
    {
      title: 'Revenue Generated',
      value: formatCurrency(wonLeads * 1000),
      change: '+18.7%',
      trend: 'up',
      icon: 'IndianRupee',
      color: 'from-purple-500 to-pink-600',
      description: 'Total revenue'
    },
    {
      title: 'Active Countries',
      value: activeCountries.toLocaleString(),
      change: '+2',
      trend: 'up',
      icon: 'Globe',
      color: 'from-orange-500 to-red-600',
      description: 'Markets served'
    }
  ]

  const monthlyLeadTrend = analyticsData.monthlyLeadTrend || []
  const countryWiseLeads = analyticsData.countryWiseLeads || []
  const employeePerformance = analyticsData.employeePerformance || []
  const conversionAnalytics = analyticsData.conversionAnalytics || []
  const leadSourceAnalytics = analyticsData.leadSourceAnalytics || []
  const performanceRadar = analyticsData.performanceRadar || []

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
            LeadGen Pro Analytics
          </h1>
          <p className="text-muted-foreground text-lg">Comprehensive lead generation and conversion analytics</p>
        </div>
        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center space-x-2 px-4 py-2 bg-muted/50 border border-border/30 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <Calendar className="w-4 h-4" />
            <span>Last 30 Days</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg shadow-blue-500/25"
          >
            <Download className="w-4 h-4" />
            <span>Export Report</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Analytics Stats Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {analyticsStats.map((stat, index) => {
          const Icon = iconMap[stat.icon]
          return (
            <motion.div
              key={index}
              whileHover={{ y: -8, scale: 1.02 }}
              className="bg-card/50 border border-border/50 rounded-2xl p-6 backdrop-blur-sm hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-14 h-14 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <div className={`flex items-center space-x-1 text-sm font-medium ${
                  stat.trend === 'up' ? 'text-green-400' : 'text-red-400'
                }`}>
                  {stat.trend === 'up' ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  <span>{stat.change}</span>
                </div>
              </div>
              <h3 className="text-3xl font-bold text-foreground mb-1">{stat.value}</h3>
              <p className="text-muted-foreground font-medium mb-1">{stat.title}</p>
              <p className="text-muted-foreground text-sm">{stat.description}</p>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Monthly Lead Trend Chart */}
      <motion.div variants={itemVariants} className="bg-card/50 border border-border/50 rounded-2xl p-6 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Monthly Lead Trend Analysis</h2>
            <p className="text-muted-foreground text-sm mt-1">Lead generation performance over time</p>
          </div>
          <PieChart className="w-5 h-5 text-muted-foreground" />
        </div>
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart data={monthlyLeadTrend}>
            <defs>
              <linearGradient id="totalGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="qualifiedGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="convertedGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
            <XAxis dataKey="month" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="totalLeads"
              stroke="#3b82f6"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#totalGradient)"
            />
            <Area
              type="monotone"
              dataKey="qualifiedLeads"
              stroke="#10b981"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#qualifiedGradient)"
            />
            <Area
              type="monotone"
              dataKey="convertedLeads"
              stroke="#f59e0b"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#convertedGradient)"
            />
            <Line
              type="monotone"
              dataKey="target"
              stroke="#ef4444"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
        <div className="flex items-center justify-center space-x-6 mt-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-sm text-muted-foreground">Total Leads</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-muted-foreground">Qualified</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
            <span className="text-sm text-muted-foreground">Converted</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-sm text-muted-foreground">Target</span>
          </div>
        </div>
      </motion.div>

      {/* Country-wise and Employee Performance Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Country-wise Leads Chart */}
        <motion.div variants={itemVariants} className="bg-card/50 border border-border/50 rounded-2xl p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-foreground">Country-wise Lead Distribution</h2>
              <p className="text-muted-foreground text-sm mt-1">Geographic lead generation analysis</p>
            </div>
            <Globe className="w-5 h-5 text-muted-foreground" />
          </div>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={countryWiseLeads} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
              <XAxis type="number" stroke="#94a3b8" />
              <YAxis dataKey="country" type="category" width={100} stroke="#94a3b8" />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="leads" fill="#3b82f6" radius={[0, 8, 8, 0]} />
              <Bar dataKey="conversion" fill="#10b981" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Employee Performance Chart */}
        <motion.div variants={itemVariants} className="bg-card/50 border border-border/50 rounded-2xl p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-foreground">Employee Performance Metrics</h2>
              <p className="text-muted-foreground text-sm mt-1">Top performers analysis</p>
            </div>
            <UserCheck className="w-5 h-5 text-muted-foreground" />
          </div>
          <ResponsiveContainer width="100%" height={350}>
            <RadarChart data={employeePerformance}>
              <PolarGrid stroke="#475569" />
              <PolarAngleAxis dataKey="name" stroke="#94a3b8" />
              <PolarRadiusAxis angle={90} domain={[0, 150]} stroke="#94a3b8" />
              <Radar
                name="Leads Generated"
                dataKey="leadsGenerated"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.6}
              />
              <Radar
                name="Conversion Rate"
                dataKey="conversionRate"
                stroke="#10b981"
                fill="#10b981"
                fillOpacity={0.6}
              />
              <Radar
                name="Target Achievement"
                dataKey="targetAchievement"
                stroke="#f59e0b"
                fill="#f59e0b"
                fillOpacity={0.6}
              />
              <Tooltip content={<CustomTooltip />} />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Conversion Analytics and Lead Source Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Conversion Funnel */}
        <motion.div variants={itemVariants} className="bg-card/50 border border-border/50 rounded-2xl p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-foreground">Conversion Funnel</h2>
              <p className="text-muted-foreground text-sm mt-1">Lead conversion pipeline</p>
            </div>
            <Target className="w-5 h-5 text-muted-foreground" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={conversionAnalytics} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
              <XAxis type="number" stroke="#94a3b8" />
              <YAxis dataKey="stage" type="category" width={120} stroke="#94a3b8" />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" fill="#8b5cf6" radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Lead Source Analytics */}
        <motion.div variants={itemVariants} className="lg:col-span-2 bg-card/50 border border-border/50 rounded-2xl p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-foreground">Lead Source Performance</h2>
              <p className="text-muted-foreground text-sm mt-1">ROI analysis by lead source</p>
            </div>
            <PieChart className="w-5 h-5 text-muted-foreground" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={leadSourceAnalytics}>
              <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
              <XAxis dataKey="source" angle={-45} textAnchor="end" height={100} stroke="#94a3b8" />
              <YAxis yAxisId="left" stroke="#94a3b8" />
              <YAxis yAxisId="right" orientation="right" stroke="#94a3b8" />
              <Tooltip content={<CustomTooltip />} />
              <Bar yAxisId="left" dataKey="leads" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              <Line yAxisId="right" type="monotone" dataKey="conversion" stroke="#10b981" strokeWidth={3} />
              <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#f59e0b" strokeWidth={2} />
            </ComposedChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Performance Overview Radar */}
      <motion.div variants={itemVariants} className="bg-card/50 border border-border/50 rounded-2xl p-6 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Overall Performance Overview</h2>
            <p className="text-muted-foreground text-sm mt-1">Key metrics performance vs targets</p>
          </div>
          <Award className="w-5 h-5 text-muted-foreground" />
        </div>
        <ResponsiveContainer width="100%" height={400}>
          <RadarChart data={performanceRadar}>
            <PolarGrid stroke="#475569" />
            <PolarAngleAxis dataKey="metric" stroke="#94a3b8" />
            <PolarRadiusAxis angle={90} domain={[0, 100]} stroke="#94a3b8" />
            <Radar
              name="Actual Performance"
              dataKey="actual"
              stroke="#3b82f6"
              fill="#3b82f6"
              fillOpacity={0.6}
              strokeWidth={2}
            />
            <Radar
              name="Target"
              dataKey="target"
              stroke="#ef4444"
              fill="#ef4444"
              fillOpacity={0.1}
              strokeWidth={2}
              strokeDasharray="5 5"
            />
            <Tooltip content={<CustomTooltip />} />
          </RadarChart>
        </ResponsiveContainer>
      </motion.div>
    </motion.div>
  )
}

export default Analytics
