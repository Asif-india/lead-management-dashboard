/**
 * Application Constants
 * Centralized constants for maintainability and consistency
 */

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    PROFILE: '/auth/profile'
  },
  LEADS: {
    LIST: '/leads',
    CREATE: '/leads',
    UPDATE: '/leads/:id',
    DELETE: '/leads/:id',
    GENERATE: '/leads/generate'
  },
  ANALYTICS: {
    DASHBOARD: '/api/analytics/dashboard',
    TRENDS: '/api/analytics/trends',
    REPORTS: '/api/analytics/reports'
  },
  USERS: {
    LIST: '/api/users',
    PROFILE: '/api/users/profile',
    SETTINGS: '/api/users/settings'
  }
}

// Routes
export const ROUTES = {
  DASHBOARD: '/admin/dashboard',
  LEADS: '/admin/leads',
  GENERATE_LEAD: '/admin/generate-lead',
  ANALYTICS: '/admin/analytics',
  INCENTIVES: '/admin/incentives',
  CAMPAIGNS: '/admin/campaigns',
  SETTINGS: '/admin/settings',
  PROFILE: '/admin/profile',
  LOGIN: '/login'
}

// Status Constants
export const STATUS = {
  LEAD: {
    NEW: 'new',
    CONTACTED: 'contacted',
    QUALIFIED: 'qualified',
    CONVERTED: 'converted',
    LOST: 'lost'
  },
  USER: {
    ACTIVE: 'active',
    INACTIVE: 'inactive',
    PENDING: 'pending',
    SUSPENDED: 'suspended'
  },
  CAMPAIGN: {
    DRAFT: 'draft',
    ACTIVE: 'active',
    PAUSED: 'paused',
    COMPLETED: 'completed'
  }
}

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZES: [10, 25, 50, 100],
  MAX_PAGE_SIZE: 100
}

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_PREFERENCES: 'user_preferences',
  THEME: 'theme',
  SIDEBAR_STATE: 'sidebar_state',
  LAST_VISITED: 'last_visited'
}

// Theme Constants
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system'
}

// Animation Durations (ms)
export const ANIMATION_DURATIONS = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
  EXTRA_SLOW: 1000
}

// Breakpoint Values (px)
export const BREAKPOINTS = {
  XS: 0,
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  XXL: 1536
}

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  SERVER_ERROR: 'Server error. Please try again later.',
  VALIDATION: 'Please check your input and try again.',
  UNKNOWN: 'An unexpected error occurred.'
}

// Success Messages
export const SUCCESS_MESSAGES = {
  SAVED: 'Changes saved successfully.',
  CREATED: 'Item created successfully.',
  UPDATED: 'Item updated successfully.',
  DELETED: 'Item deleted successfully.',
  COPIED: 'Copied to clipboard.',
  UPLOADED: 'File uploaded successfully.'
}

// Validation Patterns
export const VALIDATION_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^\+?[\d\s-()]+$/,
  URL: /^https?:\/\/.+/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/,
  NAME: /^[a-zA-Z\s'-]+$/,
  ALPHANUMERIC: /^[a-zA-Z0-9]+$/
}

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'MMM dd, yyyy',
  SHORT: 'MM/dd/yyyy',
  LONG: 'MMMM dd, yyyy HH:mm',
  ISO: 'yyyy-MM-dd',
  TIME: 'HH:mm:ss'
}

// File Types
export const FILE_TYPES = {
  IMAGES: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'],
  DOCUMENTS: ['pdf', 'doc', 'docx', 'txt'],
  SPREADSHEETS: ['xls', 'xlsx', 'csv'],
  PRESENTATIONS: ['ppt', 'pptx'],
  ARCHIVES: ['zip', 'rar', '7z']
}

// Export Limits
export const EXPORT_LIMITS = {
  MAX_RECORDS: 10000,
  MAX_FILE_SIZE: 50 * 1024 * 1024, // 50MB
  SUPPORTED_FORMATS: ['csv', 'xlsx', 'pdf']
}

// Notification Types
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
}

// Chart Colors
export const CHART_COLORS = {
  PRIMARY: '#3b82f6',
  SECONDARY: '#a855f7',
  SUCCESS: '#22c55e',
  WARNING: '#f59e0b',
  ERROR: '#ef4444',
  NEUTRAL: '#64748b'
}

// Default Values
export const DEFAULTS = {
  PAGE_SIZE: PAGINATION.DEFAULT_PAGE_SIZE,
  THEME: THEMES.DARK,
  ANIMATION_DURATION: ANIMATION_DURATIONS.NORMAL,
  DEBOUNCE_DELAY: 300,
  CACHE_DURATION: 5 * 60 * 1000 // 5 minutes
}

export default {
  API_ENDPOINTS,
  ROUTES,
  STATUS,
  PAGINATION,
  STORAGE_KEYS,
  THEMES,
  ANIMATION_DURATIONS,
  BREAKPOINTS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  VALIDATION_PATTERNS,
  DATE_FORMATS,
  FILE_TYPES,
  EXPORT_LIMITS,
  NOTIFICATION_TYPES,
  CHART_COLORS,
  DEFAULTS
}
