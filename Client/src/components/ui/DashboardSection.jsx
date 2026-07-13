import React from 'react'
import { motion } from 'framer-motion'

/**
 * DashboardSection Component
 *
 * A reusable section container for dashboard content.
 * Handles layout, header, and optional Framer Motion animations.
 * Uses semantic theme classes.
 *
 * @param {Object} props - Component props
 * @param {string} props.title - Section title
 * @param {string} props.subtitle - Optional subtitle text
 * @param {React.ReactNode} props.action - Optional action icon or element
 * @param {React.ReactNode} props.children - Section content
 * @param {string} props.className - Additional CSS classes
 * @param {Object} props.motionProps - Optional Framer Motion props (if provided, renders motion.div)
 */
const DashboardSection = ({
  title,
  subtitle,
  action,
  children,
  className = '',
  motionProps = {},
}) => {
  const MotionDiv = motion.div
  const hasMotionProps = Object.keys(motionProps).length > 0

  const sectionContent = (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-foreground">{title}</h2>
          {subtitle && (
            <p className="text-muted-foreground text-sm mt-1">{subtitle}</p>
          )}
        </div>
        {action && (
          <div className="text-muted-foreground">
            {action}
          </div>
        )}
      </div>

      {/* Content */}
      {children}
    </>
  )

  if (hasMotionProps) {
    return (
      <MotionDiv
        className={`bg-card border border-border rounded-2xl p-6 backdrop-blur-sm ${className}`}
        {...motionProps}
      >
        {sectionContent}
      </MotionDiv>
    )
  }

  return (
    <div className={`bg-card border border-border rounded-2xl p-6 backdrop-blur-sm ${className}`}>
      {sectionContent}
    </div>
  )
}

export default DashboardSection
