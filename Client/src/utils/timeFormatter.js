/**
 * Time Formatter Utilities
 * 
 * Reusable time formatting functions for consistent time presentation
 */

/**
 * Format relative time (e.g., "2 hours ago")
 */
export const formatRelativeTime = (date, locale = 'en-US') => {
  if (!date) return 'N/A'
  
  const now = new Date()
  const targetDate = new Date(date)
  const diffInSeconds = Math.floor((now - targetDate) / 1000)

  if (diffInSeconds < 60) return 'just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`
  if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} months ago`
  return `${Math.floor(diffInSeconds / 31536000)} years ago`
}

export default {
  formatRelativeTime
}
