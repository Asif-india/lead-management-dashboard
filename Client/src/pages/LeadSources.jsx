import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { leadSourcesApi, clearCacheEntry } from '../services/api'
import { PAGINATION } from '../constants'
import Modal, { ConfirmModal } from '../components/ui/Modal'
import { Plus, Search, Filter, Eye, Edit, Trash2, Loader2, AlertCircle, ChevronLeft, ChevronRight, Building2, CheckCircle, XCircle } from 'lucide-react'
import {
  Select,
  FormControl,
  MenuItem,
  Snackbar,
  Alert
} from '@mui/material'
import { selectSx, menuItemSx, menuPaperSx } from '../constants/formStyles'
import { useAuth } from '../context/AuthContext'

const LeadSources = () => {
  const navigate = useNavigate()
  const { loading: authLoading } = useAuth()
  const [leadSources, setLeadSources] = useState([])
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

  // Lead source actions state
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [selectedLeadSource, setSelectedLeadSource] = useState(null)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [editFormData, setEditFormData] = useState({ name: '', description: '' })
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [leadSourceToDelete, setLeadSourceToDelete] = useState(null)
  const [deleteError, setDeleteError] = useState('')
  const [actionLoading, setActionLoading] = useState(false)

  // Toast notification state
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastSeverity, setToastSeverity] = useState('success')

  // Fetch lead sources from API with pagination and filters
  useEffect(() => {
    if (authLoading) return

    const fetchLeadSources = async () => {
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

        const response = await leadSourcesApi.getList(params)

        // Handle different API response structures
        const leadSourcesData = Array.isArray(response) ? response : (response?.data?.data || response?.data || [])
        setLeadSources(leadSourcesData)

        // Extract pagination metadata
        const pagination = response?.data?.pagination || response?.pagination || {}
        setTotalRecords(pagination.total || 0)
        setTotalPages(pagination.totalPages || Math.ceil((pagination.total || 0) / pageSize))
      } catch (err) {
        console.error('Error fetching lead sources:', err)
        setError('Failed to load lead sources. Please try again.')
        setLeadSources([])
        setTotalRecords(0)
        setTotalPages(0)
      } finally {
        setLoading(false)
      }
    }

    fetchLeadSources()
  }, [currentPage, pageSize, searchTerm, selectedStatus, authLoading])

  const statusColors = {
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-red-100 text-red-800'
  }

  // Pagination handlers
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage)
    }
  }

  const handlePageSizeChange = (newSize) => {
    setPageSize(newSize)
    setCurrentPage(1)
  }

  // View lead source
  const handleViewLeadSource = (leadSource) => {
    setSelectedLeadSource(leadSource)
    setViewModalOpen(true)
  }

  // Edit lead source
  const handleEditLeadSource = (leadSource) => {
    setSelectedLeadSource(leadSource)
    setEditFormData({
      name: leadSource.name,
      description: leadSource.description || '',
      status: leadSource.status || 'active'
    })
    setEditModalOpen(true)
  }

  // Add new lead source
  const handleAddLeadSource = () => {
    setSelectedLeadSource(null)
    setEditFormData({
      name: '',
      description: '',
      status: 'active'
    })
    setEditModalOpen(true)
  }

  const handleEditSubmit = async (e) => {
    e.preventDefault()
    try {
      setActionLoading(true)

      if (selectedLeadSource) {
        // Update existing
        await leadSourcesApi.update(selectedLeadSource._id, editFormData)
        setToastMessage('Lead source updated successfully')
        setToastSeverity('success')
        setShowToast(true)
      } else {
        // Create new
        await leadSourcesApi.create(editFormData)
        setToastMessage('Lead source created successfully')
        setToastSeverity('success')
        setShowToast(true)
      }

      setEditModalOpen(false)
      setSelectedLeadSource(null)
      setEditFormData({ name: '', description: '', status: 'active' })
      setError(null)
      clearCacheEntry('/lead-sources', 'GET')

      // Directly refetch instead of relying on useEffect
      const params = {
        page: 1,
        limit: pageSize,
        search: searchTerm || undefined,
        status: selectedStatus !== 'all' ? selectedStatus : undefined
      }
      const response = await leadSourcesApi.getList(params)
      const leadSourcesData = Array.isArray(response) ? response : (response?.data?.data || response?.data || [])
      setLeadSources(leadSourcesData)
      const pagination = response?.data?.pagination || response?.pagination || {}
      setTotalRecords(pagination.total || 0)
      setTotalPages(pagination.totalPages || Math.ceil((pagination.total || 0) / pageSize))
      setCurrentPage(1)
    } catch (err) {
      console.error('Error saving lead source:', err)
      const errorMessage = err.response?.data?.message || (selectedLeadSource ? 'Failed to update lead source. Please try again.' : 'Failed to create lead source. Please try again.')
      setError(errorMessage)
      setToastMessage(errorMessage)
      setToastSeverity('error')
      setShowToast(true)
    } finally {
      setActionLoading(false)
    }
  }

  // Delete lead source
  const handleDeleteClick = (leadSource) => {
    setLeadSourceToDelete(leadSource)
    setDeleteError('')
    setDeleteConfirmOpen(true)
  }

  const handleDeleteConfirm = async () => {
    // If there's already a delete error (reference error), just close the modal
    if (deleteError) {
      setDeleteConfirmOpen(false)
      setLeadSourceToDelete(null)
      setDeleteError('')
      return
    }

    try {
      setActionLoading(true)
      setDeleteError('')
      await leadSourcesApi.delete(leadSourceToDelete._id)
      setDeleteConfirmOpen(false)
      setLeadSourceToDelete(null)
      setError(null)
      clearCacheEntry('/lead-sources', 'GET')
      // Directly refetch instead of relying on useEffect
      const params = {
        page: 1,
        limit: pageSize,
        search: searchTerm,
        status: selectedStatus !== 'all' ? selectedStatus : undefined
      }
      const response = await leadSourcesApi.getList(params)
      const leadSourcesData = Array.isArray(response) ? response : (response?.data?.data || response?.data || [])
      setLeadSources(leadSourcesData)
      const pagination = response?.data?.pagination || response?.pagination || {}
      setTotalRecords(pagination.total || 0)
      setTotalPages(pagination.totalPages || Math.ceil((pagination.total || 0) / pageSize))
      setCurrentPage(1)
      setToastMessage('Lead source deleted successfully')
      setToastSeverity('success')
      setShowToast(true)
    } catch (err) {
      console.error('Error deleting lead source:', err)
      const errorMessage = err.response?.data?.message || err.message || 'Failed to delete lead source. Please try again.'
      setDeleteError(errorMessage)
      setToastMessage(errorMessage)
      setToastSeverity('error')
      setShowToast(true)
      // Keep the confirmation dialog open if it's a reference error
      if (!errorMessage.includes('referenced by')) {
        setDeleteConfirmOpen(false)
        setLeadSourceToDelete(null)
        setError(errorMessage)
      }
    } finally {
      setActionLoading(false)
    }
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
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
            <h1 className="text-3xl font-bold text-foreground mb-2">Lead Sources Management</h1>
            <p className="text-muted-foreground">Manage and track your lead source channels</p>
          </div>
          <div className="flex items-center space-x-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAddLeadSource}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Lead Source</span>
            </motion.button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search lead sources..."
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
              {['all', 'active', 'inactive'].map(status => (
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

      {/* Error State */}
      {error && (
        <motion.div variants={itemVariants} className="bg-card rounded-xl border border-border p-12 flex flex-col items-center justify-center">
          <AlertCircle className="w-8 h-8 text-red-500 mb-4" />
          <p className="text-foreground mb-2">Error loading lead sources</p>
          <p className="text-muted-foreground text-sm">{error}</p>
        </motion.div>
      )}

      {/* Lead Sources Table Container */}
      {!error && (
        <motion.div variants={itemVariants} className="bg-card rounded-xl border border-border overflow-hidden min-h-[400px]">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted border-b border-border">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-foreground uppercase tracking-wider">
                    <div className="flex items-center">
                      Name
                      {loading && <Loader2 className="w-3 h-3 ml-2 animate-spin text-muted-foreground" />}
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-foreground uppercase tracking-wider">Description</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-foreground uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-foreground uppercase tracking-wider">Created</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-foreground uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {leadSources.length === 0 && !loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12">
                      <div className="flex flex-col items-center justify-center">
                        <Building2 className="w-12 h-12 text-muted-foreground mb-4" />
                        <p className="text-foreground mb-2">No lead sources found</p>
                        <p className="text-muted-foreground text-sm">Add your first lead source to get started</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  leadSources.map((leadSource, index) => (
                    <tr
                      key={leadSource._id || index}
                      className="hover:bg-muted/50 transition-colors"
                    >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center mr-3">
                          <Building2 className="w-4 h-4 text-foreground" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-foreground">{leadSource.name || 'Unknown'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-muted-foreground max-w-xs truncate">
                        {leadSource.description || 'No description'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={"px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full " + (statusColors[leadSource.status] || 'bg-gray-100 text-gray-800')}>
                        {leadSource.status || 'Unknown'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                      {leadSource.createdAt ? new Date(leadSource.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleViewLeadSource(leadSource)}
                          className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleEditLeadSource(leadSource)}
                          className="p-1.5 rounded-lg bg-muted text-muted-foreground hover:bg-accent hover:text-green-400 transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleDeleteClick(leadSource)}
                          className="p-1.5 rounded-lg bg-muted text-muted-foreground hover:bg-accent hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </td>
                  </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-border flex items-center justify-between min-h-[60px]">
            {totalRecords > 0 ? (
              <>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">Showing</span>
                  <span className="text-sm font-medium text-foreground">
                    {Math.min((currentPage - 1) * pageSize + 1, totalRecords)}-{Math.min(currentPage * pageSize, totalRecords)}
                  </span>
                  <span className="text-sm text-muted-foreground">of {totalRecords} records</span>
                  <span className="text-sm text-muted-foreground mx-2">|</span>
                  <span className="text-sm text-muted-foreground">Show</span>
                  <select
                    value={pageSize}
                    onChange={(e) => handlePageSizeChange(parseInt(e.target.value))}
                    className="px-2 py-1 bg-card border border-border rounded text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {PAGINATION.PAGE_SIZES.map(size => (
                      <option key={size} value={size}>{size}</option>
                    ))}
                  </select>
                  <span className="text-sm text-muted-foreground">per page</span>
                </div>
                {totalPages > 1 && (
                  <div className="flex items-center space-x-2">
                    <motion.button
                      whileHover={{ scale: currentPage > 1 ? 1.05 : 1 }}
                      whileTap={{ scale: currentPage > 1 ? 0.95 : 1 }}
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="p-2 rounded-lg border border-border hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </motion.button>
                    <div className="flex items-center space-x-2">
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
                )}
              </>
            ) : (
              <div className="flex-1"></div>
            )}
          </div>
        </motion.div>
      )}

      {/* View Lead Source Modal */}
      <Modal
        isOpen={viewModalOpen}
        onClose={() => {
          setViewModalOpen(false)
          setSelectedLeadSource(null)
        }}
        title="Lead Source Details"
        size="lg"
      >
        {selectedLeadSource ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Name</label>
                <p className="text-foreground mt-1">{selectedLeadSource.name || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Status</label>
                <p className="text-foreground mt-1 capitalize">{selectedLeadSource.status || 'N/A'}</p>
              </div>
              <div className="col-span-2">
                <label className="text-sm font-medium text-muted-foreground">Description</label>
                <p className="text-foreground mt-1">{selectedLeadSource.description || 'No description'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Created</label>
                <p className="text-foreground mt-1">{selectedLeadSource.createdAt ? new Date(selectedLeadSource.createdAt).toLocaleString() : 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Last Updated</label>
                <p className="text-foreground mt-1">{selectedLeadSource.updatedAt ? new Date(selectedLeadSource.updatedAt).toLocaleString() : 'N/A'}</p>
              </div>
            </div>
          </div>
        ) : null}
      </Modal>

      {/* Edit Lead Source Modal */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => {
          setEditModalOpen(false)
          setSelectedLeadSource(null)
          setEditFormData({ name: '', description: '', status: 'active' })
        }}
        title={selectedLeadSource ? 'Edit Lead Source' : 'Add Lead Source'}
        size="lg"
      >
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Name</label>
            <input
              type="text"
              value={editFormData.name}
              onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
              required
              className="w-full px-3 py-2 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Description</label>
            <textarea
              value={editFormData.description}
              onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Status</label>
            <FormControl fullWidth>
              <Select
                value={editFormData.status}
                onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
                sx={selectSx}
                MenuProps={{
                  PaperProps: { sx: { ...menuPaperSx, marginBottom: '8px' } },
                  TransitionProps: { timeout: 200 },
                  anchorOrigin: { vertical: 'bottom', horizontal: 'left' },
                  transformOrigin: { vertical: 'top', horizontal: 'left' },
                  disableScrollLock: true,
                  marginThreshold: 0
                }}
              >
                <MenuItem value="active" sx={menuItemSx}>Active</MenuItem>
                <MenuItem value="inactive" sx={menuItemSx}>Inactive</MenuItem>
              </Select>
            </FormControl>
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => {
                setEditModalOpen(false)
                setSelectedLeadSource(null)
                setEditFormData({ name: '', description: '', status: 'active' })
              }}
              className="px-4 py-2 bg-card border border-border text-foreground rounded-lg hover:bg-accent transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={actionLoading}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              {actionLoading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteConfirmOpen}
        onClose={() => {
          setDeleteConfirmOpen(false)
          setLeadSourceToDelete(null)
          setDeleteError('')
        }}
        onConfirm={handleDeleteConfirm}
        title={deleteError ? "Cannot Delete Lead Source" : "Delete Lead Source"}
        message={deleteError || `Are you sure you want to delete "${leadSourceToDelete?.name}"? This action cannot be undone.`}
        confirmText={deleteError ? "OK" : "Delete"}
        cancelText="Cancel"
        confirmVariant={deleteError ? "primary" : "danger"}
      />

      {/* Toast Notification */}
      <Snackbar
        open={showToast}
        autoHideDuration={5000}
        onClose={() => setShowToast(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          severity={toastSeverity}
          onClose={() => setShowToast(false)}
          sx={{ width: '100%' }}
        >
          {toastMessage}
        </Alert>
      </Snackbar>
    </motion.div>
  )
}

export default LeadSources
