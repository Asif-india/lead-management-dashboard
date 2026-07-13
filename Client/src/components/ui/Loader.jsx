import React from 'react'
import { motion } from 'framer-motion'
import { Loader2, RefreshCw } from 'lucide-react'

/**
 * Loader Component
 * 
 * A reusable loading component with multiple variants and sizes.
 * 
 * @param {Object} props - Component props
 * @param {string} props.variant - Loader variant ('spinner', 'dots', 'pulse', 'bars', 'wave')
 * @param {string} props.size - Loader size ('xs', 'sm', 'md', 'lg', 'xl')
 * @param {string} props.color - Loader color ('primary', 'secondary', 'white', 'current')
 * @param {string} props.text - Loading text
 * @param {boolean} props.overlay - Show as overlay
 * @param {boolean} props.centered - Center the loader
 * @param {string} props.className - Additional CSS classes
 * @param {Object} props.motionProps - Framer Motion props
 */
const Loader = ({
  variant = 'spinner',
  size = 'md',
  color = 'primary',
  text,
  overlay = false,
  centered = false,
  className = '',
  motionProps = {},
  ...props
}) => {
  const sizeClasses = {
    xs: 'w-4 h-4',
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  }
  
  const colorClasses = {
    primary: 'text-blue-500',
    secondary: 'text-purple-500',
    white: 'text-white',
    current: 'text-current'
  }
  
  const containerClasses = `
    ${centered ? 'flex items-center justify-center' : 'inline-flex'}
    ${overlay ? 'fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50' : ''}
    ${className}
  `
  
  const renderLoader = () => {
    switch (variant) {
      case 'spinner':
        return (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className={`${sizeClasses[size]} ${colorClasses[color]}`}
          >
            <Loader2 className="w-full h-full" />
          </motion.div>
        )
      
      case 'dots':
        return (
          <div className="flex space-x-1">
            {[0, 1, 2].map((index) => (
              <motion.div
                key={index}
                className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full bg-current`}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [1, 0.5, 1]
                }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  delay: index * 0.2
                }}
              />
            ))}
          </div>
        )
      
      case 'pulse':
        return (
          <div className="relative">
            <motion.div
              className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full bg-current`}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [1, 0.3, 1]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            />
          </div>
        )
      
      case 'bars':
        return (
          <div className="flex space-x-1 items-end">
            {[0, 1, 2, 3, 4].map((index) => (
              <motion.div
                key={index}
                className={`${sizeClasses[size]} ${colorClasses[color]} bg-current rounded-sm`}
                style={{ width: '3px' }}
                animate={{
                  height: ['20%', '100%', '20%']
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: index * 0.1
                }}
              />
            ))}
          </div>
        )
      
      case 'wave':
        return (
          <div className="flex space-x-1">
            {[0, 1, 2, 3, 4].map((index) => (
              <motion.div
                key={index}
                className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full bg-current`}
                animate={{
                  y: [0, -10, 0]
                }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  delay: index * 0.1
                }}
              />
            ))}
          </div>
        )
      
      default:
        return (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className={`${sizeClasses[size]} ${colorClasses[color]}`}
          >
            <RefreshCw className="w-full h-full" />
          </motion.div>
        )
    }
  }
  
  const MotionDiv = motion.div
  
  return (
    <MotionDiv
      className={containerClasses}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      {...motionProps}
      {...props}
    >
      <div className="flex flex-col items-center space-y-3">
        {renderLoader()}
        {text && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`text-sm ${colorClasses[color]}`}
          >
            {text}
          </motion.p>
        )}
      </div>
    </MotionDiv>
  )
}

/**
 * PageLoader Component - Full page loader
 */
export const PageLoader = ({ text = 'Loading...', ...props }) => (
  <Loader
    variant="spinner"
    size="xl"
    overlay={true}
    centered={true}
    text={text}
    {...props}
  />
)

/**
 * InlineLoader Component - Small inline loader
 */
export const InlineLoader = ({ size = 'sm', ...props }) => (
  <Loader
    variant="spinner"
    size={size}
    {...props}
  />
)

/**
 * ButtonLoader Component - Loader for buttons
 */
export const ButtonLoader = ({ size = 'sm', color = 'white', ...props }) => (
  <Loader
    variant="spinner"
    size={size}
    color={color}
    {...props}
  />
)

export default Loader
