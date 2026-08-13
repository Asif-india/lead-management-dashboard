/**
 * Role-Based Access Control (RBAC) Configuration
 *
 * Defines menu permissions for each role.
 * Menu items are filtered based on the user's role.
 *
 * Role Identifiers (lowercase):
 * - admin
 * - manager
 * - employee
 *
 * To add a new role:
 * 1. Add role identifier to ROLES in utils/roleHelper.js
 * 2. Add display label to formatRole in utils/roleHelper.js
 * 3. Add role permissions here
 * 4. No Sidebar JSX changes needed
 */

import { ROLES } from '../utils/roleHelper'

/**
 * Menu items configuration
 * Each item has a unique key for permission mapping
 */
export const MENU_ITEMS = [
  {
    key: 'dashboard',
    name: 'Dashboard',
    icon: 'LayoutDashboard',
    path: '/admin/dashboard',
    badgeKey: null
  },
  {
    key: 'leads',
    name: 'Leads',
    icon: 'Users',
    path: '/admin/leads',
    badgeKey: 'totalLeads'
  },
  {
    key: 'generate-lead',
    name: 'Generate Lead',
    icon: 'Plus',
    path: '/admin/generate-lead',
    badgeKey: null
  },
  {
    key: 'analytics',
    name: 'Analytics',
    icon: 'TrendingUp',
    path: '/admin/analytics',
    badgeKey: null
  },
  {
    key: 'incentives',
    name: 'Incentives',
    icon: 'Gift',
    path: '/admin/incentives',
    badgeKey: 'pendingIncentives'
  },
  {
    key: 'employees',
    name: 'Employees',
    icon: 'Briefcase',
    path: '/admin/employees',
    badgeKey: null
  },
  {
    key: 'users',
    name: 'User Management',
    icon: 'User',
    path: '/admin/users',
    badgeKey: null
  },
  {
    key: 'lead-sources',
    name: 'Lead Sources',
    icon: 'Users',
    path: '/admin/lead-sources',
    badgeKey: null
  },
  {
    key: 'audit-history',
    name: 'Audit History',
    icon: 'History',
    path: '/admin/audit-history',
    badgeKey: null
  },
  {
    key: 'settings',
    name: 'Settings',
    icon: 'Settings',
    path: '/admin/settings',
    badgeKey: null
  }
]

/**
 * Role permissions configuration
 * Maps roles to allowed menu item keys
 * Includes backward compatibility for backend role names (administrator, sales_executive)
 */
export const ROLE_PERMISSIONS = {
  // New role names (from roleHelper.js)
  [ROLES.ADMIN]: [
    'dashboard',
    'leads',
    'generate-lead',
    'analytics',
    'incentives',
    'employees',
    'users',
    'lead-sources',
    'audit-history',
    'settings'
  ],
  [ROLES.MANAGER]: [
    'dashboard',
    'leads',
    'generate-lead',
    'analytics',
    'incentives',
    'employees'
  ],
  [ROLES.EMPLOYEE]: [
    'dashboard',
    'leads',
    'generate-lead',
    'incentives'
  ],
  // Backward compatibility for backend role names
  'administrator': [
    'dashboard',
    'leads',
    'generate-lead',
    'analytics',
    'incentives',
    'employees',
    'users',
    'lead-sources',
    'audit-history',
    'settings'
  ],
  'sales_executive': [
    'dashboard',
    'leads',
    'generate-lead',
    'incentives'
  ]
}

/**
 * Get allowed menu items for a role
 *
 * @param {string} role - User role identifier
 * @returns {Array} Filtered menu items
 */
export const getMenuItemsForRole = (role) => {
  const allowedKeys = ROLE_PERMISSIONS[role] || []
  return MENU_ITEMS.filter(item => allowedKeys.includes(item.key))
}

/**
 * Check if user has permission for a menu item
 *
 * @param {string} role - User role identifier
 * @param {string} menuKey - Menu item key
 * @returns {boolean} True if user has access
 */
export const hasMenuPermission = (role, menuKey) => {
  const allowedKeys = ROLE_PERMISSIONS[role] || []
  return allowedKeys.includes(menuKey)
}
