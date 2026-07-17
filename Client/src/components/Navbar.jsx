import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  Menu,
  Bell,
  Search,
  Settings,
  User,
  LogOut,
  ChevronDown,
  Sun,
  Moon,
  HelpCircle
} from 'lucide-react'
import { useTheme } from '../hooks/useTheme'
import { useAuth } from '../context/AuthContext'

const Navbar = ({ isMobile, isTablet, isLargeScreen, setIsMobileOpen, isCollapsed }) => {
  const navigate = useNavigate()
  const [isScrolled, setIsScrolled] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const { isDark, toggleTheme } = useTheme()
  const { user, logout } = useAuth()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const notifications = [
    {
      id: 1,
      title: 'New lead assigned',
      description: 'John Smith from Tech Corp is now assigned to you',
      time: '2 min ago',
      read: false,
      type: 'lead'
    },
    {
      id: 2,
      title: 'Target achieved',
      description: 'You\'ve reached 100% of your monthly target',
      time: '1 hour ago',
      read: false,
      type: 'success'
    },
    {
      id: 3,
      title: 'System update',
      description: 'Dashboard will be updated tonight at 2 AM',
      time: '3 hours ago',
      read: true,
      type: 'system'
    },
    {
      id: 4,
      title: 'New feature available',
      description: 'Check out the new analytics dashboard',
      time: '1 day ago',
      read: true,
      type: 'feature'
    }
  ]

  const unreadCount = notifications.filter(n => !n.read).length
  const searchItems = [
    { name: 'Dashboard', path: '/admin/dashboard' },
    { name: 'Leads', path: '/admin/leads' },
    { name: 'Generate Lead', path: '/admin/generate-lead' },
    { name: 'Analytics', path: '/admin/analytics' },
    { name: 'Employees', path: '/admin/employees' },
    { name: 'Settings', path: '/admin/settings' },
  ]

  const filteredItems = searchItems.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const navbarVariants = {
    scrolled: {
      backdropFilter: 'blur(16px)',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      transition: {
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    },
    top: {
      backdropFilter: 'blur(12px)',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
      transition: {
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  }

  const dropdownVariants = {
    hidden: {
      opacity: 0,
      y: -15,
      scale: 0.95,
      transition: {
        duration: 0.2,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: [0.25, 0.46, 0.45, 0.94],
        staggerChildren: 0.05
      }
    },
    exit: {
      opacity: 0,
      y: -15,
      scale: 0.95,
      transition: {
        duration: 0.2,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  }

  const notificationItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    }
  }

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'lead':
        return '👤'
      case 'success':
        return '🎯'
      case 'system':
        return '⚙️'
      case 'feature':
        return '✨'
      default:
        return '📢'
    }
  }

  return (
    <>
      <motion.nav
        variants={navbarVariants}
        animate={isScrolled ? 'scrolled' : 'top'}
        className={"fixed top-0 right-0 z-40 transition-all duration-300 backdrop-blur-2xl bg-card/80 " + (isScrolled ? 'bg-card/95' : '') + " " + (isMobile ? 'left-0' : isTablet ? (isCollapsed ? 'left-16' : 'left-64') : (isCollapsed ? 'left-20' : 'left-72'))}
      >
        <div className={"flex items-center justify-between relative " + (isMobile ? 'h-14 px-4' : isTablet ? 'h-16 px-5' : isLargeScreen ? 'h-18 px-8' : 'h-16 px-6')}>
          {/* Navbar Background */}
          <div className="absolute inset-0 backdrop-blur-2xl border-b border-border/10" />
          {/* Left Section */}
          <div className="flex items-center space-x-4 relative z-10">
            {/* Mobile Menu Toggle */}
            {isMobile && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsMobileOpen(true)}
                className="p-2 rounded-xl backdrop-blur-sm bg-muted/50 text-muted-foreground transition-all duration-200 lg:hidden shadow-lg"
              >
                <Menu className="w-5 h-5" />
              </motion.button>
            )}

            {/* Search Bar */}
            <div className={"relative " + (isMobile ? 'hidden' : isTablet ? 'hidden lg:block' : 'hidden md:block')}>
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 z-10 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search anything..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                }}
                className={"backdrop-blur-sm border rounded-2xl focus:outline-none focus:ring-2 transition-all duration-200 shadow-lg bg-muted/30 border-border/10 text-foreground placeholder:text-muted-foreground " + (isTablet ? 'w-48 pl-9 pr-3 py-1.5 text-sm' : isLargeScreen ? 'w-96 pl-12 pr-5 py-2.5' : 'w-64 lg:w-80 pl-10 pr-4 py-2')}
              />
              {searchQuery && (
                <div className="absolute top-full left-0 mt-2 w-full rounded-2xl shadow-2xl overflow-hidden z-50 bg-popover border-border/10">
                  {filteredItems.length > 0 ? (
                    filteredItems.map((item) => (
                      <div
                        key={item.path}
                        onClick={() => {
                          navigate(item.path)
                          setSearchQuery('')
                        }}
                        className="px-4 py-3 cursor-pointer transition-all duration-200 hover:bg-muted text-foreground"
                      >
                        {item.name}
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-muted-foreground">
                      No results found
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-2 relative z-10">
            {/* Theme Toggle */}
            <motion.button
              whileHover={{ scale: 1.05, y: -1 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className={"flex items-center justify-center rounded-xl bg-muted backdrop-blur-sm text-muted-foreground hover:bg-muted/80 transition-all duration-200 shadow-lg hover:shadow-xl " + (isMobile ? 'hidden' : isTablet ? 'hidden sm:flex' : 'hidden sm:flex') + " " + (isTablet ? 'w-8 h-8' : 'w-10 h-10')}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </motion.button>

            {/* Help */}
            <motion.button
              whileHover={{ scale: 1.05, y: -1 }}
              whileTap={{ scale: 0.95 }}
              className="hidden sm:flex items-center justify-center w-10 h-10 rounded-xl bg-muted backdrop-blur-sm text-muted-foreground hover:bg-muted/80 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <HelpCircle className="w-4 h-4" />
            </motion.button>

            {/* Notifications */}
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.05, y: -1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setShowNotifications(!showNotifications)
                  setShowProfile(false)
                }}
                className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-muted backdrop-blur-sm text-muted-foreground hover:bg-muted/80 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg"
                  >
                    {unreadCount}
                  </motion.span>
                )}
              </motion.button>

              {/* Notifications Dropdown */}
              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    variants={dropdownVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="absolute right-0 mt-3 w-80 bg-popover/90 backdrop-blur-2xl border border-border rounded-2xl shadow-2xl shadow-black/20 overflow-hidden"
                  >
                    <div className="p-4 border-b border-border">
                      <h3 className="text-foreground font-semibold">Notifications</h3>
                      <p className="text-muted-foreground text-sm">{unreadCount} unread</p>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.map((notification, index) => (
                        <motion.div
                          key={notification.id}
                          variants={notificationItemVariants}
                          whileHover={{
                            x: 5,
                            transition: {
                              type: "spring",
                              stiffness: 400,
                              damping: 17
                            }
                          }}
                          className={"p-4 border-b border-border/50 cursor-pointer transition-colors hover:bg-muted/50 " + (!notification.read ? 'bg-primary/5' : '')}
                        >
                          <div className="flex items-start space-x-3">
                            <div className="text-2xl">{getNotificationIcon(notification.type)}</div>
                            <div className="flex-1 min-w-0">
                              <p className="text-foreground font-medium text-sm">{notification.title}</p>
                              <p className="text-muted-foreground text-sm mt-1">{notification.description}</p>
                              <p className="text-muted-foreground text-xs mt-2">{notification.time}</p>
                            </div>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                    <div className="p-3 border-t border-border">
                      <button className="w-full text-center text-primary hover:text-primary/90 text-sm font-medium transition-colors">
                        Mark all as read
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Profile */}
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setShowProfile(!showProfile)
                  setShowNotifications(false)
                }}
                className="flex items-center space-x-2 p-2 rounded-xl bg-muted backdrop-blur-sm hover:bg-muted/80 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <div className="relative">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-500 border-2 border-popover rounded-full shadow-lg" />
                </div>
                <ChevronDown className={"w-4 h-4 text-muted-foreground transition-transform duration-200 " + (showProfile ? 'rotate-180' : '')} />
              </motion.button>

              {/* Profile Dropdown */}
              <AnimatePresence>
                {showProfile && (
                  <motion.div
                    variants={dropdownVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="absolute right-0 mt-2 w-56 bg-popover border border-border rounded-xl shadow-2xl overflow-hidden backdrop-blur-xl"
                  >
                    <div className="p-4 border-b border-border">
                      <p className="text-foreground font-semibold">{user?.name || user?.email || 'User'}</p>
                      <p className="text-muted-foreground text-sm">{user?.email || 'No email'}</p>
                    </div>
                    <div className="py-2">
                      <motion.button
                        whileHover={{
                          x: 5,
                          transition: {
                            type: "spring",
                            stiffness: 400,
                            damping: 17
                          }
                        }}
                        className="w-full px-4 py-2 text-left text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors flex items-center space-x-3"
                      >
                        <User className="w-4 h-4" />
                        <span>Profile</span>
                      </motion.button>
                      <motion.button
                        whileHover={{
                          x: 5,
                          transition: {
                            type: "spring",
                            stiffness: 400,
                            damping: 17
                          }
                        }}
                        onClick={() => navigate('/admin/settings')}
                        className="w-full px-4 py-2 text-left text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors flex items-center space-x-3"
                      >
                        <Settings className="w-4 h-4" />
                        <span>Settings</span>
                      </motion.button>
                      <div className="border-t border-border my-2" />
                      <motion.button
                        whileHover={{
                          x: 5,
                          transition: {
                            type: "spring",
                            stiffness: 400,
                            damping: 17
                          }
                        }}
                        onClick={logout}
                        className="w-full px-4 py-2 text-left text-red-400 hover:text-red-300 hover:bg-destructive/10 transition-colors flex items-center space-x-3"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Click outside to close dropdowns */}
      {(showNotifications || showProfile) && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => {
            setShowNotifications(false)
            setShowProfile(false)
          }}
        />
      )}
    </>
  )
}

export default Navbar
