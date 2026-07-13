import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronUp, ChevronDown, MoreVertical, Search, Filter } from 'lucide-react'

/**
 * Table Component
 * 
 * A reusable table component with sorting, filtering, and pagination.
 * 
 * @param {Object} props - Component props
 * @param {Array} props.columns - Table columns configuration
 * @param {Array} props.data - Table data
 * @param {boolean} props.loading - Show loading state
 * @param {boolean} props.sortable - Enable sorting
 * @param {boolean} props.filterable - Enable filtering
 * @param {boolean} props.selectable - Enable row selection
 * @param {boolean} props.paginated - Enable pagination
 * @param {number} props.pageSize - Number of rows per page
 * @param {string} props.className - Additional CSS classes
 * @param {function} props.onRowClick - Row click handler
 * @param {function} props.onSort - Sort handler
 * @param {function} props.onFilter - Filter handler
 * @param {function} props.onSelectionChange - Selection change handler
 */
const Table = ({
  columns = [],
  data = [],
  loading = false,
  sortable = true,
  filterable = true,
  selectable = false,
  paginated = true,
  pageSize = 10,
  className = '',
  onRowClick,
  onSort,
  onFilter,
  onSelectionChange,
  ...props
}) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' })
  const [filters, setFilters] = useState({})
  const [selectedRows, setSelectedRows] = useState(new Set())
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  
  // Handle sorting
  const handleSort = (column) => {
    if (!sortable || !column.sortable) return
    
    const direction = sortConfig.key === column.key && sortConfig.direction === 'asc' ? 'desc' : 'asc'
    const newSortConfig = { key: column.key, direction }
    
    setSortConfig(newSortConfig)
    onSort && onSort(newSortConfig)
  }
  
  // Handle filtering
  const handleFilter = (column, value) => {
    const newFilters = { ...filters, [column.key]: value }
    setFilters(newFilters)
    onFilter && onFilter(newFilters)
  }
  
  // Handle row selection
  const handleRowSelect = (rowId) => {
    const newSelection = new Set(selectedRows)
    if (newSelection.has(rowId)) {
      newSelection.delete(rowId)
    } else {
      newSelection.add(rowId)
    }
    setSelectedRows(newSelection)
    onSelectionChange && onSelectionChange(newSelection)
  }
  
  // Handle select all
  const handleSelectAll = () => {
    if (selectedRows.size === filteredData.length) {
      setSelectedRows(new Set())
    } else {
      setSelectedRows(new Set(filteredData.map(row => row.id)))
    }
    onSelectionChange && onSelectionChange(selectedRows)
  }
  
  // Filter and sort data
  const filteredData = React.useMemo(() => {
    let result = [...data]
    
    // Apply search filter
    if (searchQuery) {
      result = result.filter(row =>
        columns.some(column =>
          String(row[column.key] || '').toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
    }
    
    // Apply column filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        result = result.filter(row =>
          String(row[key] || '').toLowerCase().includes(value.toLowerCase())
        )
      }
    })
    
    // Apply sorting
    if (sortConfig.key) {
      result.sort((a, b) => {
        const aValue = a[sortConfig.key]
        const bValue = b[sortConfig.key]
        
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1
        return 0
      })
    }
    
    return result
  }, [data, searchQuery, filters, sortConfig, columns])
  
  // Pagination
  const totalPages = Math.ceil(filteredData.length / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const paginatedData = paginated ? filteredData.slice(startIndex, startIndex + pageSize) : filteredData
  
  const MotionTr = motion.tr
  const MotionTd = motion.td
  
  return (
    <div className={`bg-card/50 border border-border rounded-2xl p-4 sm:p-5 md:p-6 backdrop-blur-sm ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6">
        <div className="flex items-center space-x-3 mb-4 sm:mb-0">
          {selectable && (
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedRows.size === filteredData.length && filteredData.length > 0}
                onChange={handleSelectAll}
                className="w-4 h-4 text-primary bg-muted border-input rounded focus:ring-primary"
              />
              <span className="text-sm text-muted-foreground">
                {selectedRows.size > 0 && `${selectedRows.size} selected`}
              </span>
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-3">
          {filterable && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 bg-muted/50 border border-input rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>
          )}
        </div>
      </div>
      
      {/* Table */}
      <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
        <table className="w-full min-w-full">
          <thead>
            <tr className="border-b border-border">
              {selectable && (
                <th className="text-left py-2 px-2 sm:py-3 sm:px-4">
                  <input
                    type="checkbox"
                    checked={selectedRows.size === filteredData.length && filteredData.length > 0}
                    onChange={handleSelectAll}
                    className="w-4 h-4 text-primary bg-muted border-input rounded focus:ring-primary"
                  />
                </th>
              )}
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="text-left py-2 px-2 sm:py-3 sm:px-4 font-medium text-muted-foreground text-sm sm:text-base"
                >
                  <div className="flex items-center space-x-2">
                    <span>{column.title}</span>
                    {sortable && column.sortable && (
                      <button
                        onClick={() => handleSort(column)}
                        className="flex flex-col items-center"
                      >
                        <ChevronUp
                          className={`w-3 h-3 ${
                            sortConfig.key === column.key && sortConfig.direction === 'asc'
                              ? 'text-primary'
                              : 'text-muted-foreground'
                          }`}
                        />
                        <ChevronDown
                          className={`w-3 h-3 -mt-1 ${
                            sortConfig.key === column.key && sortConfig.direction === 'desc'
                              ? 'text-primary'
                              : 'text-muted-foreground'
                          }`}
                        />
                      </button>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {loading ? (
                <tr>
                  <td colSpan={columns.length + (selectable ? 1 : 0)} className="py-8">
                    <div className="flex items-center justify-center space-x-3">
                      <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-muted-foreground">Loading...</span>
                    </div>
                  </td>
                </tr>
              ) : paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + (selectable ? 1 : 0)} className="py-8">
                    <div className="text-center text-muted-foreground">
                      No data available
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedData.map((row, index) => (
                  <MotionTr
                    key={row.id}
                    initial={{ opacity: 0, x: -30, scale: 0.98 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 30, scale: 0.98 }}
                    transition={{ 
                      delay: index * 0.06,
                      type: "spring",
                      stiffness: 300,
                      damping: 24
                    }}
                    whileHover={{ 
                      x: 8,
                      backgroundColor: 'hsl(var(--muted) / 0.3)',
                      transition: {
                        type: "spring",
                        stiffness: 400,
                        damping: 17
                      }
                    }}
                    className={`border-b border-border/30 transition-colors cursor-pointer ${
                      selectedRows.has(row.id) ? 'bg-muted/40' : ''
                    }`}
                    onClick={() => onRowClick && onRowClick(row)}
                  >
                    {selectable && (
                      <MotionTd className="py-2 px-2 sm:py-3 sm:px-4">
                        <input
                          type="checkbox"
                          checked={selectedRows.has(row.id)}
                          onChange={() => handleRowSelect(row.id)}
                          className="w-4 h-4 text-primary bg-muted border-input rounded focus:ring-primary"
                        />
                      </MotionTd>
                    )}
                    {columns.map((column) => (
                      <MotionTd key={column.key} className="py-2 px-2 sm:py-3 sm:px-4">
                        <div className="flex items-center space-x-2">
                          {column.render ? (
                            column.render(row[column.key], row)
                          ) : (
                            <span className="text-foreground text-sm sm:text-base">{row[column.key]}</span>
                          )}
                        </div>
                      </MotionTd>
                    ))}
                  </MotionTr>
                ))
              )}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      {paginated && totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-muted-foreground">
            Showing {startIndex + 1} to {Math.min(startIndex + pageSize, filteredData.length)} of {filteredData.length} results
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm border border-input rounded-lg text-muted-foreground hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <div className="flex items-center space-x-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = i + 1
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 text-sm rounded-lg ${
                      currentPage === page
                        ? 'bg-primary text-primary-foreground'
                        : 'border border-input text-muted-foreground hover:bg-muted'
                    }`}
                  >
                    {page}
                  </button>
                )
              })}
            </div>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-sm border border-input rounded-lg text-muted-foreground hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Table
