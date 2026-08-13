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
 * @param {number} props.rank - Ranking position (1, 2, 3, etc.)
 * @param {number} props.delay - Animation delay in seconds (default: 0)
 */
const PerformerCard = ({
  avatarGradient,
  avatar,
  name,
  leads = 0,
  conversions = 0,
  conversionRate = 0,
  earnings = '₹0',
  trend = 'up',
  rank = 0,
  delay = 0,
}) => {
  const MotionDiv = motion.div
  const TrendIcon = trend === 'up' ? ArrowUp : ArrowDown

  // Singular/plural helpers
  const leadsLabel = leads === 1 ? 'lead' : 'leads'
  const convertedLabel = conversions === 1 ? 'converted' : 'converted'

  // Handle zero leads case for conversion rate
  const displayRate = leads > 0 ? conversionRate : 0

  return (
    <MotionDiv
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.3 }}
      className="flex items-center space-x-4 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
    >
      {/* Ranking Indicator */}
      {rank > 0 && (
        <div className="w-6 h-6 flex items-center justify-center">
          <span className="text-muted-foreground text-xs font-semibold">#{rank}</span>
        </div>
      )}

      {/* Avatar */}
      <div className={`w-12 h-12 bg-gradient-to-br ${avatarGradient} rounded-full flex items-center justify-center flex-shrink-0`}>
        <span className="text-white font-bold text-sm">{avatar}</span>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-foreground font-medium truncate">{name}</p>
        <div className="flex items-center space-x-3 mt-1 text-xs">
          <span className="text-muted-foreground">{leads} {leadsLabel}</span>
          <span className="text-muted-foreground">•</span>
          <span className={conversions > 0 ? 'text-green-400' : 'text-muted-foreground'}>{conversions} {convertedLabel}</span>
          <span className="text-muted-foreground">•</span>
          <span className={displayRate > 0 ? 'text-blue-400' : 'text-muted-foreground'}>{displayRate}% rate</span>
        </div>
      </div>

      {/* Earnings and Trend */}
      <div className="text-right flex-shrink-0">
        <p className="text-green-400 font-semibold">{earnings}</p>
        <p className="text-muted-foreground text-xs">Incentive</p>
      </div>
    </MotionDiv>
  )
}

export default PerformerCard
