import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Users as UsersIcon,
  Search,
  MoreVertical,
  Mail,
  Shield,
  Calendar,
  Clock,
  Building2,
  Eye,
  Key,
  Mail as MailIcon,
  AlertTriangle,
  CheckCircle,
  XCircle,
  UserCheck,
  History,
  Plus
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
  DialogContentText,
  Snackbar,
  Alert,
  Box,
  Typography,
  Badge,
  CircularProgress
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
import { usersApi } from '../services/api'
import { ROLES, ROLE_LABELS } from '../utils/roleHelper'
import { useAuth } from '../context/AuthContext'

const MotionTableRow = motion(TableRow)

const Users = () => {
  const { user: currentUser } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const [filterRole, setFilterRole] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [anchorEl, setAnchorEl] = useState(null)
  const [selectedUser, setSelectedUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [users, setUsers] = useState([])
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 0 })
  
  // Modal states
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [addUserModalOpen, setAddUserModalOpen] = useState(false)
  const [changeRoleModalOpen, setChangeRoleModalOpen] = useState(false)
  const [changeStatusModalOpen, setChangeStatusModalOpen] = useState(false)
  const [changeEmailModalOpen, setChangeEmailModalOpen] = useState(false)
  const [resetPasswordModalOpen, setResetPasswordModalOpen] = useState(false)
  const [auditHistoryModalOpen, setAuditHistoryModalOpen] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  
  // Form states
  const [newRole, setNewRole] = useState('')
  const [newStatus, setNewStatus] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [formError, setFormError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Add User form state
  const [addUserFormData, setAddUserFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: ROLES.EMPLOYEE,
    phone: ''
  })

  // Audit log states
  const [auditLogs, setAuditLogs] = useState([])
  const [auditLoading, setAuditLoading] = useState(false)
  const [auditError, setAuditError] = useState('')
  const [auditPagination, setAuditPagination] = useState({ page: 1, limit: 10, total: 0 })

  // Debounced search
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('')

  // Track if component is mounted to prevent state updates after unmount
  const isMountedRef = React.useRef(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery)
    }, 500)
    return () => clearTimeout(timer)
  }, [searchQuery])

  const fetchUsers = React.useCallback(async (params = {}) => {
    try {
      setLoading(true)
      const requestParams = {
        page: pagination.page,
        limit: pagination.limit,
        search: debouncedSearchQuery || undefined,
        role: filterRole === 'all' ? undefined : filterRole,
        accountStatus: filterStatus === 'all' ? undefined : filterStatus,
        ...params
      }
      const response = await usersApi.getList(requestParams)

      // Backend response structure: { success, message, data: { data: [...], pagination: {...} } }
      const usersData = response?.data?.data || []
      const paginationData = response?.data?.pagination || pagination
      
      // Only update state if component is still mounted
      if (isMountedRef.current) {
        setUsers(Array.isArray(usersData) ? usersData : [])
        setPagination(paginationData)
      }
    } catch (err) {
      // Ignore AbortError from intentional cancellation (component unmount or timeout)
      if (err.name === 'AbortError') {
        console.log('Request cancelled (component unmount or timeout)')
        return
      }
      // Only set error if component is still mounted
      if (isMountedRef.current) {
        console.error('Error fetching users:', err)
        setError('Failed to load users')
      }
    } finally {
      // Only update loading state if component is still mounted
      if (isMountedRef.current) {
        setLoading(false)
      }
    }
  }, [pagination.page, pagination.limit, debouncedSearchQuery, filterRole, filterStatus])

  useEffect(() => {
    isMountedRef.current = true
    fetchUsers()
    
    return () => {
      isMountedRef.current = false
    }
  }, [fetchUsers])

  const handleMenuClick = (event, user) => {
    setAnchorEl(event.currentTarget)
    setSelectedUser(user)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }))
  }

  const handleViewUser = () => {
    setViewModalOpen(true)
    setAnchorEl(null)
  }

  const handleChangeRole = () => {
    setNewRole(selectedUser.role)
    setChangeRoleModalOpen(true)
    setAnchorEl(null)
  }

  const handleChangeStatus = () => {
    setNewStatus(selectedUser.accountStatus)
    setChangeStatusModalOpen(true)
    setAnchorEl(null)
  }

  const handleChangeEmail = () => {
    setNewEmail(selectedUser.email)
    setChangeEmailModalOpen(true)
    setAnchorEl(null)
  }

  const handleResetPassword = () => {
    setNewPassword('')
    setConfirmPassword('')
    setResetPasswordModalOpen(true)
    setAnchorEl(null)
  }

  const handleAuditHistory = async () => {
    setAuditHistoryModalOpen(true)
    setAnchorEl(null)
    await fetchAuditLogs()
  }

  const fetchAuditLogs = async (page = 1) => {
    if (!selectedUser?._id) return
    
    try {
      setAuditLoading(true)
      setAuditError('')
      const response = await usersApi.getUserAuditLogs(selectedUser._id, { page, limit: 10 })
      const logs = response?.data || []
      const pagination = response?.pagination || { page: 1, limit: 10, total: 0 }
      
      if (isMountedRef.current) {
        setAuditLogs(logs)
        setAuditPagination(pagination)
      }
    } catch (err) {
      if (err.name === 'AbortError') {
        console.log('Audit log request cancelled')
        return
      }
      if (isMountedRef.current) {
        console.error('Error fetching audit logs:', err)
        setAuditError('Failed to load audit history')
      }
    } finally {
      if (isMountedRef.current) {
        setAuditLoading(false)
      }
    }
  }

  const handleConfirmRoleChange = async () => {
    if (selectedUser._id === currentUser?._id && newRole !== ROLES.ADMIN) {
      setFormError('You cannot remove your own admin role')
      return
    }

    setFormError('')
    setSubmitting(true)
    try {
      await usersApi.changeRole(selectedUser._id, newRole)
      setChangeRoleModalOpen(false)
      fetchUsers()
      setSuccessMessage('Role changed successfully')
      setShowSuccess(true)
    } catch (err) {
      console.error('Error changing role:', err)
      setFormError(err.response?.data?.message || 'Failed to change role')
    } finally {
      setSubmitting(false)
    }
  }

  const handleConfirmStatusChange = async () => {
    if (selectedUser._id === currentUser?._id && 
        (newStatus === 'inactive' || newStatus === 'suspended' || newStatus === 'terminated')) {
      setFormError('You cannot deactivate, suspend, or terminate your own account')
      return
    }

    setFormError('')
    setSubmitting(true)
    try {
      await usersApi.updateStatus(selectedUser._id, newStatus)
      setChangeStatusModalOpen(false)
      fetchUsers()
      setSuccessMessage('Account status updated successfully')
      setShowSuccess(true)
    } catch (err) {
      console.error('Error updating status:', err)
      setFormError(err.response?.data?.message || 'Failed to update status')
    } finally {
      setSubmitting(false)
    }
  }

  const handleConfirmEmailChange = async () => {
    if (!newEmail || !newEmail.includes('@')) {
      setFormError('Please enter a valid email')
      return
    }

    setFormError('')
    setSubmitting(true)
    try {
      await usersApi.changeEmail(selectedUser._id, newEmail)
      setChangeEmailModalOpen(false)
      fetchUsers()
      setSuccessMessage('Email changed successfully')
      setShowSuccess(true)
    } catch (err) {
      console.error('Error changing email:', err)
      setFormError(err.response?.data?.message || 'Failed to change email')
    } finally {
      setSubmitting(false)
    }
  }

  const handleConfirmPasswordReset = async () => {
    if (!newPassword || newPassword.length < 8) {
      setFormError('Password must be at least 8 characters long')
      return
    }

    if (newPassword !== confirmPassword) {
      setFormError('Passwords do not match')
      return
    }

    setFormError('')
    setSubmitting(true)
    try {
      await usersApi.changePassword(selectedUser._id, newPassword)
      setResetPasswordModalOpen(false)
      setNewPassword('')
      setConfirmPassword('')
      setSuccessMessage('Password reset successfully')
      setShowSuccess(true)
    } catch (err) {
      console.error('Error resetting password:', err)
      setFormError(err.response?.data?.message || 'Failed to reset password')
    } finally {
      setSubmitting(false)
    }
  }

  const handleCreateUser = async () => {
    const { firstName, lastName, email, password, confirmPassword, role, phone } = addUserFormData

    if (!firstName || !lastName || !email || !password) {
      setFormError('All required fields must be filled')
      return
    }

    if (password.length < 8) {
      setFormError('Password must be at least 8 characters long')
      return
    }

    if (password !== confirmPassword) {
      setFormError('Passwords do not match')
      return
    }

    if (!email.includes('@')) {
      setFormError('Please enter a valid email address')
      return
    }

    setFormError('')
    setSubmitting(true)
    try {
      await usersApi.create({
        firstName,
        lastName,
        email,
        password,
        role,
        phone
      })
      setAddUserModalOpen(false)
      setAddUserFormData({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: ROLES.EMPLOYEE,
        phone: ''
      })
      fetchUsers()
      setSuccessMessage('User created successfully')
      setShowSuccess(true)
    } catch (err) {
      console.error('Error creating user:', err)
      setFormError(err.response?.data?.message || 'Failed to create user')
    } finally {
      setSubmitting(false)
    }
  }

  const getStatusColor = (status) => {
    const colors = {
      'active': { bg: 'rgba(16, 185, 129, 0.1)', text: '#10b981', border: 'rgba(16, 185, 129, 0.2)' },
      'inactive': { bg: 'rgba(107, 114, 128, 0.1)', text: '#6b7280', border: 'rgba(107, 114, 128, 0.2)' },
      'suspended': { bg: 'rgba(234, 179, 8, 0.1)', text: '#eab308', border: 'rgba(234, 179, 8, 0.2)' },
      'terminated': { bg: 'rgba(239, 68, 68, 0.1)', text: '#ef4444', border: 'rgba(239, 68, 68, 0.2)' }
    }
    return colors[status] || colors.inactive
  }

  const formatAuditValue = (value) => {
    if (!value) return '—'
    if (typeof value === 'object') {
      // Filter out sensitive fields
      const safeValue = { ...value }
      delete safeValue.password
      delete safeValue.passwordHash
      delete safeValue.passwordResetToken
      delete safeValue.passwordResetExpires
      delete safeValue.changedPasswordAt
      return JSON.stringify(safeValue, null, 2)
    }
    return String(value)
  }

  const getRoleColor = (role) => {
    const colors = {
      [ROLES.ADMIN]: { bg: 'rgba(139, 92, 246, 0.1)', text: '#8b5cf6', border: 'rgba(139, 92, 246, 0.2)' },
      [ROLES.MANAGER]: { bg: 'rgba(59, 130, 246, 0.1)', text: '#3b82f6', border: 'rgba(59, 130, 246, 0.2)' },
      [ROLES.EMPLOYEE]: { bg: 'rgba(16, 185, 129, 0.1)', text: '#10b981', border: 'rgba(16, 185, 129, 0.2)' }
    }
    return colors[role] || colors[ROLES.EMPLOYEE]
  }

  const formatDate = (date) => {
    if (!date) return 'N/A'
    return new Date(date).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  const formatDateTime = (date) => {
    if (!date) return 'N/A'
    return new Date(date).toLocaleString('en-US', { 
      year: 'numeric',
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getInitials = (firstName, lastName) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase()
  }

  const getFullName = (user) => {
    return `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email
  }

  if (loading && users.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LinearProgress sx={{ width: '200px' }} />
      </div>
    )
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">User Management</h1>
          <p className="text-muted-foreground">Manage user accounts, roles, and permissions</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setAddUserModalOpen(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg shadow-blue-500/25"
        >
          <Plus className="w-4 h-4" />
          <span>Add User</span>
        </motion.button>
      </div>

      {/* Filters and Search */}
      <div className="flex items-center gap-4 flex-wrap">
        <TextField
          placeholder="Search by name, email, or employee ID..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={textFieldSx}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search className="w-4 h-4 text-muted-foreground" />
              </InputAdornment>
            ),
          }}
        />
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel sx={inputLabelSx}>Role</InputLabel>
          <Select
            value={filterRole}
            label="Role"
            onChange={(e) => setFilterRole(e.target.value)}
            sx={selectSx}
          >
            <MenuItem value="all">All Roles</MenuItem>
            <MenuItem value={ROLES.ADMIN}>{ROLE_LABELS[ROLES.ADMIN]}</MenuItem>
            <MenuItem value={ROLES.MANAGER}>{ROLE_LABELS[ROLES.MANAGER]}</MenuItem>
            <MenuItem value={ROLES.EMPLOYEE}>{ROLE_LABELS[ROLES.EMPLOYEE]}</MenuItem>
          </Select>
        </FormControl>
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel sx={inputLabelSx}>Status</InputLabel>
          <Select
            value={filterStatus}
            label="Status"
            onChange={(e) => setFilterStatus(e.target.value)}
            sx={selectSx}
          >
            <MenuItem value="all">All Status</MenuItem>
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="inactive">Inactive</MenuItem>
            <MenuItem value="suspended">Suspended</MenuItem>
            <MenuItem value="terminated">Terminated</MenuItem>
          </Select>
        </FormControl>
      </div>

      {/* Error State */}
      {error && (
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Empty State */}
      {!loading && users.length === 0 && (
        <div className="text-center py-12">
          <UsersIcon className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No users found</p>
        </div>
      )}

      {/* Users Table */}
      {!loading && users.length > 0 && (
        <TableContainer component={Paper} sx={{ boxShadow: 'none', border: '1px solid hsl(var(--border))' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={tableHeaderCellSx}>User</TableCell>
                <TableCell sx={tableHeaderCellSx}>Email</TableCell>
                <TableCell sx={tableHeaderCellSx}>Role</TableCell>
                <TableCell sx={tableHeaderCellSx}>Account Status</TableCell>
                <TableCell sx={tableHeaderCellSx}>Employee ID</TableCell>
                <TableCell sx={tableHeaderCellSx}>Last Login</TableCell>
                <TableCell sx={tableHeaderCellSx}>Created At</TableCell>
                <TableCell sx={tableHeaderCellSx}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user, index) => {
                const statusColor = getStatusColor(user.accountStatus)
                const roleColor = getRoleColor(user.role)
                const fullName = getFullName(user)
                const initials = getInitials(user.firstName, user.lastName)

                return (
                  <MotionTableRow
                    key={user._id}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    custom={index}
                    sx={tableRowSx}
                  >
                    <TableCell sx={tableBodyCellSx}>
                      <div className="flex items-center gap-3">
                        <Avatar sx={{ width: 40, height: 40, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                          <span className="text-white font-medium">{initials}</span>
                        </Avatar>
                        <div>
                          <p className="font-medium text-foreground">{fullName}</p>
                          <p className="text-sm text-muted-foreground">{user.phone || 'No phone'}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell sx={tableBodyCellSx}>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <span>{user.email}</span>
                      </div>
                    </TableCell>
                    <TableCell sx={tableBodyCellSx}>
                      <Chip
                        label={ROLE_LABELS[user.role] || user.role}
                        size="small"
                        sx={{
                          backgroundColor: roleColor.bg,
                          color: roleColor.text,
                          border: `1px solid ${roleColor.border}`,
                          fontSize: '0.75rem',
                          height: '24px'
                        }}
                      />
                    </TableCell>
                    <TableCell sx={tableBodyCellSx}>
                      <Chip
                        label={user.accountStatus || 'N/A'}
                        size="small"
                        sx={{
                          backgroundColor: statusColor.bg,
                          color: statusColor.text,
                          border: `1px solid ${statusColor.border}`,
                          fontSize: '0.75rem',
                          height: '24px'
                        }}
                      />
                    </TableCell>
                    <TableCell sx={tableBodyCellSx}>
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-muted-foreground" />
                        <span>{user.employeeId?.employeeId || user.employeeId || '—'}</span>
                      </div>
                    </TableCell>
                    <TableCell sx={tableBodyCellSx}>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span>{formatDateTime(user.lastLogin)}</span>
                      </div>
                    </TableCell>
                    <TableCell sx={tableBodyCellSx}>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span>{formatDate(user.createdAt)}</span>
                      </div>
                    </TableCell>
                    <TableCell sx={tableBodyCellSx}>
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuClick(e, user)}
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

          {/* Pagination */}
          {pagination.total > 0 && (
            <div className="flex items-center justify-between mt-6 px-4 pb-4">
              <p className="text-sm text-muted-foreground">
                Showing {(pagination.page - 1) * pagination.limit + 1}–{Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} users
              </p>
              <div className="flex items-center gap-2">
                <Button
                  disabled={pagination.page <= 1}
                  onClick={() => handlePageChange(pagination.page - 1)}
                  size="small"
                >
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {pagination.page} of {pagination.pages || Math.ceil(pagination.total / pagination.limit)}
                </span>
                <Button
                  disabled={pagination.page >= (pagination.pages || Math.ceil(pagination.total / pagination.limit))}
                  onClick={() => handlePageChange(pagination.page + 1)}
                  size="small"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </TableContainer>
      )}

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{ sx: menuPaperSx }}
      >
        <MenuItem onClick={handleViewUser} sx={menuItemSx}>
          <Eye className="w-4 h-4 mr-2" />
          View User
        </MenuItem>
        <MenuItem onClick={handleChangeRole} sx={menuItemSx}>
          <Shield className="w-4 h-4 mr-2" />
          Change Role
        </MenuItem>
        <MenuItem onClick={handleChangeEmail} sx={menuItemSx}>
          <MailIcon className="w-4 h-4 mr-2" />
          Change Email
        </MenuItem>
        <MenuItem onClick={handleResetPassword} sx={menuItemSx}>
          <Key className="w-4 h-4 mr-2" />
          Reset Password
        </MenuItem>
        <MenuItem onClick={handleChangeStatus} sx={menuItemSx}>
          <UserCheck className="w-4 h-4 mr-2" />
          Change Status
        </MenuItem>
        <MenuItem onClick={handleAuditHistory} sx={menuItemSx}>
          <History className="w-4 h-4 mr-2" />
          View Audit History
        </MenuItem>
      </Menu>

      {/* View User Modal */}
      <Dialog open={viewModalOpen} onClose={() => setViewModalOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle className="text-foreground">User Details</DialogTitle>
        <DialogContent>
          {selectedUser && (
            <div className="space-y-4 mt-4">
              <div className="flex items-center gap-4 pb-4 border-b">
                <Avatar sx={{ width: 64, height: 64, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                  <span className="text-white font-bold text-xl">{getInitials(selectedUser.firstName, selectedUser.lastName)}</span>
                </Avatar>
                <div>
                  <h3 className="text-xl font-semibold text-foreground">{getFullName(selectedUser)}</h3>
                  <p className="text-muted-foreground">{selectedUser.email}</p>
                </div>
              </div>

              <div>
                <Typography variant="subtitle2" className="font-semibold mb-2">Identity</Typography>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Email:</span>
                    <span>{selectedUser.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Phone:</span>
                    <span>{selectedUser.phone || 'N/A'}</span>
                  </div>
                </div>
              </div>

              <div>
                <Typography variant="subtitle2" className="font-semibold mb-2">Account</Typography>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Role:</span>
                    <span>{ROLE_LABELS[selectedUser.role] || selectedUser.role}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Account Status:</span>
                    <span>{selectedUser.accountStatus || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Email Verified:</span>
                    <span>{selectedUser.isEmailVerified ? 'Yes' : 'No'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Last Login:</span>
                    <span>{formatDateTime(selectedUser.lastLogin)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Created At:</span>
                    <span>{formatDateTime(selectedUser.createdAt)}</span>
                  </div>
                </div>
              </div>

              <div>
                <Typography variant="subtitle2" className="font-semibold mb-2">Employee Relationship</Typography>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Employee ID:</span>
                    <span>{selectedUser.employeeId?.employeeId || selectedUser.employeeId || '—'}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewModalOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Change Role Modal */}
      <Dialog open={changeRoleModalOpen} onClose={() => setChangeRoleModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle className="text-foreground">Change User Role</DialogTitle>
        <DialogContent>
          {selectedUser && (
            <div className="space-y-4 mt-4">
              <DialogContentText>
                Change role for <strong>{getFullName(selectedUser)}</strong>
              </DialogContentText>
              <FormControl fullWidth>
                <InputLabel sx={inputLabelSx}>New Role</InputLabel>
                <Select
                  value={newRole}
                  label="New Role"
                  onChange={(e) => setNewRole(e.target.value)}
                  sx={selectSx}
                >
                  <MenuItem value={ROLES.ADMIN}>{ROLE_LABELS[ROLES.ADMIN]}</MenuItem>
                  <MenuItem value={ROLES.MANAGER}>{ROLE_LABELS[ROLES.MANAGER]}</MenuItem>
                  <MenuItem value={ROLES.EMPLOYEE}>{ROLE_LABELS[ROLES.EMPLOYEE]}</MenuItem>
                </Select>
              </FormControl>
              {formError && (
                <Alert severity="error">{formError}</Alert>
              )}
              <DialogContentText className="text-sm text-muted-foreground">
                <AlertTriangle className="w-4 h-4 inline mr-1" />
                Changing role will affect the user's permissions immediately.
              </DialogContentText>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setChangeRoleModalOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleConfirmRoleChange} 
            variant="contained"
            disabled={submitting}
          >
            {submitting ? 'Changing...' : 'Change Role'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Change Status Modal */}
      <Dialog open={changeStatusModalOpen} onClose={() => setChangeStatusModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle className="text-foreground">Change Account Status</DialogTitle>
        <DialogContent>
          {selectedUser && (
            <div className="space-y-4 mt-4">
              <DialogContentText>
                Change account status for <strong>{getFullName(selectedUser)}</strong>
              </DialogContentText>
              <FormControl fullWidth>
                <InputLabel sx={inputLabelSx}>New Status</InputLabel>
                <Select
                  value={newStatus}
                  label="New Status"
                  onChange={(e) => setNewStatus(e.target.value)}
                  sx={selectSx}
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                  <MenuItem value="suspended">Suspended</MenuItem>
                  <MenuItem value="terminated">Terminated</MenuItem>
                </Select>
              </FormControl>
              {formError && (
                <Alert severity="error">{formError}</Alert>
              )}
              {newStatus === 'terminated' && (
                <DialogContentText className="text-sm text-red-500">
                  <AlertTriangle className="w-4 h-4 inline mr-1" />
                  Terminating an account will prevent the user from accessing the system. This action is significant.
                </DialogContentText>
              )}
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setChangeStatusModalOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleConfirmStatusChange} 
            variant="contained"
            disabled={submitting}
            color={newStatus === 'terminated' ? 'error' : 'primary'}
          >
            {submitting ? 'Updating...' : 'Update Status'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Change Email Modal */}
      <Dialog open={changeEmailModalOpen} onClose={() => setChangeEmailModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle className="text-foreground">Change Email</DialogTitle>
        <DialogContent>
          {selectedUser && (
            <div className="space-y-4 mt-4">
              <DialogContentText>
                Change email for <strong>{getFullName(selectedUser)}</strong>
              </DialogContentText>
              <TextField
                fullWidth
                label="Current Email"
                value={selectedUser.email}
                disabled
                sx={textFieldSx}
              />
              <TextField
                fullWidth
                label="New Email"
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                sx={textFieldSx}
              />
              {formError && (
                <Alert severity="error">{formError}</Alert>
              )}
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setChangeEmailModalOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleConfirmEmailChange} 
            variant="contained"
            disabled={submitting}
          >
            {submitting ? 'Changing...' : 'Change Email'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Reset Password Modal */}
      <Dialog open={resetPasswordModalOpen} onClose={() => setResetPasswordModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle className="text-foreground">Reset Password</DialogTitle>
        <DialogContent>
          {selectedUser && (
            <div className="space-y-4 mt-4">
              <DialogContentText>
                Reset password for <strong>{getFullName(selectedUser)}</strong>
              </DialogContentText>
              <TextField
                fullWidth
                label="New Password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                sx={textFieldSx}
              />
              <TextField
                fullWidth
                label="Confirm Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                sx={textFieldSx}
              />
              {formError && (
                <Alert severity="error">{formError}</Alert>
              )}
              <DialogContentText className="text-sm text-muted-foreground">
                <AlertTriangle className="w-4 h-4 inline mr-1" />
                Password must be at least 8 characters long.
              </DialogContentText>
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setResetPasswordModalOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleConfirmPasswordReset} 
            variant="contained"
            disabled={submitting}
          >
            {submitting ? 'Resetting...' : 'Reset Password'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add User Modal */}
      <Dialog open={addUserModalOpen} onClose={() => setAddUserModalOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle className="text-foreground">Add New User</DialogTitle>
        <DialogContent>
          <div className="space-y-4 mt-4">
            <DialogContentText>
              Create a new user account with appropriate role and permissions.
            </DialogContentText>
            <TextField
              fullWidth
              label="First Name"
              value={addUserFormData.firstName}
              onChange={(e) => setAddUserFormData({ ...addUserFormData, firstName: e.target.value })}
              sx={textFieldSx}
            />
            <TextField
              fullWidth
              label="Last Name"
              value={addUserFormData.lastName}
              onChange={(e) => setAddUserFormData({ ...addUserFormData, lastName: e.target.value })}
              sx={textFieldSx}
            />
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={addUserFormData.email}
              onChange={(e) => setAddUserFormData({ ...addUserFormData, email: e.target.value })}
              sx={textFieldSx}
            />
            <TextField
              fullWidth
              label="Phone (Optional)"
              value={addUserFormData.phone}
              onChange={(e) => setAddUserFormData({ ...addUserFormData, phone: e.target.value })}
              sx={textFieldSx}
            />
            <FormControl fullWidth>
              <InputLabel sx={inputLabelSx}>Role</InputLabel>
              <Select
                value={addUserFormData.role}
                label="Role"
                onChange={(e) => setAddUserFormData({ ...addUserFormData, role: e.target.value })}
                sx={selectSx}
              >
                <MenuItem value={ROLES.ADMIN}>{ROLE_LABELS[ROLES.ADMIN]}</MenuItem>
                <MenuItem value={ROLES.MANAGER}>{ROLE_LABELS[ROLES.MANAGER]}</MenuItem>
                <MenuItem value={ROLES.EMPLOYEE}>{ROLE_LABELS[ROLES.EMPLOYEE]}</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Password"
              type="password"
              value={addUserFormData.password}
              onChange={(e) => setAddUserFormData({ ...addUserFormData, password: e.target.value })}
              sx={textFieldSx}
            />
            <TextField
              fullWidth
              label="Confirm Password"
              type="password"
              value={addUserFormData.confirmPassword}
              onChange={(e) => setAddUserFormData({ ...addUserFormData, confirmPassword: e.target.value })}
              sx={textFieldSx}
            />
            {formError && (
              <Alert severity="error">{formError}</Alert>
            )}
            <DialogContentText className="text-sm text-muted-foreground">
              <AlertTriangle className="w-4 h-4 inline mr-1" />
              Password must be at least 8 characters long. The user will be created with an active account status.
            </DialogContentText>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddUserModalOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleCreateUser} 
            variant="contained"
            disabled={submitting}
          >
            {submitting ? 'Creating...' : 'Create User'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Audit History Modal */}
      <Dialog open={auditHistoryModalOpen} onClose={() => setAuditHistoryModalOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle className="text-foreground">
          Audit History - {selectedUser ? getFullName(selectedUser) : 'User'}
        </DialogTitle>
        <DialogContent>
          <div className="space-y-4 mt-4">
            {auditLoading ? (
              <div className="flex justify-center py-8">
                <CircularProgress size={40} />
              </div>
            ) : auditError ? (
              <Alert severity="error">{auditError}</Alert>
            ) : auditLogs.length === 0 ? (
              <Alert severity="info">No audit history found for this user.</Alert>
            ) : (
              <>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {auditLogs.map((log) => (
                    <div key={log._id} className="border rounded-lg p-4 bg-muted/50">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant="outlined" 
                            sx={{ 
                              fontSize: '0.75rem',
                              textTransform: 'capitalize'
                            }}
                          >
                            {log.action?.replace(/_/g, ' ').toLowerCase()}
                          </Badge>
                          <Typography variant="caption" className="text-muted-foreground">
                            {formatDateTime(log.createdAt)}
                          </Typography>
                        </div>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Performed By:</span>
                          <span className="font-medium">
                            {log.performedBy ? `${log.performedBy.firstName} ${log.performedBy.lastName}` : 'System'}
                          </span>
                        </div>
                        
                        {log.description && (
                          <div className="text-muted-foreground text-xs">
                            {log.description}
                          </div>
                        )}
                        
                        {(log.oldValue || log.newValue) && (
                          <div className="grid grid-cols-2 gap-2 text-xs mt-2">
                            {log.oldValue && (
                              <div>
                                <span className="text-muted-foreground">Old:</span>
                                <div className="font-mono bg-background p-1 rounded mt-1">
                                  {formatAuditValue(log.oldValue)}
                                </div>
                              </div>
                            )}
                            {log.newValue && (
                              <div>
                                <span className="text-muted-foreground">New:</span>
                                <div className="font-mono bg-background p-1 rounded mt-1">
                                  {formatAuditValue(log.newValue)}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                        
                        {log.ipAddress && (
                          <div className="text-xs text-muted-foreground">
                            IP: {log.ipAddress}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                {auditPagination.total > auditPagination.limit && (
                  <div className="flex justify-between items-center pt-4 border-t">
                    <Typography variant="caption" className="text-muted-foreground">
                      Showing {((auditPagination.page - 1) * auditPagination.limit) + 1}–{Math.min(auditPagination.page * auditPagination.limit, auditPagination.total)} of {auditPagination.total}
                    </Typography>
                    <div className="flex gap-2">
                      <Button
                        size="small"
                        disabled={auditPagination.page === 1}
                        onClick={() => fetchAuditLogs(auditPagination.page - 1)}
                      >
                        Previous
                      </Button>
                      <Button
                        size="small"
                        disabled={auditPagination.page * auditPagination.limit >= auditPagination.total}
                        onClick={() => fetchAuditLogs(auditPagination.page + 1)}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAuditHistoryModalOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Success Snackbar */}
      <Snackbar
        open={showSuccess}
        autoHideDuration={5000}
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity="success" onClose={() => setShowSuccess(false)}>
          {successMessage}
        </Alert>
      </Snackbar>
    </motion.div>
  )
}

export default Users
