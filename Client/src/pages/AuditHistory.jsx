import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { auditLogsApi } from '../services/api'
import { PAGINATION } from '../constants'
import Modal from '../components/ui/Modal'
import { Search, Filter, Eye, Loader2, AlertCircle, ChevronLeft, ChevronRight, History, Clock, User, Shield } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const AuditHistory = () => {
  const formatRecordId = (id) => {
    if (!id) return '—';
    const value = String(id);
    if (value.length <= 14) return value;
    return `${value.slice(0, 8)}...${value.slice(-4)}`;
  };
  const navigate = useNavigate()
  const { user, loading: authLoading } = useAuth()
  const [auditLogs, setAuditLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedAction, setSelectedAction] = useState('all')
  const [selectedModule, setSelectedModule] = useState('all')
  const [showFilters, setShowFilters] = useState(false)

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(PAGINATION.DEFAULT_PAGE_SIZE)
  const [totalRecords, setTotalRecords] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  // Details modal state
  const [detailsModalOpen, setDetailsModalOpen] = useState(false)
  const [selectedAuditLog, setSelectedAuditLog] = useState(null)

  // Action options
  const actionOptions = [
    { value: 'all', label: 'All Actions' },
    { value: 'USER_CREATED', label: 'User Created' },
    { value: 'USER_ACTIVATED', label: 'User Activated' },
    { value: 'USER_DEACTIVATED', label: 'User Deactivated' },
    { value: 'USER_SUSPENDED', label: 'User Suspended' },
    { value: 'USER_REACTIVATED', label: 'User Reactivated' },
    { value: 'PASSWORD_CHANGED', label: 'Password Changed' },
    { value: 'PASSWORD_RESET', label: 'Password Reset' },
    { value: 'ROLE_CHANGED', label: 'Role Changed' },
    { value: 'EMAIL_CHANGED', label: 'Email Changed' },
    { value: 'EMPLOYEE_CREATED', label: 'Employee Created' },
    { value: 'EMPLOYEE_UPDATED', label: 'Employee Updated' },
    { value: 'EMPLOYEE_TERMINATED', label: 'Employee Terminated' },
    { value: 'EMPLOYEE_STATUS_CHANGED', label: 'Employee Status Changed' },
    { value: 'LEAD_CREATED', label: 'Lead Created' },
    { value: 'LEAD_UPDATED', label: 'Lead Updated' },
    { value: 'LEAD_DELETED', label: 'Lead Deleted' },
    { value: 'INCENTIVE_CREATED', label: 'Incentive Created' },
    { value: 'INCENTIVE_UPDATED', label: 'Incentive Updated' },
    { value: 'INCENTIVE_DELETED', label: 'Incentive Deleted' },
  ]

  // Module options
  const moduleOptions = [
    { value: 'all', label: 'All Modules' },
    { value: 'User', label: 'Users' },
    { value: 'Employee', label: 'Employees' },
    { value: 'Lead', label: 'Leads' },
    { value: 'Incentive', label: 'Incentives' },
    { value: 'LeadSource', label: 'Lead Sources' },
  ]

  // Check authorization
  useEffect(() => {
    if (!authLoading && user?.role !== 'administrator') {
      navigate('/admin/dashboard')
    }
  }, [authLoading, user, navigate])

  // Fetch audit logs from API
  useEffect(() => {
    if (authLoading) return

    const fetchAuditLogs = async () => {
      try {
        setLoading(true)
        setError(null)

        // Build query params
        const params = {
          page: currentPage,
          limit: pageSize
        }

        // Add search term if provided
        if (searchTerm) {
          params.search = searchTerm
        }

        // Add action filter if not 'all'
        if (selectedAction !== 'all') {
          params.action = selectedAction
        }

        // Add module filter if not 'all'
        if (selectedModule !== 'all') {
          params.entityType = selectedModule
        }

        const response = await auditLogsApi.getList(params)

        // Handle different API response structures
        const auditLogsData = Array.isArray(response) ? response : (response?.data?.data || response?.data || [])
        setAuditLogs(auditLogsData)

        // Extract pagination metadata
        const pagination = response?.data?.pagination || response?.pagination || {}
        setTotalRecords(pagination.total || 0)
        setTotalPages(pagination.totalPages || Math.ceil((pagination.total || 0) / pageSize))
      } catch (err) {
        console.error('Error fetching audit logs:', err)
        if (err.status === 401 || err.status === 403) {
          setError('You are not authorized to view audit history.')
        } else {
          setError('Failed to load audit history. Please try again.')
        }
        setAuditLogs([])
        setTotalRecords(0)
        setTotalPages(0)
      } finally {
        setLoading(false)
      }
    }

    fetchAuditLogs()
  }, [currentPage, pageSize, searchTerm, selectedAction, selectedModule, authLoading])

  const handleViewDetails = (log) => {
    setSelectedAuditLog(log)
    setDetailsModalOpen(true)
  }

  const formatDate = (dateString) => {
    if (!dateString) return '—'
    const date = new Date(dateString)
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
  }

  const getActionBadgeColor = (action) => {
    if (action.includes('CREATED')) return 'bg-green-100 text-green-800'
    if (action.includes('UPDATED')) return 'bg-blue-100 text-blue-800'
    if (action.includes('DELETED')) return 'bg-red-100 text-red-800'
    if (action.includes('SUSPENDED')) return 'bg-orange-100 text-orange-800'
    if (action.includes('ACTIVATED') || action.includes('REACTIVATED')) return 'bg-green-100 text-green-800'
    if (action.includes('DEACTIVATED')) return 'bg-red-100 text-red-800'
    if (action.includes('PASSWORD')) return 'bg-purple-100 text-purple-800'
    if (action.includes('ROLE') || action.includes('EMAIL')) return 'bg-yellow-100 text-yellow-800'
    return 'bg-gray-100 text-gray-800'
  }

  const formatActionLabel = (action) => {
    return action.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
  }

  const formatAuditValue = (value) => {
    if (!value) return '—'
    if (typeof value === 'object') {
      return JSON.stringify(value, null, 2)
    }
    return String(value)
  }

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (user?.role !== 'administrator') {
    return null
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-500/10 rounded-lg">
              <History className="w-6 h-6 text-purple-500" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">Audit History</h1>
          </div>
          <p className="text-muted-foreground ml-11">Track system activity and user actions</p>
        </div>

        {/* Filters */}
        <div className="bg-card border border-border rounded-xl p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search audit logs..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value)
                    setCurrentPage(1)
                  }}
                  className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-foreground"
                />
              </div>
            </div>

            {/* Action Filter */}
            <div className="lg:w-64">
              <select
                value={selectedAction}
                onChange={(e) => {
                  setSelectedAction(e.target.value)
                  setCurrentPage(1)
                }}
                className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-foreground"
              >
                {actionOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>

            {/* Module Filter */}
            <div className="lg:w-64">
              <select
                value={selectedModule}
                onChange={(e) => {
                  setSelectedModule(e.target.value)
                  setCurrentPage(1)
                }}
                className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-foreground"
              >
                {moduleOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            <span className="ml-3 text-muted-foreground">Loading audit history...</span>
          </div>
        ) : error ? (
          <div className="bg-card border border-border rounded-xl p-8 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-muted-foreground">{error}</p>
          </div>
        ) : auditLogs.length === 0 ? (
          <div className="bg-card border border-border rounded-xl p-8 text-center">
            <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No audit activity found</p>
          </div>
        ) : (
          <>
            {/* Table */}
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full" style={{ minWidth: '1000px' }}>
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider" style={{ minWidth: '170px' }}>
                        Date & Time
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider" style={{ minWidth: '150px' }}>
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider" style={{ minWidth: '150px' }}>
                        Action
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider" style={{ minWidth: '100px' }}>
                        Module
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider" style={{ minWidth: '140px' }}>
                        Record
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider" style={{ minWidth: '200px' }}>
                        Description
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider" style={{ minWidth: '120px' }}>
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {auditLogs.map((log) => (
                      <tr key={log._id} className="hover:bg-muted/30 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                          {formatDate(log.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-muted-foreground" />
                            {log.performedBy?.firstName && log.performedBy?.lastName
                              ? `${log.performedBy.firstName} ${log.performedBy.lastName}`
                              : log.performedBy?.email || 'Unknown'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getActionBadgeColor(log.action)}`}>
                            {formatActionLabel(log.action)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                          {log.entityType || '—'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                          <span
                            title={log.entityId || 'No record ID'}
                            className="font-mono"
                          >
                            {formatRecordId(log.entityId)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-muted-foreground max-w-xs truncate">
                          {log.description || '—'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button
                            onClick={() => handleViewDetails(log)}
                            className="text-purple-500 hover:text-purple-600 transition-colors flex items-center gap-1"
                          >
                            <Eye className="w-4 h-4" />
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            {totalRecords > pageSize && (
              <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-muted-foreground">
                  Showing {((currentPage - 1) * pageSize) + 1}–{Math.min(currentPage * pageSize, totalRecords)} of {totalRecords}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-card border border-border rounded-lg hover:bg-muted/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </button>
                  <div className="px-4 py-2 bg-card border border-border rounded-lg text-sm text-foreground">
                    Page {currentPage} of {totalPages}
                  </div>
                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-card border border-border rounded-lg hover:bg-muted/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </motion.div>

      {/* Details Modal */}
      <Modal
        isOpen={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        title="Audit Log Details"
      >
        {selectedAuditLog && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Action</label>
                <p className="text-foreground mt-1">{formatActionLabel(selectedAuditLog.action)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Timestamp</label>
                <p className="text-foreground mt-1">{formatDate(selectedAuditLog.createdAt)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Performed By</label>
                <p className="text-foreground mt-1">
                  {selectedAuditLog.performedBy?.firstName && selectedAuditLog.performedBy?.lastName
                    ? `${selectedAuditLog.performedBy.firstName} ${selectedAuditLog.performedBy.lastName}`
                    : selectedAuditLog.performedBy?.email || 'Unknown'}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Module</label>
                <p className="text-foreground mt-1">{selectedAuditLog.entityType || '—'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Record ID</label>
                <p className="text-foreground mt-1 font-mono text-xs break-all">{selectedAuditLog.entityId || '—'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Description</label>
                <p className="text-foreground mt-1">{selectedAuditLog.description || '—'}</p>
              </div>
            </div>

            {selectedAuditLog.ipAddress && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">IP Address</label>
                <p className="text-foreground mt-1 font-mono text-xs">{selectedAuditLog.ipAddress}</p>
              </div>
            )}

            {(selectedAuditLog.oldValue || selectedAuditLog.newValue) && (
              <div className="border-t border-border pt-4">
                <h3 className="text-sm font-medium text-foreground mb-3">Changes</h3>
                <div className="grid grid-cols-2 gap-4">
                  {selectedAuditLog.oldValue && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Before</label>
                      <pre className="mt-1 p-3 bg-muted/50 rounded-lg text-xs overflow-auto max-h-40 text-foreground whitespace-pre-wrap break-all">
                        {formatAuditValue(selectedAuditLog.oldValue)}
                      </pre>
                    </div>
                  )}
                  {selectedAuditLog.newValue && (
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">After</label>
                      <pre className="mt-1 p-3 bg-muted/50 rounded-lg text-xs overflow-auto max-h-40 text-foreground whitespace-pre-wrap break-all">
                        {formatAuditValue(selectedAuditLog.newValue)}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}

export default AuditHistory
