import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Menu, 
  X, 
  Home, 
  Info, 
  Contact, 
  Settings,
  ChevronDown 
} from 'lucide-react'
import { Button } from '@mui/material'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const location = useLocation()

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'About', href: '/about', icon: Info },
    { name: 'Contact', href: '/contact', icon: Contact },
  ]

  const dropdownItems = [
    { name: 'Profile', href: '/profile' },
    { name: 'Settings', href: '/settings', icon: Settings },
    { name: 'Dashboard', href: '/dashboard' },
  ]

  const isActive = (path) => location.pathname === path

  return (
    <header className="sticky top-0 z-50 glass border-b border-border/40">
      <div className="container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-2"
          >
            <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">M</span>
            </div>
            <span className="font-bold text-xl gradient-text">ModernApp</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-1 text-sm font-medium transition-colors hover:text-primary ${
                    isActive(item.href) 
                      ? 'text-primary' 
                      : 'text-muted-foreground'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              )
            })}
            
            {/* Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-1 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                <span>More</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-border py-2"
                >
                  {dropdownItems.map((item) => {
                    const Icon = item.icon
                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-muted-foreground hover:text-primary hover:bg-accent transition-colors"
                      >
                        {Icon && <Icon className="w-4 h-4" />}
                        <span>{item.name}</span>
                      </Link>
                    )
                  })}
                </motion.div>
              )}
            </div>
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="outlined" size="small">
              Sign In
            </Button>
            <Button variant="contained" size="small">
              Get Started
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md text-muted-foreground hover:text-primary hover:bg-accent transition-colors"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden border-t border-border/40 py-4"
          >
            <nav className="flex flex-col space-y-3">
              {navigation.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive(item.href)
                        ? 'text-primary bg-primary/10'
                        : 'text-muted-foreground hover:text-primary hover:bg-accent'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                )
              })}
              
              <div className="border-t border-border/40 pt-3 space-y-2">
                {dropdownItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm text-muted-foreground hover:text-primary hover:bg-accent transition-colors"
                    >
                      {Icon && <Icon className="w-4 h-4" />}
                      <span>{item.name}</span>
                    </Link>
                  )
                })}
              </div>
              
              <div className="border-t border-border/40 pt-3 space-y-2">
                <Button variant="outlined" size="small" className="w-full">
                  Sign In
                </Button>
                <Button variant="contained" size="small" className="w-full">
                  Get Started
                </Button>
              </div>
            </nav>
          </motion.div>
        )}
      </div>
    </header>
  )
}

export default Header
