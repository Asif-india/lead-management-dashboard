import React from 'react'
import { motion } from 'framer-motion'
import { Loader2, RefreshCw } from 'lucide-react'

/**
 * Premium Loading Spinner Component
 * 
 * Multiple animation variants with smooth, professional loading states
 */
const LoadingSpinner = ({ 
  variant = 'spinner', 
  size = 'md', 
  text,
  overlay = false,
  className = '' 
}) => {
  const sizeClasses = {
    xs: 'w-4 h-4',
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  }

  const containerClasses = overlay 
    ? 'fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center'
    : 'inline-flex items-center justify-center'

  const renderSpinner = () => {
    switch (variant) {
      case 'spinner':
        return (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity, 
              ease: "linear" 
            }}
            className={`${sizeClasses[size]} text-blue-500`}
          >
            <Loader2 className="w-full h-full" />
          </motion.div>
        )
      
      case 'pulse':
        return (
          <div className="relative">
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [1, 0.3, 1]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className={`${sizeClasses[size]} bg-blue-500 rounded-full`}
            />
          </div>
        )
      
      case 'dots':
        return (
          <div className="flex space-x-2">
            {[0, 1, 2].map((index) => (
              <motion.div
                key={index}
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [1, 0.5, 1]
                }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  delay: index * 0.2
                }}
                className={`${sizeClasses[size]} bg-blue-500 rounded-full`}
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
                animate={{
                  y: [0, -12, 0]
                }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  delay: index * 0.1
                }}
                className={`${sizeClasses[size]} bg-blue-500 rounded-full`}
                style={{ width: '4px' }}
              />
            ))}
          </div>
        )
      
      default:
        return (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity, 
              ease: "linear" 
            }}
            className={`${sizeClasses[size]} text-blue-500`}
          >
            <RefreshCw className="w-full h-full" />
          </motion.div>
        )
    }
  }

  return (
    <motion.div
      className={`${containerClasses} ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col items-center space-y-4">
        {renderSpinner()}
        {text && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-300 text-sm"
          >
            {text}
          </motion.p>
        )}
      </div>
    </motion.div>
  )
}

export default LoadingSpinner
