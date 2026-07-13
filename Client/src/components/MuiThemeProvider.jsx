import React, { useMemo } from 'react'
import { ThemeProvider as MuiThemeProviderOriginal } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { getTheme } from '../theme'
import { useTheme } from '../hooks/useTheme'

/**
 * MuiThemeProvider Component
 * 
 * Wraps MUI's ThemeProvider and consumes ThemeContext directly.
 * Recreates the MUI theme when effectiveTheme changes using useMemo.
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 */
const MuiThemeProvider = ({ children }) => {
  const { effectiveTheme } = useTheme()

  // Recreate MUI theme only when effectiveTheme changes
  const muiTheme = useMemo(() => getTheme(effectiveTheme), [effectiveTheme])

  return (
    <MuiThemeProviderOriginal theme={muiTheme}>
      <CssBaseline />
      {children}
    </MuiThemeProviderOriginal>
  )
}

export default MuiThemeProvider
