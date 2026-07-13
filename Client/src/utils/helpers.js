/**
 * Helper Utilities
 * 
 * Reusable helper functions for common operations
 */

/**
 * Deep clone an object
 */
export const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj
  if (obj instanceof Date) return new Date(obj.getTime())
  if (obj instanceof Array) return obj.map(item => deepClone(item))
  if (typeof obj === 'object') {
    const cloned = {}
    Object.keys(obj).forEach(key => {
      cloned[key] = deepClone(obj[key])
    })
    return cloned
  }
  return obj
}

/**
 * Deep merge objects
 */
export const deepMerge = (target, ...sources) => {
  if (!sources.length) return target
  const source = sources.shift()

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} })
        deepMerge(target[key], source[key])
      } else {
        Object.assign(target, { [key]: source[key] })
      }
    }
  }

  return deepMerge(target, ...sources)
}

/**
 * Check if value is an object
 */
export const isObject = (item) => {
  return item && typeof item === 'object' && !Array.isArray(item)
}

/**
 * Generate unique ID
 */
export const generateId = (prefix = '', length = 8) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return prefix ? `${prefix}_${result}` : result
}

/**
 * Debounce function
 */
export const debounce = (func, wait, immediate = false) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      timeout = null
      if (!immediate) func(...args)
    }
    const callNow = immediate && !timeout
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
    if (callNow) func(...args)
  }
}

/**
 * Throttle function
 */
export const throttle = (func, limit) => {
  let inThrottle
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

/**
 * Retry function with exponential backoff
 */
export const retry = async (fn, maxAttempts = 3, delay = 1000) => {
  let lastError
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error
      if (attempt === maxAttempts) break
      
      const waitTime = delay * Math.pow(2, attempt - 1)
      await new Promise(resolve => setTimeout(resolve, waitTime))
    }
  }
  
  throw lastError
}

/**
 * Group array of objects by key
 */
export const groupBy = (array, key) => {
  return array.reduce((groups, item) => {
    const group = item[key]
    groups[group] = groups[group] || []
    groups[group].push(item)
    return groups
  }, {})
}

/**
 * Sort array of objects by key
 */
export const sortBy = (array, key, direction = 'asc') => {
  return [...array].sort((a, b) => {
    const aVal = a[key]
    const bVal = b[key]
    
    if (aVal < bVal) return direction === 'asc' ? -1 : 1
    if (aVal > bVal) return direction === 'asc' ? 1 : -1
    return 0
  })
}

/**
 * Filter array of objects by multiple criteria
 */
export const filterBy = (array, criteria) => {
  return array.filter(item => {
    return Object.entries(criteria).every(([key, value]) => {
      if (typeof value === 'function') {
        return value(item[key])
      }
      return item[key] === value
    })
  })
}

/**
 * Paginate array
 */
export const paginate = (array, page = 1, pageSize = 10) => {
  const startIndex = (page - 1) * pageSize
  const endIndex = startIndex + pageSize
  return {
    data: array.slice(startIndex, endIndex),
    currentPage: page,
    totalPages: Math.ceil(array.length / pageSize),
    totalItems: array.length,
    hasNext: endIndex < array.length,
    hasPrev: page > 1
  }
}

/**
 * Search array of objects
 */
export const search = (array, searchTerm, searchFields = []) => {
  if (!searchTerm) return array
  
  const term = searchTerm.toLowerCase()
  
  return array.filter(item => {
    if (searchFields.length === 0) {
      // Search all string fields
      return Object.values(item).some(value => 
        typeof value === 'string' && value.toLowerCase().includes(term)
      )
    }
    
    return searchFields.some(field => {
      const value = item[field]
      return typeof value === 'string' && value.toLowerCase().includes(term)
    })
  })
}

/**
 * Create array with range
 */
export const range = (start, end, step = 1) => {
  const result = []
  for (let i = start; i < end; i += step) {
    result.push(i)
  }
  return result
}

/**
 * Pick specific keys from object
 */
export const pick = (obj, keys) => {
  return keys.reduce((result, key) => {
    if (key in obj) {
      result[key] = obj[key]
    }
    return result
  }, {})
}

/**
 * Omit specific keys from object
 */
export const omit = (obj, keys) => {
  const result = { ...obj }
  keys.forEach(key => delete result[key])
  return result
}

/**
 * Convert object to query string
 */
export const toQueryString = (params) => {
  return Object.entries(params)
    .filter(([_, value]) => value !== undefined && value !== null)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&')
}

/**
 * Parse query string to object
 */
export const parseQueryString = (queryString) => {
  const params = new URLSearchParams(queryString)
  const result = {}
  
  for (const [key, value] of params) {
    result[key] = value
  }
  
  return result
}

/**
 * Check if element is in viewport
 */
export const isInViewport = (element) => {
  const rect = element.getBoundingClientRect()
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  )
}

/**
 * Get scroll position
 */
export const getScrollPosition = () => {
  return {
    x: window.pageXOffset || document.documentElement.scrollLeft,
    y: window.pageYOffset || document.documentElement.scrollTop
  }
}

/**
 * Smooth scroll to element
 */
export const scrollToElement = (element, offset = 0) => {
  const top = element.offsetTop - offset
  window.scrollTo({
    top,
    behavior: 'smooth'
  })
}

/**
 * Copy text to clipboard
 */
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (err) {
    // Fallback for older browsers
    const textArea = document.createElement('textarea')
    textArea.value = text
    textArea.style.position = 'fixed'
    textArea.style.opacity = '0'
    document.body.appendChild(textArea)
    textArea.select()
    
    try {
      document.execCommand('copy')
      document.body.removeChild(textArea)
      return true
    } catch (fallbackErr) {
      document.body.removeChild(textArea)
      return false
    }
  }
}

/**
 * Download file from URL
 */
export const downloadFile = (url, filename) => {
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

/**
 * Get file extension from filename
 */
export const getFileExtension = (filename) => {
  return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2)
}

/**
 * Convert bytes to human readable format
 */
export const bytesToHuman = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
}

export default {
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
}
