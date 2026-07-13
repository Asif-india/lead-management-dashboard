/**
 * Settings Data Constants
 *
 * Static configuration data for the Settings page.
 */

// Default General Settings
export const generalSettings = {
  siteName: 'ModernApp',
  siteDescription: 'A modern React application with beautiful design',
  defaultLanguage: 'en',
  timezone: 'America/Los_Angeles',
  dateFormat: 'MM/DD/YYYY',
  timeFormat: '12h'
}

// Default Appearance Settings
export const appearanceSettings = {
  theme: 'light',
  primaryColor: '#3b82f6',
  fontSize: 'medium',
  sidebarCollapsed: false,
  showAnimations: true,
  compactMode: false
}

// Default Notification Settings
export const notificationSettings = {
  emailNotifications: true,
  pushNotifications: false,
  smsNotifications: false,
  marketingEmails: true,
  securityAlerts: true,
  productUpdates: true
}

// Default Privacy Settings
export const privacySettings = {
  profileVisibility: 'public',
  showEmail: false,
  showPhone: false,
  allowMessages: true,
  showActivity: false,
  dataCollection: true
}

// Language Options
export const languageOptions = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' },
  { value: 'de', label: 'German' },
  { value: 'zh', label: 'Chinese' }
]

// Timezone Options
export const timezoneOptions = [
  { value: 'America/Los_Angeles', label: 'Pacific Time' },
  { value: 'America/New_York', label: 'Eastern Time' },
  { value: 'Europe/London', label: 'London' },
  { value: 'Asia/Tokyo', label: 'Tokyo' }
]

// Date Format Options
export const dateFormatOptions = [
  { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
  { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
  { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' }
]

// Theme Options
export const themeOptions = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'auto', label: 'Auto' }
]

// Font Size Options
export const fontSizeOptions = [
  { value: 'small', label: 'Small' },
  { value: 'medium', label: 'Medium' },
  { value: 'large', label: 'Large' }
]

// Profile Visibility Options
export const profileVisibilityOptions = [
  { value: 'public', label: 'Public' },
  { value: 'private', label: 'Private' },
  { value: 'friends', label: 'Friends Only' }
]
