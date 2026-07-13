import React, { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react'

/**
 * Modal Component
 * 
 * A reusable modal component with multiple variants and sizes.
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Modal open state
 * @param {function} props.onClose - Close handler
 * @param {string} props.title - Modal title
 * @param {string} props.subtitle - Modal subtitle
 * @param {React.ReactNode} props.children - Modal content
 * @param {string} props.size - Modal size ('sm', 'md', 'lg', 'xl', 'full')
 * @param {string} props.variant - Modal variant ('default', 'alert', 'confirm', 'info')
 * @param {boolean} props.showCloseButton - Show close button
 * @param {boolean} props.closeOnOverlayClick - Close on overlay click
 * @param {boolean} props.closeOnEscape - Close on escape key
 * @param {React.ReactNode} props.footer - Modal footer content
 * @param {string} props.className - Additional CSS classes
 * @param {Object} props.motionProps - Framer Motion props
 */
const Modal = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  size = 'md',
  variant = 'default',
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEscape = true,
  footer,
  className = '',
  motionProps = {},
  ...props
}) => {
  const modalRef = useRef(null)
  
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-full mx-4'
  }
  
  const getVariantIcon = () => {
    switch (variant) {
      case 'alert':
        return <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
      case 'confirm':
        return <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
      case 'info':
        return <Info className="w-6 h-6 text-blue-600 dark:text-blue-400" />
      case 'warning':
        return <AlertTriangle className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
      default:
        return null
    }
  }
  
  const handleOverlayClick = (e) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose()
    }
  }
  
  const handleEscape = (e) => {
    if (closeOnEscape && e.key === 'Escape') {
      onClose()
    }
  }
  
  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
      
      // Focus management
      if (modalRef.current) {
        modalRef.current.focus()
      }
    } else {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, closeOnEscape])
  
  const MotionDiv = motion.div
  
  return (
    <AnimatePresence>
      {isOpen && (
        <MotionDiv
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={handleOverlayClick}
        >
          {/* Overlay */}
          <MotionDiv
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          
          {/* Modal */}
          <MotionDiv
            ref={modalRef}
            initial={{ scale: 0.9, opacity: 0, y: 40, rotateX: -5 }}
            animate={{ scale: 1, opacity: 1, y: 0, rotateX: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 40, rotateX: 5 }}
            transition={{ 
              type: "spring", 
              stiffness: 400, 
              damping: 25,
              duration: 0.5
            }}
            className={`relative w-full ${sizeClasses[size]} bg-popover border border-border rounded-2xl shadow-2xl backdrop-blur-xl ${className}`}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? 'modal-title' : undefined}
            onClick={(e) => e.stopPropagation()}
            {...motionProps}
            {...props}
          >
            {/* Header */}
            {(title || getVariantIcon() || showCloseButton) && (
              <div className="flex items-start justify-between p-6 border-b border-border">
                <div className="flex items-start space-x-3 flex-1">
                  {getVariantIcon() && (
                    <div className="flex-shrink-0 mt-1">
                      {getVariantIcon()}
                    </div>
                  )}
                  <div className="flex-1">
                    {title && (
                      <h2 id="modal-title" className="text-xl font-semibold text-foreground">
                        {title}
                      </h2>
                    )}
                    {subtitle && (
                      <p className="text-muted-foreground text-sm mt-1">{subtitle}</p>
                    )}
                  </div>
                </div>
                
                {showCloseButton && (
                  <button
                    onClick={onClose}
                    className="flex-shrink-0 p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            )}
            
            {/* Content */}
            <div className="p-6">
              {children}
            </div>
            
            {/* Footer */}
            {footer && (
              <div className="p-6 border-t border-border">
                {footer}
              </div>
            )}
          </MotionDiv>
        </MotionDiv>
      )}
    </AnimatePresence>
  )
}

/**
 * ConfirmModal Component - Confirmation dialog
 */
export const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmVariant = 'primary',
  ...props
}) => {
  const footer = (
    <div className="flex justify-end space-x-3">
      <button
        onClick={onClose}
        className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        {cancelText}
      </button>
      <button
        onClick={onConfirm}
        className={`px-4 py-2 text-sm font-medium rounded-xl transition-colors ${
          confirmVariant === 'danger'
            ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
            : 'bg-primary text-primary-foreground hover:bg-primary/90'
        }`}
      >
        {confirmText}
      </button>
    </div>
  )
  
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      variant="confirm"
      footer={footer}
      {...props}
    >
      <p className="text-muted-foreground">{message}</p>
    </Modal>
  )
}

/**
 * AlertModal Component - Alert dialog
 */
export const AlertModal = ({
  isOpen,
  onClose,
  title = 'Alert',
  message,
  buttonText = 'OK',
  ...props
}) => {
  const footer = (
    <div className="flex justify-end">
      <button
        onClick={onClose}
        className="px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors"
      >
        {buttonText}
      </button>
    </div>
  )
  
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      variant="alert"
      footer={footer}
      {...props}
    >
      <p className="text-muted-foreground">{message}</p>
    </Modal>
  )
}

export default Modal
