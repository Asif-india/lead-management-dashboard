import React from 'react'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'

/**
 * CustomButton Component
 * 
 * A reusable button component with multiple variants, sizes, and loading states.
 * 
 * @param {Object} props - Component props
 * @param {string} props.variant - Button variant ('primary', 'secondary', 'outline', 'ghost', 'danger')
 * @param {string} props.size - Button size ('sm', 'md', 'lg', 'xl')
 * @param {boolean} props.loading - Show loading state
 * @param {boolean} props.disabled - Disable button
 * @param {boolean} props.fullWidth - Full width button
 * @param {React.ReactNode} props.children - Button content
 * @param {React.ReactNode} props.leftIcon - Icon on the left side
 * @param {React.ReactNode} props.rightIcon - Icon on the right side
 * @param {function} props.onClick - Click handler
 * @param {string} props.className - Additional CSS classes
 * @param {Object} props.motionProps - Framer Motion props
 */
const CustomButton = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  children,
  leftIcon,
  rightIcon,
  onClick,
  className = '',
  motionProps = {},
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900'
  
  const variantClasses = {
    primary: 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 focus:ring-blue-500 shadow-lg shadow-blue-500/25',
    secondary: 'bg-slate-700 text-white hover:bg-slate-600 focus:ring-slate-500',
    outline: 'border border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white focus:ring-slate-500',
    ghost: 'text-slate-300 hover:bg-slate-700 hover:text-white focus:ring-slate-500',
    danger: 'bg-gradient-to-r from-red-500 to-pink-600 text-white hover:from-red-600 hover:to-pink-700 focus:ring-red-500 shadow-lg shadow-red-500/25'
  }
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2',
    xl: 'px-8 py-4 text-lg gap-3'
  }
  
  const disabledClasses = disabled || loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
  const widthClasses = fullWidth ? 'w-full' : ''
  
  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses} ${widthClasses} ${className}`
  
  const MotionButton = motion.button
  
  return (
    <MotionButton
      className={classes}
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={!disabled && !loading ? { scale: 1.02 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.98 } : {}}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      {...motionProps}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {!loading && leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
      <span className="truncate">{children}</span>
      {!loading && rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
    </MotionButton>
  )
}

export default CustomButton
