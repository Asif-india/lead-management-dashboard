import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Users,
  Search,
  Plus,
  MoreVertical,
  Mail,
  Phone,
  MapPin,
  Calendar,
  TrendingUp,
  Eye,
  Edit,
  Trash2,
  UserCheck,
  Building2,
  Award
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
  Button,
  Avatar,
  LinearProgress,
  Select,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert
} from '@mui/material'
import { containerVariants, itemVariants } from '../constants/formAnimations'
import {
  textFieldSx,
  selectSx,
  inputLabelSx,
  menuPaperSx,
  menuItemSx,
  tableHeaderCellSx,
  tableBodyCellSx,
  tableMutedCellSx,
  tableRowSx
} from '../constants/formStyles'
import { employeesApi } from '../services/api'

const Employees = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterDepartment, setFilterDepartment] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [anchorEl, setAnchorEl] = useState(null)
  const [selectedEmployee, setSelectedEmployee] = useState(null)
  const [viewMode, setViewMode] = useState('table') // 'table' or 'cards'
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [employees, setEmployees] = useState([])
  const [statistics, setStatistics] = useState(null)
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 0 })
  
  // Modal states
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  
  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    employeeId: '',
    department: '',
    designation: '',
    country: '',
    state: '',
    city: '',
    address: '',
    zipCode: '',
    dateOfJoining: '',
    employmentStatus: 'active',
    salary: '',
    bio: '',
    skills: []
  })
  
  // Filter options
  const departments = ['all', 'Engineering', 'Marketing', 'Sales', 'HR', 'Finance', 'Operations', 'IT', 'Legal']
  const statuses = ['all', 'active', 'inactive', 'on-leave', 'terminated']

  useEffect(() => {
    fetchStatistics()
    fetchEmployees()
  }, [])

  useEffect(() => {
    if (pagination.page > 1) {
      fetchEmployees()
    }
  }, [pagination.page])

  useEffect(() => {
    setPagination(prev => ({ ...prev, page: 1 }))
    fetchEmployees({ page: 1 })
  }, [searchQuery, filterDepartment, filterStatus])

  const fetchStatistics = async () => {
    try {
      const response = await employeesApi.getStatistics()
      const data = response?.data || response
      setStatistics(data)
    } catch (err) {
      console.error('Error fetching statistics:', err)
    }
  }

  const fetchEmployees = async (params = {}) => {
    try {
      setLoading(true)
      const requestParams = {
        page: pagination.page,
        limit: pagination.limit,
        search: searchQuery || undefined,
        department: filterDepartment === 'all' ? undefined : filterDepartment,
        employmentStatus: filterStatus === 'all' ? undefined : filterStatus,
        ...params
      }
      const response = await employeesApi.getList(requestParams)
      const data = response?.data || response
      setEmployees(Array.isArray(data) ? data : data.data || [])
      const paginationData = response?.data?.pagination || response?.pagination || {}
      setPagination(prev => ({
        ...prev,
        ...paginationData,
        pages: paginationData.totalPages || Math.ceil((paginationData.total || 0) / prev.limit)
      }))
    } catch (err) {
      console.error('Error fetching employees:', err)
      setError('Failed to load employees')
    } finally {
      setLoading(false)
    }
  }

  const iconMap = {
    'Users': Users,
    'UserCheck': UserCheck,
    'Building2': Building2,
    'TrendingUp': TrendingUp
  }

  const handleMenuClick = (event, employee) => {
    setAnchorEl(event.currentTarget)
    setSelectedEmployee(employee)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    setSelectedEmployee(null)
  }

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }))
    fetchEmployees({ page: newPage })
  }

  const handleCreateEmployee = async () => {
    try {
      const employeeData = {
        ...formData,
        salary: Number(formData.salary),
        skills: Array.isArray(formData.skills) ? formData.skills : formData.skills.split(',').map(s => s.trim())
      }
      await employeesApi.create(employeeData)
      setCreateModalOpen(false)
      resetForm()
      fetchEmployees()
      fetchStatistics()
      setSuccessMessage('Employee created successfully!')
      setShowSuccess(true)
    } catch (err) {
      console.error('Error creating employee:', err)
      setError('Failed to create employee')
    }
  }

  const handleEditEmployee = async () => {
    try {
      const employeeData = {
        ...formData,
        salary: Number(formData.salary),
        skills: Array.isArray(formData.skills) ? formData.skills : formData.skills.split(',').map(s => s.trim())
      }
      await employeesApi.update(selectedEmployee._id, employeeData)
      setEditModalOpen(false)
      resetForm()
      setSelectedEmployee(null)
      fetchEmployees()
      fetchStatistics()
      setSuccessMessage('Employee updated successfully!')
      setShowSuccess(true)
    } catch (err) {
      console.error('Error updating employee:', err)
      setError('Failed to update employee')
    }
  }

  const handleDeleteEmployee = async () => {
    try {
      await employeesApi.delete(selectedEmployee._id)
      setAnchorEl(null)
      setSelectedEmployee(null)
      fetchEmployees()
      fetchStatistics()
      setSuccessMessage('Employee deleted successfully!')
      setShowSuccess(true)
    } catch (err) {
      console.error('Error deleting employee:', err)
      setError('Failed to delete employee')
    }
  }

  const handleViewEmployee = () => {
    setViewModalOpen(true)
  }

  const handleOpenEditModal = () => {
    if (selectedEmployee) {
      setFormData({
        firstName: selectedEmployee.firstName,
        lastName: selectedEmployee.lastName,
        email: selectedEmployee.email,
        phone: selectedEmployee.phone,
        employeeId: selectedEmployee.employeeId,
        department: selectedEmployee.department,
        designation: selectedEmployee.designation,
        country: selectedEmployee.country,
        state: selectedEmployee.state,
        city: selectedEmployee.city,
        address: selectedEmployee.address,
        zipCode: selectedEmployee.zipCode,
        dateOfJoining: selectedEmployee.dateOfJoining ? new Date(selectedEmployee.dateOfJoining).toISOString().split('T')[0] : '',
        employmentStatus: selectedEmployee.employmentStatus,
        salary: selectedEmployee.salary,
        bio: selectedEmployee.bio || '',
        skills: selectedEmployee.skills || []
      })
      setEditModalOpen(true)
    }
    setAnchorEl(null)
  }

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      employeeId: '',
      department: '',
      designation: '',
      country: '',
      state: '',
      city: '',
      address: '',
      zipCode: '',
      dateOfJoining: '',
      employmentStatus: 'active',
      salary: '',
      bio: '',
      skills: []
    })
  }

  // Format statistics for display
  const employeeStats = statistics ? [
    {
      title: 'Total Employees',
      value: statistics.totalEmployees?.toString() || '0',
      change: '+12%',
      trend: 'up',
      icon: 'Users',
      color: 'from-blue-500 to-cyan-600',
      description: 'Across all departments'
    },
    {
      title: 'Active Employees',
      value: statistics.statusDistribution?.find(s => s._id === 'active')?.count?.toString() || '0',
      change: '+5%',
      trend: 'up',
      icon: 'UserCheck',
      color: 'from-green-500 to-emerald-600',
      description: 'Currently working'
    },
    {
      title: 'Departments',
      value: statistics.departmentDistribution?.length?.toString() || '0',
      change: '0',
      trend: 'neutral',
      icon: 'Building2',
      color: 'from-purple-500 to-pink-600',
      description: 'Total departments'
    },
    {
      title: 'Avg Performance',
      value: '86%',
      change: '+8%',
      trend: 'up',
      icon: 'TrendingUp',
      color: 'from-orange-500 to-red-600',
      description: 'Company average'
    }
  ] : []

  if (loading && !statistics) {
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return { bg: 'rgba(16, 185, 129, 0.1)', text: '#4ade80', border: 'rgba(16, 185, 129, 0.2)' }
      case 'on_leave':
        return { bg: 'rgba(234, 179, 8, 0.1)', text: '#facc15', border: 'rgba(234, 179, 8, 0.2)' }
      case 'inactive':
        return { bg: 'rgba(239, 68, 68, 0.1)', text: '#f87171', border: 'rgba(239, 68, 68, 0.2)' }
      default:
        return { bg: 'rgba(107, 114, 128, 0.1)', text: '#9ca3af', border: 'rgba(107, 114, 128, 0.2)' }
    }
  }

  const getPerformanceColor = (performance) => {
    if (performance >= 90) return { color: '#4ade80', bg: 'rgba(16, 185, 129, 0.1)' }
    if (performance >= 80) return { color: '#60a5fa', bg: 'rgba(59, 130, 246, 0.1)' }
    if (performance >= 70) return { color: '#facc15', bg: 'rgba(234, 179, 8, 0.1)' }
    return { color: '#f87171', bg: 'rgba(239, 68, 68, 0.1)' }
  }

  const getDepartmentColor = (department) => {
    const colors = {
      'Sales': 'from-blue-500 to-cyan-600',
      'Marketing': 'from-purple-500 to-pink-600',
      'Engineering': 'from-green-500 to-emerald-600',
      'HR': 'from-orange-500 to-red-600',
      'Finance': 'from-indigo-500 to-purple-600'
    }
    return colors[department] || 'from-gray-500 to-slate-600'
  }


  const EmployeeCard = ({ employee, index }) => {
    const statusColor = getStatusColor(employee.employmentStatus)
    const performanceColor = getPerformanceColor(employee.performance || 75)
    const deptColor = getDepartmentColor(employee.department)
    const fullName = `${employee.firstName} ${employee.lastName}`
    const location = `${employee.city}, ${employee.country}`
    const joinDate = employee.dateOfJoining ? new Date(employee.dateOfJoining).toLocaleDateString() : 'N/A'
    const avatar = fullName.split(' ').map(n => n[0]).join('')
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        whileHover={{ y: -8, scale: 1.02 }}
        className="bg-muted/30 border border-border/30 rounded-xl p-6 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300"
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-4">
            <Avatar sx={{ width: 56, height: 56, background: `linear-gradient(135deg, ${deptColor.split(' ')[1]}, ${deptColor.split(' ')[3]})` }}>
              <span className="text-white font-bold text-lg">{avatar}</span>
            </Avatar>
            <div>
              <h3 className="text-foreground font-semibold text-lg">{fullName}</h3>
              <p className="text-muted-foreground text-sm">{employee.designation}</p>
              <div className="flex items-center space-x-2 mt-1">
                <Chip
                  label={employee.department}
                  size="small"
                  sx={{
                    backgroundColor: 'rgba(59, 130, 246, 0.1)',
                    color: '#60a5fa',
                    border: '1px solid rgba(59, 130, 246, 0.2)',
                    fontSize: '0.65rem',
                    height: '20px'
                  }}
                />
                <Chip
                  label={employee.employmentStatus.replace('-', ' ')}
                  size="small"
                  sx={{
                    backgroundColor: statusColor.bg,
                    color: statusColor.text,
                    border: `1px solid ${statusColor.border}`,
                    fontSize: '0.65rem',
                    height: '20px'
                  }}
                />
              </div>
            </div>
          </div>
          <IconButton
            size="small"
            onClick={(e) => handleMenuClick(e, employee)}
            sx={tableMutedCellSx}
          >
            <MoreVertical className="w-4 h-4" />
          </IconButton>
        </div>

        <div className="space-y-3">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Mail className="w-4 h-4" />
            <span className="truncate">{employee.email}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Phone className="w-4 h-4" />
            <span>{employee.phone}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span>{location}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>Joined {joinDate}</span>
          </div>
        </div>

        <div className="mt-4 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Performance</span>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium" style={{ color: performanceColor.color }}>
                {employee.performance || 75}%
              </span>
              <div className="w-20">
                <LinearProgress
                  variant="determinate"
                  value={employee.performance || 75}
                  sx={{
                    height: 4,
                    backgroundColor: 'hsl(var(--muted))',
                    '& .MuiLinearProgress-bar': {
                      background: 'linear-gradient(to right, #3b82f6, #8b5cf6)'
                    }
                  }}
                />
              </div>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Salary</span>
            <span className="text-sm font-medium text-green-400">${employee.salary?.toLocaleString()}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Projects</span>
            <span className="text-sm font-medium text-blue-400">{employee.projects || 0}</span>
          </div>
        </div>

        <div className="mt-4">
          <p className="text-xs text-muted-foreground mb-2">Skills</p>
          <div className="flex flex-wrap gap-1">
            {(employee.skills || []).slice(0, 3).map((skill, skillIndex) => (
              <Chip
                key={skillIndex}
                label={skill}
                size="small"
                sx={{
                  backgroundColor: 'rgba(139, 92, 246, 0.1)',
                  color: '#a78bfa',
                  border: '1px solid rgba(139, 92, 246, 0.2)',
                  fontSize: '0.6rem',
                  height: '18px'
                }}
              />
            ))}
            {(employee.skills || []).length > 3 && (
              <Chip
                label={`+${(employee.skills || []).length - 3}`}
                size="small"
                sx={{
                  backgroundColor: 'rgba(71, 85, 105, 0.3)',
                  color: '#94a3b8',
                  fontSize: '0.6rem',
                  height: '18px'
                }}
              />
            )}
          </div>
        </div>
      </motion.div>
    )
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
            Employees Management
          </h1>
          <p className="text-muted-foreground text-lg">Manage your team and track employee performance</p>
        </div>
        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          <Button
            variant="text"
            size="small"
            sx={{ color: 'hsl(var(--muted-foreground))', '&:hover': { color: 'hsl(var(--foreground))' } }}
            onClick={() => setViewMode(viewMode === 'table' ? 'cards' : 'table')}
          >
            {viewMode === 'table' ? 'Card View' : 'Table View'}
          </Button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCreateModalOpen(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg shadow-blue-500/25"
          >
            <Plus className="w-4 h-4" />
            <span>Add Employee</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Employee Statistics Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {employeeStats.map((stat, index) => {
          const Icon = stat.icon
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
                  stat.trend === 'up' ? 'text-green-400' : stat.trend === 'down' ? 'text-red-400' : 'text-muted-foreground'
                }`}>
                  {stat.trend === 'up' && <TrendingUp className="w-4 h-4" />}
                  {stat.trend === 'down' && <TrendingUp className="w-4 h-4 rotate-180" />}
                  <span>{stat.change}</span>
                </div>
              </div>
              <h3 className="text-3xl font-bold text-foreground mb-1">{stat.value}</h3>
              <p className="text-foreground font-medium mb-1">{stat.title}</p>
              <p className="text-muted-foreground text-sm">{stat.description}</p>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Filters and Search */}
      <motion.div variants={itemVariants} className="bg-card/50 border border-border/50 rounded-2xl p-6 backdrop-blur-sm">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <TextField
              fullWidth
              placeholder="Search employees by name, email, position, or skills..."
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
          </div>
          
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel sx={inputLabelSx}>Department</InputLabel>
            <Select
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
              label="Department"
              sx={selectSx}
            >
              {departments.map(dept => (
                <MenuItem key={dept} value={dept} sx={menuItemSx}>
                  {dept === 'all' ? 'All Departments' : dept}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel sx={inputLabelSx}>Status</InputLabel>
            <Select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              label="Status"
              sx={selectSx}
            >
              {statuses.map(status => (
                <MenuItem key={status} value={status} sx={menuItemSx}>
                  {status === 'all' ? 'All Status' : status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        
        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} employees
          </p>
          <div className="flex items-center space-x-2">
            <Button
              variant="text"
              size="small"
              sx={{ color: 'hsl(var(--muted-foreground))', '&:hover': { color: 'hsl(var(--foreground))' } }}
              onClick={() => {
                setSearchQuery('')
                setFilterDepartment('all')
                setFilterStatus('all')
              }}
            >
              Clear Filters
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Employee Display */}
      <motion.div variants={itemVariants} className="bg-card/50 border border-border/50 rounded-2xl p-6 backdrop-blur-sm min-h-[300px]">
        {viewMode === 'table' ? (
          <div>
            <TableContainer component={Paper} sx={{ backgroundColor: 'transparent', boxShadow: 'none', overflowX: 'visible' }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={tableHeaderCellSx}>Employee</TableCell>
                      <TableCell sx={tableHeaderCellSx}>Department</TableCell>
                      <TableCell sx={tableHeaderCellSx}>Position</TableCell>
                      <TableCell sx={tableHeaderCellSx}>Status</TableCell>
                      <TableCell sx={tableHeaderCellSx}>Performance</TableCell>
                      <TableCell sx={tableHeaderCellSx}>Salary</TableCell>
                      <TableCell sx={tableHeaderCellSx}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody sx={{ minHeight: `${pagination.limit * 60}px` }}>
                    {employees.map((employee, index) => {
                      const statusColor = getStatusColor(employee.employmentStatus)
                      const performanceColor = getPerformanceColor(employee.performance || 75)
                      const deptColor = getDepartmentColor(employee.department)
                      const fullName = `${employee.firstName} ${employee.lastName}`
                      const avatar = fullName.split(' ').map(n => n[0]).join('')
                      return (
                        <TableRow
                          key={employee._id}
                          sx={tableRowSx}
                        >
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <Avatar sx={{ width: 40, height: 40, background: `linear-gradient(135deg, ${deptColor.split(' ')[1]}, ${deptColor.split(' ')[3]})` }}>
                                {avatar}
                              </Avatar>
                              <div>
                                <p className="text-foreground font-medium">{fullName}</p>
                                <p className="text-muted-foreground text-xs">{employee.email}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell sx={tableBodyCellSx}>
                            <Chip
                              label={employee.department}
                              size="small"
                              sx={{
                                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                                color: '#60a5fa',
                                border: '1px solid rgba(59, 130, 246, 0.2)',
                                fontSize: '0.7rem'
                              }}
                            />
                          </TableCell>
                          <TableCell sx={tableBodyCellSx}>{employee.designation}</TableCell>
                          <TableCell>
                            <Chip
                              label={employee.employmentStatus.replace('-', ' ')}
                              size="small"
                              sx={{
                                backgroundColor: statusColor.bg,
                                color: statusColor.text,
                                border: `1px solid ${statusColor.border}`,
                                fontSize: '0.7rem',
                                fontWeight: 500
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              <LinearProgress
                                variant="determinate"
                                value={employee.performance || 75}
                                sx={{
                                  width: 60,
                                  height: 6,
                                  backgroundColor: 'hsl(var(--muted))',
                                  '& .MuiLinearProgress-bar': {
                                    background: 'linear-gradient(to right, #3b82f6, #8b5cf6)'
                                  }
                                }}
                              />
                              <span className="text-sm font-medium" style={{ color: performanceColor.color }}>
                                {employee.performance || 75}%
                              </span>
                            </div>
                          </TableCell>
                          <TableCell sx={tableBodyCellSx}>${employee.salary?.toLocaleString()}</TableCell>
                          <TableCell>
                            <IconButton
                              size="small"
                              onClick={(e) => handleMenuClick(e, employee)}
                              sx={tableMutedCellSx}
                            >
                              <MoreVertical className="w-4 h-4" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {employees.map((employee, index) => (
              <EmployeeCard key={employee._id} employee={employee} index={index} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.total > 0 && (
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-border/50">
            <div className="text-sm text-muted-foreground">
              Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} employees
            </div>
            <div className="flex items-center space-x-2">
              <Button
                size="small"
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                sx={{ color: 'hsl(var(--muted-foreground))', '&:hover': { color: 'hsl(var(--foreground))' } }}
              >
                Previous
              </Button>
              <span className="text-sm text-foreground px-3">
                Page {pagination.page} of {Math.ceil(pagination.total / pagination.limit)}
              </span>
              <Button
                size="small"
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page >= Math.ceil(pagination.total / pagination.limit)}
                sx={{ color: 'hsl(var(--muted-foreground))', '&:hover': { color: 'hsl(var(--foreground))' } }}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </motion.div>

      {/* Dropdown Menu */}
      <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          PaperProps={{
            sx: {
              ...menuPaperSx,
              borderRadius: '12px',
              minWidth: 180
            }
          }}
        >
          <MenuItem onClick={handleViewEmployee} sx={menuItemSx}>
            <Eye className="w-4 h-4 mr-3" />
            View Profile
          </MenuItem>
          <MenuItem onClick={handleOpenEditModal} sx={menuItemSx}>
            <Edit className="w-4 h-4 mr-3" />
            Edit Employee
          </MenuItem>
          <MenuItem onClick={handleMenuClose} sx={menuItemSx}>
            <Award className="w-4 h-4 mr-3" />
            Performance Review
          </MenuItem>
          <MenuItem onClick={handleDeleteEmployee} sx={menuItemSx}>
            <Trash2 className="w-4 h-4 mr-3" />
            Remove Employee
          </MenuItem>
        </Menu>

      {/* Create Employee Modal */}
      <Dialog open={createModalOpen} onClose={() => setCreateModalOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle className="text-foreground">Add New Employee</DialogTitle>
        <DialogContent>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <TextField
              fullWidth
              label="First Name"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              sx={textFieldSx}
            />
            <TextField
              fullWidth
              label="Last Name"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              sx={textFieldSx}
            />
            <TextField
              fullWidth
              label="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              sx={textFieldSx}
            />
            <TextField
              fullWidth
              label="Phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
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
              <InputLabel sx={inputLabelSx}>Department</InputLabel>
              <Select
                value={formData.department}
                label="Department"
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                sx={selectSx}
              >
                <MenuItem value="Engineering">Engineering</MenuItem>
                <MenuItem value="Marketing">Marketing</MenuItem>
                <MenuItem value="Sales">Sales</MenuItem>
                <MenuItem value="HR">HR</MenuItem>
                <MenuItem value="Finance">Finance</MenuItem>
                <MenuItem value="Operations">Operations</MenuItem>
                <MenuItem value="IT">IT</MenuItem>
                <MenuItem value="Legal">Legal</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Designation"
              value={formData.designation}
              onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
              sx={textFieldSx}
            />
            <TextField
              fullWidth
              label="Salary"
              type="number"
              value={formData.salary}
              onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
              sx={textFieldSx}
            />
            <TextField
              fullWidth
              label="Country"
              value={formData.country}
              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              sx={textFieldSx}
            />
            <TextField
              fullWidth
              label="State"
              value={formData.state}
              onChange={(e) => setFormData({ ...formData, state: e.target.value })}
              sx={textFieldSx}
            />
            <TextField
              fullWidth
              label="City"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              sx={textFieldSx}
            />
            <TextField
              fullWidth
              label="Address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              sx={textFieldSx}
            />
            <TextField
              fullWidth
              label="Zip Code"
              value={formData.zipCode}
              onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
              sx={textFieldSx}
            />
            <TextField
              fullWidth
              label="Date of Joining"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={formData.dateOfJoining}
              onChange={(e) => setFormData({ ...formData, dateOfJoining: e.target.value })}
              sx={textFieldSx}
            />
            <FormControl fullWidth sx={textFieldSx}>
              <InputLabel sx={inputLabelSx}>Employment Status</InputLabel>
              <Select
                value={formData.employmentStatus}
                label="Employment Status"
                onChange={(e) => setFormData({ ...formData, employmentStatus: e.target.value })}
                sx={selectSx}
              >
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
                <MenuItem value="on-leave">On Leave</MenuItem>
                <MenuItem value="terminated">Terminated</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Skills (comma separated)"
              value={Array.isArray(formData.skills) ? formData.skills.join(', ') : formData.skills}
              onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
              sx={textFieldSx}
            />
            <TextField
              fullWidth
              label="Bio"
              multiline
              rows={2}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              sx={textFieldSx}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setCreateModalOpen(false); resetForm() }} sx={{ color: 'hsl(var(--muted-foreground))' }}>
            Cancel
          </Button>
          <Button onClick={handleCreateEmployee} variant="contained" className="bg-gradient-to-r from-blue-500 to-purple-600">
            Add Employee
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Employee Modal */}
      <Dialog open={editModalOpen} onClose={() => setEditModalOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle className="text-foreground">Edit Employee</DialogTitle>
        <DialogContent>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <TextField
              fullWidth
              label="First Name"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              sx={textFieldSx}
            />
            <TextField
              fullWidth
              label="Last Name"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              sx={textFieldSx}
            />
            <TextField
              fullWidth
              label="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              sx={textFieldSx}
            />
            <TextField
              fullWidth
              label="Phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
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
              <InputLabel sx={inputLabelSx}>Department</InputLabel>
              <Select
                value={formData.department}
                label="Department"
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                sx={selectSx}
              >
                <MenuItem value="Engineering">Engineering</MenuItem>
                <MenuItem value="Marketing">Marketing</MenuItem>
                <MenuItem value="Sales">Sales</MenuItem>
                <MenuItem value="HR">HR</MenuItem>
                <MenuItem value="Finance">Finance</MenuItem>
                <MenuItem value="Operations">Operations</MenuItem>
                <MenuItem value="IT">IT</MenuItem>
                <MenuItem value="Legal">Legal</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Designation"
              value={formData.designation}
              onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
              sx={textFieldSx}
            />
            <TextField
              fullWidth
              label="Salary"
              type="number"
              value={formData.salary}
              onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
              sx={textFieldSx}
            />
            <TextField
              fullWidth
              label="Country"
              value={formData.country}
              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              sx={textFieldSx}
            />
            <TextField
              fullWidth
              label="State"
              value={formData.state}
              onChange={(e) => setFormData({ ...formData, state: e.target.value })}
              sx={textFieldSx}
            />
            <TextField
              fullWidth
              label="City"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              sx={textFieldSx}
            />
            <TextField
              fullWidth
              label="Address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              sx={textFieldSx}
            />
            <TextField
              fullWidth
              label="Zip Code"
              value={formData.zipCode}
              onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
              sx={textFieldSx}
            />
            <TextField
              fullWidth
              label="Date of Joining"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={formData.dateOfJoining}
              onChange={(e) => setFormData({ ...formData, dateOfJoining: e.target.value })}
              sx={textFieldSx}
            />
            <FormControl fullWidth sx={textFieldSx}>
              <InputLabel sx={inputLabelSx}>Employment Status</InputLabel>
              <Select
                value={formData.employmentStatus}
                label="Employment Status"
                onChange={(e) => setFormData({ ...formData, employmentStatus: e.target.value })}
                sx={selectSx}
              >
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
                <MenuItem value="on-leave">On Leave</MenuItem>
                <MenuItem value="terminated">Terminated</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Skills (comma separated)"
              value={Array.isArray(formData.skills) ? formData.skills.join(', ') : formData.skills}
              onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
              sx={textFieldSx}
            />
            <TextField
              fullWidth
              label="Bio"
              multiline
              rows={2}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              sx={textFieldSx}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setEditModalOpen(false); resetForm(); setSelectedEmployee(null) }} sx={{ color: 'hsl(var(--muted-foreground))' }}>
            Cancel
          </Button>
          <Button onClick={handleEditEmployee} variant="contained" className="bg-gradient-to-r from-blue-500 to-purple-600">
            Update Employee
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Employee Modal */}
      <Dialog open={viewModalOpen} onClose={() => { setViewModalOpen(false); setAnchorEl(null) }} maxWidth="md" fullWidth>
        <DialogTitle className="text-foreground">Employee Profile</DialogTitle>
        <DialogContent>
          {selectedEmployee && (
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-muted-foreground text-sm">Full Name</p>
                  <p className="text-foreground font-medium">{selectedEmployee.firstName} {selectedEmployee.lastName}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Employee ID</p>
                  <p className="text-foreground font-medium">{selectedEmployee.employeeId}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Email</p>
                  <p className="text-foreground font-medium">{selectedEmployee.email}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Phone</p>
                  <p className="text-foreground font-medium">{selectedEmployee.phone}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Department</p>
                  <p className="text-foreground font-medium">{selectedEmployee.department}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Designation</p>
                  <p className="text-foreground font-medium">{selectedEmployee.designation}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Employment Status</p>
                  <Chip
                    label={selectedEmployee.employmentStatus.replace('-', ' ')}
                    size="small"
                    sx={{
                      backgroundColor: getStatusColor(selectedEmployee.employmentStatus).bg,
                      color: getStatusColor(selectedEmployee.employmentStatus).text,
                      border: `1px solid ${getStatusColor(selectedEmployee.employmentStatus).border}`,
                    }}
                  />
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Salary</p>
                  <p className="text-green-400 font-semibold">${selectedEmployee.salary?.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Location</p>
                  <p className="text-foreground font-medium">{selectedEmployee.city}, {selectedEmployee.country}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Date of Joining</p>
                  <p className="text-foreground font-medium">{selectedEmployee.dateOfJoining ? new Date(selectedEmployee.dateOfJoining).toLocaleDateString() : 'N/A'}</p>
                </div>
              </div>
              {selectedEmployee.skills && selectedEmployee.skills.length > 0 && (
                <div>
                  <p className="text-muted-foreground text-sm">Skills</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {selectedEmployee.skills.map((skill, index) => (
                      <Chip key={index} label={skill} size="small" sx={{ backgroundColor: 'rgba(139, 92, 246, 0.1)', color: '#a78bfa' }} />
                    ))}
                  </div>
                </div>
              )}
              {selectedEmployee.bio && (
                <div>
                  <p className="text-muted-foreground text-sm">Bio</p>
                  <p className="text-foreground">{selectedEmployee.bio}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setViewModalOpen(false); setAnchorEl(null) }} sx={{ color: 'hsl(var(--muted-foreground))' }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success Snackbar */}
      <Snackbar
        open={showSuccess}
        autoHideDuration={3000}
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        sx={{
          mt: '90px',
          zIndex: 999999
        }}
      >
        <Alert
          severity="success"
          variant="filled"
          elevation={6}
          onClose={() => setShowSuccess(false)}
        >
          {successMessage}
        </Alert>
      </Snackbar>
    </motion.div>
  )
}

export default Employees
