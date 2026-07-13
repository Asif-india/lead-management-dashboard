import React, { useState } from 'react'
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
  Search
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
  Button
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
import {
  incentiveStats,
  monthlyIncentiveData,
  employeeLeaderboard,
  incentiveDistribution,
  incentiveTableData
} from '../constants/incentiveData'

const MotionTableRow = motion(TableRow)

const Incentives = () => {
  const [anchorEl, setAnchorEl] = useState(null)
  const [selectedIncentive, setSelectedIncentive] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

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

  const filteredIncentives = incentiveTableData.filter(incentive => {
    const matchesSearch = incentive.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         incentive.employeeId.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterStatus === 'all' || incentive.status === filterStatus
    return matchesSearch && matchesFilter
  })

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
              {filteredIncentives.map((incentive, index) => {
                const statusColor = getStatusColor(incentive.status)
                return (
                  <MotionTableRow
                    key={incentive.id}
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
                    <TableCell sx={tableMutedCellSx}>{incentive.date}</TableCell>
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

        {/* Dropdown Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          PaperProps={{
            sx: menuPaperSx
          }}
        >
          <MenuItem onClick={handleMenuClose} sx={menuItemSx}>
            <Eye className="w-4 h-4 mr-2" />
            View Details
          </MenuItem>
          <MenuItem onClick={handleMenuClose} sx={menuItemSx}>
            <Edit className="w-4 h-4 mr-2" />
            Edit Incentive
          </MenuItem>
          <MenuItem onClick={handleMenuClose} sx={menuItemSx}>
            <Calculator className="w-4 h-4 mr-2" />
            Recalculate
          </MenuItem>
        </Menu>
      </motion.div>
    </motion.div>
  )
}

export default Incentives
