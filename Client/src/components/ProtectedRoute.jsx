/**
 * ProtectedRoute Component
 * 
 * Route wrapper that checks authentication status before rendering children.
 * Redirects to login page if user is not authenticated.
 * 
 * @module components/ProtectedRoute
 */

import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { ROUTES } from '../constants'
import { Loader2 } from 'lucide-react'

/**
 * ProtectedRoute Component
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render if authenticated
 * @returns {JSX.Element} Protected route with authentication check
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth()
  const location = useLocation()

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="w-8 h-8 text-muted-foreground animate-spin" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated()) {
    // Save the attempted location for redirect after login
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />
  }

  // Render children if authenticated
  return children
}

export default ProtectedRoute
