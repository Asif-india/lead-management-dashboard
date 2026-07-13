/**
 * Performance Utilities
 * 
 * Utilities for monitoring and optimizing application performance
 */

/**
 * Performance monitoring class
 */
export class PerformanceMonitor {
  constructor() {
    this.metrics = new Map()
    this.observers = new Set()
    this.isSupported = 'performance' in window && 'measure' in window.performance
  }

  /**
   * Start timing a performance mark
   */
  startMark(name) {
    if (!this.isSupported) return
    
    try {
      performance.mark(`${name}-start`)
    } catch (error) {
      console.warn(`Performance mark start failed: ${name}`, error)
    }
  }

  /**
   * End timing a performance mark
   */
  endMark(name) {
    if (!this.isSupported) return null
    
    try {
      performance.mark(`${name}-end`)
      performance.measure(name, `${name}-start`, `${name}-end`)
      
      const measure = performance.getEntriesByName(name, 'measure')[0]
      const duration = measure.duration
      
      this.metrics.set(name, {
        duration,
        timestamp: Date.now()
      })
      
      // Clean up marks
      performance.clearMarks(`${name}-start`)
      performance.clearMarks(`${name}-end`)
      performance.clearMeasures(name)
      
      return duration
    } catch (error) {
      console.warn(`Performance mark end failed: ${name}`, error)
      return null
    }
  }

  /**
   * Get performance metrics
   */
  getMetrics() {
    return Object.fromEntries(this.metrics)
  }

  /**
   * Clear all metrics
   */
  clearMetrics() {
    this.metrics.clear()
  }

  /**
   * Monitor component render performance
   */
  measureComponentRender(componentName, renderFunction) {
    this.startMark(`${componentName}-render`)
    const result = renderFunction()
    const duration = this.endMark(`${componentName}-render`)
    
    if (duration > 16) { // More than one frame
      console.warn(`Slow render detected: ${componentName} took ${duration.toFixed(2)}ms`)
    }
    
    return result
  }

  /**
   * Monitor API call performance
   */
  async measureApiCall(apiName, apiFunction) {
    this.startMark(`${apiName}-api`)
    
    try {
      const result = await apiFunction()
      const duration = this.endMark(`${apiName}-api`)
      
      if (duration > 1000) { // More than 1 second
        console.warn(`Slow API call: ${apiName} took ${duration.toFixed(2)}ms`)
      }
      
      return result
    } catch (error) {
      this.endMark(`${apiName}-api`)
      throw error
    }
  }
}

/**
 * Create a performance monitor instance
 */
export const performanceMonitor = new PerformanceMonitor()

/**
 * Higher-order component for performance monitoring
 */
export const withPerformanceMonitoring = (WrappedComponent, componentName) => {
  const MonitoredComponent = (props) => {
    performanceMonitor.startMark(`${componentName}-render`)
    
    // Use useEffect to measure render completion
    React.useEffect(() => {
      const duration = performanceMonitor.endMark(`${componentName}-render`)
      
      if (duration > 16) {
        console.warn(`Component render warning: ${componentName} took ${duration.toFixed(2)}ms`)
      }
    })
    
    return <WrappedComponent {...props} />
  }
  
  MonitoredComponent.displayName = `withPerformanceMonitoring(${componentName})`
  return MonitoredComponent
}

/**
 * Debounced function for performance optimization
 */
export const createDebouncedCallback = (callback, delay = 300) => {
  let timeoutId = null
  
  return (...args) => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    
    timeoutId = setTimeout(() => {
      callback(...args)
      timeoutId = null
    }, delay)
  }
}

/**
 * Throttled function for performance optimization
 */
export const createThrottledCallback = (callback, limit = 100) => {
  let inThrottle = false
  
  return (...args) => {
    if (!inThrottle) {
      callback(...args)
      inThrottle = true
      setTimeout(() => {
        inThrottle = false
      }, limit)
    }
  }
}

/**
 * Memoized component creator
 */
export const createMemoizedComponent = (component, areEqual = null) => {
  return React.memo(component, areEqual)
}

/**
 * Lazy load component with error boundary
 */
export const createLazyComponent = (importFunc, fallback = null) => {
  const LazyComponent = React.lazy(importFunc)
  
  return (props) => (
    <React.Suspense fallback={fallback || <div>Loading...</div>}>
      <LazyComponent {...props} />
    </React.Suspense>
  )
}

/**
 * Virtual scroll helper for large lists
 */
export const createVirtualScrollConfig = (itemHeight, containerHeight, overscan = 5) => {
  return {
    itemHeight,
    containerHeight,
    overscan,
    getVisibleRange: (scrollTop, totalItems) => {
      const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan)
      const endIndex = Math.min(
        totalItems - 1,
        Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
      )
      
      return { startIndex, endIndex }
    },
    getTotalHeight: (totalItems) => totalItems * itemHeight,
    getItemOffset: (index) => index * itemHeight
  }
}

/**
 * Image optimization utilities
 */
export const imageOptimizer = {
  /**
   * Generate responsive image sources
   */
  generateSrcSet: (baseUrl, widths) => {
    return widths
      .map(width => `${baseUrl}?w=${width} ${width}w`)
      .join(', ')
  },
  
  /**
   * Generate responsive image sizes
   */
  generateSizes: (breakpoints) => {
    return breakpoints
      .map(({ breakpoint, size }) => `(min-width: ${breakpoint}px) ${size}`)
      .join(', ')
  },
  
  /**
   * Lazy load image with intersection observer
   */
  createLazyImage: (src, options = {}) => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              img.src = src
              observer.disconnect()
            }
          })
        },
        { threshold: 0.1, ...options }
      )
      
      img.onload = () => resolve(img)
      img.onerror = reject
      
      // Start observing
      observer.observe(document.body)
    })
  }
}

/**
 * Bundle size analyzer
 */
export const analyzeBundleSize = () => {
  if (!window.performance || !window.performance.getEntriesByType) {
    return null
  }
  
  const resources = performance.getEntriesByType('resource')
  const jsResources = resources.filter(resource => resource.name.endsWith('.js'))
  
  const totalSize = jsResources.reduce((total, resource) => {
    return total + (resource.transferSize || 0)
  }, 0)
  
  return {
    totalSize,
    fileCount: jsResources.length,
    files: jsResources.map(resource => ({
      name: resource.name.split('/').pop(),
      size: resource.transferSize || 0,
      duration: resource.duration
    }))
  }
}

/**
 * Performance report generator
 */
export const generatePerformanceReport = () => {
  const metrics = performanceMonitor.getMetrics()
  const bundleAnalysis = analyzeBundleSize()
  
  return {
    timestamp: new Date().toISOString(),
    metrics,
    bundleAnalysis,
    recommendations: generateRecommendations(metrics, bundleAnalysis)
  }
}

/**
 * Generate performance recommendations
 */
const generateRecommendations = (metrics, bundleAnalysis) => {
  const recommendations = []
  
  // Check for slow renders
  Object.entries(metrics).forEach(([name, { duration }]) => {
    if (duration > 16) {
      recommendations.push({
        type: 'slow-render',
        component: name,
        duration,
        suggestion: 'Consider optimizing component logic or using React.memo'
      })
    }
  })
  
  // Check bundle size
  if (bundleAnalysis && bundleAnalysis.totalSize > 1024 * 1024) { // 1MB
    recommendations.push({
      type: 'large-bundle',
      size: bundleAnalysis.totalSize,
      suggestion: 'Consider code splitting and lazy loading'
    })
  }
  
  return recommendations
}

export default {
  PerformanceMonitor,
  performanceMonitor,
  withPerformanceMonitoring,
  createDebouncedCallback,
  createThrottledCallback,
  createMemoizedComponent,
  createLazyComponent,
  createVirtualScrollConfig,
  imageOptimizer,
  analyzeBundleSize,
  generatePerformanceReport
}
