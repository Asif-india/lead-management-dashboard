/**
 * Centralized currency formatter for INR (Indian Rupee)
 * Uses Indian number formatting (e.g., ₹15,000, ₹1,50,000)
 * Presentation-only formatter - does NOT apply exchange rate conversion
 */

/**
 * Format a number as INR currency
 * @param {number} amount - The amount to format (numeric value from database/API)
 * @param {Object} options - Intl.NumberFormat options
 * @returns {string} Formatted currency string (e.g., ₹15,000)
 */
export const formatCurrency = (amount, options = {}) => {
  if (amount === null || amount === undefined) return '₹0'

  const defaultOptions = {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
    ...options
  }

  return new Intl.NumberFormat('en-IN', defaultOptions).format(amount)
}

/**
 * Format a number as INR with K suffix for thousands
 * @param {number} amount - The amount to format (numeric value from database/API)
 * @returns {string} Formatted currency string with K suffix (e.g., ₹15K)
 */
export const formatCurrencyCompact = (amount) => {
  if (amount === null || amount === undefined) return '₹0K'

  const inThousands = amount / 1000
  return `₹${inThousands.toFixed(1)}K`
}
