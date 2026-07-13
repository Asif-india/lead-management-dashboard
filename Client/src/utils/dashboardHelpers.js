import {
  CheckCircle,
  Users,
  Award,
  AlertCircle,
  Target,
  Activity
} from 'lucide-react'

/**
 * Dashboard Helper Functions
 *
 * Reusable helper functions for dashboard components.
 * Extracted from SaasDashboard.jsx for better architecture.
 */

/**
 * Returns the appropriate icon component for a given activity type.
 *
 * @param {string} type - The activity type identifier
 * @returns {React.Component} The icon component for the activity type
 */
export const getActivityIcon = (type) => {
  switch (type) {
    case 'lead_converted':
      return CheckCircle
    case 'new_lead':
      return Users
    case 'incentive_earned':
      return Award
    case 'lead_pending':
      return AlertCircle
    case 'milestone_reached':
      return Target
    default:
      return Activity
  }
}

/**
 * Returns the appropriate avatar gradient based on rank.
 *
 * @param {number} rank - The rank index (0-based)
 * @returns {string} The Tailwind gradient class string
 */
export const getAvatarGradient = (rank) => {
  switch (rank) {
    case 0:
      return 'from-yellow-400 to-orange-500' // Gold
    case 1:
      return 'from-gray-300 to-gray-400' // Silver
    default:
      return 'from-orange-400 to-red-500' // Bronze
  }
}
