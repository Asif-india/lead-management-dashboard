import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { leadsApi, clearCacheEntry } from '../services/api'
import { PAGINATION } from '../constants'
import Modal, { ConfirmModal } from '../components/ui/Modal'
import { Plus, Search, Filter, Download, Eye, Edit, Trash2, User, Building, Loader2, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const Leads = () => {
  const navigate = useNavigate()
  const { loading: authLoading } = useAuth()
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [showFilters, setShowFilters] = useState(false)
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(PAGINATION.DEFAULT_PAGE_SIZE)
  const [totalRecords, setTotalRecords] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  // Lead actions state
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [selectedLead, setSelectedLead] = useState(null)
  const [viewLeadLoading, setViewLeadLoading] = useState(false)
  const [viewLeadError, setViewLeadError] = useState(null)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [leadToDelete, setLeadToDelete] = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  // Fetch leads from API with pagination and filters
  useEffect(() => {
    if (authLoading) return

    const fetchLeads = async () => {
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

        // Add status filter if not 'all'
        if (selectedStatus !== 'all') {
          params.status = selectedStatus
        }

        const response = await leadsApi.getList(params)

        // Handle different API response structures
        const leadsData = Array.isArray(response) ? response : (response?.data?.data || response?.data || [])
        setLeads(leadsData)

        // Extract pagination metadata
        const pagination = response?.data?.pagination || response?.pagination || {}
        setTotalRecords(pagination.total || 0)
        setTotalPages(pagination.totalPages || Math.ceil((pagination.total || 0) / pageSize))
      } catch (err) {
        console.error('Error fetching leads:', err)
        setError('Failed to load leads. Please try again.')
        setLeads([])
        setTotalRecords(0)
        setTotalPages(0)
      } finally {
        setLoading(false)
      }
    }

    fetchLeads()
  }, [currentPage, pageSize, searchTerm, selectedStatus])

  const statusColors = {
    new: 'bg-blue-100 text-blue-800',
    contacted: 'bg-cyan-100 text-cyan-800',
    qualified: 'bg-yellow-100 text-yellow-800',
    proposal: 'bg-orange-100 text-orange-800',
    negotiation: 'bg-indigo-100 text-indigo-800',
    won: 'bg-purple-100 text-purple-800',
    lost: 'bg-red-100 text-red-800'
  }

  // Calculate stats from current page data
  const totalLeads = totalRecords
  const newLeads = leads.filter(l => l.leadStatus === 'new').length
  const contactedLeads = leads.filter(l => l.leadStatus === 'contacted').length
  const qualifiedLeads = leads.filter(l => l.leadStatus === 'qualified').length
  const proposalLeads = leads.filter(l => l.leadStatus === 'proposal').length
  const negotiationLeads = leads.filter(l => l.leadStatus === 'negotiation').length
  const wonLeads = leads.filter(l => l.leadStatus === 'won').length
  const lostLeads = leads.filter(l => l.leadStatus === 'lost').length

  // Pagination handlers
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage)
    }
  }

  const handlePageSizeChange = (newSize) => {
    setPageSize(newSize)
    setCurrentPage(1) // Reset to first page when changing page size
  }

  const calculateShowingRange = () => {
    if (totalRecords === 0) return '0–0'
    const start = (currentPage - 1) * pageSize + 1
    const end = Math.min(currentPage * pageSize, totalRecords)
    return `${start}–${end}`
  }

  // View Lead handler
  const handleViewLead = async (leadId) => {
    try {
      setViewLeadLoading(true)
      setViewLeadError(null)
      setSelectedLead(null)
      setViewModalOpen(true)

      const response = await leadsApi.getById(leadId)
      const leadData = response?.data || response
      setSelectedLead(leadData)
    } catch (err) {
      console.error('Error fetching lead:', err)
      setViewLeadError('Failed to load lead details')
    } finally {
      setViewLeadLoading(false)
    }
  }

  // Edit Lead handler
  const handleEditLead = (leadId) => {
    navigate(`/admin/generate-lead?edit=${leadId}`)
  }

  // Delete Lead handlers
  const handleDeleteClick = (lead) => {
    setLeadToDelete(lead)
    setDeleteConfirmOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!leadToDelete) return

    try {
      setDeleteLoading(true)
      await leadsApi.delete(leadToDelete._id)
      setDeleteConfirmOpen(false)
      setLeadToDelete(null)
      clearCacheEntry('/leads', 'GET')

      // Check if current page will be empty after deletion
      const isLastPage = currentPage === totalPages
      const isOnlyItemOnPage = leads.length === 1

      if (isLastPage && isOnlyItemOnPage && currentPage > 1) {
        // Navigate to previous page
        setCurrentPage(currentPage - 1)
      } else {
        // Refresh current page
        const fetchLeads = async () => {
          try {
            setLoading(true)
            const params = {
              page: currentPage,
              limit: pageSize
            }
            if (searchTerm) params.search = searchTerm
            if (selectedStatus !== 'all') params.status = selectedStatus

            const response = await leadsApi.getList(params)
            const leadsData = Array.isArray(response) ? response : (response?.data?.data || response?.data || [])
            setLeads(leadsData)

            const pagination = response?.data?.pagination || response?.pagination || {}
            setTotalRecords(pagination.total || 0)
            setTotalPages(pagination.totalPages || Math.ceil((pagination.total || 0) / pageSize))
          } catch (err) {
            console.error('Error refreshing leads:', err)
            setError('Failed to refresh leads')
          } finally {
            setLoading(false)
          }
        }
        fetchLeads()
      }
    } catch (err) {
      console.error('Error deleting lead:', err)
      alert('Failed to delete lead. Please try again.')
    } finally {
      setDeleteLoading(false)
    }
  }


  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="p-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Leads Management</h1>
            <p className="text-muted-foreground">Manage and track your sales leads</p>
          </div>
          <div className="flex items-center space-x-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center space-x-2 px-4 py-2 bg-card border border-border text-foreground hover:bg-accent rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Export</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/admin/generate-lead')}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Lead</span>
            </motion.button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search leads..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-card border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 px-4 py-2 bg-card border border-border text-foreground hover:bg-accent rounded-lg transition-colors"
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
          </motion.button>
        </div>

        {/* Filter Options */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 p-4 bg-card rounded-lg border border-border"
          >
            <div className="flex flex-wrap gap-2">
              {['all', 'new', 'contacted', 'qualified', 'proposal', 'negotiation', 'won', 'lost'].map(status => (
                <button
                  key={status}
                  onClick={() => setSelectedStatus(status)}
                  className={"px-3 py-1 rounded-full text-sm font-medium transition-colors " + (
                    selectedStatus === status
                      ? 'bg-blue-500 text-white'
                      : 'bg-card border border-border text-foreground hover:bg-accent'
                  )}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Stats Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div
          whileHover={{ y: -2 }}
          className="bg-card rounded-xl p-6 border border-border"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-500 rounded-lg opacity-20"></div>
          </div>
          <h3 className="text-2xl font-bold text-foreground mb-1">{totalLeads}</h3>
          <p className="text-muted-foreground text-sm">Total Leads</p>
        </motion.div>
        <motion.div
          whileHover={{ y: -2 }}
          className="bg-card rounded-xl p-6 border border-border"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-500 rounded-lg opacity-20"></div>
          </div>
          <h3 className="text-2xl font-bold text-foreground mb-1">{newLeads}</h3>
          <p className="text-muted-foreground text-sm">New</p>
        </motion.div>
        <motion.div
          whileHover={{ y: -2 }}
          className="bg-card rounded-xl p-6 border border-border"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-cyan-500 rounded-lg opacity-20"></div>
          </div>
          <h3 className="text-2xl font-bold text-foreground mb-1">{contactedLeads}</h3>
          <p className="text-muted-foreground text-sm">Contacted</p>
        </motion.div>
        <motion.div
          whileHover={{ y: -2 }}
          className="bg-card rounded-xl p-6 border border-border"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-yellow-500 rounded-lg opacity-20"></div>
          </div>
          <h3 className="text-2xl font-bold text-foreground mb-1">{qualifiedLeads}</h3>
          <p className="text-muted-foreground text-sm">Qualified</p>
        </motion.div>
        <motion.div
          whileHover={{ y: -2 }}
          className="bg-card rounded-xl p-6 border border-border"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-500 rounded-lg opacity-20"></div>
          </div>
          <h3 className="text-2xl font-bold text-foreground mb-1">{proposalLeads}</h3>
          <p className="text-muted-foreground text-sm">Proposal</p>
        </motion.div>
        <motion.div
          whileHover={{ y: -2 }}
          className="bg-card rounded-xl p-6 border border-border"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-indigo-500 rounded-lg opacity-20"></div>
          </div>
          <h3 className="text-2xl font-bold text-foreground mb-1">{negotiationLeads}</h3>
          <p className="text-muted-foreground text-sm">Negotiation</p>
        </motion.div>
        <motion.div
          whileHover={{ y: -2 }}
          className="bg-card rounded-xl p-6 border border-border"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-500 rounded-lg opacity-20"></div>
          </div>
          <h3 className="text-2xl font-bold text-foreground mb-1">{wonLeads}</h3>
          <p className="text-muted-foreground text-sm">Won</p>
        </motion.div>
        <motion.div
          whileHover={{ y: -2 }}
          className="bg-card rounded-xl p-6 border border-border"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-red-500 rounded-lg opacity-20"></div>
          </div>
          <h3 className="text-2xl font-bold text-foreground mb-1">{lostLeads}</h3>
          <p className="text-muted-foreground text-sm">Lost</p>
        </motion.div>
      </motion.div>

      {/* Loading State */}
      {loading && (
        <motion.div variants={itemVariants} className="bg-card rounded-xl border border-border p-12 flex flex-col items-center justify-center">
          <Loader2 className="w-8 h-8 text-muted-foreground animate-spin mb-4" />
          <p className="text-muted-foreground">Loading leads...</p>
        </motion.div>
      )}

      {/* Error State */}
      {error && (
        <motion.div variants={itemVariants} className="bg-card rounded-xl border border-border p-12 flex flex-col items-center justify-center">
          <AlertCircle className="w-8 h-8 text-red-500 mb-4" />
          <p className="text-foreground mb-2">Error loading leads</p>
          <p className="text-muted-foreground text-sm">{error}</p>
        </motion.div>
      )}

      {/* Empty State */}
      {!loading && !error && leads.length === 0 && (
        <motion.div variants={itemVariants} className="bg-card rounded-xl border border-border p-12 flex flex-col items-center justify-center">
          <User className="w-12 h-12 text-muted-foreground mb-4" />
          <p className="text-foreground mb-2">No leads found</p>
          <p className="text-muted-foreground text-sm mb-4">Get started by creating your first lead</p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/admin/generate-lead')}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Lead</span>
          </motion.button>
        </motion.div>
      )}

      {/* Leads Table */}
      {!loading && !error && leads.length > 0 && (
        <motion.div variants={itemVariants} className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted border-b border-border">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-foreground uppercase tracking-wider">Lead</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-foreground uppercase tracking-wider">University</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-foreground uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-foreground uppercase tracking-wider">Assigned To</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-foreground uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {leads.length > 0 ? (
                  leads.map((lead, index) => (
                    <motion.tr
                      key={lead._id || index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-muted/50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center mr-3">
                              <User className="w-4 h-4 text-foreground" />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-foreground">{lead.employeeName || lead.studentName || 'Unknown'}</div>
                              <div className="text-sm text-muted-foreground">{lead.email || 'No email'}</div>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-foreground">
                          <Building className="w-4 h-4 mr-2" />
                          {lead.university || 'Not specified'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={"px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full " + (statusColors[lead.leadStatus] || 'bg-gray-100 text-gray-800')}>
                          {lead.leadStatus || 'Unknown'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                        {lead.assignedTo || 'Unassigned'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleViewLead(lead._id)}
                            className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleEditLead(lead._id)}
                            className="p-1.5 rounded-lg bg-muted text-muted-foreground hover:bg-accent hover:text-green-400 transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleDeleteClick(lead)}
                            className="p-1.5 rounded-lg bg-muted text-muted-foreground hover:bg-accent hover:text-red-400 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-muted-foreground">
                      No leads found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* Pagination */}
      {!loading && !error && totalRecords > 0 && (
        <motion.div variants={itemVariants} className="mt-6 bg-card rounded-xl border border-border p-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Showing info */}
            <div className="text-sm text-muted-foreground">
              Showing <span className="font-medium text-foreground">{calculateShowingRange()}</span> of{' '}
              <span className="font-medium text-foreground">{totalRecords}</span> Leads
            </div>

            <div className="flex items-center gap-4">
              {/* Page size selector */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Rows per page:</span>
                <select
                  value={pageSize}
                  onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                  className="px-3 py-1.5 bg-background border border-border rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {PAGINATION.PAGE_SIZES.map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
              </div>

              {/* Page navigation */}
              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: currentPage > 1 ? 1.05 : 1 }}
                  whileTap={{ scale: currentPage > 1 ? 0.95 : 1 }}
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-border hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </motion.button>

                <div className="flex items-center gap-1">
                  <span className="px-3 py-1.5 text-sm font-medium text-foreground bg-accent rounded-lg">
                    {currentPage}
                  </span>
                  <span className="text-sm text-muted-foreground">of {totalPages}</span>
                </div>

                <motion.button
                  whileHover={{ scale: currentPage < totalPages ? 1.05 : 1 }}
                  whileTap={{ scale: currentPage < totalPages ? 0.95 : 1 }}
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-border hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* View Lead Modal */}
      <Modal
        isOpen={viewModalOpen}
        onClose={() => {
          setViewModalOpen(false)
          setSelectedLead(null)
          setViewLeadError(null)
        }}
        title="Lead Details"
        size="lg"
      >
        {viewLeadLoading ? (
          <div className="flex flex-col items-center justify-center py-8">
            <Loader2 className="w-8 h-8 text-muted-foreground animate-spin mb-4" />
            <p className="text-muted-foreground">Loading lead details...</p>
          </div>
        ) : viewLeadError ? (
          <div className="flex flex-col items-center justify-center py-8">
            <AlertCircle className="w-8 h-8 text-red-500 mb-4" />
            <p className="text-foreground">{viewLeadError}</p>
          </div>
        ) : selectedLead ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Name</label>
                <p className="text-foreground mt-1">{selectedLead.employeeName || selectedLead.studentName || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Email</label>
                <p className="text-foreground mt-1">{selectedLead.email || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Phone</label>
                <p className="text-foreground mt-1">{selectedLead.phone || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">University</label>
                <p className="text-foreground mt-1">{selectedLead.university || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Status</label>
                <p className="text-foreground mt-1">{selectedLead.leadStatus || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Assigned To</label>
                <p className="text-foreground mt-1">{selectedLead.assignedTo || 'Unassigned'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Course</label>
                <p className="text-foreground mt-1">{selectedLead.course || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Priority</label>
                <p className="text-foreground mt-1 capitalize">{selectedLead.priority || 'N/A'}</p>
              </div>
            </div>
            {selectedLead.notes && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Notes</label>
                <p className="text-foreground mt-1">{selectedLead.notes}</p>
              </div>
            )}
          </div>
        ) : null}
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteConfirmOpen}
        onClose={() => {
          setDeleteConfirmOpen(false)
          setLeadToDelete(null)
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete Lead"
        message={`Are you sure you want to delete ${leadToDelete?.employeeName || leadToDelete?.studentName || 'this lead'}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        confirmVariant="danger"
      />
    </motion.div>
  )
}

export default Leads
