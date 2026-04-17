/**
 * Validation utilities for checkout flow
 * Provides client-side validation for form inputs and file uploads
 */

export interface ValidationResult {
  valid: boolean
  error?: string
}

/**
 * Validates email format
 * Requirements: 1.3, 1.4
 */
export function validateEmail(email: string): ValidationResult {
  if (!email || email.trim() === "") {
    return { valid: false, error: "Email wajib diisi" }
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return { valid: false, error: "Format email tidak valid" }
  }

  return { valid: true }
}

/**
 * Validates name field
 * Requirements: 1.1, 1.4
 */
export function validateName(name: string): ValidationResult {
  if (!name || name.trim() === "") {
    return { valid: false, error: "Nama lengkap wajib diisi" }
  }

  if (name.trim().length < 2) {
    return { valid: false, error: "Nama minimal 2 karakter" }
  }

  return { valid: true }
}

/**
 * Validates file for payment proof upload
 * Requirements: 4.2, 4.3, 4.4
 */
export function validateFile(file: File): ValidationResult {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "application/pdf"]

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: "Format file tidak didukung. Gunakan JPG, PNG, atau PDF.",
    }
  }

  const maxSize = 5 * 1024 * 1024 // 5MB
  if (file.size > maxSize) {
    return { valid: false, error: "Ukuran file maksimal 5MB." }
  }

  return { valid: true }
}
