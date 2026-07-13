/**
 * Error Boundary Component
 * 
 * Catches JavaScript errors in child component trees,
 * logs error information, and displays a fallback UI
 */

import React, { Component } from 'react'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null
    }
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render shows the fallback UI
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    // Log error to console in development
    console.error('Error Boundary caught an error:', error, errorInfo)
    
    // Generate unique error ID
    const errorId = `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    
    // Update state with error details
    this.setState({
      error,
      errorInfo,
      errorId
    })
    
    // Log to external service in production
    if (process.env.NODE_ENV === 'production') {
      this.logErrorToService(error, errorInfo, errorId)
    }
  }

  logErrorToService = (error, errorInfo, errorId) => {
    // Send error to logging service
    try {
      const errorData = {
        errorId,
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
        userId: this.props.userId || 'anonymous'
      }
      
      // Send to your error logging service
      fetch('/api/errors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(errorData)
      }).catch(err => {
        console.error('Failed to log error to service:', err)
      })
    } catch (err) {
      console.error('Error in error logging:', err)
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null
    })
  }

  handleGoHome = () => {
    window.location.href = '/'
  }

  render() {
    if (this.state.hasError) {
      const { fallback, showDetails = process.env.NODE_ENV === 'development' } = this.props
      
      // Custom fallback UI
      if (fallback) {
        return typeof fallback === 'function' 
          ? fallback(this.state.error, this.resetErrorBoundary)
          : fallback
      }

      // Default error UI
      return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-slate-800 rounded-2xl p-8 text-center shadow-2xl">
            {/* Error Icon */}
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-8 h-8 text-red-400" />
            </div>
            
            {/* Error Message */}
            <h1 className="text-2xl font-bold text-white mb-2">
              Something went wrong
            </h1>
            <p className="text-slate-400 mb-6">
              We're sorry, but something unexpected happened. 
              {this.props.showRetry && ' You can try refreshing the page.'}
            </p>
            
            {/* Error ID */}
            {this.state.errorId && (
              <p className="text-xs text-slate-500 mb-6">
                Error ID: {this.state.errorId}
              </p>
            )}
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {this.props.showRetry !== false && (
                <button
                  onClick={this.handleReset}
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                >
                  <RefreshCw className="w-4 h-4" />
                  Try Again
                </button>
              )}
              
              <button
                onClick={this.handleGoHome}
                className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
              >
                <Home className="w-4 h-4" />
                Go Home
              </button>
            </div>
            
            {/* Error Details (Development Only) */}
            {showDetails && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="cursor-pointer text-sm text-slate-400 hover:text-slate-300">
                  Error Details
                </summary>
                <div className="mt-3 p-3 bg-slate-900 rounded-lg text-xs font-mono text-red-400 overflow-auto max-h-40">
                  <div className="mb-2">
                    <strong>Error:</strong> {this.state.error.toString()}
                  </div>
                  {this.state.error.stack && (
                    <div className="mb-2">
                      <strong>Stack Trace:</strong>
                      <pre className="whitespace-pre-wrap">{this.state.error.stack}</pre>
                    </div>
                  )}
                  {this.state.errorInfo?.componentStack && (
                    <div>
                      <strong>Component Stack:</strong>
                      <pre className="whitespace-pre-wrap">{this.state.errorInfo.componentStack}</pre>
                    </div>
                  )}
                </div>
              </details>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

/**
 * Higher-order component for error boundary
 */
export const withErrorBoundary = (Component, fallback, options = {}) => {
  const WrappedComponent = (props) => (
    <ErrorBoundary fallback={fallback} {...options}>
      <Component {...props} />
    </ErrorBoundary>
  )
  
  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`
  return WrappedComponent
}

/**
 * Hook for error boundary integration
 */
export const useErrorHandler = () => {
  const [error, setError] = React.useState(null)
  
  const resetError = React.useCallback(() => {
    setError(null)
  }, [])
  
  const captureError = React.useCallback((error) => {
    console.error('Error captured by error handler:', error)
    setError(error)
  }, [])
  
  // Throw error to be caught by error boundary
  React.useEffect(() => {
    if (error) {
      throw error
    }
  }, [error])
  
  return { captureError, resetError }
}

export default ErrorBoundary
