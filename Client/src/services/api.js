/**
 * API Service Layer
 * 
 * Centralized API service with error handling, caching, and performance optimization
 */

import { API_ENDPOINTS, ERROR_MESSAGES, DEFAULTS } from '../constants'
import { performanceMonitor } from '../utils/performance'

/**
 * Base API configuration
 */
const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1',
  timeout: 10000,
  retryAttempts: 3,
  retryDelay: 1000
}

/**
 * Request cache for GET requests
 */
const requestCache = new Map()

/**
 * Active requests controller to prevent duplicate requests
 */
const activeRequests = new Map()

/**
 * Create abort controller for request timeout
 */
const createTimeoutController = (timeout) => {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)
  return { controller, timeoutId }
}

/**
 * Parse API response
 */
const parseResponse = async (response) => {
  const contentType = response.headers.get('content-type')
  
  if (contentType?.includes('application/json')) {
    return await response.json()
  }
  
  if (contentType?.includes('text/')) {
    return await response.text()
  }
  
  return await response.blob()
}

/**
 * Handle API errors
 */
const handleApiError = async (response, data) => {
  const error = new Error(data?.message || ERROR_MESSAGES.UNKNOWN)
  error.status = response.status
  error.code = data?.code
  error.details = data?.errors || data?.details
  
  // Log error for debugging
  console.log('BACKEND VALIDATION:', data)
  console.error('API Error:', {
    url: response.url,
    status: response.status,
    message: error.message,
    details: error.details
  })
  
  throw error
}

/**
 * Make HTTP request with retry logic
 */
const makeRequest = async (url, options = {}, retryCount = 0) => {
  const { controller, timeoutId } = createTimeoutController(API_CONFIG.timeout)
  const cacheKey = `${options.method || 'GET'}:${url}`
  
  try {
    // Check for active duplicate requests
    if (options.method === 'GET' && activeRequests.has(cacheKey)) {
      return await activeRequests.get(cacheKey)
    }
    
    // Check cache for GET requests
    if (options.method === 'GET' && !options.skipCache) {
      const cached = requestCache.get(cacheKey)
      if (cached && Date.now() - cached.timestamp < DEFAULTS.CACHE_DURATION) {
        return cached.data
      }
    }
    
    // Add Authorization header if token exists
    const token = localStorage.getItem('auth_token')
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    }
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
    
    // Create request promise
    const requestPromise = fetch(url, {
      ...options,
      signal: controller.signal,
      headers
    })
    
    // Track active request
    if (options.method === 'GET') {
      activeRequests.set(cacheKey, requestPromise)
    }
    
    const response = await requestPromise
    const data = await parseResponse(response)
    
    // Clean up
    clearTimeout(timeoutId)
    if (options.method === 'GET') {
      activeRequests.delete(cacheKey)
    }
    
    // Handle error responses
    if (!response.ok) {
      await handleApiError(response, data)
    }
    
    // Cache successful GET requests
    if (options.method === 'GET' && !options.skipCache) {
      requestCache.set(cacheKey, {
        data,
        timestamp: Date.now()
      })
    }
    
    return data
    
  } catch (error) {
    clearTimeout(timeoutId)
    activeRequests.delete(cacheKey)
    
    // Retry logic for network errors
    if (retryCount < API_CONFIG.retryAttempts && 
        (error.name === 'AbortError' || error.name === 'TypeError')) {
      console.warn(`Retrying request (${retryCount + 1}/${API_CONFIG.retryAttempts}):`, url)
      
      await new Promise(resolve => setTimeout(resolve, API_CONFIG.retryDelay * Math.pow(2, retryCount)))
      return makeRequest(url, options, retryCount + 1)
    }
    
    throw error
  }
}

/**
 * API Service Class
 */
class ApiService {
  constructor(baseURL = API_CONFIG.baseURL) {
    this.baseURL = baseURL
  }

  /**
   * Build full URL
   */
  buildUrl(endpoint, params = {}) {
    const url = new URL(this.baseURL + endpoint)
    
    // Add query parameters
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value))
      }
    })
    
    return url.toString()
  }

  /**
   * GET request
   */
  async get(endpoint, params = {}, options = {}) {
    performanceMonitor.startMark(`api-${endpoint}-get`)
    
    try {
      const url = this.buildUrl(endpoint, params)
      const data = await makeRequest(url, { method: 'GET', ...options })
      
      performanceMonitor.endMark(`api-${endpoint}-get`)
      return data
    } catch (error) {
      performanceMonitor.endMark(`api-${endpoint}-get`)
      throw error
    }
  }

  /**
   * POST request
   */
  async post(endpoint, data = {}, options = {}) {
    performanceMonitor.startMark(`api-${endpoint}-post`)
    
    try {
      const url = this.buildUrl(endpoint)
      const response = await makeRequest(url, {
        method: 'POST',
        body: JSON.stringify(data),
        ...options
      })
      
      performanceMonitor.endMark(`api-${endpoint}-post`)
      return response
    } catch (error) {
      performanceMonitor.endMark(`api-${endpoint}-post`)
      throw error
    }
  }

  /**
   * PUT request
   */
  async put(endpoint, data = {}, options = {}) {
    performanceMonitor.startMark(`api-${endpoint}-put`)
    
    try {
      const url = this.buildUrl(endpoint)
      const response = await makeRequest(url, {
        method: 'PUT',
        body: JSON.stringify(data),
        ...options
      })
      
      performanceMonitor.endMark(`api-${endpoint}-put`)
      return response
    } catch (error) {
      performanceMonitor.endMark(`api-${endpoint}-put`)
      throw error
    }
  }

  /**
   * PATCH request
   */
  async patch(endpoint, data = {}, options = {}) {
    performanceMonitor.startMark(`api-${endpoint}-patch`)
    
    try {
      const url = this.buildUrl(endpoint)
      const response = await makeRequest(url, {
        method: 'PATCH',
        body: JSON.stringify(data),
        ...options
      })
      
      performanceMonitor.endMark(`api-${endpoint}-patch`)
      return response
    } catch (error) {
      performanceMonitor.endMark(`api-${endpoint}-patch`)
      throw error
    }
  }

  /**
   * DELETE request
   */
  async delete(endpoint, options = {}) {
    performanceMonitor.startMark(`api-${endpoint}-delete`)
    
    try {
      const url = this.buildUrl(endpoint)
      const response = await makeRequest(url, {
        method: 'DELETE',
        ...options
      })
      
      performanceMonitor.endMark(`api-${endpoint}-delete`)
      return response
    } catch (error) {
      performanceMonitor.endMark(`api-${endpoint}-delete`)
      throw error
    }
  }

  /**
   * Upload file
   */
  async upload(endpoint, file, options = {}) {
    performanceMonitor.startMark(`api-${endpoint}-upload`)
    
    try {
      const formData = new FormData()
      formData.append('file', file)
      
      const url = this.buildUrl(endpoint)
      const response = await makeRequest(url, {
        method: 'POST',
        body: formData,
        headers: {}, // Let browser set content-type for FormData
        ...options
      })
      
      performanceMonitor.endMark(`api-${endpoint}-upload`)
      return response
    } catch (error) {
      performanceMonitor.endMark(`api-${endpoint}-upload`)
      throw error
    }
  }

  /**
   * Download file
   */
  async download(endpoint, filename, options = {}) {
    performanceMonitor.startMark(`api-${endpoint}-download`)
    
    try {
      const url = this.buildUrl(endpoint)
      const response = await makeRequest(url, {
        method: 'GET',
        ...options
      })
      
      // Create download link
      const blob = new Blob([response])
      const downloadUrl = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(downloadUrl)
      
      performanceMonitor.endMark(`api-${endpoint}-download`)
      return response
    } catch (error) {
      performanceMonitor.endMark(`api-${endpoint}-download`)
      throw error
    }
  }
}

/**
 * Create API service instance
 */
export const apiService = new ApiService()

/**
 * Specific API endpoints
 */
export const authApi = {
  login: (credentials) => apiService.post(API_ENDPOINTS.AUTH.LOGIN, credentials),
  logout: () => apiService.post(API_ENDPOINTS.AUTH.LOGOUT),
  refresh: () => apiService.post(API_ENDPOINTS.AUTH.REFRESH),
  getProfile: () => apiService.get(API_ENDPOINTS.AUTH.PROFILE)
}

/**
 * Format lead form data for API submission
 */
const formatLeadData = (data) => {
  return {
    employeeName: data.employeeName,
    email: data.employeeEmail,
    phone: data.employeePhone,
    employeeId: data.employeeId,
    department: data.employeeDepartment === 'Information Technology' ? 'IT' : data.employeeDepartment,
    country: data.country,
    state: data.state,
    city: data.city,
    address: data.address,
    zipCode: data.zipCode,
    studentName: data.studentName,
    course: data.course,
    university: data.collegeName,
    leadStatus: 'new',
    priority: (data.priority || 'medium').toLowerCase(),
    notes: data.notes || ''
  }
}

export const leadsApi = {
  getList: (params) => apiService.get(API_ENDPOINTS.LEADS.LIST, params),
  create: (data) => apiService.post(API_ENDPOINTS.LEADS.CREATE, formatLeadData(data)),
  update: (id, data) => apiService.put(API_ENDPOINTS.LEADS.UPDATE.replace(':id', id), data),
  delete: (id) => apiService.delete(API_ENDPOINTS.LEADS.DELETE.replace(':id', id)),
  generate: (data) => apiService.post(API_ENDPOINTS.LEADS.GENERATE, data)
}

export const analyticsApi = {
  getDashboard: () => apiService.get(API_ENDPOINTS.ANALYTICS.DASHBOARD),
  getTrends: (params) => apiService.get(API_ENDPOINTS.ANALYTICS.TRENDS, params),
  getReports: (params) => apiService.get(API_ENDPOINTS.ANALYTICS.REPORTS, params)
}

export const usersApi = {
  getList: (params) => apiService.get(API_ENDPOINTS.USERS.LIST, params),
  getProfile: () => apiService.get(API_ENDPOINTS.USERS.PROFILE),
  updateSettings: (data) => apiService.put(API_ENDPOINTS.USERS.SETTINGS, data)
}

/**
 * Clear request cache
 */
export const clearCache = () => {
  requestCache.clear()
}

/**
 * Clear specific cache entry
 */
export const clearCacheEntry = (endpoint, method = 'GET') => {
  const cacheKey = `${method}:${endpoint}`
  requestCache.delete(cacheKey)
}

export default {
  ApiService,
  apiService,
  authApi,
  leadsApi,
  analyticsApi,
  usersApi,
  clearCache,
  clearCacheEntry
}
