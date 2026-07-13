/**
 * Form Business Constants
 *
 * Business rule constants for form validation and logic.
 */

/**
 * Student age validation limits
 */
export const STUDENT_AGE = {
  MIN: 16,
  MAX: 60
}

/**
 * Graduation year validation limits
 */
export const GRADUATION_YEAR = {
  MIN: 2024,
  MAX: 2030
}

/**
 * Success snackbar auto-hide duration (ms)
 */
export const SUCCESS_SNACKBAR_DURATION = 5000

/**
 * Form reset delay after successful submission (ms)
 * Must be greater than SUCCESS_SNACKBAR_DURATION to prevent race condition
 */
export const FORM_RESET_DELAY = 6000
