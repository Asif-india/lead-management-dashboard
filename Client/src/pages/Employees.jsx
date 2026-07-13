import React, { useState } from 'react'
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
  InputLabel
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
import {
  employeeStats,
  employees,
  departments,
  statuses
} from '../constants/employeeData'

const MotionTableRow = motion(TableRow)

const Employees = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterDepartment, setFilterDepartment] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [anchorEl, setAnchorEl] = useState(null)
  const [selectedEmployee, setSelectedEmployee] = useState(null)
  const [viewMode, setViewMode] = useState('table') // 'table' or 'cards'

  const iconMap = {
    'Users': Users,
    'UserCheck': UserCheck,
    'Building2': Building2,
    'TrendingUp': TrendingUp
  }

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         employee.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         employee.position.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         employee.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesDepartment = filterDepartment === 'all' || employee.department === filterDepartment
    const matchesStatus = filterStatus === 'all' || employee.status === filterStatus
    return matchesSearch && matchesDepartment && matchesStatus
  })

  const handleMenuClick = (event, employee) => {
    setAnchorEl(event.currentTarget)
    setSelectedEmployee(employee)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    setSelectedEmployee(null)
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
    const statusColor = getStatusColor(employee.status)
    const performanceColor = getPerformanceColor(employee.performance)
    const deptColor = getDepartmentColor(employee.department)
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
              <span className="text-white font-bold text-lg">{employee.avatar}</span>
            </Avatar>
            <div>
              <h3 className="text-foreground font-semibold text-lg">{employee.name}</h3>
              <p className="text-muted-foreground text-sm">{employee.position}</p>
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
                  label={employee.status.replace('_', ' ')}
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
            <span>{employee.location}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>Joined {employee.joinDate}</span>
          </div>
        </div>

        <div className="mt-4 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Performance</span>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium" style={{ color: performanceColor.color }}>
                {employee.performance}%
              </span>
              <div className="w-20">
                <LinearProgress
                  variant="determinate"
                  value={employee.performance}
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
            <span className="text-sm font-medium text-green-400">{employee.salary}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Projects</span>
            <span className="text-sm font-medium text-blue-400">{employee.projects}</span>
          </div>
        </div>

        <div className="mt-4">
          <p className="text-xs text-muted-foreground mb-2">Skills</p>
          <div className="flex flex-wrap gap-1">
            {employee.skills.slice(0, 3).map((skill, skillIndex) => (
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
            {employee.skills.length > 3 && (
              <Chip
                label={`+${employee.skills.length - 3}`}
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
            Showing {filteredEmployees.length} of {employees.length} employees
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
      <motion.div variants={itemVariants} className="bg-card/50 border border-border/50 rounded-2xl p-6 backdrop-blur-sm">
        <AnimatePresence mode="wait">
          {viewMode === 'table' ? (
            <motion.div
              key="table"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <TableContainer component={Paper} sx={{ backgroundColor: 'transparent', boxShadow: 'none' }}>
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
                  <TableBody>
                    {filteredEmployees.map((employee, index) => {
                      const statusColor = getStatusColor(employee.status)
                      const performanceColor = getPerformanceColor(employee.performance)
                      const deptColor = getDepartmentColor(employee.department)
                      return (
                        <MotionTableRow
                          key={employee.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          sx={tableRowSx}
                        >
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <Avatar sx={{ width: 40, height: 40, background: `linear-gradient(135deg, ${deptColor.split(' ')[1]}, ${deptColor.split(' ')[3]})` }}>
                                {employee.avatar}
                              </Avatar>
                              <div>
                                <p className="text-foreground font-medium">{employee.name}</p>
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
                          <TableCell sx={tableBodyCellSx}>{employee.position}</TableCell>
                          <TableCell>
                            <Chip
                              label={employee.status.replace('_', ' ')}
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
                                value={employee.performance}
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
                                {employee.performance}%
                              </span>
                            </div>
                          </TableCell>
                          <TableCell sx={tableBodyCellSx}>{employee.salary}</TableCell>
                          <TableCell>
                            <IconButton
                              size="small"
                              onClick={(e) => handleMenuClick(e, employee)}
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
            </motion.div>
          ) : (
            <motion.div
              key="cards"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredEmployees.map((employee, index) => (
                  <EmployeeCard key={employee.id} employee={employee} index={index} />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

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
          <MenuItem onClick={handleMenuClose} sx={menuItemSx}>
            <Eye className="w-4 h-4 mr-3" />
            View Profile
          </MenuItem>
          <MenuItem onClick={handleMenuClose} sx={menuItemSx}>
            <Edit className="w-4 h-4 mr-3" />
            Edit Employee
          </MenuItem>
          <MenuItem onClick={handleMenuClose} sx={menuItemSx}>
            <Award className="w-4 h-4 mr-3" />
            Performance Review
          </MenuItem>
          <MenuItem onClick={handleMenuClose} sx={menuItemSx}>
            <Trash2 className="w-4 h-4 mr-3" />
            Remove Employee
          </MenuItem>
        </Menu>
      </motion.div>
    </motion.div>
  )
}

export default Employees
