import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  BarChart3,
  Users,
  TrendingUp,
  DollarSign,
  Calendar,
  Download,
  Filter,
  Search,
  Bell,
  Settings,
  Plus,
  MoreVertical,
  Eye,
  Edit,
  Trash2
} from 'lucide-react'
import {
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Box,
  TextField,
  IconButton,
  Menu,
  MenuItem,
  Chip
} from '@mui/material'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts'

const Dashboard = () => {
  const [anchorEl, setAnchorEl] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  const stats = [
    {
      title: 'Total Revenue',
      value: '$45,231',
      change: '+20.1%',
      icon: DollarSign,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-900/30'
    },
    {
      title: 'Active Users',
      value: '2,350',
      change: '+15.3%',
      icon: Users,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30'
    },
    {
      title: 'Conversion Rate',
      value: '12.5%',
      change: '+2.1%',
      icon: TrendingUp,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-100 dark:bg-purple-900/30'
    },
    {
      title: 'Total Sales',
      value: '1,234',
      change: '+18.2%',
      icon: BarChart3,
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-100 dark:bg-orange-900/30'
    }
  ]

  const chartData = [
    { name: 'Jan', revenue: 4000, users: 2400 },
    { name: 'Feb', revenue: 3000, users: 1398 },
    { name: 'Mar', revenue: 2000, users: 9800 },
    { name: 'Apr', revenue: 2780, users: 3908 },
    { name: 'May', revenue: 1890, users: 4800 },
    { name: 'Jun', revenue: 2390, users: 3800 },
    { name: 'Jul', revenue: 3490, users: 4300 }
  ]

  const pieData = [
    { name: 'Desktop', value: 45, color: '#3b82f6' },
    { name: 'Mobile', value: 35, color: '#d946ef' },
    { name: 'Tablet', value: 20, color: '#22c55e' }
  ]

  const recentActivities = [
    {
      id: 1,
      user: 'John Doe',
      action: 'Completed purchase',
      time: '2 minutes ago',
      status: 'success'
    },
    {
      id: 2,
      user: 'Sarah Smith',
      action: 'Updated profile',
      time: '15 minutes ago',
      status: 'info'
    },
    {
      id: 3,
      user: 'Mike Johnson',
      action: 'Left a review',
      time: '1 hour ago',
      status: 'warning'
    },
    {
      id: 4,
      user: 'Emily Davis',
      action: 'Subscribed to newsletter',
      time: '2 hours ago',
      status: 'success'
    }
  ]

  const recentProjects = [
    {
      id: 1,
      name: 'E-commerce Platform',
      status: 'In Progress',
      progress: 75,
      deadline: '2024-02-15',
      team: ['JD', 'SM', 'MJ']
    },
    {
      id: 2,
      name: 'Mobile App Redesign',
      status: 'Planning',
      progress: 25,
      deadline: '2024-03-01',
      team: ['ED', 'AK']
    },
    {
      id: 3,
      name: 'API Integration',
      status: 'Completed',
      progress: 100,
      deadline: '2024-01-30',
      team: ['RT', 'KL']
    }
  ]

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return 'bg-success/20 text-success-foreground'
      case 'warning': return 'bg-warning/20 text-warning-foreground'
      case 'info': return 'bg-primary/20 text-primary-foreground'
      case 'error': return 'bg-error/20 text-error-foreground'
      default: return 'bg-muted text-muted-foreground'
    }
  }

  const getProjectStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'success'
      case 'In Progress': return 'warning'
      case 'Planning': return 'info'
      default: return 'default'
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <Typography variant="h4" className="font-semibold">
              Dashboard
            </Typography>
            <Typography variant="body2" className="text-muted-foreground">
              Welcome back! Here's what's happening with your business today.
            </Typography>
          </div>
          <div className="flex items-center gap-4">
            <TextField
              size="small"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <Search className="w-4 h-4 text-muted-foreground mr-2" />
              }}
            />
            <IconButton>
              <Bell className="w-5 h-5 text-muted-foreground" />
            </IconButton>
            <IconButton>
              <Settings className="w-5 h-5 text-muted-foreground" />
            </IconButton>
            <Button variant="contained" startIcon={<Plus />}>
              New Project
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Stats Grid */}
        <Grid container spacing={4} className="mb-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <Grid item xs={12} sm={6} lg={3} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="hover-lift">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                          <Icon className={`w-6 h-6 ${stat.color}`} />
                        </div>
                        <Chip 
                          label={stat.change} 
                          size="small" 
                          color="success"
                          className="text-xs"
                        />
                      </div>
                      <Typography variant="h5" className="font-semibold mb-1">
                        {stat.value}
                      </Typography>
                      <Typography variant="body2" className="text-muted-foreground">
                        {stat.title}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            )
          })}
        </Grid>

        {/* Charts Section */}
        <Grid container spacing={6} className="mb-6">
          <Grid item xs={12} lg={8}>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <Typography variant="h6" className="font-semibold text-foreground">
                      Revenue Overview
                    </Typography>
                    <div className="flex items-center gap-2">
                      <IconButton size="small" className="text-muted-foreground hover:text-foreground">
                        <Filter className="w-4 h-4" />
                      </IconButton>
                      <IconButton size="small" className="text-muted-foreground hover:text-foreground">
                        <Download className="w-4 h-4" />
                      </IconButton>
                    </div>
                  </div>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="name" stroke="hsl(var(--text-muted))" />
                      <YAxis stroke="hsl(var(--text-muted))" />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'hsl(var(--popover))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                          color: 'hsl(var(--popover-foreground))'
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="hsl(var(--primary))" 
                        strokeWidth={2}
                        dot={{ fill: 'hsl(var(--primary))' }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="users" 
                        stroke="hsl(var(--accent))" 
                        strokeWidth={2}
                        dot={{ fill: 'hsl(var(--accent))' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          <Grid item xs={12} lg={4}>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Card className="shadow-lg h-full">
                <CardContent className="p-6">
                  <Typography variant="h6" className="font-semibold mb-6 text-foreground">
                    Traffic Sources
                  </Typography>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'hsl(var(--popover))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                          color: 'hsl(var(--popover-foreground))'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="mt-4 space-y-2">
                    {pieData.map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: item.color }}
                          />
                          <Typography variant="body2" className="text-foreground">{item.name}</Typography>
                        </div>
                        <Typography variant="body2" className="font-medium text-foreground">
                          {item.value}%
                        </Typography>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        </Grid>

        {/* Recent Activities and Projects */}
        <Grid container spacing={6}>
          <Grid item xs={12} lg={6}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card className="shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <Typography variant="h6" className="font-semibold text-foreground">
                      Recent Activities
                    </Typography>
                    <Button size="small" variant="text">
                      View All
                    </Button>
                  </div>
                  <div className="space-y-4">
                    {recentActivities.map((activity) => (
                      <div key={activity.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                            <span className="text-xs font-semibold text-primary">
                              {activity.user.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div>
                            <Typography variant="body2" className="font-medium text-foreground">
                              {activity.user}
                            </Typography>
                            <Typography variant="caption" className="text-muted-foreground">
                              {activity.action}
                            </Typography>
                          </div>
                        </div>
                        <div className="text-right">
                          <Chip 
                            label={activity.status}
                            size="small"
                            className={getStatusColor(activity.status)}
                          />
                          <Typography variant="caption" className="text-muted-foreground block mt-1">
                            {activity.time}
                          </Typography>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          <Grid item xs={12} lg={6}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <Card className="shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <Typography variant="h6" className="font-semibold text-foreground">
                      Recent Projects
                    </Typography>
                    <Button size="small" variant="text">
                      View All
                    </Button>
                  </div>
                  <div className="space-y-4">
                    {recentProjects.map((project) => (
                      <div key={project.id} className="p-4 border border-border rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <Typography variant="subtitle2" className="font-semibold text-foreground">
                            {project.name}
                          </Typography>
                          <IconButton size="small" onClick={handleMenuClick} className="text-muted-foreground hover:text-foreground">
                            <MoreVertical className="w-4 h-4" />
                          </IconButton>
                        </div>
                        <div className="flex items-center gap-2 mb-3">
                          <Chip 
                            label={project.status}
                            size="small"
                            color={getProjectStatusColor(project.status)}
                          />
                          <Typography variant="caption" className="text-muted-foreground">
                            Due: {project.deadline}
                          </Typography>
                        </div>
                        <div className="mb-3">
                          <div className="flex items-center justify-between text-sm mb-1">
                            <Typography variant="caption" className="text-muted-foreground">Progress</Typography>
                            <Typography variant="caption" className="text-muted-foreground">{project.progress}%</Typography>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div 
                              className="bg-primary h-2 rounded-full"
                              style={{ width: `${project.progress}%` }}
                            />
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {project.team.map((member, index) => (
                            <div 
                              key={index}
                              className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center"
                            >
                              <span className="text-xs font-semibold text-primary">
                                {member}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        </Grid>
      </div>

      {/* Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose} className="text-foreground">
          <Eye className="w-4 h-4 mr-2" />
          View
        </MenuItem>
        <MenuItem onClick={handleMenuClose} className="text-foreground">
          <Edit className="w-4 h-4 mr-2" />
          Edit
        </MenuItem>
        <MenuItem onClick={handleMenuClose} className="text-foreground">
          <Trash2 className="w-4 h-4 mr-2" />
          Delete
        </MenuItem>
      </Menu>
    </div>
  )
}

export default Dashboard
