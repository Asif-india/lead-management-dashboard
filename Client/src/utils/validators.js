/**
 * Validation Utilities
 * 
 * Reusable validation functions for form inputs and data validation
 */

import { VALIDATION_PATTERNS } from '../constants'

/**
 * Validate email address
 */
export const isValidEmail = (email) => {
  if (!email || typeof email !== 'string') return false
  return VALIDATION_PATTERNS.EMAIL.test(email.trim())
}

/**
 * Validate phone number
 */
export const isValidPhone = (phone) => {
  if (!phone || typeof phone !== 'string') return false
  return VALIDATION_PATTERNS.PHONE.test(phone.trim())
}

/**
 * Validate URL
 */
export const isValidUrl = (url) => {
  if (!url || typeof url !== 'string') return false
  return VALIDATION_PATTERNS.URL.test(url.trim())
}

/**
 * Validate password strength
 */
export const isValidPassword = (password) => {
  if (!password || typeof password !== 'string') return false
  return VALIDATION_PATTERNS.PASSWORD.test(password)
}

/**
 * Validate name (letters, spaces, hyphens, apostrophes only)
 */
export const isValidName = (name) => {
  if (!name || typeof name !== 'string') return false
  return VALIDATION_PATTERNS.NAME.test(name.trim())
}

/**
 * Validate alphanumeric string
 */
export const isValidAlphanumeric = (value) => {
  if (!value || typeof value !== 'string') return false
  return VALIDATION_PATTERNS.ALPHANUMERIC.test(value)
}

/**
 * Validate required field
 */
export const isRequired = (value) => {
  if (value === null || value === undefined) return false
  if (typeof value === 'string') return value.trim().length > 0
  if (Array.isArray(value)) return value.length > 0
  return true
}

/**
 * Validate string length
 */
export const isValidLength = (value, minLength = 0, maxLength = Infinity) => {
  if (value === null || value === undefined) return false
  const length = String(value).length
  return length >= minLength && length <= maxLength
}

/**
 * Validate number range
 */
export const isValidRange = (value, min = -Infinity, max = Infinity) => {
  const num = Number(value)
  return !isNaN(num) && num >= min && num <= max
}

/**
 * Validate date
 */
export const isValidDate = (date) => {
  if (!date) return false
  const parsedDate = new Date(date)
  return !isNaN(parsedDate.getTime())
}

/**
 * Validate age (minimum and maximum)
 */
export const isValidAge = (birthDate, minAge = 0, maxAge = 150) => {
  if (!isValidDate(birthDate)) return false
  
  const today = new Date()
  const birth = new Date(birthDate)
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }
  
  return age >= minAge && age <= maxAge
}

/**
 * Validate file type
 */
export const isValidFileType = (file, allowedTypes) => {
  if (!file || !file.name) return false
  
  const extension = file.name.split('.').pop().toLowerCase()
  return allowedTypes.includes(extension)
}

/**
 * Validate file size
 */
export const isValidFileSize = (file, maxSizeInBytes) => {
  if (!file || !file.size) return false
  return file.size <= maxSizeInBytes
}

/**
 * Validate credit card number (Luhn algorithm)
 */
export const isValidCreditCard = (cardNumber) => {
  if (!cardNumber || typeof cardNumber !== 'string') return false
  
  const cleaned = cardNumber.replace(/\D/g, '')
  if (cleaned.length < 13 || cleaned.length > 19) return false
  
  let sum = 0
  let isEven = false
  
  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned[i])
    
    if (isEven) {
      digit *= 2
      if (digit > 9) digit -= 9
    }
    
    sum += digit
    isEven = !isEven
  }
  
  return sum % 10 === 0
}

/**
 * Validate IP address (IPv4 or IPv6)
 */
export const isValidIP = (ip) => {
  if (!ip || typeof ip !== 'string') return false
  
  // IPv4 regex
  const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
  
  // IPv6 regex (simplified)
  const ipv6Regex = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$|^::1$|^::$/
  
  return ipv4Regex.test(ip) || ipv6Regex.test(ip)
}

/**
 * Validate hex color code
 */
export const isValidHexColor = (color) => {
  if (!color || typeof color !== 'string') return false
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color)
}

/**
 * Validate social security number (US format)
 */
export const isValidSSN = (ssn) => {
  if (!ssn || typeof ssn !== 'string') return false
  const cleaned = ssn.replace(/\D/g, '')
  return /^(?!666|000|9\d{2})\d{3}(?!00)\d{2}(?!0{4})\d{4}$/.test(cleaned)
}

/**
 * Custom validator creator
 */
export const createValidator = (rules) => {
  return (value) => {
    for (const rule of rules) {
      const result = rule.validator(value)
      if (!result) {
        return rule.message || 'Validation failed'
      }
    }
    return null // No errors
  }
}

/**
 * Validate multiple fields
 */
export const validateFields = (data, validationRules) => {
  const errors = {}
  
  for (const [field, rules] of Object.entries(validationRules)) {
    const value = data[field]
    const validator = createValidator(rules)
    const error = validator(value)
    
    if (error) {
      errors[field] = error
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

export default {
  isValidEmail,
  isValidPhone,
  isValidUrl,
  isValidPassword,
  isValidName,
  isValidAlphanumeric,
  isRequired,
  isValidLength,
  isValidRange,
  isValidDate,
  isValidAge,
  isValidFileType,
  isValidFileSize,
  isValidCreditCard,
  isValidIP,
  isValidHexColor,
  isValidSSN,
  createValidator,
  validateFields
}
