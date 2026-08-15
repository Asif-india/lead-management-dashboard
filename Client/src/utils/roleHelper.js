/**
 * Role Helper Utilities
 *
 * Single source of truth for role formatting and display.
 * All database values use lowercase identifiers.
 * Display labels are generated only by this formatter.
 *
 * Role Identifiers (Database/JWT/Auth):
 * - admin
 * - manager
 * - employee
 *
 * Display Labels (UI only):
 * - Admin
 * - Manager
 * - Employee
 */

/**
 * Format role identifier to display label
 *
 * @param {string} role - Role identifier (lowercase)
 * @returns {string} Formatted display label
 */
export const formatRole = (role) => {
  const roleMap = {
    'admin': 'Admin',
    'administrator': 'Admin',
    'manager': 'Manager',
    'employee': 'Employee',
    'sales_executive': 'Employee'
  }

  return roleMap[role] || role
}

/**
 * Get initials from user name
 *
 * @param {string} name - User name
 * @returns {string} Initials (up to 2 characters)
 */
export const getInitials = (name) => {
  if (!name) return ''

  const parts = name.trim().split(' ')

  if (parts.length === 1) {
    return parts[0][0].toUpperCase()
  }

  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

/**
 * Role identifiers enum for type safety
 * Matches backend USER_ROLES in server/src/constants/index.js
 */
export const ROLES = {
  ADMIN: 'administrator',
  MANAGER: 'manager',
  EMPLOYEE: 'employee'
}

/**
 * Role display labels for UI
 */
export const ROLE_LABELS = {
  administrator: 'Admin',
  manager: 'Manager',
  employee: 'Employee'

}
