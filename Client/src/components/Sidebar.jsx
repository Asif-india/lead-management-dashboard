import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  TrendingUp,
  Gift,
  Briefcase,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Bell,
  Search,
  User,
  Plus
} from 'lucide-react'
import { useAnalytics } from '../context/AnalyticsContext'
import { useAuth } from '../context/AuthContext'
import { getMenuItemsForRole, MENU_ITEMS } from '../config/rolePermissions'

const iconMap = {
  LayoutDashboard,
  Users,
  Plus,
  TrendingUp,
  Gift,
  Briefcase,
  User,
  Settings
}

const Sidebar = ({ isCollapsed, setIsCollapsed, isMobile, isTablet, isLargeScreen, isMobileOpen, setIsMobileOpen }) => {
  const location = useLocation()
  const [searchQuery, setSearchQuery] = useState('')
  const { totalLeads, pendingIncentives, approvedIncentives } = useAnalytics()
  const { user } = useAuth()

  // Get role-based menu items
  const userRole = user?.role?.toLowerCase() || 'sales_executive'
  const roleMenuItems = getMenuItemsForRole(userRole)
  
  // Convert menu items to use icon map
  const menuItems = roleMenuItems.map(item => ({
    ...item,
    icon: iconMap[item.icon] || Users,
    badge: item.badgeKey
  }))

  const filteredMenuItems = menuItems.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const sidebarVariants = {
    expanded: {
      width: isLargeScreen ? '320px' : '280px',
      transition: {
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    },
    collapsed: {
      width: isTablet ? '60px' : '80px',
      transition: {
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    },
    mobile: {
      x: isMobileOpen ? 0 : -280,
      transition: {
        duration: 0.3,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  }

  const menuItemVariants = {
    hidden: {
      opacity: 0,
      x: -30,
      scale: 0.8
    },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    },
    hover: {
      scale: 1.02,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 17
      }
    }
  }

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobile && isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setIsMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        variants={isMobile ? sidebarVariants : undefined}
        animate={isMobile ? 'mobile' : (isCollapsed ? 'collapsed' : 'expanded')}
        className={`
          fixed top-0 left-0 h-screen z-50 flex flex-col backdrop-blur-2xl
          ${isMobile ? 'shadow-2xl shadow-black/20' : 'shadow-xl shadow-black/10'}
          ${!isMobile && (isCollapsed ? 'w-20' : 'w-72')}
        `}
        style={{
          background: 'linear-gradient(to bottom, hsl(var(--card) / 0.9), hsl(var(--muted) / 0.8), hsl(var(--card) / 0.9))',
          borderColor: 'hsl(var(--border) / 0.1)'
        }}
      >
        {/* Logo Section */}
        <div className={`
          border-b backdrop-blur-sm
          ${isMobile ? 'p-4' : isTablet ? 'p-3' : isLargeScreen ? 'p-8' : 'p-6'}
        `}
        style={{ borderColor: 'hsl(var(--border) / 0.1)' }}
        >
          <div className="flex items-center justify-between">
            <motion.div
              animate={{
                opacity: isCollapsed ? 0 : 1,
                scale: isCollapsed ? 0.8 : 1
              }}
              transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="flex items-center space-x-3"
            >
              <div className={`
                bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25 relative overflow-hidden
                ${isTablet ? 'w-8 h-8' : isLargeScreen ? 'w-12 h-12' : 'w-10 h-10'}
              `}>
                <div className="absolute inset-0 bg-white/10 dark:bg-black/20 backdrop-blur-sm" />
                <LayoutDashboard className={`
                  text-white relative z-10
                  ${isTablet ? 'w-5 h-5' : isLargeScreen ? 'w-7 h-7' : 'w-6 h-6'}
                `} />
              </div>
              {!isCollapsed && (
                <div className="space-y-1">
                  <h1 className={`
                    font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent
                    ${isTablet ? 'text-lg' : isLargeScreen ? 'text-2xl' : 'text-xl'}
                  `}>SaaS Admin</h1>
                  <p className={`
                    text-muted-foreground font-medium
                    ${isTablet ? 'text-xs' : isLargeScreen ? 'text-sm' : 'text-xs'}
                  `}>Premium Dashboard</p>
                </div>
              )}
            </motion.div>

            {/* Collapse Toggle */}
            {!isMobile && !isTablet && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="hidden lg:flex items-center justify-center w-8 h-8 rounded-lg bg-muted text-muted-foreground hover:bg-muted/80 transition-colors"
              >
                {isCollapsed ? (
                  <ChevronRight className="w-4 h-4" />
                ) : (
                  <ChevronLeft className="w-4 h-4" />
                )}
              </motion.button>
            )}
          </div>
        </div>

        {/* Search Bar */}
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="p-4 border-b border-border/50"
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search menu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-muted/30 border border-input rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all"
              />
            </div>
          </motion.div>
        )}

        {/* Navigation Menu */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-2">
            {filteredMenuItems.map((item, index) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path

              return (
                <motion.div
                  key={item.name}
                  variants={menuItemVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                  transition={{ delay: index * 0.06 }}
                >
                  <Link
                    to={item.path}
                    onClick={() => isMobile && setIsMobileOpen(false)}
                    className={`
                      relative flex items-center px-4 py-3 rounded-xl transition-all duration-300 group
                      ${isActive
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-primary-foreground shadow-lg shadow-blue-500/25'
                        : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                      }
                    `}
                  >
                    {/* Active Indicator */}
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg shadow-blue-500/25"
                        transition={{ type: "tween", ease: "easeOut", duration: 0.15 }}
                      />
                    )}

                    {/* Menu Content */}
                    <div className="relative z-10 flex items-center w-full">
                      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-white/10 dark:bg-black/20 backdrop-blur-sm">
                        <Icon className="w-5 h-5 text-foreground" />
                      </div>

                      {!isCollapsed && (
                        <motion.div
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          transition={{ duration: 0.2 }}
                          className="flex-1 ml-3 flex items-center justify-between"
                        >
                          <span className="font-medium">{item.name}</span>
                          {item.badge && (
                            <span className="px-2 py-1 text-xs font-semibold bg-blue-600 dark:bg-white/10 text-white dark:text-white rounded-full">
                              {item.badge === 'totalLeads' ? totalLeads || 0 :
                               item.badge === 'pendingIncentives' ? pendingIncentives || 0 :
                               item.badge === 'approvedIncentives' ? (approvedIncentives || 0) :
                               item.badge}
                            </span>
                          )}
                        </motion.div>
                      )}
                    </div>

                    {/* Tooltip for collapsed state */}
                    {isCollapsed && (
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        whileHover={{ opacity: 1, x: 0 }}
                        className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground text-sm rounded-lg shadow-lg whitespace-nowrap pointer-events-none z-50"
                      >
                        {item.name}
                        {item.badge && (
                          <span className="ml-2 px-1 py-0.5 bg-primary text-primary-foreground text-xs rounded-full">
                            {item.badge}
                          </span>
                        )}
                      </motion.div>
                    )}
                  </Link>
                </motion.div>
              )
            })}
          </div>
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-border/50">
          <motion.div
            className="flex items-center space-x-3 p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-600 dark:bg-green-400 border-2 border-popover rounded-full" />
            </div>

            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="flex-1"
              >
                <p className="text-sm font-medium text-foreground">John Doe</p>
                <p className="text-xs text-muted-foreground">Administrator</p>
              </motion.div>
            )}

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </motion.button>
          </motion.div>
        </div>
      </motion.aside>
    </>
  )
}

export default Sidebar
