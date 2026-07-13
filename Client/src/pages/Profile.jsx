import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  User, 
  Mail, 
  Phone, 
  MapPin,
  Calendar,
  Briefcase,
  Camera,
  Edit,
  Save,
  X,
  Shield,
  Bell,
  Globe,
  CreditCard,
  Download,
  Trash2
} from 'lucide-react'
import { useForm } from 'react-hook-form'
import { 
  Typography, 
  Card, 
  CardContent, 
  Grid, 
  TextField, 
  Button,
  Box,
  Avatar,
  IconButton,
  Chip,
  Divider,
  Switch,
  FormControlLabel,
  Tabs,
  Tab
} from '@mui/material'

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState(0)
  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm()

  const userData = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    bio: 'Full-stack developer with a passion for creating beautiful and functional web applications.',
    website: 'https://johndoe.dev',
    company: 'Tech Corp',
    position: 'Senior Developer',
    joinDate: 'January 2022'
  }

  const notifications = [
    { id: 1, name: 'Email Notifications', description: 'Receive email updates about your account', enabled: true },
    { id: 2, name: 'Push Notifications', description: 'Receive push notifications in your browser', enabled: false },
    { id: 3, name: 'SMS Notifications', description: 'Receive text messages for important updates', enabled: false },
    { id: 4, name: 'Marketing Emails', description: 'Receive emails about new features and offers', enabled: true }
  ]

  const security = [
    { id: 1, name: 'Two-Factor Authentication', description: 'Add an extra layer of security to your account', enabled: true },
    { id: 2, name: 'Login Alerts', description: 'Get notified when someone logs into your account', enabled: true },
    { id: 3, name: 'Session Management', description: 'View and manage your active sessions', enabled: false }
  ]

  const activities = [
    { id: 1, action: 'Updated profile', date: '2 hours ago', icon: Edit },
    { id: 2, action: 'Changed password', date: '2 days ago', icon: Shield },
    { id: 3, action: 'Logged in from new device', date: '1 week ago', icon: Globe },
    { id: 4, action: 'Updated email preferences', date: '2 weeks ago', icon: Bell }
  ]

  const skills = ['React', 'JavaScript', 'TypeScript', 'Node.js', 'Python', 'AWS', 'Docker', 'MongoDB']

  const onSubmit = (data) => {
    console.log('Profile updated:', data)
    setIsEditing(false)
  }

  const handleCancel = () => {
    reset(userData)
    setIsEditing(false)
  }

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-accent text-white">
        <div className="container">
          <div className="py-12">
            <div className="flex items-center gap-6">
              <div className="relative">
                <Avatar className="w-24 h-24 border-4 border-white">
                  <span className="text-3xl font-bold">
                    {userData.firstName[0]}{userData.lastName[0]}
                  </span>
                </Avatar>
                <IconButton 
                  className="absolute bottom-0 right-0 bg-white text-primary"
                  size="small"
                >
                  <Camera className="w-4 h-4" />
                </IconButton>
              </div>
              <div className="flex-1">
                <Typography variant="h3" className="font-bold mb-2">
                  {userData.firstName} {userData.lastName}
                </Typography>
                <Typography variant="body1" className="opacity-90 mb-2">
                  {userData.position} at {userData.company}
                </Typography>
                <div className="flex items-center gap-4">
                  <Chip 
                    icon={<MapPin className="w-4 h-4" />}
                    label={userData.location}
                    size="small"
                    className="bg-white/20 text-white"
                  />
                  <Chip 
                    icon={<Calendar className="w-4 h-4" />}
                    label={`Joined ${userData.joinDate}`}
                    size="small"
                    className="bg-white/20 text-white"
                  />
                </div>
              </div>
              <Button
                variant="contained"
                startIcon={isEditing ? <Save /> : <Edit />}
                onClick={isEditing ? handleSubmit(onSubmit) : () => setIsEditing(true)}
                className="bg-white text-primary hover:bg-gray-100"
              >
                {isEditing ? 'Save Changes' : 'Edit Profile'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-8">
        <Grid container spacing={6}>
          {/* Main Content */}
          <Grid item xs={12} lg={8}>
            <Card className="shadow-lg mb-6">
              <CardContent className="p-6">
                <Tabs value={activeTab} onChange={handleTabChange} className="mb-6">
                  <Tab label="Profile Information" />
                  <Tab label="Settings" />
                  <Tab label="Activity" />
                </Tabs>

                {activeTab === 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <form className="space-y-6">
                      <Grid container spacing={4}>
                        <Grid item xs={12} md={6}>
                          <TextField
                            fullWidth
                            label="First Name"
                            defaultValue={userData.firstName}
                            {...register('firstName', { required: 'First name is required' })}
                            disabled={!isEditing}
                            error={!!errors.firstName}
                            helperText={errors.firstName?.message}
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <TextField
                            fullWidth
                            label="Last Name"
                            defaultValue={userData.lastName}
                            {...register('lastName', { required: 'Last name is required' })}
                            disabled={!isEditing}
                            error={!!errors.lastName}
                            helperText={errors.lastName?.message}
                          />
                        </Grid>
                      </Grid>

                      <TextField
                        fullWidth
                        label="Email"
                        type="email"
                        defaultValue={userData.email}
                        {...register('email', { required: 'Email is required' })}
                        disabled={!isEditing}
                        error={!!errors.email}
                        helperText={errors.email?.message}
                        InputProps={{
                          startAdornment: <Mail className="w-4 h-4 text-gray-400 mr-2" />
                        }}
                      />

                      <TextField
                        fullWidth
                        label="Phone"
                        defaultValue={userData.phone}
                        {...register('phone')}
                        disabled={!isEditing}
                        InputProps={{
                          startAdornment: <Phone className="w-4 h-4 text-gray-400 mr-2" />
                        }}
                      />

                      <TextField
                        fullWidth
                        label="Location"
                        defaultValue={userData.location}
                        {...register('location')}
                        disabled={!isEditing}
                        InputProps={{
                          startAdornment: <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                        }}
                      />

                      <TextField
                        fullWidth
                        label="Bio"
                        multiline
                        rows={4}
                        defaultValue={userData.bio}
                        {...register('bio')}
                        disabled={!isEditing}
                      />

                      <Grid container spacing={4}>
                        <Grid item xs={12} md={6}>
                          <TextField
                            fullWidth
                            label="Company"
                            defaultValue={userData.company}
                            {...register('company')}
                            disabled={!isEditing}
                            InputProps={{
                              startAdornment: <Briefcase className="w-4 h-4 text-gray-400 mr-2" />
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <TextField
                            fullWidth
                            label="Position"
                            defaultValue={userData.position}
                            {...register('position')}
                            disabled={!isEditing}
                          />
                        </Grid>
                      </Grid>

                      <TextField
                        fullWidth
                        label="Website"
                        defaultValue={userData.website}
                        {...register('website')}
                        disabled={!isEditing}
                        InputProps={{
                          startAdornment: <Globe className="w-4 h-4 text-gray-400 mr-2" />
                        }}
                      />

                      {isEditing && (
                        <div className="flex gap-4">
                          <Button type="submit" variant="contained">
                            Save Changes
                          </Button>
                          <Button variant="outlined" onClick={handleCancel}>
                            Cancel
                          </Button>
                        </div>
                      )}
                    </form>
                  </motion.div>
                )}

                {activeTab === 1 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="space-y-6">
                      <div>
                        <Typography variant="h6" className="font-semibold mb-4">
                          Notifications
                        </Typography>
                        <div className="space-y-3">
                          {notifications.map((notification) => (
                            <div key={notification.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div>
                                <Typography variant="subtitle2" className="font-medium">
                                  {notification.name}
                                </Typography>
                                <Typography variant="body2" className="text-gray-500">
                                  {notification.description}
                                </Typography>
                              </div>
                              <Switch defaultChecked={notification.enabled} />
                            </div>
                          ))}
                        </div>
                      </div>

                      <Divider />

                      <div>
                        <Typography variant="h6" className="font-semibold mb-4">
                          Security
                        </Typography>
                        <div className="space-y-3">
                          {security.map((item) => (
                            <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div>
                                <Typography variant="subtitle2" className="font-medium">
                                  {item.name}
                                </Typography>
                                <Typography variant="body2" className="text-gray-500">
                                  {item.description}
                                </Typography>
                              </div>
                              <Switch defaultChecked={item.enabled} />
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <Button variant="contained" startIcon={<Shield />}>
                          Change Password
                        </Button>
                        <Button variant="outlined" startIcon={<Download />}>
                          Export Data
                        </Button>
                        <Button variant="outlined" color="error" startIcon={<Trash2 />}>
                          Delete Account
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 2 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Typography variant="h6" className="font-semibold mb-4">
                      Recent Activity
                    </Typography>
                    <div className="space-y-4">
                      {activities.map((activity) => {
                        const Icon = activity.icon
                        return (
                          <div key={activity.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                              <Icon className="w-5 h-5 text-primary" />
                            </div>
                            <div className="flex-1">
                              <Typography variant="body2" className="font-medium">
                                {activity.action}
                              </Typography>
                              <Typography variant="caption" className="text-gray-500">
                                {activity.date}
                              </Typography>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </motion.div>
                )}
              </CardContent>
            </Card>

            {/* Skills Card */}
            <Card className="shadow-lg">
              <CardContent className="p-6">
                <Typography variant="h6" className="font-semibold mb-4">
                  Skills & Expertise
                </Typography>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, index) => (
                    <Chip
                      key={index}
                      label={skill}
                      variant="outlined"
                      className="border-primary text-primary"
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </Grid>

          {/* Sidebar */}
          <Grid item xs={12} lg={4}>
            <Card className="shadow-lg mb-6">
              <CardContent className="p-6">
                <Typography variant="h6" className="font-semibold mb-4">
                  Quick Stats
                </Typography>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Typography variant="body2" className="text-gray-600">
                      Projects Completed
                    </Typography>
                    <Typography variant="h6" className="font-semibold">
                      42
                    </Typography>
                  </div>
                  <div className="flex items-center justify-between">
                    <Typography variant="body2" className="text-gray-600">
                      Total Revenue
                    </Typography>
                    <Typography variant="h6" className="font-semibold">
                      $125,430
                    </Typography>
                  </div>
                  <div className="flex items-center justify-between">
                    <Typography variant="body2" className="text-gray-600">
                      Client Rating
                    </Typography>
                    <Typography variant="h6" className="font-semibold">
                      4.9/5
                    </Typography>
                  </div>
                  <div className="flex items-center justify-between">
                    <Typography variant="body2" className="text-gray-600">
                      Response Time
                    </Typography>
                    <Typography variant="h6" className="font-semibold">
                      2h avg
                    </Typography>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardContent className="p-6">
                <Typography variant="h6" className="font-semibold mb-4">
                  Account Status
                </Typography>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full" />
                    <Typography variant="body2">Account Active</Typography>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full" />
                    <Typography variant="body2">Email Verified</Typography>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full" />
                    <Typography variant="body2">2FA Enabled</Typography>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                    <Typography variant="body2">Premium Plan</Typography>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </div>
    </div>
  )
}

export default Profile
