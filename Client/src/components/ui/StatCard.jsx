import React from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

/**
 * StatCard Component
 * 
 * A reusable statistics card with icon, value, change indicator, and description.
 * 
 * @param {Object} props - Component props
 * @param {string} props.title - Card title
 * @param {string|number} props.value - Main value
 * @param {string} props.change - Change value (e.g., '+12.5%')
 * @param {string} props.trend - Trend direction ('up', 'down', 'neutral')
 * @param {React.ReactNode} props.icon - Icon component
 * @param {string} props.iconColor - Icon gradient color (e.g., 'from-blue-500 to-cyan-600')
 * @param {string} props.description - Additional description
 * @param {boolean} props.loading - Show loading state
 * @param {boolean} props.animate - Enable animations
 * @param {string} props.className - Additional CSS classes
 * @param {Object} props.motionProps - Framer Motion props
 */
const StatCard = ({
  title,
  value,
  change,
  trend = 'neutral',
  icon: Icon,
  iconColor = 'from-blue-500 to-cyan-600',
  description,
  loading = false,
  animate = true,
  className = '',
  motionProps = {},
  ...props
}) => {
  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4" />
      case 'down':
        return <TrendingDown className="w-4 h-4" />
      default:
        return <Minus className="w-4 h-4" />
    }
  }
  
  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'text-green-600 dark:text-green-400'
      case 'down':
        return 'text-red-600 dark:text-red-400'
      default:
        return 'text-muted-foreground'
    }
  }
  
  const MotionDiv = motion.div
  
  const cardContent = (
    <div className="bg-card/50 border border-border rounded-2xl p-6 backdrop-blur-sm hover:shadow-xl hover:shadow-primary/10 transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-14 h-14 bg-gradient-to-br ${iconColor} rounded-xl flex items-center justify-center`}>
          {Icon && <Icon className="w-7 h-7 text-white" />}
        </div>
        {change && (
          <div className={`flex items-center space-x-1 text-sm font-medium ${getTrendColor()}`}>
            {getTrendIcon()}
            <span>{change}</span>
          </div>
        )}
      </div>
      
      {loading ? (
        <div className="space-y-2">
          <div className="h-8 bg-muted rounded animate-pulse"></div>
          <div className="h-4 bg-muted rounded w-3/4 animate-pulse"></div>
          <div className="h-3 bg-muted rounded w-1/2 animate-pulse"></div>
        </div>
      ) : (
        <>
          <h3 className="text-3xl font-bold text-foreground mb-1">{value}</h3>
          <p className="text-muted-foreground font-medium mb-1">{title}</p>
          {description && <p className="text-muted-foreground/70 text-sm">{description}</p>}
        </>
      )}
    </div>
  )
  
  if (!animate) {
    return (
      <div className={className} {...props}>
        {cardContent}
      </div>
    )
  }
  
  return (
    <MotionDiv
      className={className}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      {...motionProps}
      {...props}
    >
      {cardContent}
    </MotionDiv>
  )
}

export default StatCard
