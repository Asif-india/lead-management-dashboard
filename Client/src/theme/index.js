/**
 * MUI Theme Configuration
 * 
 * Creates and configures the MUI theme based on the current mode (light/dark).
 * This module is separated from main.jsx to follow clean architecture principles.
 * 
 * @module theme/index
 */

import { createTheme, responsiveFontSizes } from '@mui/material/styles'

/**
 * Creates MUI theme based on current mode
 * 
 * @param {string} mode - Theme mode ('light' or 'dark')
 * @returns {Object} MUI theme object
 */
export const getTheme = (mode = 'dark') => {
  const isDark = mode === 'dark'
  
  let theme = createTheme({
    palette: {
      mode: isDark ? 'dark' : 'light',
      primary: {
        main: isDark ? '#60a5fa' : '#3b82f6',
        light: isDark ? '#93c5fd' : '#60a5fa',
        dark: isDark ? '#3b82f6' : '#2563eb',
        contrastText: '#ffffff',
      },
      secondary: {
        main: isDark ? '#94a3b8' : '#64748b',
        light: isDark ? '#cbd5e1' : '#94a3b8',
        dark: isDark ? '#64748b' : '#475569',
        contrastText: isDark ? '#ffffff' : '#ffffff',
      },
      background: {
        default: isDark ? '#0f172a' : '#f8fafc',
        paper: isDark ? '#1e293b' : '#ffffff',
      },
      text: {
        primary: isDark ? '#f8fafc' : '#0f172a',
        secondary: isDark ? '#cbd5e1' : '#64748b',
      },
      divider: isDark ? 'rgba(71, 85, 105, 0.5)' : 'rgba(226, 232, 240, 0.8)',
      error: {
        main: '#ef4444',
      },
      warning: {
        main: '#f59e0b',
      },
      success: {
        main: '#22c55e',
      },
      info: {
        main: '#3b82f6',
      },
    },
    typography: {
      fontFamily: '"Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", sans-serif',
      h1: {
        fontWeight: 700,
      },
      h2: {
        fontWeight: 600,
      },
      h3: {
        fontWeight: 600,
      },
      h4: {
        fontWeight: 600,
      },
      h5: {
        fontWeight: 600,
      },
      h6: {
        fontWeight: 600,
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            borderRadius: '0.5rem',
            fontWeight: 500,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: '0.75rem',
            boxShadow: isDark 
              ? '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.15)'
              : '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.06)',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: '0.5rem',
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: '0.375rem',
          },
        },
      },
    },
  })
  
  return responsiveFontSizes(theme)
}

export default getTheme
