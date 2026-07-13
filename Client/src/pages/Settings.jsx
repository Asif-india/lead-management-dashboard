import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Palette, 
  Globe, 
  Bell, 
  Shield,
  Save,
  RefreshCw,
  Download,
  Upload,
  Trash2,
  AlertTriangle
} from 'lucide-react'
import { useForm } from 'react-hook-form'
import { 
  Typography, 
  Card, 
  CardContent, 
  Grid, 
  TextField, 
  Button,
  Switch,
  FormControlLabel,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material'
import { containerVariants, itemVariants } from '../constants/formAnimations'
import {
  textFieldSx,
  selectSx,
  inputLabelSx,
  menuItemSx,
  primaryButtonSx,
  secondaryButtonSx
} from '../constants/formStyles'
import {
  generalSettings,
  appearanceSettings,
  notificationSettings,
  privacySettings,
  languageOptions,
  timezoneOptions,
  dateFormatOptions,
  themeOptions,
  fontSizeOptions,
  profileVisibilityOptions
} from '../constants/settingsData'

const Settings = () => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const { register, handleSubmit } = useForm()

  const handleSaveSettings = (data) => {
    console.log('Settings saved:', data)
  }

  const handleExportData = () => {
    console.log('Exporting data...')
  }

  const handleImportData = () => {
    console.log('Importing data...')
  }

  const handleResetSettings = () => {
    console.log('Resetting settings...')
  }

  const handleDeleteAccount = () => {
    console.log('Deleting account...')
    setDeleteDialogOpen(false)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border px-6 py-4">
        <div>
          <Typography variant="h4" className="font-semibold">
            Settings
          </Typography>
          <Typography variant="body2" className="text-muted-foreground">
            Manage your account settings and preferences
          </Typography>
        </div>
      </div>

      <div className="p-6">
        <Grid container spacing={6} variants={containerVariants} initial="hidden" animate="visible">
          {/* General Settings */}
          <Grid item xs={12} lg={8}>
            <motion.div variants={itemVariants}>
              <Card className="shadow-lg mb-6 bg-card">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <Globe className="w-5 h-5 text-primary" />
                    <Typography variant="h6" className="font-semibold">
                      General Settings
                    </Typography>
                  </div>
                  
                  <form onSubmit={handleSubmit(handleSaveSettings)} className="space-y-6">
                    <Grid container spacing={4}>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Site Name"
                          defaultValue={generalSettings.siteName}
                          {...register('siteName')}
                          sx={textFieldSx}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <FormControl fullWidth>
                          <InputLabel sx={inputLabelSx}>Default Language</InputLabel>
                          <Select
                            defaultValue={generalSettings.defaultLanguage}
                            {...register('defaultLanguage')}
                            label="Default Language"
                            sx={selectSx}
                          >
                            {languageOptions.map(option => (
                              <MenuItem key={option.value} value={option.value} sx={menuItemSx}>
                                {option.label}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                    </Grid>

                    <TextField
                      fullWidth
                      label="Site Description"
                      multiline
                      rows={3}
                      defaultValue={generalSettings.siteDescription}
                      {...register('siteDescription')}
                      sx={textFieldSx}
                    />

                    <Grid container spacing={4}>
                      <Grid item xs={12} md={6}>
                        <FormControl fullWidth>
                          <InputLabel sx={inputLabelSx}>Timezone</InputLabel>
                          <Select
                            defaultValue={generalSettings.timezone}
                            {...register('timezone')}
                            label="Timezone"
                            sx={selectSx}
                          >
                            {timezoneOptions.map(option => (
                              <MenuItem key={option.value} value={option.value} sx={menuItemSx}>
                                {option.label}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <FormControl fullWidth>
                          <InputLabel sx={inputLabelSx}>Date Format</InputLabel>
                          <Select
                            defaultValue={generalSettings.dateFormat}
                            {...register('dateFormat')}
                            label="Date Format"
                            sx={selectSx}
                          >
                            {dateFormatOptions.map(option => (
                              <MenuItem key={option.value} value={option.value} sx={menuItemSx}>
                                {option.label}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                    </Grid>
                  </form>
                </CardContent>
              </Card>

              {/* Appearance Settings */}
              <Card className="shadow-lg mb-6 bg-card">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <Palette className="w-5 h-5 text-primary" />
                    <Typography variant="h6" className="font-semibold">
                      Appearance
                    </Typography>
                  </div>

                  <div className="space-y-6">
                    <Grid container spacing={4}>
                      <Grid item xs={12} md={6}>
                        <FormControl fullWidth>
                          <InputLabel sx={inputLabelSx}>Theme</InputLabel>
                          <Select
                            defaultValue={appearanceSettings.theme}
                            label="Theme"
                            sx={selectSx}
                          >
                            {themeOptions.map(option => (
                              <MenuItem key={option.value} value={option.value} sx={menuItemSx}>
                                {option.label}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <TextField
                          fullWidth
                          label="Primary Color"
                          type="color"
                          defaultValue={appearanceSettings.primaryColor}
                          sx={textFieldSx}
                        />
                      </Grid>
                    </Grid>

                    <FormControl fullWidth>
                      <InputLabel sx={inputLabelSx}>Font Size</InputLabel>
                      <Select
                        defaultValue={appearanceSettings.fontSize}
                        label="Font Size"
                        sx={selectSx}
                      >
                        {fontSizeOptions.map(option => (
                          <MenuItem key={option.value} value={option.value} sx={menuItemSx}>
                            {option.label}
                              </MenuItem>
                            ))}
                      </Select>
                    </FormControl>

                    <div className="space-y-3">
                      <FormControlLabel
                        control={<Switch defaultChecked={appearanceSettings.sidebarCollapsed} />}
                        label="Collapse sidebar by default"
                      />
                      <FormControlLabel
                        control={<Switch defaultChecked={appearanceSettings.showAnimations} />}
                        label="Show animations"
                      />
                      <FormControlLabel
                        control={<Switch defaultChecked={appearanceSettings.compactMode} />}
                        label="Compact mode"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Notification Settings */}
              <Card className="shadow-lg mb-6 bg-card">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <Bell className="w-5 h-5 text-primary" />
                    <Typography variant="h6" className="font-semibold">
                      Notifications
                    </Typography>
                  </div>

                  <div className="space-y-3">
                    <FormControlLabel
                      control={<Switch defaultChecked={notificationSettings.emailNotifications} />}
                      label="Email notifications"
                    />
                    <FormControlLabel
                      control={<Switch defaultChecked={notificationSettings.pushNotifications} />}
                      label="Push notifications"
                    />
                    <FormControlLabel
                      control={<Switch defaultChecked={notificationSettings.smsNotifications} />}
                      label="SMS notifications"
                    />
                    <FormControlLabel
                      control={<Switch defaultChecked={notificationSettings.marketingEmails} />}
                      label="Marketing emails"
                    />
                    <FormControlLabel
                      control={<Switch defaultChecked={notificationSettings.securityAlerts} />}
                      label="Security alerts"
                    />
                    <FormControlLabel
                      control={<Switch defaultChecked={notificationSettings.productUpdates} />}
                      label="Product updates"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Privacy Settings */}
              <Card className="shadow-lg bg-card">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <Shield className="w-5 h-5 text-primary" />
                    <Typography variant="h6" className="font-semibold">
                      Privacy & Security
                    </Typography>
                  </div>

                  <div className="space-y-6">
                    <FormControl fullWidth>
                      <InputLabel sx={inputLabelSx}>Profile Visibility</InputLabel>
                      <Select
                        defaultValue={privacySettings.profileVisibility}
                        label="Profile Visibility"
                        sx={selectSx}
                      >
                        {profileVisibilityOptions.map(option => (
                          <MenuItem key={option.value} value={option.value} sx={menuItemSx}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <div className="space-y-3">
                      <FormControlLabel
                        control={<Switch defaultChecked={privacySettings.showEmail} />}
                        label="Show email address"
                      />
                      <FormControlLabel
                        control={<Switch defaultChecked={privacySettings.showPhone} />}
                        label="Show phone number"
                      />
                      <FormControlLabel
                        control={<Switch defaultChecked={privacySettings.allowMessages} />}
                        label="Allow messages from anyone"
                      />
                      <FormControlLabel
                        control={<Switch defaultChecked={privacySettings.showActivity} />}
                        label="Show activity status"
                      />
                      <FormControlLabel
                        control={<Switch defaultChecked={privacySettings.dataCollection} />}
                        label="Allow data collection for analytics"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          {/* Sidebar */}
          <Grid item xs={12} lg={4}>
            <motion.div variants={itemVariants}>
              {/* Account Actions */}
              <Card className="shadow-lg mb-6 bg-card">
                <CardContent className="p-6">
                  <Typography variant="h6" className="font-semibold mb-4">
                    Account Actions
                  </Typography>
                  <div className="space-y-3">
                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={<Save />}
                      onClick={handleSubmit(handleSaveSettings)}
                      sx={primaryButtonSx}
                    >
                      Save All Settings
                    </Button>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<RefreshCw />}
                      onClick={handleResetSettings}
                      sx={secondaryButtonSx}
                    >
                      Reset to Defaults
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Data Management */}
              <Card className="shadow-lg mb-6 bg-card">
                <CardContent className="p-6">
                  <Typography variant="h6" className="font-semibold mb-4">
                    Data Management
                  </Typography>
                  <div className="space-y-3">
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<Download />}
                      onClick={handleExportData}
                      sx={secondaryButtonSx}
                    >
                      Export Data
                    </Button>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<Upload />}
                      onClick={handleImportData}
                      sx={secondaryButtonSx}
                    >
                      Import Data
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Danger Zone */}
              <Card className="shadow-lg border-2 border-red-200 bg-card">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                    <Typography variant="h6" className="font-semibold text-red-600">
                      Danger Zone
                    </Typography>
                  </div>
                  <Alert severity="warning" className="mb-4">
                    Once you delete your account, there is no going back. Please be certain.
                  </Alert>
                  <Button
                    fullWidth
                    variant="outlined"
                    color="error"
                    startIcon={<Trash2 />}
                    onClick={() => setDeleteDialogOpen(true)}
                  >
                    Delete Account
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        </Grid>
      </div>

      {/* Delete Account Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} PaperProps={{ sx: { backgroundColor: 'hsl(var(--card))' } }}>
        <DialogTitle sx={{ color: 'hsl(var(--foreground))' }}>Delete Account</DialogTitle>
        <DialogContent>
          <Alert severity="error" className="mb-4">
            This action cannot be undone. This will permanently delete your account and remove all your data.
          </Alert>
          <Typography variant="body2" className="mb-4 text-muted-foreground">
            Please type <strong>DELETE</strong> to confirm:
          </Typography>
          <TextField
            fullWidth
            placeholder="Type DELETE to confirm"
            sx={textFieldSx}
            // Add confirmation logic here
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} sx={{ color: 'hsl(var(--foreground))' }}>
            Cancel
          </Button>
          <Button 
            variant="contained" 
            color="error" 
            onClick={handleDeleteAccount}
            disabled // Enable only when DELETE is typed
          >
            Delete Account
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default Settings
