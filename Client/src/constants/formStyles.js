/**
 * Form Styles Constants
 *
 * Reusable MUI sx props for form components.
 * Uses semantic CSS variables for theme-aware styling.
 */

/**
 * TextField sx props - uses semantic theme colors
 */
export const textFieldSx = {
  '& .MuiOutlinedInput-root': {
    '& fieldset': { borderColor: 'hsl(var(--border))' },
    '&:hover fieldset': { borderColor: 'hsl(var(--ring))' },
    '&.Mui-focused fieldset': { borderColor: '#3b82f6' } // Brand color
  },
  '& .MuiInputLabel-root': { color: 'hsl(var(--muted-foreground))' },
  '& .MuiInputBase-input': { color: 'hsl(var(--foreground))' }
}

/**
 * Select sx props - uses semantic theme colors
 */
export const selectSx = {
  '& .MuiOutlinedInput-notchedOutline': { borderColor: 'hsl(var(--border))' },
  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'hsl(var(--ring))' },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#3b82f6' }, // Brand color
  '& .MuiSelect-select': { color: 'hsl(var(--foreground))' }
}

/**
 * InputLabel sx props - uses semantic theme colors
 */
export const inputLabelSx = {
  color: 'hsl(var(--muted-foreground))'
}

/**
 * Secondary Button sx props - uses semantic theme colors
 */
export const secondaryButtonSx = {
  color: 'hsl(var(--foreground))',
  borderColor: 'hsl(var(--border))',
  '&:hover': {
    borderColor: 'hsl(var(--ring))',
    backgroundColor: 'hsl(var(--muted))'
  }
}

/**
 * Primary Button sx props - uses brand gradient
 */
export const primaryButtonSx = {
  background: 'linear-gradient(to right, #3b82f6, #8b5cf6)',
  color: '#ffffff',
  '&:hover': {
    background: 'linear-gradient(to right, #2563eb, #7c3aed)'
  }
}

/**
 * Success Alert sx props - uses brand color
 */
export const successAlertSx = {
  backgroundColor: '#10b981',
  color: '#ffffff',
  '& .MuiAlert-icon': { color: '#0f172a' }
}

/**
 * MenuItem sx props - semantic theme colors
 */
export const menuItemSx = {
  color: 'hsl(var(--foreground))',

  '&:hover': {
    backgroundColor: 'hsl(var(--accent))'
  },

  '&.Mui-selected': {
    backgroundColor: 'hsl(var(--accent))'
  },

  '&.Mui-selected:hover': {
    backgroundColor: 'hsl(var(--accent))'
  }
}

/**
 * Select dropdown paper sx props
 */
export const menuPaperSx = {
  backgroundColor: 'hsl(var(--card))',
  color: 'hsl(var(--foreground))',
  border: '1px solid hsl(var(--border))'
}

/**
 * Table header cell sx props - uses semantic theme colors
 */
export const tableHeaderCellSx = {
  color: 'hsl(var(--muted-foreground))',
  fontWeight: 600
}

/**
 * Table body cell sx props - uses semantic theme colors
 */
export const tableBodyCellSx = {
  color: 'hsl(var(--foreground))'
}

/**
 * Table muted cell sx props - for secondary text
 */
export const tableMutedCellSx = {
  color: 'hsl(var(--muted-foreground))'
}

/**
 * Table row sx props - uses semantic theme colors
 */
export const tableRowSx = {
  '&:hover': {
    backgroundColor: 'hsl(var(--muted))'
  },
  borderBottom: '1px solid hsl(var(--border))'
}
