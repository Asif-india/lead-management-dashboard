import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

// Hooks
import { useBreakpoint, useLocalStorage, useTheme } from '../hooks'

// Components
import { Sidebar, Navbar } from '../components'

// Constants
import { STORAGE_KEYS, BREAKPOINTS, ANIMATION_DURATIONS } from '../constants'

// Animation configurations
const mainContentVariants = {
  mobile: { marginLeft: 0 },
  collapsed: { marginLeft: 0 },
  expanded: { marginLeft: 0 }
}

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 300 } },
  exit: { opacity: 0, y: -20, transition: { duration: 150 } }
}

const sectionVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 600 } }
}

const MainLayout = () => {
  const location = useLocation()

  // Initialize theme globally
  useTheme()

  // Use custom hooks for responsive behavior and localStorage
  const { is } = useBreakpoint()

  const isMobile = is.mobile
  const isTablet = is.tablet
  const isLargeScreen = is.large

  const [isCollapsed, setIsCollapsed] = useLocalStorage(
    STORAGE_KEYS.SIDEBAR_STATE,
    false
  )

  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const mobileOpenRef = useRef(false)

  // Use ref to persist mobile open state across StrictMode re-renders
  const getMobileOpen = () => mobileOpenRef.current
  const setMobileOpen = (value) => {
    mobileOpenRef.current = value
    setIsMobileOpen(value)
  }

  // Effective collapsed state: mobile always expanded, desktop uses persisted value
  const effectiveIsCollapsed = isMobile ? false : isCollapsed

  // Auto-collapse sidebar on tablet
  useEffect(() => {
    if (isTablet) {
      setIsCollapsed(true)
    }
  }, [isTablet, setIsCollapsed])

  // Close mobile menu when route changes
  useEffect(() => {
    if (getMobileOpen()) {
      setMobileOpen(false)
    }
  }, [location.pathname])

  // Memoize sidebar props for performance
  const sidebarProps = useMemo(() => ({
    isCollapsed: effectiveIsCollapsed,
    setIsCollapsed,
    isMobile,
    isTablet,
    isLargeScreen,
    isMobileOpen: getMobileOpen(),
    setIsMobileOpen: setMobileOpen
  }), [effectiveIsCollapsed, setIsCollapsed, isMobile, isTablet, isLargeScreen, isMobileOpen])

  // Memoize navbar props for performance
  const navbarProps = useMemo(() => ({
    isMobile,
    isTablet,
    isLargeScreen,
    isCollapsed: effectiveIsCollapsed,
    setIsMobileOpen: setMobileOpen
  }), [isMobile, isTablet, isLargeScreen, effectiveIsCollapsed])

  const mainContentVariants = {
    expanded: {
      marginLeft: '280px',
      transition: {
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    },
    collapsed: {
      marginLeft: '80px',
      transition: {
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    },
    mobile: {
      marginLeft: '0px',
      transition: {
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  }

  const pageVariants = {
    initial: {
      opacity: 0,
      x: 20,
      scale: 0.98
    },
    animate: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94],
        staggerChildren: 0.1
      }
    },
    exit: {
      opacity: 0,
      x: -20,
      scale: 0.98,
      transition: {
        duration: 0.3,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  }

  const sectionVariants = {
    initial: {
      opacity: 0,
      y: 30
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  }

  return (
    <div className="h-screen overflow-hidden bg-background">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(59,130,246,0.1)_0%,transparent_50%)] opacity-30" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(168,85,247,0.1)_0%,transparent_50%)] opacity-30" />
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      {/* Sidebar */}
      <Sidebar
        isCollapsed={effectiveIsCollapsed}
        setIsCollapsed={setIsCollapsed}
        isMobile={isMobile}
        isTablet={isTablet}
        isLargeScreen={isLargeScreen}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      {/* Navbar */}
      <Navbar
        isMobile={isMobile}
        isTablet={isTablet}
        isLargeScreen={isLargeScreen}
        setIsMobileOpen={setIsMobileOpen}
        isCollapsed={effectiveIsCollapsed}
      />

      {/* Main Content */}
      <motion.main
        variants={mainContentVariants}
        animate={isMobile ? 'mobile' : effectiveIsCollapsed ? 'collapsed' : 'expanded'}
        className="h-screen overflow-y-auto relative z-10"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className={`relative min-h-full ${isMobile
              ? 'px-4 pt-20 pb-6'
              : isTablet
                ? 'px-6 pt-20 pb-8'
                : 'px-8 pt-20 pb-8'
              }`}
          >
            {/* Content Background */}
            <div className="absolute inset-0 bg-surface/30 backdrop-blur-sm rounded-2xl border border-border/20 pointer-events-none" />
            <motion.div
              variants={sectionVariants}
              initial="initial"
              animate="animate"
              className="relative z-50 max-w-full overflow-x-hidden pointer-events-auto"
            >
              <Outlet />
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </motion.main>

      {/* Mobile Background Overlay */}
      <AnimatePresence>
        {isMobile && getMobileOpen() && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default MainLayout
