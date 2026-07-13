/**
 * Formatter Utilities
 * 
 * Reusable formatting functions for consistent data presentation
 */

import { DATE_FORMATS } from '../constants'

/**
 * Format currency amount
 */
export const formatCurrency = (amount, currency = 'USD', locale = 'en-US') => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(amount)
}

/**
 * Format number with thousands separators
 */
export const formatNumber = (number, locale = 'en-US') => {
  return new Intl.NumberFormat(locale).format(number)
}

/**
 * Format percentage
 */
export const formatPercentage = (value, decimals = 1) => {
  return `${(value * 100).toFixed(decimals)}%`
}

/**
 * Format date
 */
export const formatDate = (date, format = DATE_FORMATS.DISPLAY, locale = 'en-US') => {
  if (!date) return 'N/A'
  
  const dateObj = new Date(date)
  if (isNaN(dateObj.getTime())) return 'Invalid Date'

  const options = {
    [DATE_FORMATS.DISPLAY]: { month: 'short', day: 'numeric', year: 'numeric' },
    [DATE_FORMATS.SHORT]: { month: '2-digit', day: '2-digit', year: 'numeric' },
    [DATE_FORMATS.LONG]: { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    },
    [DATE_FORMATS.TIME]: { hour: '2-digit', minute: '2-digit', second: '2-digit' }
  }

  return new Intl.DateTimeFormat(locale, options[format] || options[DATE_FORMATS.DISPLAY])
    .format(dateObj)
}

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

/**
 * Format file size
 */
export const formatFileSize = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

/**
 * Format phone number
 */
export const formatPhoneNumber = (phoneNumber) => {
  if (!phoneNumber) return 'N/A'
  
  const cleaned = phoneNumber.replace(/\D/g, '')
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/)
  
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`
  }
  
  return phoneNumber
}

/**
 * Format text with capitalization
 */
export const formatCapitalization = (text, type = 'sentence') => {
  if (!text || typeof text !== 'string') return text

  switch (type) {
    case 'sentence':
      return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
    case 'title':
      return text.replace(/\w\S*/g, (txt) => 
        txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
      )
    case 'upper':
      return text.toUpperCase()
    case 'lower':
      return text.toLowerCase()
    default:
      return text
  }
}

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text, maxLength, suffix = '...') => {
  if (!text || text.length <= maxLength) return text
  return text.substring(0, maxLength - suffix.length) + suffix
}

/**
 * Format list with conjunction
 */
export const formatList = (items, conjunction = 'and') => {
  if (!Array.isArray(items) || items.length === 0) return ''
  if (items.length === 1) return items[0]
  if (items.length === 2) return items.join(` ${conjunction} `)
  
  return `${items.slice(0, -1).join(', ')} ${conjunction} ${items[items.length - 1]}`
}

/**
 * Format duration in milliseconds to human readable format
 */
export const formatDuration = (milliseconds) => {
  if (!milliseconds || milliseconds < 0) return '0s'
  
  const seconds = Math.floor(milliseconds / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 0) return `${days}d ${hours % 24}h`
  if (hours > 0) return `${hours}h ${minutes % 60}m`
  if (minutes > 0) return `${minutes}m ${seconds % 60}s`
  return `${seconds}s`
}

export default {
  formatCurrency,
  formatNumber,
  formatPercentage,
  formatDate,
  formatRelativeTime,
  formatFileSize,
  formatPhoneNumber,
  formatCapitalization,
  truncateText,
  formatList,
  formatDuration
}
