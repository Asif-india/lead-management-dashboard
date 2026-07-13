import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, Clock, TrendingUp } from 'lucide-react'

/**
 * SearchBar Component
 * 
 * A reusable search bar with suggestions, recent searches, and keyboard navigation.
 * 
 * @param {Object} props - Component props
 * @param {string} props.placeholder - Placeholder text
 * @param {string} props.value - Current search value
 * @param {function} props.onChange - Change handler
 * @param {function} props.onSearch - Search handler
 * @param {function} props.onClear - Clear handler
 * @param {Array} props.suggestions - Search suggestions array
 * @param {Array} props.recentSearches - Recent searches array
 * @param {boolean} props.showSuggestions - Show suggestions dropdown
 * @param {boolean} props.showRecentSearches - Show recent searches
 * @param {boolean} props.loading - Show loading state
 * @param {boolean} props.fullWidth - Full width search bar
 * @param {string} props.size - Search bar size ('sm', 'md', 'lg')
 * @param {string} props.className - Additional CSS classes
 * @param {Object} props.motionProps - Framer Motion props
 */
const SearchBar = ({
  placeholder = 'Search...',
  value = '',
  onChange,
  onSearch,
  onClear,
  suggestions = [],
  recentSearches = [],
  showSuggestions = true,
  showRecentSearches = true,
  loading = false,
  fullWidth = false,
  size = 'md',
  className = '',
  motionProps = {},
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const inputRef = useRef(null)
  const dropdownRef = useRef(null)
  
  const hasValue = value.length > 0
  const filteredSuggestions = suggestions.filter(item =>
    item.toLowerCase().includes(value.toLowerCase())
  )
  const showDropdown = isFocused && (showSuggestions && filteredSuggestions.length > 0 || showRecentSearches && recentSearches.length > 0 && !hasValue)
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-3 text-base'
  }
  
  const handleKeyDown = (e) => {
    const items = showSuggestions ? filteredSuggestions : recentSearches
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(prev => (prev + 1) % items.length)
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prev => prev <= 0 ? items.length - 1 : prev - 1)
        break
      case 'Enter':
        e.preventDefault()
        if (selectedIndex >= 0 && items[selectedIndex]) {
          const selectedItem = items[selectedIndex]
          onChange(selectedItem)
          onSearch && onSearch(selectedItem)
          setIsFocused(false)
          setSelectedIndex(-1)
        } else {
          onSearch && onSearch(value)
        }
        break
      case 'Escape':
        setIsFocused(false)
        setSelectedIndex(-1)
        inputRef.current?.blur()
        break
    }
  }
  
  const handleSuggestionClick = (item) => {
    onChange(item)
    onSearch && onSearch(item)
    setIsFocused(false)
    setSelectedIndex(-1)
  }
  
  const handleClear = () => {
    onChange('')
    onClear && onClear()
    inputRef.current?.focus()
  }
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsFocused(false)
        setSelectedIndex(-1)
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])
  
  const MotionInput = motion.input
  
  return (
    <div className={`relative ${fullWidth ? 'w-full' : ''} ${className}`} ref={dropdownRef}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
        
        <MotionInput
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          placeholder={placeholder}
          className={`w-full ${sizeClasses[size]} bg-slate-800/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pl-10 pr-10 transition-all duration-200`}
          animate={{
            borderColor: isFocused ? '#3b82f6' : '#475569'
          }}
          transition={{ duration: 0.2 }}
          {...motionProps}
          {...props}
        />
        
        {hasValue && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
        
        {loading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>
      
      {/* Dropdown */}
      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 bg-slate-800 border border-slate-700 rounded-xl shadow-xl z-50 max-h-64 overflow-y-auto"
          >
            {!hasValue && showRecentSearches && recentSearches.length > 0 && (
              <div className="p-2">
                <div className="flex items-center space-x-2 px-3 py-2 text-xs text-slate-500 font-medium">
                  <Clock className="w-3 h-3" />
                  <span>Recent Searches</span>
                </div>
                {recentSearches.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(item)}
                    className={`w-full text-left px-3 py-2 text-sm text-slate-300 hover:bg-slate-700 rounded-lg transition-colors flex items-center space-x-2 ${
                      selectedIndex === index ? 'bg-slate-700' : ''
                    }`}
                  >
                    <Clock className="w-3 h-3 text-slate-500" />
                    <span>{item}</span>
                  </button>
                ))}
              </div>
            )}
            
            {hasValue && showSuggestions && filteredSuggestions.length > 0 && (
              <div className="p-2">
                <div className="flex items-center space-x-2 px-3 py-2 text-xs text-slate-500 font-medium">
                  <TrendingUp className="w-3 h-3" />
                  <span>Suggestions</span>
                </div>
                {filteredSuggestions.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(item)}
                    className={`w-full text-left px-3 py-2 text-sm text-slate-300 hover:bg-slate-700 rounded-lg transition-colors flex items-center space-x-2 ${
                      selectedIndex === index ? 'bg-slate-700' : ''
                    }`}
                  >
                    <Search className="w-3 h-3 text-slate-500" />
                    <span>{item}</span>
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default SearchBar
