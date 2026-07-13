/**
 * Premium SaaS Design System
 * 
 * Industry-level design tokens and utilities for consistent, beautiful UI
 */

// Color Palette - Premium SaaS Theme
export const colors = {
  // Primary Brand Colors
  primary: {
    50: '#eff6ff',
    100: '#dbeafe', 
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
    950: '#172554'
  },
  
  // Secondary Accent Colors
  secondary: {
    50: '#faf5ff',
    100: '#f3e8ff',
    200: '#e9d5ff', 
    300: '#d8b4fe',
    400: '#c084fc',
    500: '#a855f7',
    600: '#9333ea',
    700: '#7c3aed',
    800: '#6b21a8',
    900: '#581c87',
    950: '#3b0764'
  },
  
  // Success Colors
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac', 
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
    950: '#052e16'
  },
  
  // Warning Colors
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
    950: '#451a03'
  },
  
  // Error Colors
  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
    950: '#450a0a'
  },
  
  // Neutral Colors - Premium Grays
  neutral: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
    950: '#020617'
  },
  
  // Dark Theme Colors
  dark: {
    bg: '#0f172a',
    bgSecondary: '#1e293b',
    bgTertiary: '#334155',
    surface: '#1e293b',
    surfaceSecondary: '#334155',
    border: '#334155',
    borderSecondary: '#475569',
    text: '#f8fafc',
    textSecondary: '#cbd5e1',
    textTertiary: '#94a3b8',
    textMuted: '#64748b'
  }
}

// Typography Scale
export const typography = {
  fontFamily: {
    sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
    mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
    display: ['Cal Sans', 'Inter', 'sans-serif']
  },
  
  fontSize: {
    xs: ['0.75rem', { lineHeight: '1rem' }],
    sm: ['0.875rem', { lineHeight: '1.25rem' }],
    base: ['1rem', { lineHeight: '1.5rem' }],
    lg: ['1.125rem', { lineHeight: '1.75rem' }],
    xl: ['1.25rem', { lineHeight: '1.75rem' }],
    '2xl': ['1.5rem', { lineHeight: '2rem' }],
    '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
    '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
    '5xl': ['3rem', { lineHeight: '1' }],
    '6xl': ['3.75rem', { lineHeight: '1' }],
    '7xl': ['4.5rem', { lineHeight: '1' }],
    '8xl': ['6rem', { lineHeight: '1' }],
    '9xl': ['8rem', { lineHeight: '1' }]
  },
  
  fontWeight: {
    thin: '100',
    extralight: '200',
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
    black: '900'
  },
  
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0em',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em'
  }
}

// Spacing System
export const spacing = {
  0: '0px',
  1: '0.25rem',   // 4px
  2: '0.5rem',    // 8px
  3: '0.75rem',   // 12px
  4: '1rem',      // 16px
  5: '1.25rem',   // 20px
  6: '1.5rem',    // 24px
  7: '1.75rem',   // 28px
  8: '2rem',      // 32px
  9: '2.25rem',   // 36px
  10: '2.5rem',   // 40px
  11: '2.75rem',  // 44px
  12: '3rem',     // 48px
  14: '3.5rem',   // 56px
  16: '4rem',     // 64px
  20: '5rem',     // 80px
  24: '6rem',     // 96px
  28: '7rem',     // 112px
  32: '8rem',     // 128px
  36: '9rem',     // 144px
  40: '10rem',    // 160px
  44: '11rem',    // 176px
  48: '12rem',    // 192px
  52: '13rem',    // 208px
  56: '14rem',    // 224px
  60: '15rem',    // 240px
  64: '16rem',    // 256px
  72: '18rem',    // 288px
  80: '20rem',    // 320px
  96: '24rem'     // 384px
}

// Shadow System - Premium Shadows
export const shadows = {
  xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  base: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  md: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  lg: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  xl: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  '2xl': '0 50px 100px -20px rgba(0, 0, 0, 0.25)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
  
  // Colored Shadows
  primary: '0 10px 25px -3px rgba(59, 130, 246, 0.25)',
  secondary: '0 10px 25px -3px rgba(168, 85, 247, 0.25)',
  success: '0 10px 25px -3px rgba(34, 197, 94, 0.25)',
  warning: '0 10px 25px -3px rgba(245, 158, 11, 0.25)',
  error: '0 10px 25px -3px rgba(239, 68, 68, 0.25)',
  
  // Glow Effects
  glow: {
    primary: '0 0 20px rgba(59, 130, 246, 0.5)',
    secondary: '0 0 20px rgba(168, 85, 247, 0.5)',
    success: '0 0 20px rgba(34, 197, 94, 0.5)',
    warning: '0 0 20px rgba(245, 158, 11, 0.5)',
    error: '0 0 20px rgba(239, 68, 68, 0.5)'
  }
}

// Border Radius
export const borderRadius = {
  none: '0',
  sm: '0.125rem',    // 2px
  base: '0.25rem',   // 4px
  md: '0.375rem',    // 6px
  lg: '0.5rem',      // 8px
  xl: '0.75rem',     // 12px
  '2xl': '1rem',     // 16px
  '3xl': '1.5rem',   // 24px
  full: '9999px'
}

// Animation & Transitions
export const animation = {
  duration: {
    75: '75ms',
    100: '100ms',
    150: '150ms',
    200: '200ms',
    300: '300ms',
    500: '500ms',
    700: '700ms',
    1000: '1000ms'
  },
  
  ease: {
    linear: 'linear',
    in: 'cubic-bezier(0.4, 0, 1, 1)',
    out: 'cubic-bezier(0, 0, 0.2, 1)',
    'in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
    // Premium easing curves
    smooth: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    bouncy: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    sharp: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
  }
}

// Component Sizes
export const sizes = {
  container: {
    xs: '20rem',
    sm: '24rem',
    md: '28rem',
    lg: '32rem',
    xl: '36rem',
    '2xl': '42rem',
    '3xl': '48rem',
    '4xl': '56rem',
    '5xl': '64rem',
    '6xl': '72rem',
    '7xl': '80rem'
  },
  
  button: {
    xs: { height: '1.5rem', padding: '0 0.75rem', fontSize: '0.75rem' },
    sm: { height: '2rem', padding: '0 1rem', fontSize: '0.875rem' },
    md: { height: '2.5rem', padding: '0 1.5rem', fontSize: '0.875rem' },
    lg: { height: '3rem', padding: '0 2rem', fontSize: '1rem' },
    xl: { height: '3.5rem', padding: '0 2.5rem', fontSize: '1.125rem' }
  },
  
  input: {
    xs: { height: '1.5rem', padding: '0 0.5rem', fontSize: '0.75rem' },
    sm: { height: '2rem', padding: '0 0.75rem', fontSize: '0.875rem' },
    md: { height: '2.5rem', padding: '0 1rem', fontSize: '0.875rem' },
    lg: { height: '3rem', padding: '0 1.25rem', fontSize: '1rem' },
    xl: { height: '3.5rem', padding: '0 1.5rem', fontSize: '1.125rem' }
  }
}

// Z-Index Scale
export const zIndex = {
  hide: -1,
  auto: 'auto',
  base: 0,
  docked: 10,
  dropdown: 1000,
  sticky: 1100,
  banner: 1200,
  overlay: 1300,
  modal: 1400,
  popover: 1500,
  skipLink: 1600,
  toast: 1700,
  tooltip: 1800
}

// Breakpoints
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px'
}

// Utility Classes Generator
export const generateUtilityClasses = () => {
  return {
    // Background utilities
    bg: Object.keys(colors).reduce((acc, key) => {
      if (typeof colors[key] === 'object') {
        Object.keys(colors[key]).forEach(shade => {
          acc[`bg-${key}-${shade}`] = { backgroundColor: colors[key][shade] }
        })
      } else {
        acc[`bg-${key}`] = { backgroundColor: colors[key] }
      }
      return acc
    }, {}),
    
    // Text color utilities
    text: Object.keys(colors).reduce((acc, key) => {
      if (typeof colors[key] === 'object') {
        Object.keys(colors[key]).forEach(shade => {
          acc[`text-${key}-${shade}`] = { color: colors[key][shade] }
        })
      } else {
        acc[`text-${key}`] = { color: colors[key] }
      }
      return acc
    }, {}),
    
    // Shadow utilities
    shadow: Object.keys(shadows).reduce((acc, key) => {
      acc[`shadow-${key}`] = { boxShadow: shadows[key] }
      return acc
    }, {})
  }
}

export default {
  colors,
  typography,
  spacing,
  shadows,
  borderRadius,
  animation,
  sizes,
  zIndex,
  breakpoints,
  generateUtilityClasses
}
