import React from 'react'
import { motion } from 'framer-motion'

/**
 * ResponsiveForm Component
 * 
 * A responsive form wrapper that adapts to different screen sizes
 * with proper grid layouts and spacing.
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Form content
 * @param {string} props.layout - Layout type ('vertical', 'horizontal', 'grid')
 * @param {number} props.columns - Number of columns for grid layout
 * @param {string} props.spacing - Spacing between form elements
 * @param {string} props.className - Additional CSS classes
 * @param {function} props.onSubmit - Form submit handler
 */
const ResponsiveForm = ({
  children,
  layout = 'vertical',
  columns = 2,
  spacing = 'normal',
  className = '',
  onSubmit,
  ...props
}) => {
  const getLayoutClasses = () => {
    const spacingClasses = {
      tight: 'space-y-3',
      normal: 'space-y-4',
      loose: 'space-y-6'
    }

    const gridClasses = {
      1: 'grid-cols-1',
      2: 'grid-cols-1 md:grid-cols-2',
      3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
      4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
    }

    switch (layout) {
      case 'horizontal':
        return 'flex flex-col sm:flex-row sm:items-end sm:space-y-0 sm:space-x-4'
      case 'grid':
        return `grid ${gridClasses[columns]} gap-4 md:gap-6`
      default:
        return `${spacingClasses[spacing]}`
    }
  }

  const MotionForm = motion.form

  return (
    <MotionForm
      onSubmit={onSubmit}
      className={`${getLayoutClasses()} ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      {...props}
    >
      {children}
    </MotionForm>
  )
}

/**
 * ResponsiveFormGroup Component
 * 
 * A responsive form group that handles label and input positioning
 */
export const ResponsiveFormGroup = ({
  children,
  label,
  required = false,
  error,
  helper,
  className = '',
  layout = 'vertical'
}) => {
  const getGroupClasses = () => {
    switch (layout) {
      case 'horizontal':
        return 'flex flex-col sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4'
      default:
        return 'space-y-2'
    }
  }

  return (
    <motion.div
      className={`${getGroupClasses()} ${className}`}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      {label && (
        <label className={`
          font-medium text-slate-300
          ${layout === 'horizontal' ? 'sm:w-1/3' : ''}
          ${layout === 'horizontal' ? 'sm:text-right' : ''}
        `}>
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}
      
      <div className={layout === 'horizontal' ? 'sm:w-2/3' : ''}>
        {children}
        {helper && (
          <p className="text-slate-400 text-sm mt-1">{helper}</p>
        )}
        {error && (
          <p className="text-red-400 text-sm mt-1">{error}</p>
        )}
      </div>
    </motion.div>
  )
}

/**
 * ResponsiveFormActions Component
 * 
 * Responsive form action buttons with proper spacing
 */
export const ResponsiveFormActions = ({
  children,
  align = 'left',
  className = ''
}) => {
  const getActionsClasses = () => {
    const baseClasses = 'flex flex-wrap gap-3 mt-6'
    
    switch (align) {
      case 'right':
        return `${baseClasses} sm:justify-end`
      case 'center':
        return `${baseClasses} sm:justify-center`
      default:
        return `${baseClasses} sm:justify-start`
    }
  }

  return (
    <motion.div
      className={`${getActionsClasses()} ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      {children}
    </motion.div>
  )
}

export default ResponsiveForm
