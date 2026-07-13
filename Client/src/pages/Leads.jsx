import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { leadsApi } from '../services/api'
import {
  Plus,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  User,
  Building,
  Loader2,
  AlertCircle,
} from 'lucide-react'

const Leads = () => {
  const navigate = useNavigate()
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [showFilters, setShowFilters] = useState(false)

  // Fetch leads from API
  useEffect(() => {
    const fetchLeads = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await leadsApi.getList()
        // Handle different API response structures
        const leadsData = Array.isArray(response) ? response : (response?.data || [])
        setLeads(leadsData)
      } catch (err) {
        console.error('Error fetching leads:', err)
        setError('Failed to load leads. Please try again.')
        setLeads([])
      } finally {
        setLoading(false)
      }
    }

    fetchLeads()
  }, [])

  const statusColors = {
    new: 'bg-blue-100 text-blue-800',
    contacted: 'bg-yellow-100 text-yellow-800',
    qualified: 'bg-green-100 text-green-800',
    converted: 'bg-purple-100 text-purple-800',
    lost: 'bg-red-100 text-red-800',
    negotiation: 'bg-orange-100 text-orange-800'
  }

  // Calculate stats from real data
  const totalLeads = leads.length
  const newLeads = leads.filter(l => l.leadStatus === 'new').length
  const qualifiedLeads = leads.filter(l => l.leadStatus === 'qualified').length
  const convertedLeads = leads.filter(l => l.leadStatus === 'converted').length

  // Filter leads based on search and status
  const filteredLeads = leads.filter(lead => {
    const matchesSearch = 
      (lead.employeeName && lead.employeeName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (lead.email && lead.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (lead.university && lead.university.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (lead.studentName && lead.studentName.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesStatus = selectedStatus === 'all' || lead.leadStatus === selectedStatus
    return matchesSearch && matchesStatus
  })


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
              {['all', 'new', 'contacted', 'qualified', 'converted', 'lost'].map(status => (
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
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
          <p className="text-muted-foreground text-sm">New Leads</p>
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
            <div className="w-12 h-12 bg-purple-500 rounded-lg opacity-20"></div>
          </div>
          <h3 className="text-2xl font-bold text-foreground mb-1">{convertedLeads}</h3>
          <p className="text-muted-foreground text-sm">Converted</p>
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
                {filteredLeads.length > 0 ? (
                  filteredLeads.map((lead, index) => (
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
                            className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            className="p-1.5 rounded-lg bg-muted text-muted-foreground hover:bg-accent hover:text-green-400 transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
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
                      No leads match your search or filter criteria
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}

export default Leads
