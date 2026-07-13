import React from 'react'
import { motion } from 'framer-motion'
import { Plus, Filter, Download, Search, Bell, Settings, HelpCircle, ArrowLeft, Home } from 'lucide-react'

/**
 * PageHeader Component
 * 
 * A reusable page header component with breadcrumbs, actions, and navigation.
 * 
 * @param {Object} props - Component props
 * @param {string} props.title - Page title
 * @param {string} props.subtitle - Page subtitle or description
 * @param {Array} props.breadcrumbs - Breadcrumb items array
 * @param {React.ReactNode} props.children - Additional header content
 * @param {Array} props.actions - Action buttons array
 * @param {boolean} props.showBackButton - Show back button
 * @param {function} props.onBack - Back button handler
 * @param {boolean} props.showSearch - Show search button
 * @param {function} props.onSearch - Search handler
 * @param {boolean} props.showNotifications - Show notifications button
 * @param {boolean} props.showSettings - Show settings button
 * @param {string} props.size - Header size ('sm', 'md', 'lg')
 * @param {boolean} props.sticky - Make header sticky
 * @param {string} props.className - Additional CSS classes
 * @param {Object} props.motionProps - Framer Motion props
 */
const PageHeader = ({
  title,
  subtitle,
  breadcrumbs = [],
  children,
  actions = [],
  showBackButton = false,
  onBack,
  showSearch = false,
  onSearch,
  showNotifications = false,
  showSettings = false,
  size = 'md',
  sticky = false,
  className = '',
  motionProps = {},
  ...props
}) => {
  const sizeClasses = {
    sm: 'py-4',
    md: 'py-6',
    lg: 'py-8'
  }

  const titleSizeClasses = {
    sm: 'text-2xl',
    md: 'text-3xl',
    lg: 'text-4xl'
  }

  const MotionDiv = motion.div

  const renderBreadcrumbs = () => {
    if (breadcrumbs.length === 0) return null

    return (
      <motion.nav
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center space-x-2 text-sm text-muted-foreground mb-4"
      >
        <button
          onClick={() => window.history.back()}
          className="hover:text-foreground transition-colors"
        >
          <Home className="w-4 h-4" />
        </button>

        {breadcrumbs.map((item, index) => (
          <React.Fragment key={index}>
            <span className="text-muted-foreground">/</span>
            {item.href ? (
              <a
                href={item.href}
                className="hover:text-foreground transition-colors"
              >
                {item.label}
              </a>
            ) : (
              <span className={index === breadcrumbs.length - 1 ? 'text-foreground' : ''}>
                {item.label}
              </span>
            )}
          </React.Fragment>
        ))}
      </motion.nav>
    )
  }

  const renderActions = () => {
    if (actions.length === 0 && !showSearch && !showNotifications && !showSettings) {
      return null
    }

    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="flex items-center space-x-3"
      >
        {showSearch && (
          <button
            onClick={onSearch}
            className="p-2 rounded-lg bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground transition-colors"
          >
            <Search className="w-5 h-5" />
          </button>
        )}

        {showNotifications && (
          <button className="p-2 rounded-lg bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground transition-colors relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
        )}

        {showSettings && (
          <button className="p-2 rounded-lg bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground transition-colors">
            <Settings className="w-5 h-5" />
          </button>
        )}

        {actions.map((action, index) => (
          <motion.button
            key={index}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={action.onClick}
            className={`inline-flex items-center space-x-2 px-4 py-2 font-medium rounded-xl transition-all duration-200 ${action.variant === 'primary'
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-lg shadow-blue-500/25'
                : 'bg-muted text-foreground hover:bg-muted/80'
              }`}
          >
            {action.icon && <action.icon className="w-4 h-4" />}
            <span>{action.label}</span>
          </motion.button>
        ))}
      </motion.div>
    )
  }

  return (
    <MotionDiv
      className={`${sizeClasses[size]} ${sticky ? 'sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border' : ''} ${className}`}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      {...motionProps}
      {...props}
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          {/* Left Section */}
          <div className="flex-1 min-w-0">
            {/* Back Button */}
            {showBackButton && (
              <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                onClick={onBack || (() => window.history.back())}
                className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors mb-4 lg:mb-0"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </motion.button>
            )}

            {/* Breadcrumbs */}
            {renderBreadcrumbs()}

            {/* Title and Subtitle */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <h1
                className={`${titleSizeClasses[size]} font-bold mb-2 text-foreground`}
              >
                {title}
              </h1>
              {subtitle && (
                <p className="text-muted-foreground text-lg max-w-2xl">
                  {subtitle}
                </p>
              )}
            </motion.div>

            {/* Additional Content */}
            {children && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="mt-4"
              >
                {children}
              </motion.div>
            )}
          </div>

          {/* Right Section - Actions */}
          <div className="flex-shrink-0 mt-6 lg:mt-0 lg:ml-8">
            {renderActions()}
          </div>
        </div>
      </div>
    </MotionDiv>
  )
}

/**
 * DashboardHeader Component - Specialized header for dashboards
 */
export const DashboardHeader = (props) => (
  <PageHeader
    size="lg"
    showSearch={true}
    showNotifications={true}
    showSettings={true}
    {...props}
  />
)

/**
 * SettingsHeader Component - Specialized header for settings pages
 */
export const SettingsHeader = (props) => (
  <PageHeader
    showBackButton={true}
    breadcrumbs={[
      { label: 'Dashboard', href: '/admin' },
      { label: 'Settings' }
    ]}
    {...props}
  />
)

/**
 * FormHeader Component - Specialized header for forms
 */
export const FormHeader = ({ title, subtitle, onSave, onCancel, ...props }) => (
  <PageHeader
    title={title}
    subtitle={subtitle}
    showBackButton={true}
    actions={[
      {
        label: 'Cancel',
        onClick: onCancel,
        variant: 'secondary'
      },
      {
        label: 'Save',
        onClick: onSave,
        variant: 'primary',
        icon: Plus
      }
    ]}
    {...props}
  />
)

export default PageHeader
