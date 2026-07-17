/**
 * AuthContext
 * 
 * Authentication state management for the application.
 * Handles user login, logout, token storage, and authentication state.
 * 
 * @module context/AuthContext
 */

import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { authApi } from '../services/api'
import { STORAGE_KEYS, ROUTES } from '../constants'

const AuthContext = createContext(null)

/**
 * AuthProvider Component
 * 
 * Manages authentication state and provides auth methods to the application.
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @returns {JSX.Element} AuthProvider with children
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Check for existing token on mount
  useEffect(() => {
    const storedToken = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)
    const storedUser = localStorage.getItem('user')

    if (storedToken) {
      setToken(storedToken)
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser))
        } catch (err) {
          console.error('Error parsing stored user:', err)
          localStorage.removeItem('user')
        }
      }
    }

    setLoading(false)
  }, [])

  /**
   * Login function
   * 
   * @param {Object} credentials - User credentials
   * @param {string} credentials.email - User email
   * @param {string} credentials.password - User password
   * @returns {Promise<Object>} Login response with token and user data
   */
  const login = useCallback(async (credentials) => {
    try {
      setError(null)

      const response = await authApi.login(credentials)

      if (response.success && response.data?.token) {
        // Store token
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.data.token)
        setToken(response.data.token)

        // Store user info
        if (response.data.user) {
          localStorage.setItem('user', JSON.stringify(response.data.user))
          setUser(response.data.user)
        }

        return {
          success: true,
          user: response.data.user
        }
      }

      throw new Error('Login failed: Invalid response from server')
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        'Login failed. Please try again.'

      setError(errorMessage)
      throw err
    }
  }, [])

  /**
   * Logout function
   * 
   * Clears authentication state and redirects to login.
   */
  const logout = useCallback(async () => {
    try {
      // Call logout API if available
      await authApi.logout()
    } catch (err) {
      console.error('Logout API call failed:', err)
      // Continue with local logout even if API call fails
    } finally {
      // Clear local storage
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN)
      localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
      localStorage.removeItem('user')

      // Clear state
      setToken(null)
      setUser(null)
      setError(null)

      // Redirect to login
      window.location.href = ROUTES.LOGIN
    }
  }, [])

  /**
   * Check if user is authenticated
   * 
   * @returns {boolean} True if user has a valid token
   */
  const isAuthenticated = useCallback(() => {
    return !!token
  }, [token])

  /**
   * Memoize context value to avoid unnecessary re-renders
   */
  const value = {
    user,
    token,
    loading,
    error,
    login,
    logout,
    isAuthenticated
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

/**
 * useAuth Hook
 * 
 * Hook to consume auth context.
 * 
 * @returns {Object} Auth state and methods
 * @throws {Error} If used outside AuthProvider
 */
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export default AuthContext
