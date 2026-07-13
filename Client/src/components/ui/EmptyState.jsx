import React from 'react'
import { motion } from 'framer-motion'
import {
  Search,
  Filter,
  Inbox,
  FileText,
  Users,
  ShoppingBag,
  AlertCircle,
  Plus,
  RefreshCw
} from 'lucide-react'

/**
 * EmptyState Component
 * 
 * A reusable empty state component with multiple variants and actions.
 * 
 * @param {Object} props - Component props
 * @param {string} props.variant - Empty state variant ('no-data', 'no-search', 'no-filter', 'error', 'loading')
 * @param {string} props.title - Empty state title
 * @param {string} props.description - Empty state description
 * @param {React.ReactNode} props.icon - Custom icon
 * @param {React.ReactNode} props.action - Action button or component
 * @param {string} props.actionText - Action button text
 * @param {function} props.onAction - Action handler
 * @param {boolean} props.showIllustration - Show illustration
 * @param {string} props.size - Size ('sm', 'md', 'lg')
 * @param {string} props.className - Additional CSS classes
 * @param {Object} props.motionProps - Framer Motion props
 */
const EmptyState = ({
  variant = 'no-data',
  title,
  description,
  icon,
  action,
  actionText,
  onAction,
  showIllustration = true,
  size = 'md',
  className = '',
  motionProps = {},
  ...props
}) => {
  const getVariantConfig = () => {
    switch (variant) {
      case 'no-search':
        return {
          defaultTitle: 'No results found',
          defaultDescription: 'Try adjusting your search terms or filters',
          defaultIcon: Search,
          defaultAction: 'Clear search',
          color: 'text-blue-400'
        }
      case 'no-filter':
        return {
          defaultTitle: 'No matches found',
          defaultDescription: 'Try adjusting your filter criteria',
          defaultIcon: Filter,
          defaultAction: 'Reset filters',
          color: 'text-purple-400'
        }
      case 'error':
        return {
          defaultTitle: 'Something went wrong',
          defaultDescription: 'Please try again or contact support if the problem persists',
          defaultIcon: AlertCircle,
          defaultAction: 'Try again',
          color: 'text-red-400'
        }
      case 'loading':
        return {
          defaultTitle: 'Loading...',
          defaultDescription: 'Please wait while we fetch your data',
          defaultIcon: RefreshCw,
          defaultAction: null,
          color: 'text-slate-400'
        }
      default:
        return {
          defaultTitle: 'No data available',
          defaultDescription: 'There are no items to display at the moment',
          defaultIcon: Inbox,
          defaultAction: 'Get started',
          color: 'text-slate-400'
        }
    }
  }
  
  const config = getVariantConfig()
  const finalTitle = title || config.defaultTitle
  const finalDescription = description || config.defaultDescription
  const FinalIcon = icon || config.defaultIcon
  const finalActionText = actionText || config.defaultAction
  
  const sizeClasses = {
    sm: 'py-12',
    md: 'py-16',
    lg: 'py-20'
  }
  
  const iconSizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-20 h-20'
  }
  
  const MotionDiv = motion.div
  
  const renderIllustration = () => {
    if (!showIllustration) return null
    
    return (
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="relative"
      >
        <div className={`mx-auto ${iconSizeClasses[size]} ${config.color} opacity-20`}>
          <FinalIcon className="w-full h-full" />
        </div>
        
        {/* Decorative elements */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className={`${iconSizeClasses[size]} ${config.color}`}>
            <FinalIcon className="w-full h-full" />
          </div>
        </motion.div>
      </motion.div>
    )
  }
  
  return (
    <MotionDiv
      className={`flex flex-col items-center justify-center text-center ${sizeClasses[size]} ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      {...motionProps}
      {...props}
    >
      {renderIllustration()}
      
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="max-w-md mx-auto"
      >
        <h3 className="text-xl font-semibold text-white mb-2">
          {finalTitle}
        </h3>
        <p className="text-slate-400 mb-6">
          {finalDescription}
        </p>
        
        {(action || (finalActionText && onAction)) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            {action || (
              <button
                onClick={onAction}
                className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
              >
                <Plus className="w-4 h-4" />
                <span>{finalActionText}</span>
              </button>
            )}
          </motion.div>
        )}
      </motion.div>
    </MotionDiv>
  )
}

/**
 * NoDataState Component - Specific no data state
 */
export const NoDataState = (props) => (
  <EmptyState variant="no-data" {...props} />
)

/**
 * NoSearchState Component - Specific no search results state
 */
export const NoSearchState = (props) => (
  <EmptyState variant="no-search" {...props} />
)

/**
 * NoFilterState Component - Specific no filter results state
 */
export const NoFilterState = (props) => (
  <EmptyState variant="no-filter" {...props} />
)

/**
 * ErrorState Component - Specific error state
 */
export const ErrorState = (props) => (
  <EmptyState variant="error" {...props} />
)

/**
 * EmptyTableState Component - Empty state for tables
 */
export const EmptyTableState = ({ columns, ...props }) => (
  <EmptyState
    variant="no-data"
    title="No data in table"
    description={`There are no ${columns?.[0]?.title || 'records'} to display`}
    icon={FileText}
    {...props}
  />
)

/**
 * EmptyUsersState Component - Empty state for users/lists
 */
export const EmptyUsersState = (props) => (
  <EmptyState
    variant="no-data"
    title="No users found"
    description="There are no users to display at the moment"
    icon={Users}
    {...props}
  />
)

/**
 * EmptyProductsState Component - Empty state for products
 */
export const EmptyProductsState = (props) => (
  <EmptyState
    variant="no-data"
    title="No products found"
    description="There are no products to display at the moment"
    icon={ShoppingBag}
    {...props}
  />
)

export default EmptyState
