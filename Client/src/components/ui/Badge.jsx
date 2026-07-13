import React from 'react'
import { motion } from 'framer-motion'
import { X, Check, AlertCircle, Info } from 'lucide-react'

/**
 * Badge Component
 * 
 * A reusable badge component with multiple variants, sizes, and interactive features.
 * 
 * @param {Object} props - Component props
 * @param {string} props.variant - Badge variant ('default', 'primary', 'secondary', 'success', 'warning', 'error', 'info')
 * @param {string} props.size - Badge size ('xs', 'sm', 'md', 'lg')
 * @param {React.ReactNode} props.children - Badge content
 * @param {boolean} props.dismissible - Show dismiss button
 * @param {function} props.onDismiss - Dismiss handler
 * @param {boolean} props.dot - Show as dot indicator
 * @param {boolean} props.pulse - Add pulse animation
 * @param {boolean} props.animate - Enable animations
 * @param {string} props.className - Additional CSS classes
 * @param {Object} props.motionProps - Framer Motion props
 */
const Badge = ({
  variant = 'default',
  size = 'md',
  children,
  dismissible = false,
  onDismiss,
  dot = false,
  pulse = false,
  animate = true,
  className = '',
  motionProps = {},
  ...props
}) => {
  const [isVisible, setIsVisible] = React.useState(true)
  
  const baseClasses = 'inline-flex items-center font-medium rounded-full transition-all duration-200'
  
  const variantClasses = {
    default: 'bg-slate-700 text-slate-300 border border-slate-600',
    primary: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
    secondary: 'bg-purple-500/10 text-purple-400 border border-purple-500/20',
    success: 'bg-green-500/10 text-green-400 border border-green-500/20',
    warning: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20',
    error: 'bg-red-500/10 text-red-400 border border-red-500/20',
    info: 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
  }
  
  const sizeClasses = {
    xs: dot ? 'w-2 h-2' : 'px-2 py-0.5 text-xs',
    sm: dot ? 'w-2.5 h-2.5' : 'px-2.5 py-1 text-xs',
    md: dot ? 'w-3 h-3' : 'px-3 py-1 text-xs',
    lg: dot ? 'w-4 h-4' : 'px-4 py-1.5 text-sm'
  }
  
  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`
  
  const handleDismiss = () => {
    setIsVisible(false)
    onDismiss && onDismiss()
  }
  
  const getVariantIcon = () => {
    switch (variant) {
      case 'success':
        return <Check className="w-3 h-3" />
      case 'error':
        return <X className="w-3 h-3" />
      case 'warning':
        return <AlertCircle className="w-3 h-3" />
      case 'info':
        return <Info className="w-3 h-3" />
      default:
        return null
    }
  }
  
  const MotionSpan = motion.span
  
  const badgeContent = (
    <>
      {!dot && getVariantIcon() && (
        <span className="mr-1">{getVariantIcon()}</span>
      )}
      
      {!dot && children && <span>{children}</span>}
      
      {dot && <span className="sr-only">{children}</span>}
      
      {dismissible && !dot && (
        <button
          onClick={handleDismiss}
          className="ml-1 hover:opacity-70 transition-opacity"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </>
  )
  
  if (!isVisible) {
    return null
  }
  
  const badgeElement = (
    <span className={classes} {...props}>
      {badgeContent}
    </span>
  )
  
  if (!animate) {
    return badgeElement
  }
  
  return (
    <MotionSpan
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 500, damping: 20 }}
      className={`${pulse ? 'animate-pulse' : ''}`}
      {...motionProps}
    >
      {badgeElement}
    </MotionSpan>
  )
}

/**
 * StatusBadge Component - Specialized badge for status indicators
 */
export const StatusBadge = ({
  status,
  children,
  className = '',
  ...props
}) => {
  const statusVariants = {
    active: 'success',
    inactive: 'error',
    pending: 'warning',
    processing: 'info',
    online: 'success',
    offline: 'error',
    busy: 'warning',
    away: 'secondary'
  }
  
  return (
    <Badge
      variant={statusVariants[status] || 'default'}
      dot={props.dot || false}
      className={className}
      {...props}
    >
      {children || status}
    </Badge>
  )
}

/**
 * CountBadge Component - Badge for displaying counts
 */
export const CountBadge = ({
  count,
  max = 99,
  showZero = false,
  className = '',
  ...props
}) => {
  if (!showZero && count === 0) {
    return null
  }
  
  const displayCount = count > max ? `${max}+` : count
  
  return (
    <Badge
      variant="error"
      size="sm"
      className={`min-w-[20px] justify-center ${className}`}
      {...props}
    >
      {displayCount}
    </Badge>
  )
}

export default Badge
