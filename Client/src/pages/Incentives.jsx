import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Trophy,
  Target,
  Award,
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  Plus,
  Eye,
  Edit,
  MoreVertical,
  Medal,
  Crown,
  Calculator,
  Filter,
  Search,
  X,
  Trash2
} from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  TextField,
  InputAdornment,
  Avatar,
  LinearProgress,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem as SelectMenuItem,
  FormControl,
  InputLabel,
  Box,
  Snackbar,
  Alert
} from '@mui/material'
import {
  AreaChart,
  Area,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import { containerVariants, itemVariants } from '../constants/formAnimations'
import {
  textFieldSx,
  menuPaperSx,
  menuItemSx,
  secondaryButtonSx,
  tableHeaderCellSx,
  tableBodyCellSx,
  tableMutedCellSx,
  tableRowSx
} from '../constants/formStyles'
import { incentivesApi } from '../services/api'

const MotionTableRow = motion(TableRow)

const Incentives = () => {
  const [anchorEl, setAnchorEl] = useState(null)
  const [selectedIncentive, setSelectedIncentive] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [analyticsData, setAnalyticsData] = useState(null)
  const [incentives, setIncentives] = useState([])
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 0 })

  // Toast notification state
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastSeverity, setToastSeverity] = useState('success')
  
  // Modal states
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [filterModalOpen, setFilterModalOpen] = useState(false)
  const [viewModalOpen, setViewModalOpen] = useState(false)
  
  // Form state
  const [formData, setFormData] = useState({
    employeeName: '',
    employeeId: '',
    department: '',
    incentiveType: '',
    amount: '',
    status: 'pending',
    quarter: '',
    calculatedBy: 'System',
    notes: '',
    performance: 75,
    totalEarned: 0,
    currentMonth: 0,
    totalIncentives: 0,
    badges: []
  })
  
  // Filter state
  const [filterData, setFilterData] = useState({
    status: 'all',
    department: 'all',
    incentiveType: 'all',
    startDate: '',
    endDate: ''
  })

  useEffect(() => {
    fetchAnalytics()
    fetchIncentives()
  }, [])

  const fetchAnalytics = async () => {
    try {
      const response = await incentivesApi.getAnalytics()
      const data = response?.data || response
      setAnalyticsData(data)
    } catch (err) {
      console.error('Error fetching analytics:', err)
    }
  }

  const fetchIncentives = async (params = {}) => {
    try {
      setLoading(true)
      const response = await incentivesApi.getList({
        page: pagination.page,
        limit: pagination.limit,
        search: searchQuery,
        status: filterStatus,
        ...params
      })
      const data = response?.data || response
      setIncentives(Array.isArray(data) ? data : data.data || [])
      const paginationData = response?.data?.pagination || response?.pagination || {}
      setPagination(prev => ({
        ...prev,
        ...paginationData,
        pages: paginationData.totalPages || Math.ceil((paginationData.total || 0) / prev.limit)
      }))
    } catch (err) {
      console.error('Error fetching incentives:', err)
      setError('Failed to load incentives')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setPagination(prev => ({ ...prev, page: 1 }))
    fetchIncentives({ page: 1 })
  }, [searchQuery, filterStatus])

  const iconMap = {
    Target,
    DollarSign,
    Users,
    Award
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return { bg: 'rgba(16, 185, 129, 0.1)', text: '#4ade80', border: 'rgba(16, 185, 129, 0.2)' }
      case 'pending':
        return { bg: 'rgba(234, 179, 8, 0.1)', text: '#facc15', border: 'rgba(234, 179, 8, 0.2)' }
      case 'processing':
        return { bg: 'rgba(59, 130, 246, 0.1)', text: '#60a5fa', border: 'rgba(59, 130, 246, 0.2)' }
      case 'rejected':
        return { bg: 'rgba(239, 68, 68, 0.1)', text: '#f87171', border: 'rgba(239, 68, 68, 0.2)' }
      default:
        return { bg: 'rgba(107, 114, 128, 0.1)', text: '#9ca3af', border: 'rgba(107, 114, 128, 0.2)' }
    }
  }

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Crown className="w-5 h-5 text-yellow-400" />
      case 2:
        return <Medal className="w-5 h-5 text-gray-300" />
      case 3:
        return <Medal className="w-5 h-5 text-orange-400" />
      default:
        return <span className="w-5 h-5 flex items-center justify-center text-slate-400 font-bold">{rank}</span>
    }
  }

  const handleMenuClick = (event, incentive) => {
    setAnchorEl(event.currentTarget)
    setSelectedIncentive(incentive)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    setSelectedIncentive(null)
  }

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }))
    fetchIncentives({ page: newPage })
  }

  const handleCreateIncentive = async () => {
    try {
      const incentiveData = {
        ...formData,
        amount: Number(formData.amount),
        performance: Number(formData.performance),
        totalEarned: Number(formData.totalEarned),
        currentMonth: Number(formData.currentMonth),
        totalIncentives: Number(formData.totalIncentives)
      }
      await incentivesApi.create(incentiveData)
      setCreateModalOpen(false)
      resetForm()
      fetchIncentives()
      fetchAnalytics()
      setToastMessage('Incentive created successfully')
      setToastSeverity('success')
      setShowToast(true)
    } catch (err) {
      console.error('Error creating incentive:', err)
      if (err.status === 403) {
        setError('You do not have permission to create incentives')
        setToastMessage('You do not have permission to create incentives')
        setToastSeverity('error')
        setShowToast(true)
      } else {
        setError(err.message || 'Failed to create incentive')
        setToastMessage(err.message || 'Failed to create incentive')
        setToastSeverity('error')
        setShowToast(true)
      }
    }
  }

  const handleEditIncentive = async () => {
    try {
      const incentiveData = {
        ...formData,
        amount: Number(formData.amount),
        performance: Number(formData.performance),
        totalEarned: Number(formData.totalEarned),
        currentMonth: Number(formData.currentMonth),
        totalIncentives: Number(formData.totalIncentives)
      }
      await incentivesApi.update(selectedIncentive._id, incentiveData)
      setEditModalOpen(false)
      resetForm()
      setSelectedIncentive(null)
      fetchIncentives()
      fetchAnalytics()
      setToastMessage('Incentive updated successfully')
      setToastSeverity('success')
      setShowToast(true)
    } catch (err) {
      console.error('Error updating incentive:', err)
      if (err.status === 403) {
        setError('You do not have permission to edit incentives')
        setToastMessage('You do not have permission to edit incentives')
        setToastSeverity('error')
        setShowToast(true)
      } else {
        setError(err.message || 'Failed to update incentive')
        setToastMessage(err.message || 'Failed to update incentive')
        setToastSeverity('error')
        setShowToast(true)
      }
    }
  }

  const handleDeleteIncentive = async () => {
    try {
      await incentivesApi.delete(selectedIncentive._id)
      setAnchorEl(null)
      setSelectedIncentive(null)
      fetchIncentives()
      fetchAnalytics()
      setToastMessage('Incentive deleted successfully')
      setToastSeverity('success')
      setShowToast(true)
    } catch (err) {
      console.error('Error deleting incentive:', err)
      if (err.status === 403) {
        setError('You do not have permission to delete incentives')
        setToastMessage('You do not have permission to delete incentives')
        setToastSeverity('error')
        setShowToast(true)
      } else {
        setError(err.message || 'Failed to delete incentive')
        setToastMessage(err.message || 'Failed to delete incentive')
        setToastSeverity('error')
        setShowToast(true)
      }
    }
  }

  const handleViewIncentive = () => {
    setViewModalOpen(true)
  }

  const handleOpenEditModal = () => {
    if (selectedIncentive) {
      setFormData({
        employeeName: selectedIncentive.employeeName,
        employeeId: selectedIncentive.employeeId,
        department: selectedIncentive.department,
        incentiveType: selectedIncentive.incentiveType,
        amount: selectedIncentive.amount,
        status: selectedIncentive.status,
        quarter: selectedIncentive.quarter || '',
        calculatedBy: selectedIncentive.calculatedBy || 'System',
        notes: selectedIncentive.notes || '',
        performance: selectedIncentive.performance || 75,
        totalEarned: selectedIncentive.totalEarned || 0,
        currentMonth: selectedIncentive.currentMonth || 0,
        totalIncentives: selectedIncentive.totalIncentives || 0,
        badges: selectedIncentive.badges || []
      })
      setEditModalOpen(true)
    }
    setAnchorEl(null)
  }

  const handleApplyFilter = () => {
    setFilterStatus(filterData.status)
    fetchIncentives({
      status: filterData.status,
      department: filterData.department,
      incentiveType: filterData.incentiveType,
      startDate: filterData.startDate,
      endDate: filterData.endDate
    })
    setFilterModalOpen(false)
  }

  const resetForm = () => {
    setFormData({
      employeeName: '',
      employeeId: '',
      department: '',
      incentiveType: '',
      amount: '',
      status: 'pending',
      quarter: '',
      calculatedBy: 'System',
      notes: '',
      performance: 75,
      totalEarned: 0,
      currentMonth: 0,
      totalIncentives: 0,
      badges: []
    })
  }

  // Format analytics data for display
  const incentiveStats = analyticsData ? [
    {
      title: 'Active Incentives',
      value: analyticsData.activeIncentives?.toString() || '0',
      change: '+8.3%',
      trend: 'up',
      icon: 'Target',
      color: 'from-blue-500 to-cyan-600',
      description: 'Currently running'
    },
    {
      title: 'Total Payout',
      value: `$${(analyticsData.totalPayout / 1000).toFixed(1)}K`,
      change: '+23.7%',
      trend: 'up',
      icon: 'DollarSign',
      color: 'from-green-500 to-emerald-600',
      description: 'This quarter'
    },
    {
      title: 'Participants',
      value: analyticsData.totalParticipants?.toString() || '0',
      change: '+15.2%',
      trend: 'up',
      icon: 'Users',
      color: 'from-purple-500 to-pink-600',
      description: 'Active employees'
    },
    {
      title: 'Avg. Incentive',
      value: `$${Math.round(analyticsData.averageIncentive || 0)}`,
      change: '+5.8%',
      trend: 'up',
      icon: 'Award',
      color: 'from-orange-500 to-red-600',
      description: 'Per employee'
    }
  ] : []

  const monthlyIncentiveData = analyticsData?.monthlyTrends || []
  const employeeLeaderboard = analyticsData?.leaderboard || []
  const incentiveDistribution = analyticsData?.distribution || []

  if (loading && !analyticsData) {
    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex items-center justify-center min-h-[400px]"
      >
        <LinearProgress sx={{ width: '200px' }} />
      </motion.div>
    )
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-xl">
          <p className="text-foreground font-medium mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: ${entry.value.toLocaleString()}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
            Incentive Management
          </h1>
          <p className="text-muted-foreground text-lg">Track and manage employee incentives and rewards</p>
        </div>
        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center space-x-2 px-4 py-2 bg-muted/50 border border-border/30 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <Calculator className="w-4 h-4" />
            <span>Calculate</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCreateModalOpen(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg shadow-blue-500/25"
          >
            <Plus className="w-4 h-4" />
            <span>Create Incentive</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Incentive Statistics Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {incentiveStats.map((stat, index) => {
          const Icon = iconMap[stat.icon]
          return (
            <motion.div
              key={index}
              whileHover={{ y: -8, scale: 1.02 }}
              className="bg-card/50 border border-border/50 rounded-2xl p-6 backdrop-blur-sm hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-14 h-14 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <div className={`flex items-center space-x-1 text-sm font-medium ${
                  stat.trend === 'up' ? 'text-green-400' : 'text-red-400'
                }`}>
                  {stat.trend === 'up' ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  <span>{stat.change}</span>
                </div>
              </div>
              <h3 className="text-3xl font-bold text-foreground mb-1">{stat.value}</h3>
              <p className="text-muted-foreground font-medium mb-1">{stat.title}</p>
              <p className="text-muted-foreground text-sm">{stat.description}</p>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Monthly Incentive Chart and Leaderboard */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Monthly Incentive Chart */}
        <motion.div variants={itemVariants} className="xl:col-span-2 bg-card/50 border border-border/50 rounded-2xl p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-foreground">Monthly Incentive Trends</h2>
              <p className="text-muted-foreground text-sm mt-1">Incentive payout analysis over time</p>
            </div>
            <TrendingUp className="w-5 h-5 text-muted-foreground" />
          </div>
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={monthlyIncentiveData}>
              <defs>
                <linearGradient id="totalGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="claimedGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
              <XAxis dataKey="month" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="total"
                stroke="#3b82f6"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#totalGradient)"
              />
              <Area
                type="monotone"
                dataKey="claimed"
                stroke="#10b981"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#claimedGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
          <div className="flex items-center justify-center space-x-6 mt-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-muted-foreground">Total Allocated</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-muted-foreground">Claimed</span>
            </div>
          </div>
        </motion.div>

        {/* Incentive Distribution */}
        <motion.div variants={itemVariants} className="bg-card/50 border border-border/50 rounded-2xl p-6 backdrop-blur-sm">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-foreground">Incentive Distribution</h2>
            <p className="text-muted-foreground text-sm mt-1">By incentive type</p>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={incentiveDistribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={3}
                dataKey="value"
              >
                {incentiveDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-6 space-y-3">
            {incentiveDistribution.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-muted-foreground">{item.type}</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-medium text-foreground">{item.value}%</span>
                  <p className="text-xs text-muted-foreground">${item.amount.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Employee Leaderboard */}
      <motion.div variants={itemVariants} className="bg-card/50 border border-border/50 rounded-2xl p-6 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Employee Leaderboard</h2>
            <p className="text-muted-foreground text-sm mt-1">Top performers this quarter</p>
          </div>
          <Trophy className="w-5 h-5 text-muted-foreground" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {employeeLeaderboard.map((employee, index) => (
            <motion.div
              key={employee.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className={`relative bg-muted/30 border ${
                employee.rank <= 3 ? 'border-yellow-500/30' : 'border-border/30'
              } rounded-xl p-4 hover:shadow-xl transition-all duration-300`}
            >
              {employee.rank <= 3 && (
                <div className={`absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center ${
                  employee.rank === 1 ? 'bg-gradient-to-br from-yellow-400 to-orange-500' :
                  employee.rank === 2 ? 'bg-gradient-to-br from-gray-300 to-gray-400' :
                  'bg-gradient-to-br from-orange-400 to-red-500'
                }`}>
                  {getRankIcon(employee.rank)}
                </div>
              )}
              
              <div className="flex flex-col items-center text-center">
                <div className={`w-16 h-16 bg-gradient-to-br ${
                  employee.rank === 1 ? 'from-yellow-400 to-orange-500' :
                  employee.rank === 2 ? 'from-gray-300 to-gray-400' :
                  employee.rank === 3 ? 'from-orange-400 to-red-500' :
                  'from-blue-400 to-purple-500'
                } rounded-full flex items-center justify-center mb-3`}>
                  <span className="text-white font-bold text-lg">{employee.avatar}</span>
                </div>
                
                <h3 className="text-foreground font-semibold mb-1">{employee.name}</h3>
                <p className="text-muted-foreground text-sm mb-3">{employee.department}</p>
                
                <div className="w-full space-y-2 mb-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Performance</span>
                    <span className="text-foreground font-medium">{employee.performance}%</span>
                  </div>
                  <LinearProgress
                    variant="determinate"
                    value={employee.performance}
                    sx={{
                      backgroundColor: 'hsl(var(--muted))',
                      '& .MuiLinearProgress-bar': {
                        background: 'linear-gradient(to right, #3b82f6, #8b5cf6)'
                      }
                    }}
                  />
                </div>
                
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Earned</span>
                    <span className="text-green-400 font-semibold">${employee.totalEarned.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">This Month</span>
                    <span className="text-blue-400 font-semibold">${employee.currentMonth.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Incentives</span>
                    <span className="text-foreground">{employee.totalIncentives}</span>
                  </div>
                </div>
                
                {employee.badges.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {employee.badges.map((badge, badgeIndex) => (
                      <Chip
                        key={badgeIndex}
                        label={badge}
                        size="small"
                        sx={{
                          backgroundColor: 'rgba(59, 130, 246, 0.1)',
                          color: '#60a5fa',
                          border: '1px solid rgba(59, 130, 246, 0.2)',
                          fontSize: '0.65rem',
                          height: '20px'
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Incentive Table */}
      <motion.div variants={itemVariants} className="bg-card/50 border border-border/50 rounded-2xl p-6 backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Incentive Details</h2>
            <p className="text-muted-foreground text-sm mt-1">Detailed incentive records</p>
          </div>
          <div className="flex items-center space-x-3 mt-4 sm:mt-0">
            <TextField
              size="small"
              placeholder="Search employees..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search className="w-4 h-4 text-muted-foreground" />
                  </InputAdornment>
                ),
              }}
              sx={textFieldSx}
            />
            <Button
              variant="outlined"
              startIcon={<Filter className="w-4 h-4" />}
              onClick={() => setFilterModalOpen(true)}
              sx={secondaryButtonSx}
            >
              Filter
            </Button>
          </div>
        </div>

        <TableContainer component={Paper} sx={{ backgroundColor: 'transparent', boxShadow: 'none' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={tableHeaderCellSx}>Employee</TableCell>
                <TableCell sx={tableHeaderCellSx}>Department</TableCell>
                <TableCell sx={tableHeaderCellSx}>Type</TableCell>
                <TableCell sx={tableHeaderCellSx}>Amount</TableCell>
                <TableCell sx={tableHeaderCellSx}>Status</TableCell>
                <TableCell sx={tableHeaderCellSx}>Date</TableCell>
                <TableCell sx={tableHeaderCellSx}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {incentives.map((incentive, index) => {
                const statusColor = getStatusColor(incentive.status)
                return (
                  <MotionTableRow
                    key={incentive._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    sx={tableRowSx}
                  >
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar sx={{ width: 32, height: 32, background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}>
                          {incentive.employeeName.split(' ').map(n => n[0]).join('')}
                        </Avatar>
                        <div>
                          <p className="text-foreground font-medium">{incentive.employeeName}</p>
                          <p className="text-muted-foreground text-xs">{incentive.employeeId}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell sx={tableBodyCellSx}>{incentive.department}</TableCell>
                    <TableCell sx={tableBodyCellSx}>{incentive.incentiveType}</TableCell>
                    <TableCell sx={{ color: '#10b981', fontWeight: 600 }}>${incentive.amount.toLocaleString()}</TableCell>
                    <TableCell>
                      <Chip
                        label={incentive.status}
                        size="small"
                        sx={{
                          backgroundColor: statusColor.bg,
                          color: statusColor.text,
                          border: `1px solid ${statusColor.border}`,
                          fontSize: '0.75rem',
                          fontWeight: 500
                        }}
                      />
                    </TableCell>
                    <TableCell sx={tableMutedCellSx}>{new Date(incentive.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuClick(e, incentive)}
                        sx={tableMutedCellSx}
                      >
                        <MoreVertical className="w-4 h-4" />
                      </IconButton>
                    </TableCell>
                  </MotionTableRow>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-muted-foreground">
            Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} incentives
          </div>
          <div className="flex items-center space-x-2">
            <Button
              size="small"
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              sx={secondaryButtonSx}
            >
              Previous
            </Button>
            <span className="text-sm text-foreground px-3">
              Page {pagination.page} of {pagination.pages}
            </span>
            <Button
              size="small"
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.pages}
              sx={secondaryButtonSx}
            >
              Next
            </Button>
          </div>
        </div>

        {/* Dropdown Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          PaperProps={{
            sx: menuPaperSx
          }}
        >
          <MenuItem onClick={handleViewIncentive} sx={menuItemSx}>
            <Eye className="w-4 h-4 mr-2" />
            View Details
          </MenuItem>
          <MenuItem onClick={handleOpenEditModal} sx={menuItemSx}>
            <Edit className="w-4 h-4 mr-2" />
            Edit Incentive
          </MenuItem>
          <MenuItem onClick={handleDeleteIncentive} sx={menuItemSx}>
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Incentive
          </MenuItem>
        </Menu>
      </motion.div>

      {/* Create Incentive Modal */}
      <Dialog open={createModalOpen} onClose={() => setCreateModalOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle className="text-foreground">Create New Incentive</DialogTitle>
        <DialogContent>
          <Box className="space-y-4 mt-4">
            <TextField
              fullWidth
              label="Employee Name"
              value={formData.employeeName}
              onChange={(e) => setFormData({ ...formData, employeeName: e.target.value })}
              sx={textFieldSx}
            />
            <TextField
              fullWidth
              label="Employee ID"
              value={formData.employeeId}
              onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
              sx={textFieldSx}
            />
            <FormControl fullWidth sx={textFieldSx}>
              <InputLabel>Department</InputLabel>
              <Select
                value={formData.department}
                label="Department"
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              >
                <SelectMenuItem value="Engineering">Engineering</SelectMenuItem>
                <SelectMenuItem value="Marketing">Marketing</SelectMenuItem>
                <SelectMenuItem value="Sales">Sales</SelectMenuItem>
                <SelectMenuItem value="HR">HR</SelectMenuItem>
                <SelectMenuItem value="Finance">Finance</SelectMenuItem>
                <SelectMenuItem value="Operations">Operations</SelectMenuItem>
                <SelectMenuItem value="IT">IT</SelectMenuItem>
                <SelectMenuItem value="Legal">Legal</SelectMenuItem>
                <SelectMenuItem value="Customer Success">Customer Success</SelectMenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth sx={textFieldSx}>
              <InputLabel>Incentive Type</InputLabel>
              <Select
                value={formData.incentiveType}
                label="Incentive Type"
                onChange={(e) => setFormData({ ...formData, incentiveType: e.target.value })}
              >
                <SelectMenuItem value="Performance Bonus">Performance Bonus</SelectMenuItem>
                <SelectMenuItem value="Sales Commission">Sales Commission</SelectMenuItem>
                <SelectMenuItem value="Referral Bonus">Referral Bonus</SelectMenuItem>
                <SelectMenuItem value="Recognition Award">Recognition Award</SelectMenuItem>
                <SelectMenuItem value="Team Bonus">Team Bonus</SelectMenuItem>
                <SelectMenuItem value="Campaign Success">Campaign Success</SelectMenuItem>
                <SelectMenuItem value="Customer Satisfaction">Customer Satisfaction</SelectMenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Amount"
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              sx={textFieldSx}
            />
            <FormControl fullWidth sx={textFieldSx}>
              <InputLabel>Status</InputLabel>
              <Select
                value={formData.status}
                label="Status"
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <SelectMenuItem value="pending">Pending</SelectMenuItem>
                <SelectMenuItem value="processing">Processing</SelectMenuItem>
                <SelectMenuItem value="approved">Approved</SelectMenuItem>
                <SelectMenuItem value="rejected">Rejected</SelectMenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Quarter"
              value={formData.quarter}
              onChange={(e) => setFormData({ ...formData, quarter: e.target.value })}
              sx={textFieldSx}
            />
            <TextField
              fullWidth
              label="Notes"
              multiline
              rows={3}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              sx={textFieldSx}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setCreateModalOpen(false); resetForm() }} sx={secondaryButtonSx}>
            Cancel
          </Button>
          <Button onClick={handleCreateIncentive} variant="contained" className="bg-gradient-to-r from-blue-500 to-purple-600">
            Create Incentive
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Incentive Modal */}
      <Dialog open={editModalOpen} onClose={() => setEditModalOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle className="text-foreground">Edit Incentive</DialogTitle>
        <DialogContent>
          <Box className="space-y-4 mt-4">
            <TextField
              fullWidth
              label="Employee Name"
              value={formData.employeeName}
              onChange={(e) => setFormData({ ...formData, employeeName: e.target.value })}
              sx={textFieldSx}
            />
            <TextField
              fullWidth
              label="Employee ID"
              value={formData.employeeId}
              onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
              sx={textFieldSx}
            />
            <FormControl fullWidth sx={textFieldSx}>
              <InputLabel>Department</InputLabel>
              <Select
                value={formData.department}
                label="Department"
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              >
                <SelectMenuItem value="Engineering">Engineering</SelectMenuItem>
                <SelectMenuItem value="Marketing">Marketing</SelectMenuItem>
                <SelectMenuItem value="Sales">Sales</SelectMenuItem>
                <SelectMenuItem value="HR">HR</SelectMenuItem>
                <SelectMenuItem value="Finance">Finance</SelectMenuItem>
                <SelectMenuItem value="Operations">Operations</SelectMenuItem>
                <SelectMenuItem value="IT">IT</SelectMenuItem>
                <SelectMenuItem value="Legal">Legal</SelectMenuItem>
                <SelectMenuItem value="Customer Success">Customer Success</SelectMenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth sx={textFieldSx}>
              <InputLabel>Incentive Type</InputLabel>
              <Select
                value={formData.incentiveType}
                label="Incentive Type"
                onChange={(e) => setFormData({ ...formData, incentiveType: e.target.value })}
              >
                <SelectMenuItem value="Performance Bonus">Performance Bonus</SelectMenuItem>
                <SelectMenuItem value="Sales Commission">Sales Commission</SelectMenuItem>
                <SelectMenuItem value="Referral Bonus">Referral Bonus</SelectMenuItem>
                <SelectMenuItem value="Recognition Award">Recognition Award</SelectMenuItem>
                <SelectMenuItem value="Team Bonus">Team Bonus</SelectMenuItem>
                <SelectMenuItem value="Campaign Success">Campaign Success</SelectMenuItem>
                <SelectMenuItem value="Customer Satisfaction">Customer Satisfaction</SelectMenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Amount"
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              sx={textFieldSx}
            />
            <FormControl fullWidth sx={textFieldSx}>
              <InputLabel>Status</InputLabel>
              <Select
                value={formData.status}
                label="Status"
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <SelectMenuItem value="pending">Pending</SelectMenuItem>
                <SelectMenuItem value="processing">Processing</SelectMenuItem>
                <SelectMenuItem value="approved">Approved</SelectMenuItem>
                <SelectMenuItem value="rejected">Rejected</SelectMenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Quarter"
              value={formData.quarter}
              onChange={(e) => setFormData({ ...formData, quarter: e.target.value })}
              sx={textFieldSx}
            />
            <TextField
              fullWidth
              label="Notes"
              multiline
              rows={3}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              sx={textFieldSx}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setEditModalOpen(false); resetForm(); setSelectedIncentive(null) }} sx={secondaryButtonSx}>
            Cancel
          </Button>
          <Button onClick={handleEditIncentive} variant="contained" className="bg-gradient-to-r from-blue-500 to-purple-600">
            Update Incentive
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Incentive Modal */}
      <Dialog open={viewModalOpen} onClose={() => { setViewModalOpen(false); setAnchorEl(null) }} maxWidth="md" fullWidth>
        <DialogTitle className="text-foreground">Incentive Details</DialogTitle>
        <DialogContent>
          {selectedIncentive && (
            <Box className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-muted-foreground text-sm">Employee Name</p>
                  <p className="text-foreground font-medium">{selectedIncentive.employeeName}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Employee ID</p>
                  <p className="text-foreground font-medium">{selectedIncentive.employeeId}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Department</p>
                  <p className="text-foreground font-medium">{selectedIncentive.department}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Incentive Type</p>
                  <p className="text-foreground font-medium">{selectedIncentive.incentiveType}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Amount</p>
                  <p className="text-green-400 font-semibold">${selectedIncentive.amount?.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Status</p>
                  <Chip
                    label={selectedIncentive.status}
                    size="small"
                    sx={{
                      backgroundColor: getStatusColor(selectedIncentive.status).bg,
                      color: getStatusColor(selectedIncentive.status).text,
                      border: `1px solid ${getStatusColor(selectedIncentive.status).border}`,
                    }}
                  />
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Quarter</p>
                  <p className="text-foreground font-medium">{selectedIncentive.quarter || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Date</p>
                  <p className="text-foreground font-medium">{new Date(selectedIncentive.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              {selectedIncentive.notes && (
                <div>
                  <p className="text-muted-foreground text-sm">Notes</p>
                  <p className="text-foreground">{selectedIncentive.notes}</p>
                </div>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setViewModalOpen(false); setAnchorEl(null) }} sx={secondaryButtonSx}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Filter Modal */}
      <Dialog open={filterModalOpen} onClose={() => setFilterModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle className="text-foreground">Filter Incentives</DialogTitle>
        <DialogContent>
          <Box className="space-y-4 mt-4">
            <FormControl fullWidth sx={textFieldSx}>
              <InputLabel>Status</InputLabel>
              <Select
                value={filterData.status}
                label="Status"
                onChange={(e) => setFilterData({ ...filterData, status: e.target.value })}
              >
                <SelectMenuItem value="all">All Statuses</SelectMenuItem>
                <SelectMenuItem value="pending">Pending</SelectMenuItem>
                <SelectMenuItem value="processing">Processing</SelectMenuItem>
                <SelectMenuItem value="approved">Approved</SelectMenuItem>
                <SelectMenuItem value="rejected">Rejected</SelectMenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth sx={textFieldSx}>
              <InputLabel>Department</InputLabel>
              <Select
                value={filterData.department}
                label="Department"
                onChange={(e) => setFilterData({ ...filterData, department: e.target.value })}
              >
                <SelectMenuItem value="all">All Departments</SelectMenuItem>
                <SelectMenuItem value="Engineering">Engineering</SelectMenuItem>
                <SelectMenuItem value="Marketing">Marketing</SelectMenuItem>
                <SelectMenuItem value="Sales">Sales</SelectMenuItem>
                <SelectMenuItem value="HR">HR</SelectMenuItem>
                <SelectMenuItem value="Finance">Finance</SelectMenuItem>
                <SelectMenuItem value="Operations">Operations</SelectMenuItem>
                <SelectMenuItem value="IT">IT</SelectMenuItem>
                <SelectMenuItem value="Legal">Legal</SelectMenuItem>
                <SelectMenuItem value="Customer Success">Customer Success</SelectMenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth sx={textFieldSx}>
              <InputLabel>Incentive Type</InputLabel>
              <Select
                value={filterData.incentiveType}
                label="Incentive Type"
                onChange={(e) => setFilterData({ ...filterData, incentiveType: e.target.value })}
              >
                <SelectMenuItem value="all">All Types</SelectMenuItem>
                <SelectMenuItem value="Performance Bonus">Performance Bonus</SelectMenuItem>
                <SelectMenuItem value="Sales Commission">Sales Commission</SelectMenuItem>
                <SelectMenuItem value="Referral Bonus">Referral Bonus</SelectMenuItem>
                <SelectMenuItem value="Recognition Award">Recognition Award</SelectMenuItem>
                <SelectMenuItem value="Team Bonus">Team Bonus</SelectMenuItem>
                <SelectMenuItem value="Campaign Success">Campaign Success</SelectMenuItem>
                <SelectMenuItem value="Customer Satisfaction">Customer Satisfaction</SelectMenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Start Date"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={filterData.startDate}
              onChange={(e) => setFilterData({ ...filterData, startDate: e.target.value })}
              sx={textFieldSx}
            />
            <TextField
              fullWidth
              label="End Date"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={filterData.endDate}
              onChange={(e) => setFilterData({ ...filterData, endDate: e.target.value })}
              sx={textFieldSx}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFilterModalOpen(false)} sx={secondaryButtonSx}>
            Cancel
          </Button>
          <Button onClick={handleApplyFilter} variant="contained" className="bg-gradient-to-r from-blue-500 to-purple-600">
            Apply Filters
          </Button>
        </DialogActions>
      </Dialog>

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

export default Incentives
