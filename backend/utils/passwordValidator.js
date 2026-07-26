// Password Validation Utility
// Validates password strength according to enterprise security standards

class PasswordValidator {
  constructor() {
    this.minLength = 8
    this.maxLength = 128
    this.requireUppercase = true
    this.requireLowercase = true
    this.requireNumber = true
    this.requireSpecialChar = true
    this.specialChars = '!@#$%^&*()_+-=[]{}|;:,.<>?'
  }

  // Validate password against all rules
  validate(password) {
    const errors = []
    const strength = this.calculateStrength(password)

    // Check minimum length
    if (password.length < this.minLength) {
      errors.push(`Password must be at least ${this.minLength} characters long`)
    }

    // Check maximum length
    if (password.length > this.maxLength) {
      errors.push(`Password must not exceed ${this.maxLength} characters`)
    }

    // Check for uppercase
    if (this.requireUppercase && !/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter')
    }

    // Check for lowercase
    if (this.requireLowercase && !/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter')
    }

    // Check for number
    if (this.requireNumber && !/\d/.test(password)) {
      errors.push('Password must contain at least one number')
    }

    // Check for special character
    if (this.requireSpecialChar && !this.hasSpecialChar(password)) {
      errors.push(`Password must contain at least one special character (${this.specialChars})`)
    }

    // Check for common passwords
    if (this.isCommonPassword(password)) {
      errors.push('Password is too common. Please choose a stronger password')
    }

    // Check for personal information (placeholder - would need user context)
    // This would check against name, email, etc.

    return {
      isValid: errors.length === 0,
      errors,
      strength,
    }
  }

  // Check if password has special character
  hasSpecialChar(password) {
    const regex = new RegExp(`[${this.escapeRegex(this.specialChars)}]`)
    return regex.test(password)
  }

  // Escape special regex characters
  escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  }

  // Calculate password strength (0-100)
  calculateStrength(password) {
    let strength = 0

    // Length contribution (up to 25 points)
    strength += Math.min(password.length * 2, 25)

    // Character variety
    if (/[a-z]/.test(password)) strength += 10
    if (/[A-Z]/.test(password)) strength += 10
    if (/\d/.test(password)) strength += 10
    if (this.hasSpecialChar(password)) strength += 15

    // Complexity bonus
    const uniqueChars = new Set(password).size
    strength += Math.min(uniqueChars * 2, 20)

    // Penalty for common patterns
    if (/(.)\1{2,}/.test(password)) strength -= 10 // Repeated characters
    if (/123|abc|qwerty|password/i.test(password)) strength -= 15 // Common patterns

    return Math.max(0, Math.min(100, strength))
  }

  // Get strength label
  getStrengthLabel(strength) {
    if (strength < 20) return 'Very Weak'
    if (strength < 40) return 'Weak'
    if (strength < 60) return 'Fair'
    if (strength < 80) return 'Strong'
    return 'Very Strong'
  }

  // Get strength color (for UI)
  getStrengthColor(strength) {
    if (strength < 20) return '#ef4444' // red
    if (strength < 40) return '#f97316' // orange
    if (strength < 60) return '#eab308' // yellow
    if (strength < 80) return '#22c55e' // green
    return '#15803d' // dark green
  }

  // Check against common passwords list
  isCommonPassword(password) {
    const commonPasswords = [
      'password', '123456', '12345678', 'qwerty', 'abc123',
      'monkey', 'master', 'dragon', '111111', 'baseball',
      'iloveyou', 'trustno1', 'sunshine', 'princess', 'admin',
      'welcome', 'shadow', 'ashley', 'football', 'jesus',
      'michael', 'ninja', 'mustang', 'password1', '1234567890',
    ]
    
    return commonPasswords.includes(password.toLowerCase())
  }

  // Validate password confirmation
  validateConfirmation(password, confirmation) {
    if (password !== confirmation) {
      return {
        isValid: false,
        error: 'Passwords do not match',
      }
    }
    return {
      isValid: true,
    }
  }

  // Sanitize password (remove any potentially harmful characters)
  sanitize(password) {
    // Remove any control characters except newline and tab
    return password.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
  }

  // Generate a strong random password
  generateStrongPassword(length = 16) {
    const lowercase = 'abcdefghijklmnopqrstuvwxyz'
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const numbers = '0123456789'
    const special = this.specialChars
    const allChars = lowercase + uppercase + numbers + special

    let password = ''
    
    // Ensure at least one of each required character type
    password += lowercase[Math.floor(Math.random() * lowercase.length)]
    password += uppercase[Math.floor(Math.random() * uppercase.length)]
    password += numbers[Math.floor(Math.random() * numbers.length)]
    password += special[Math.floor(Math.random() * special.length)]

    // Fill the rest with random characters
    for (let i = 4; i < length; i++) {
      password += allChars[Math.floor(Math.random() * allChars.length)]
    }

    // Shuffle the password
    return password.split('').sort(() => Math.random() - 0.5).join('')
  }
}

export default new PasswordValidator()
