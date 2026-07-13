import React from 'react'
import { motion } from 'framer-motion'

/**
 * ResponsiveGrid Component
 * 
 * A responsive grid system that adapts to different screen sizes
 * with customizable breakpoints and spacing.
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Grid items
 * @param {string} props.cols - Number of columns ('1-12' or 'auto')
 * @param {string} props.smCols - Small screen columns
 * @param {string} props.mdCols - Medium screen columns
 * @param {string} props.lgCols - Large screen columns
 * @param {string} props.xlCols Extra large screen columns
 * @param {string} props.gap - Gap between items ('none' | 'sm' | 'md' | 'lg' | 'xl')
 * @param {string} props.className - Additional CSS classes
 * @param {Object} props.motionProps - Framer Motion props
 */
const ResponsiveGrid = ({
  children,
  cols = 'auto',
  smCols,
  mdCols,
  lgCols,
  xlCols,
  gap = 'md',
  className = '',
  motionProps = {},
  ...props
}) => {
  const getGridClasses = () => {
    const columnClasses = {
      '1': 'grid-cols-1',
      '2': 'grid-cols-2',
      '3': 'grid-cols-3',
      '4': 'grid-cols-4',
      '5': 'grid-cols-5',
      '6': 'grid-cols-6',
      '7': 'grid-cols-7',
      '8': 'grid-cols-8',
      '9': 'grid-cols-9',
      '10': 'grid-cols-10',
      '11': 'grid-cols-11',
      '12': 'grid-cols-12',
      'auto': 'grid-cols-[repeat(auto-fit,minmax(250px,1fr))]',
      'auto-sm': 'grid-cols-[repeat(auto-fit,minmax(200px,1fr))]',
      'auto-lg': 'grid-cols-[repeat(auto-fit,minmax(300px,1fr))]'
    }

    const gapClasses = {
      'none': 'gap-0',
      'sm': 'gap-2 sm:gap-3',
      'md': 'gap-3 sm:gap-4 md:gap-6',
      'lg': 'gap-4 sm:gap-6 md:gap-8',
      'xl': 'gap-6 sm:gap-8 md:gap-10'
    }

    let classes = columnClasses[cols] || columnClasses['auto']
    classes += ` ${gapClasses[gap]}`

    if (smCols) classes += ` ${columnClasses[smCols].replace('grid-cols-', 'sm:grid-cols-')}`
    if (mdCols) classes += ` ${columnClasses[mdCols].replace('grid-cols-', 'md:grid-cols-')}`
    if (lgCols) classes += ` ${columnClasses[lgCols].replace('grid-cols-', 'lg:grid-cols-')}`
    if (xlCols) classes += ` ${columnClasses[xlCols].replace('grid-cols-', 'xl:grid-cols-')}`

    return classes
  }

  const MotionDiv = motion.div

  return (
    <MotionDiv
      className={`grid ${getGridClasses()} ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      {...motionProps}
      {...props}
    >
      {children}
    </MotionDiv>
  )
}

/**
 * ResponsiveGridItem Component
 * 
 * Individual grid item with responsive behavior
 */
export const ResponsiveGridItem = ({
  children,
  span,
  smSpan,
  mdSpan,
  lgSpan,
  xlSpan,
  className = '',
  motionProps = {},
  ...props
}) => {
  const getSpanClasses = () => {
    const spanClasses = {
      '1': 'col-span-1',
      '2': 'col-span-2',
      '3': 'col-span-3',
      '4': 'col-span-4',
      '5': 'col-span-5',
      '6': 'col-span-6',
      '7': 'col-span-7',
      '8': 'col-span-8',
      '9': 'col-span-9',
      '10': 'col-span-10',
      '11': 'col-span-11',
      '12': 'col-span-12',
      'full': 'col-span-full',
      'auto': 'col-auto'
    }

    let classes = ''
    if (span) classes += `${spanClasses[span]} `
    if (smSpan) classes += `${spanClasses[smSpan].replace('col-span-', 'sm:col-span-')} `
    if (mdSpan) classes += `${spanClasses[mdSpan].replace('col-span-', 'md:col-span-')} `
    if (lgSpan) classes += `${spanClasses[lgSpan].replace('col-span-', 'lg:col-span-')} `
    if (xlSpan) classes += `${spanClasses[xlSpan].replace('col-span-', 'xl:col-span-')} `

    return classes.trim()
  }

  const MotionDiv = motion.div

  return (
    <MotionDiv
      className={`${getSpanClasses()} ${className}`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      {...motionProps}
      {...props}
    >
      {children}
    </MotionDiv>
  )
}

/**
 * Preset grid configurations for common layouts
 */
export const GridPresets = {
  // Dashboard KPI cards
  kpiCards: {
    cols: '1',
    smCols: '2',
    mdCols: '2',
    lgCols: '4',
    gap: 'md'
  },
  
  // Form layouts
  formFields: {
    cols: '1',
    smCols: '1',
    mdCols: '2',
    gap: 'md'
  },
  
  // Image galleries
  gallery: {
    cols: 'auto-sm',
    smCols: 'auto-sm',
    mdCols: '3',
    lgCols: '4',
    gap: 'sm'
  },
  
  // Content cards
  contentCards: {
    cols: '1',
    smCols: '2',
    mdCols: '2',
    lgCols: '3',
    gap: 'lg'
  },
  
  // Data tables and charts
  dataLayout: {
    cols: '1',
    lgCols: '3',
    gap: 'lg'
  },
  
  // Navigation items
  navigation: {
    cols: 'auto',
    smCols: 'auto',
    mdCols: '4',
    lgCols: '6',
    gap: 'sm'
  }
}

/**
 * Quick preset grid components
 */
export const KPIGrid = ({ children, ...props }) => (
  <ResponsiveGrid {...GridPresets.kpiCards} {...props}>
    {children}
  </ResponsiveGrid>
)

export const FormGrid = ({ children, ...props }) => (
  <ResponsiveGrid {...GridPresets.formFields} {...props}>
    {children}
  </ResponsiveGrid>
)

export const GalleryGrid = ({ children, ...props }) => (
  <ResponsiveGrid {...GridPresets.gallery} {...props}>
    {children}
  </ResponsiveGrid>
)

export const ContentGrid = ({ children, ...props }) => (
  <ResponsiveGrid {...GridPresets.contentCards} {...props}>
    {children}
  </ResponsiveGrid>
)

export const DataGrid = ({ children, ...props }) => (
  <ResponsiveGrid {...GridPresets.dataLayout} {...props}>
    {children}
  </ResponsiveGrid>
)

export default ResponsiveGrid
