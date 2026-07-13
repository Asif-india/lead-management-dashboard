import React from 'react'
import { motion } from 'framer-motion'
import { BarChart3, LineChart, PieChart, TrendingUp, Download, RefreshCw } from 'lucide-react'

/**
 * ChartCard Component
 * 
 * A reusable card component for displaying charts with header, controls, and loading states.
 * 
 * @param {Object} props - Component props
 * @param {string} props.title - Card title
 * @param {string} props.subtitle - Card subtitle
 * @param {React.ReactNode} props.children - Chart component to render
 * @param {string} props.chartType - Type of chart ('bar', 'line', 'pie', 'area', etc.)
 * @param {boolean} props.loading - Show loading state
 * @param {boolean} props.showRefresh - Show refresh button
 * @param {boolean} props.showDownload - Show download button
 * @param {function} props.onRefresh - Refresh handler
 * @param {function} props.onDownload - Download handler
 * @param {React.ReactNode} props.rightAction - Custom right action component
 * @param {string} props.className - Additional CSS classes
 * @param {Object} props.motionProps - Framer Motion props
 */
const ChartCard = ({
  title,
  subtitle,
  children,
  chartType = 'bar',
  loading = false,
  showRefresh = false,
  showDownload = false,
  onRefresh,
  onDownload,
  rightAction,
  className = '',
  motionProps = {},
  ...props
}) => {
  const getChartIcon = () => {
    switch (chartType) {
      case 'line':
        return <LineChart className="w-5 h-5" />
      case 'pie':
        return <PieChart className="w-5 h-5" />
      case 'area':
        return <TrendingUp className="w-5 h-5" />
      default:
        return <BarChart3 className="w-5 h-5" />
    }
  }
  
  const MotionDiv = motion.div
  
  const cardContent = (
    <div className="bg-card/50 border border-border rounded-2xl p-6 backdrop-blur-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex-1">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              {getChartIcon()}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">{title}</h2>
              {subtitle && <p className="text-muted-foreground text-sm mt-1">{subtitle}</p>}
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {showRefresh && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onRefresh}
              className="p-2 rounded-lg bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground transition-colors"
              disabled={loading}
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </motion.button>
          )}
          
          {showDownload && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onDownload}
              className="p-2 rounded-lg bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground transition-colors"
            >
              <Download className="w-4 h-4" />
            </motion.button>
          )}
          
          {rightAction}
        </div>
      </div>
      
      {/* Chart Content */}
      <div className="relative">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              <p className="text-muted-foreground text-sm">Loading chart data...</p>
            </div>
          </div>
        ) : (
          <div className="transition-all duration-300">
            {children}
          </div>
        )}
      </div>
    </div>
  )
  
  return (
    <MotionDiv
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      {...motionProps}
      {...props}
    >
      {cardContent}
    </MotionDiv>
  )
}

export default ChartCard
