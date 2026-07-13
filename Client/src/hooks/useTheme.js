/**
 * useTheme Hook
 * 
 * A thin wrapper around ThemeContext that provides theme state and controls.
 * All theme logic is centralized in ThemeContext.
 * 
 * @returns {Object} - Theme state and controls from ThemeContext
 */

import { useTheme as useThemeContext } from '../context/ThemeContext'

export const useTheme = () => {
  return useThemeContext()
}

export default useTheme
