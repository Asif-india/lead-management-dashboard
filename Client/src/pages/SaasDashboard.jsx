import React from 'react'
import { useBreakpoint } from '../hooks'
import { motion } from 'framer-motion'
import {
  Activity,
  Calendar,
  Download,
  MoreVertical,
  UserCheck
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
  PieChart,
  Pie,
  Cell
} from 'recharts'
import { DashboardHeader } from '../components/ui/PageHeader'
import StatCard from '../components/ui/StatCard'
import ChartCard from '../components/ui/ChartCard'
import ActivityCard from '../components/ui/ActivityCard'
import PerformerCard from '../components/ui/PerformerCard'
import DashboardSection from '../components/ui/DashboardSection'
import {
  LINE_CHART_COLORS,
  LINE_CHART_CONFIG,
  BAR_CHART_CONFIG,
  PIE_CHART_CONFIG,
  TOOLTIP_CONFIG,
  CARTESIAN_GRID_CONFIG,
  XAXIS_CONFIG,
  YAXIS_CONFIG,
  LINE_CHART_LEGEND_ITEMS
} from '../constants/dashboardCharts'
import { getActivityIcon, getAvatarGradient } from '../utils/dashboardHelpers'
import {
  containerVariants,
  itemVariants,
  cardVariants,
  chartVariants
} from '../constants/dashboardAnimations'
import { useDashboard } from '../hooks/useDashboard'

const SaasDashboard = () => {

  const { is } = useBreakpoint()
  const {
    kpiStats,
    leadTrendData,
    leadSourcesData,
    conversionRateData,
    recentActivity,
    topPerformers,
    loading,
    error
  } = useDashboard()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center text-red-500">
          <p>{error}</p>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Header */}
      <DashboardHeader
        variants={itemVariants}
        title="LeadGen Pro Dashboard"
        subtitle="Real-time lead generation and conversion analytics"
        showSearch={false}
        showNotifications={false}
        showSettings={false}
        actions={[
          {
            label: 'Last 30 Days',
            icon: Calendar,
            variant: 'secondary',
            onClick: () => {}
          },
          {
            label: 'Export Report',
            icon: Download,
            variant: 'primary',
            onClick: () => {}
          }
        ]}
      />

      {/* KPI Statistics Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {kpiStats.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            change={stat.change}
            trend={stat.trend}
            icon={stat.icon}
            iconColor={stat.color}
            description={stat.description}
            motionProps={{
              variants: cardVariants,
              whileHover: "hover"
            }}
          />
        ))}
      </motion.div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
        {/* Lead Generation Trend (Line Chart) */}
        <ChartCard
          title="Lead Generation Trend"
          subtitle="Monthly lead generation and conversion performance"
          chartType="line"
          className="lg:col-span-2 xl:col-span-2"
          motionProps={{
            variants: chartVariants
          }}
          rightAction={
            <motion.button
              whileHover={{ scale: 1.05, y: -1 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-lg bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground transition-colors"
            >
              <MoreVertical className="w-4 h-4" />
            </motion.button>
          }
        >
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={leadTrendData}>
              <defs>
                <linearGradient id="totalGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={LINE_CHART_COLORS.total} stopOpacity={0.8}/>
                  <stop offset="95%" stopColor={LINE_CHART_COLORS.total} stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="convertedGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={LINE_CHART_COLORS.converted} stopOpacity={0.8}/>
                  <stop offset="95%" stopColor={LINE_CHART_COLORS.converted} stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="pendingGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={LINE_CHART_COLORS.pending} stopOpacity={0.8}/>
                  <stop offset="95%" stopColor={LINE_CHART_COLORS.pending} stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid {...CARTESIAN_GRID_CONFIG} />
              <XAxis dataKey="month" {...XAXIS_CONFIG} />
              <YAxis {...YAXIS_CONFIG} />
              <Tooltip {...TOOLTIP_CONFIG} />
              <Line
                type={LINE_CHART_CONFIG.type}
                dataKey="totalLeads"
                stroke={LINE_CHART_COLORS.total}
                strokeWidth={LINE_CHART_CONFIG.strokeWidth}
                dot={{ fill: LINE_CHART_COLORS.total, r: LINE_CHART_CONFIG.dotRadius }}
                activeDot={{ r: LINE_CHART_CONFIG.activeDotRadius }}
              />
              <Line
                type={LINE_CHART_CONFIG.type}
                dataKey="convertedLeads"
                stroke={LINE_CHART_COLORS.converted}
                strokeWidth={LINE_CHART_CONFIG.strokeWidth}
                dot={{ fill: LINE_CHART_COLORS.converted, r: LINE_CHART_CONFIG.dotRadius }}
                activeDot={{ r: LINE_CHART_CONFIG.activeDotRadius }}
              />
              <Line
                type={LINE_CHART_CONFIG.type}
                dataKey="pendingLeads"
                stroke={LINE_CHART_COLORS.pending}
                strokeWidth={LINE_CHART_CONFIG.strokeWidth}
                dot={{ fill: LINE_CHART_COLORS.pending, r: LINE_CHART_CONFIG.dotRadius }}
                activeDot={{ r: LINE_CHART_CONFIG.activeDotRadius }}
              />
            </LineChart>
          </ResponsiveContainer>
          <div className="flex items-center justify-center space-x-6 mt-4">
            {LINE_CHART_LEGEND_ITEMS.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div className={`w-3 h-3 ${item.color} rounded-full`}></div>
                <span className="text-sm text-muted-foreground">{item.label}</span>
              </div>
            ))}
          </div>
        </ChartCard>

        {/* Lead Sources Distribution (Doughnut Chart) */}
        <ChartCard
          title="Lead Sources"
          subtitle="Distribution by acquisition channel"
          chartType="pie"
          motionProps={{
            variants: itemVariants
          }}
        >
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={leadSourcesData}
                {...PIE_CHART_CONFIG}
                dataKey="value"
              >
                {leadSourcesData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip {...TOOLTIP_CONFIG} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-6 space-y-3">
            {leadSourcesData.map((source, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: source.color }}
                  />
                  <span className="text-sm text-muted-foreground">{source.name}</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-medium text-foreground">{source.value}%</span>
                </div>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      {/* Conversion Rate by Channel (Bar Chart) */}
      <ChartCard
        title="Conversion Rate by Channel"
        subtitle="Performance analysis across lead sources"
        chartType="bar"
        motionProps={{
          variants: itemVariants
        }}
        rightAction={
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded-lg bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground transition-colors"
          >
            <MoreVertical className="w-4 h-4" />
          </motion.button>
        }
      >
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={conversionRateData}>
            <CartesianGrid {...CARTESIAN_GRID_CONFIG} />
            <XAxis dataKey="channel" {...XAXIS_CONFIG} />
            <YAxis {...YAXIS_CONFIG} />
            <Tooltip {...TOOLTIP_CONFIG} />
            <Bar dataKey="conversionRate" fill={BAR_CHART_CONFIG.fill} radius={BAR_CHART_CONFIG.radius} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Recent Activity and Top Performers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <DashboardSection
          title="Recent Activity"
          action={<Activity className="w-5 h-5" />}
          motionProps={{ variants: itemVariants }}
        >
          <div className="space-y-4">
            {recentActivity.length > 0 ? (
              recentActivity.map((activity, index) => {
                const Icon = getActivityIcon(activity.type)
                return (
                  <ActivityCard
                    key={activity.id}
                    icon={Icon}
                    iconColor={activity.color}
                    message={activity.message}
                    time={activity.time}
                    value={activity.value}
                    valueColor="text-green-400"
                    delay={index * 0.1}
                  />
                )
              })
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>No recent activity</p>
              </div>
            )}
          </div>
        </DashboardSection>

        {/* Top Performers */}
        <DashboardSection
          title="Top Performers"
          action={<UserCheck className="w-5 h-5" />}
          motionProps={{ variants: itemVariants }}
        >
          <div className="space-y-4">
            {topPerformers.map((performer, index) => {
              return (
                <PerformerCard
                  key={performer.id}
                  avatarGradient={getAvatarGradient(index)}
                  avatar={performer.avatar}
                  name={performer.name}
                  leads={performer.leads}
                  conversions={performer.conversions}
                  conversionRate={performer.conversionRate}
                  earnings={performer.earnings}
                  trend={performer.trend}
                  delay={index * 0.1}
                />
              )
            })}
          </div>
        </DashboardSection>
      </div>
    </motion.div>
  )
}

export default SaasDashboard
