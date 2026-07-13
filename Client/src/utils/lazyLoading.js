/**
 * Lazy Loading Utilities
 * 
 * Utilities for code splitting, lazy loading, and performance optimization
 */

import React, { Suspense, lazy } from 'react'

/**
 * Loading fallback component
 */
const DefaultLoadingFallback = () => (
  <div className="flex items-center justify-center min-h-[200px]">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
  </div>
)

/**
 * Error fallback component
 */
const DefaultErrorFallback = ({ error, reset }) => (
  <div className="flex flex-col items-center justify-center min-h-[200px] p-4">
    <div className="text-red-400 mb-2">Failed to load component</div>
    <button 
      onClick={reset}
      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
    >
      Retry
    </button>
  </div>
)

/**
 * Create lazy loaded component with error boundary
 */
export const createLazyComponent = (
  importFunc,
  options = {}
) => {
  const {
    fallback = <DefaultLoadingFallback />,
    errorFallback = DefaultErrorFallback,
    retryLimit = 3
  } = options

  const LazyComponent = lazy(() => {
    return importFunc().catch(error => {
      console.error('Lazy loading failed:', error)
      // Return a module with a default error component
      return {
        default: () => errorFallback({ error, reset: () => window.location.reload() })
      }
    })
  })

  return (props) => (
    <Suspense fallback={fallback}>
      <LazyComponent {...props} />
    </Suspense>
  )
}

/**
 * Preload component
 */
export const preloadComponent = (importFunc) => {
  return importFunc()
}

/**
 * Lazy load with intersection observer
 */
export const createIntersectionLazyComponent = (
  importFunc,
  options = {}
) => {
  const {
    root = null,
    rootMargin = '50px',
    threshold = 0.1,
    fallback = <DefaultLoadingFallback />
  } = options

  return React.forwardRef((props, ref) => {
    const [Component, setComponent] = React.useState(null)
    const [error, setError] = React.useState(null)
    const elementRef = React.useRef()

    React.useEffect(() => {
      const element = elementRef.current
      if (!element) return

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              loadComponent()
              observer.unobserve(element)
            }
          })
        },
        { root, rootMargin, threshold }
      )

      observer.observe(element)
      return () => observer.unobserve(element)
    }, [root, rootMargin, threshold])

    const loadComponent = async () => {
      try {
        const module = await importFunc()
        setComponent(() => module.default)
      } catch (err) {
        console.error('Intersection lazy loading failed:', err)
        setError(err)
      }
    }

    if (Component) {
      return <Component {...props} ref={ref} />
    }

    if (error) {
      return <DefaultErrorFallback error={error} reset={() => setError(null)} />
    }

    return <div ref={elementRef}>{fallback}</div>
  })
}

/**
 * Lazy load images with intersection observer
 */
export const LazyImage = ({ 
  src, 
  alt, 
  placeholder = '/placeholder.jpg',
  className = '',
  onLoad,
  onError,
  ...props 
}) => {
  const [imageSrc, setImageSrc] = React.useState(placeholder)
  const [imageRef, setImageRef] = React.useState()

  React.useEffect(() => {
    if (!imageRef) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = new Image()
            img.src = src
            
            img.onload = () => {
              setImageSrc(src)
              onLoad?.()
            }
            
            img.onerror = () => {
              onError?.()
            }
            
            observer.unobserve(imageRef)
          }
        })
      },
      { threshold: 0.1 }
    )

    observer.observe(imageRef)
    return () => observer.unobserve(imageRef)
  }, [imageRef, src, onLoad, onError])

  return (
    <img
      {...props}
      ref={setImageRef}
      src={imageSrc}
      alt={alt}
      className={className}
    />
  )
}

/**
 * Virtual scrolling for large lists
 */
export const useVirtualScroll = ({
  items,
  itemHeight,
  containerHeight,
  overscan = 5
}) => {
  const [scrollTop, setScrollTop] = React.useState(0)

  const visibleItems = React.useMemo(() => {
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan)
    const endIndex = Math.min(
      items.length - 1,
      Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
    )

    return items.slice(startIndex, endIndex + 1).map((item, index) => ({
      item,
      index: startIndex + index
    }))
  }, [items, itemHeight, containerHeight, scrollTop, overscan])

  const totalHeight = items.length * itemHeight

  const handleScroll = React.useCallback((e) => {
    setScrollTop(e.target.scrollTop)
  }, [])

  return {
    visibleItems,
    totalHeight,
    handleScroll
  }
}

/**
 * Infinite scroll hook
 */
export const useInfiniteScroll = ({
  fetchMore,
  hasMore,
  threshold = 100
}) => {
  const [loading, setLoading] = React.useState(false)
  const containerRef = React.useRef()

  React.useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleScroll = () => {
      if (loading || !hasMore) return

      const { scrollTop, scrollHeight, clientHeight } = container
      const distanceFromBottom = scrollHeight - scrollTop - clientHeight

      if (distanceFromBottom <= threshold) {
        setLoading(true)
        fetchMore().finally(() => setLoading(false))
      }
    }

    container.addEventListener('scroll', handleScroll)
    return () => container.removeEventListener('scroll', handleScroll)
  }, [fetchMore, hasMore, loading, threshold])

  return {
    containerRef,
    loading
  }
}

/**
 * Preload critical resources
 */
export const preloadResources = (resources) => {
  resources.forEach(resource => {
    if (resource.type === 'image') {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.as = 'image'
      link.href = resource.url
      document.head.appendChild(link)
    } else if (resource.type === 'script') {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.as = 'script'
      link.href = resource.url
      document.head.appendChild(link)
    } else if (resource.type === 'style') {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.as = 'style'
      link.href = resource.url
      document.head.appendChild(link)
    }
  })
}

/**
 * Route-based code splitting
 */
export const createLazyRoute = (path, importFunc, options = {}) => {
  const Component = createLazyComponent(importFunc, options)
  
  return {
    path,
    element: <Component />
  }
}

/**
 * Progressive image loading
 */
export const ProgressiveImage = ({ 
  src, 
  placeholder, 
  alt, 
  className = '',
  ...props 
}) => {
  const [imgSrc, setImgSrc] = React.useState(placeholder)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const img = new Image()
    img.src = src
    
    img.onload = () => {
      setImgSrc(src)
      setLoading(false)
    }
  }, [src])

  return (
    <div className={`relative ${className}`}>
      <img
        {...props}
        src={imgSrc}
        alt={alt}
        className={`transition-opacity duration-300 ${loading ? 'opacity-50' : 'opacity-100'}`}
      />
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
        </div>
      )}
    </div>
  )
}

export default {
  createLazyComponent,
  preloadComponent,
  createIntersectionLazyComponent,
  LazyImage,
  useVirtualScroll,
  useInfiniteScroll,
  preloadResources,
  createLazyRoute,
  ProgressiveImage
}
