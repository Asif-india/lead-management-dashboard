import React from 'react'
import { motion } from 'framer-motion'

/**
 * ActivityCard Component
 *
 * Extracted from SaasDashboard.jsx Recent Activity section.
 * A reusable activity item card for displaying user activities, notifications, or events.
 * Supports Framer Motion animations and semantic theme classes.
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.icon - Icon component to display
 * @param {string} props.iconColor - Icon color class (e.g., "text-green-400", "text-blue-400")
 * @param {string} props.message - Primary message or action text
 * @param {string} props.time - Time or date string (e.g., "2 minutes ago")
 * @param {string} props.value - Value to display (e.g., "$8,500", "3 leads")
 * @param {string} props.valueColor - Value color class (default: "text-success-400")
 * @param {number} props.delay - Animation delay in seconds (default: 0)
 */
const ActivityCard = ({
  icon: Icon,
  iconColor,
  message,
  time,
  value,
  valueColor = 'text-success-400',
  delay = 0,
}) => {
  const MotionDiv = motion.div

  return (
    <MotionDiv
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.3 }}
      className="flex items-start space-x-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
    >
      <div className={`p-2 rounded-lg bg-muted ${iconColor}`}>
        {Icon && <Icon className="w-4 h-4" />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-foreground text-sm font-medium">{message}</p>
        <div className="flex items-center justify-between mt-1">
          <span className="text-muted-foreground text-xs">{time}</span>
          {value && <span className={`${valueColor} text-xs font-medium`}>{value}</span>}
        </div>
      </div>
    </MotionDiv>
  )
}

export default ActivityCard
