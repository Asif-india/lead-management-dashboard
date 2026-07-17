/**
 * Form Styles Constants
 *
 * Reusable MUI sx props for form components.
 * Uses semantic CSS variables for theme-aware styling.
 */

/**
 * TextField sx props - premium glassmorphism styling
 */
export const textFieldSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    backgroundColor: 'hsla(var(--card), 0.5)',
    transition: 'all 0.2s ease-in-out',
    '& fieldset': { 
      borderColor: 'hsl(var(--border))',
      borderWidth: '1.5px'
    },
    '&:hover fieldset': { 
      borderColor: 'hsl(var(--ring))',
      borderWidth: '2px'
    },
    '&.Mui-focused fieldset': { 
      borderColor: '#3b82f6',
      borderWidth: '2px',
      boxShadow: '0 0 0 4px rgba(59, 130, 246, 0.1)'
    },
    '&.Mui-disabled': {
      backgroundColor: 'hsl(var(--muted))',
      opacity: 0.7
    }
  },
  '& .MuiInputLabel-root': { 
    color: 'hsl(var(--muted-foreground))',
    fontWeight: 500,
    '&.Mui-focused': { color: '#3b82f6' }
  },
  '& .MuiInputBase-input': { 
    color: 'hsl(var(--foreground))',
    fontSize: '0.95rem',
    padding: '12px 14px'
  },
  '& .MuiFormHelperText-root': {
    marginLeft: 0,
    marginTop: '6px',
    fontSize: '0.85rem'
  }
}

/**
 * Select sx props - premium glassmorphism styling
 */
export const selectSx = {
  borderRadius: '12px',
  backgroundColor: 'hsla(var(--card), 0.5)',
  transition: 'all 0.2s ease-in-out',
  '& .MuiOutlinedInput-notchedOutline': { 
    borderColor: 'hsl(var(--border))',
    borderWidth: '1.5px'
  },
  '&:hover .MuiOutlinedInput-notchedOutline': { 
    borderColor: 'hsl(var(--ring))',
    borderWidth: '2px'
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { 
    borderColor: '#3b82f6',
    borderWidth: '2px',
    boxShadow: '0 0 0 4px rgba(59, 130, 246, 0.1)'
  },
  '& .MuiSelect-select': { 
    color: 'hsl(var(--foreground))',
    fontSize: '0.95rem',
    padding: '12px 14px'
  },
  '& .MuiSelect-icon': {
    color: 'hsl(var(--muted-foreground))'
  },
  '&.Mui-disabled': {
    backgroundColor: 'hsl(var(--muted))',
    opacity: 0.7
  }
}

/**
 * InputLabel sx props - premium styling
 */
export const inputLabelSx = {
  color: 'hsl(var(--muted-foreground))',
  fontWeight: 500,
  fontSize: '0.9rem',
  '&.Mui-focused': { color: '#3b82f6' }
}

/**
 * Secondary Button sx props - premium styling
 */
export const secondaryButtonSx = {
  color: 'hsl(var(--foreground))',
  borderColor: 'hsl(var(--border))',
  borderWidth: '1.5px',
  borderRadius: '10px',
  fontWeight: 500,
  padding: '10px 20px',
  transition: 'all 0.2s ease-in-out',
  textTransform: 'none',
  '&:hover': {
    borderColor: 'hsl(var(--ring))',
    backgroundColor: 'hsl(var(--muted))',
    transform: 'translateY(-1px)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
  },
  '&:active': {
    transform: 'translateY(0)'
  },
  '&.Mui-disabled': {
    opacity: 0.5
  }
}

/**
 * Primary Button sx props - premium gradient styling
 */
export const primaryButtonSx = {
  background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
  color: '#ffffff',
  borderRadius: '10px',
  fontWeight: 600,
  padding: '10px 24px',
  transition: 'all 0.2s ease-in-out',
  textTransform: 'none',
  boxShadow: '0 4px 14px rgba(59, 130, 246, 0.4)',
  '&:hover': {
    background: 'linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)',
    transform: 'translateY(-1px)',
    boxShadow: '0 6px 20px rgba(59, 130, 246, 0.5)'
  },
  '&:active': {
    transform: 'translateY(0)'
  },
  '&.Mui-disabled': {
    background: 'hsl(var(--muted))',
    color: 'hsl(var(--muted-foreground))',
    boxShadow: 'none'
  }
}

/**
 * Success Alert sx props - premium styling
 */
export const successAlertSx = {
  backgroundColor: '#10b981',
  color: '#ffffff',
  borderRadius: '12px',
  fontWeight: 500,
  boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
  '& .MuiAlert-icon': { color: '#ffffff' }
}

/**
 * MenuItem sx props - premium styling
 */
export const menuItemSx = {
  color: 'hsl(var(--foreground))',
  fontSize: '0.9rem',
  padding: '10px 16px',
  borderRadius: '8px',
  margin: '4px 8px',
  transition: 'all 0.15s ease-in-out',

  '&:hover': {
    backgroundColor: 'hsl(var(--accent))',
    transform: 'translateX(4px)'
  },

  '&.Mui-selected': {
    backgroundColor: 'hsla(59, 130, 246, 0.15)',
    color: '#3b82f6',
    fontWeight: 500
  },

  '&.Mui-selected:hover': {
    backgroundColor: 'hsla(59, 130, 246, 0.2)'
  }
}

/**
 * Select dropdown paper sx props - premium glassmorphism
 */
export const menuPaperSx = {
  backgroundColor: 'hsl(var(--card))',
  color: 'hsl(var(--foreground))',
  border: '1px solid hsl(var(--border))',
  borderRadius: '12px',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08)',
  marginTop: '8px',
  maxHeight: '300px'
}

/**
 * Table header cell sx props - premium styling
 */
export const tableHeaderCellSx = {
  color: 'hsl(var(--muted-foreground))',
  fontWeight: 600,
  fontSize: '0.85rem',
  textTransform: 'uppercase',
  letterSpacing: '0.05em'
}

/**
 * Table body cell sx props - premium styling
 */
export const tableBodyCellSx = {
  color: 'hsl(var(--foreground))',
  fontSize: '0.9rem'
}

/**
 * Table muted cell sx props - for secondary text
 */
export const tableMutedCellSx = {
  color: 'hsl(var(--muted-foreground))',
  fontSize: '0.85rem'
}

/**
 * Table row sx props - premium styling
 */
export const tableRowSx = {
  transition: 'all 0.15s ease-in-out',
  '&:hover': {
    backgroundColor: 'hsl(var(--muted))',
    transform: 'scale(1.005)'
  },
  borderBottom: '1px solid hsl(var(--border))'
}
