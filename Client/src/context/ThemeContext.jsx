/**
 * ThemeContext
 * 
 * Single source of truth for theme state management.
 * Provides theme state, localStorage persistence, system preference detection,
 * and HTML class toggling for Tailwind CSS.
 * 
 * @module context/ThemeContext
 */

import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react'
import { THEMES, STORAGE_KEYS, DEFAULTS } from '../constants'

const ThemeContext = createContext(null)

/**
 * ThemeProvider Component
 * 
 * Manages all theme state and provides it to the application via Context.
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @returns {JSX.Element} ThemeProvider with children
 */
export const ThemeProvider = ({ children }) => {
  // Theme state
  const [theme, setThemeState] = useState(() => {
    // Initialize from localStorage or default (SSR-safe)
    if (typeof window !== 'undefined') {
      const storedTheme = localStorage.getItem(STORAGE_KEYS.THEME)
      return storedTheme || DEFAULTS.THEME
    }
    return DEFAULTS.THEME
  })
  const [systemTheme, setSystemTheme] = useState(DEFAULTS.THEME)

  // Detect system theme preference
  useEffect(() => {
    if (typeof window === 'undefined') return
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    const handleChange = (e) => {
      setSystemTheme(e.matches ? THEMES.DARK : THEMES.LIGHT)
    }

    // Initial detection
    handleChange(mediaQuery)

    // Listen for changes
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  // Persist theme to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.THEME, theme)
    }
  }, [theme])

  // Compute effective theme
  const effectiveTheme = theme === THEMES.SYSTEM ? systemTheme : theme

  // Apply theme to document (for Tailwind CSS)
  useEffect(() => {
    const root = document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add(effectiveTheme)
  }, [effectiveTheme])

  // Set theme with persistence
  const setTheme = useCallback((newTheme) => {
    setThemeState(newTheme)
  }, [])

  // Toggle between light and dark
  const toggleTheme = useCallback(() => {
    setThemeState(currentTheme =>
      currentTheme === THEMES.DARK ? THEMES.LIGHT : THEMES.DARK
    )
  }, [])

  // Cycle through all themes
  const cycleTheme = useCallback(() => {
    setThemeState(currentTheme => {
      const themes = [THEMES.LIGHT, THEMES.DARK, THEMES.SYSTEM]
      const currentIndex = themes.indexOf(currentTheme)
      return themes[(currentIndex + 1) % themes.length]
    })
  }, [])

  // Memoize context value to avoid unnecessary re-renders
  const value = useMemo(() => ({
    theme,
    systemTheme,
    effectiveTheme,
    setTheme,
    toggleTheme,
    cycleTheme,
    isDark: effectiveTheme === THEMES.DARK,
    isLight: effectiveTheme === THEMES.LIGHT,
    isSystem: theme === THEMES.SYSTEM
  }), [theme, systemTheme, effectiveTheme])

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

/**
 * useTheme Hook
 * 
 * Hook to consume theme context.
 * 
 * @returns {Object} Theme state and controls
 * @throws {Error} If used outside ThemeProvider
 */
export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

export default ThemeContext
