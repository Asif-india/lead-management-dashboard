/**
 * Utils Index
 * 
 * Centralized export of all utility functions for clean imports
 */

// Export from specialized utility modules
export * from './formatters'
export * from './validators'
export * from './helpers'

// Named exports for better tree shaking
export {
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
} from './formatters'

export {
  isValidEmail,
  isValidPhone,
  isValidUrl,
  isValidPassword,
  isValidName,
  isValidAlphanumeric,
  isRequired,
  isValidLength,
  isValidRange,
  isValidDate,
  isValidAge,
  isValidFileType,
  isValidFileSize,
  isValidCreditCard,
  isValidIP,
  isValidHexColor,
  isValidSSN,
  createValidator,
  validateFields
} from './validators'

export {
  deepClone,
  deepMerge,
  isObject,
  generateId,
  debounce,
  throttle,
  retry,
  groupBy,
  sortBy,
  filterBy,
  paginate,
  search,
  range,
  pick,
  omit,
  toQueryString,
  parseQueryString,
  isInViewport,
  getScrollPosition,
  scrollToElement,
  copyToClipboard,
  downloadFile,
  getFileExtension,
  bytesToHuman
} from './helpers'

// Legacy exports for backward compatibility
export { capitalize, truncate, slugify, getInitials, getRandomColor, calculateReadingTime } from './helpers'
export { localstorage, sessionstorage } from './helpers'
