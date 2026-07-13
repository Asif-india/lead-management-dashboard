import React from 'react'
import { motion } from 'framer-motion'
import { ArrowUp, ArrowDown } from 'lucide-react'

/**
 * PerformerCard Component
 *
 * Extracted from SaasDashboard.jsx Top Performers section.
 * A reusable performer card for displaying team member performance metrics.
 * Supports Framer Motion animations and semantic theme classes.
 *
 * @param {Object} props - Component props
 * @param {string} props.avatarGradient - Avatar gradient classes (e.g., "from-yellow-400 to-orange-500")
 * @param {string} props.avatar - Avatar initials (e.g., "SJ", "MK")
 * @param {string} props.name - Performer name
 * @param {number} props.leads - Number of leads
 * @param {number} props.conversions - Number of conversions
 * @param {number} props.conversionRate - Conversion rate percentage
 * @param {string} props.earnings - Earnings string (e.g., "$8,500")
 * @param {'up' | 'down'} props.trend - Performance trend direction
 * @param {number} props.delay - Animation delay in seconds (default: 0)
 */
const PerformerCard = ({
  avatarGradient,
  avatar,
  name,
  leads,
  conversions,
  conversionRate,
  earnings,
  trend,
  delay = 0,
}) => {
  const MotionDiv = motion.div
  const TrendIcon = trend === 'up' ? ArrowUp : ArrowDown

  return (
    <MotionDiv
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.3 }}
      className="flex items-center space-x-4 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
    >
      {/* Avatar */}
      <div className={`w-12 h-12 bg-gradient-to-br ${avatarGradient} rounded-full flex items-center justify-center`}>
        <span className="text-white font-bold text-sm">{avatar}</span>
      </div>

      {/* Content */}
      <div className="flex-1">
        <p className="text-foreground font-medium">{name}</p>
        <div className="flex items-center space-x-4 mt-1">
          <span className="text-muted-foreground text-xs">{leads} leads</span>
          <span className="text-green-400 text-xs">{conversions} converted</span>
          <span className="text-blue-400 text-xs">{conversionRate}% rate</span>
        </div>
      </div>

      {/* Earnings and Trend */}
      <div className="text-right">
        <p className="text-green-400 font-semibold">{earnings}</p>
        <div className={`flex items-center text-xs ${
          trend === 'up' ? 'text-green-400' : 'text-red-400'
        }`}>
          <TrendIcon className="w-3 h-3" />
        </div>
      </div>
    </MotionDiv>
  )
}

export default PerformerCard
