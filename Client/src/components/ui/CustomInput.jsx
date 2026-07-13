import React, { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Search, AlertCircle, CheckCircle } from 'lucide-react'

/**
 * CustomInput Component
 * 
 * A reusable input component with multiple variants, sizes, and validation states.
 * 
 * @param {Object} props - Component props
 * @param {string} props.variant - Input variant ('outline', 'filled', 'flushed', 'unstyled')
 * @param {string} props.size - Input size ('sm', 'md', 'lg')
 * @param {string} props.type - Input type ('text', 'email', 'password', 'search', 'number', 'tel')
 * @param {string} props.label - Input label
 * @param {string} props.placeholder - Placeholder text
 * @param {string} props.helperText - Helper text below input
 * @param {string} props.errorText - Error text
 * @param {boolean} props.required - Required field indicator
 * @param {boolean} props.disabled - Disable input
 * @param {boolean} props.fullWidth - Full width input
 * @param {boolean} props.showPasswordToggle - Show password toggle for password type
 * @param {React.ReactNode} props.leftIcon - Icon on the left side
 * @param {React.ReactNode} props.rightIcon - Icon on the right side
 * @param {string} props.className - Additional CSS classes
 * @param {Object} props.motionProps - Framer Motion props
 */
const CustomInput = forwardRef(({
  variant = 'outline',
  size = 'md',
  type = 'text',
  label,
  placeholder,
  helperText,
  errorText,
  required = false,
  disabled = false,
  fullWidth = false,
  showPasswordToggle = false,
  leftIcon,
  rightIcon,
  className = '',
  motionProps = {},
  value,
  onChange,
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = React.useState(false)
  const [isFocused, setIsFocused] = React.useState(false)
  
  const inputType = type === 'password' && showPassword ? 'text' : type
  const hasError = !!errorText
  const hasValue = value && value.length > 0
  
  const baseClasses = 'transition-all duration-200 bg-card/50 border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background'
  
  const variantClasses = {
    outline: 'border-input focus:border-primary focus:ring-primary',
    filled: 'border-transparent bg-muted focus:border-primary focus:ring-primary',
    flushed: 'border-transparent border-b-2 border-input rounded-none focus:border-primary focus:ring-0 px-0',
    unstyled: 'border-transparent bg-transparent focus:ring-0 px-0'
  }
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-3 text-base'
  }
  
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : ''
  const widthClasses = fullWidth ? 'w-full' : ''
  const iconPadding = leftIcon ? 'pl-10' : rightIcon || showPasswordToggle || type === 'password' ? 'pr-10' : ''
  
  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses} ${widthClasses} ${iconPadding} ${className}`
  
  const MotionInput = motion.input
  
  const renderRightIcon = () => {
    if (type === 'password' && showPasswordToggle) {
      return (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
        >
          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      )
    }
    if (rightIcon) {
      return (
        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
          {rightIcon}
        </span>
      )
    }
    if (hasError) {
      return (
        <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-red-600 dark:text-red-400" />
      )
    }
    if (!hasError && hasValue) {
      return (
        <CheckCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-green-600 dark:text-green-400" />
      )
    }
    return null
  }
  
  return (
    <div className={`${fullWidth ? 'w-full' : ''} ${className}`}>
      {label && (
        <label className={`block text-sm font-medium mb-2 ${hasError ? 'text-red-600 dark:text-red-400' : 'text-muted-foreground'}`}>
          {label}
          {required && <span className="text-red-600 dark:text-red-400 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {leftIcon && (
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
            {leftIcon}
          </span>
        )}
        
        <MotionInput
          ref={ref}
          type={inputType}
          className={classes}
          placeholder={placeholder}
          disabled={disabled}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          animate={{
            borderColor: hasError ? 'hsl(var(--destructive))' : isFocused ? 'hsl(var(--primary))' : 'hsl(var(--input))'
          }}
          transition={{ duration: 0.2 }}
          {...motionProps}
          {...props}
        />
        
        {renderRightIcon()}
      </div>
      
      {(helperText || errorText) && (
        <p className={`mt-2 text-xs ${hasError ? 'text-red-600 dark:text-red-400' : 'text-muted-foreground'}`}>
          {errorText || helperText}
        </p>
      )}
    </div>
  )
})

CustomInput.displayName = 'CustomInput'

export default CustomInput
