// Frontend Validation Utilities
// Real-time validation with user-friendly error messages

// ============================================
// EMAIL VALIDATION
// ============================================

export const validateEmail = (email) => {
  if (!email) {
    return { isValid: false, message: "Email is required" };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, message: "Please provide a valid email address" };
  }

  if (email.length > 255) {
    return { isValid: false, message: "Email cannot exceed 255 characters" };
  }

  return { isValid: true };
};

// ============================================
// PASSWORD VALIDATION
// ============================================

export const validatePassword = (password) => {
  const errors = [];
  const checks = {
    minLength: false,
    maxLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    hasSpecial: false,
  };

  if (!password) {
    return {
      isValid: false,
      message: "Password is required",
      checks,
      errors: ["Password is required"],
    };
  }

  if (password.length < 8) {
    errors.push("Password must be at least 8 characters");
  } else {
    checks.minLength = true;
  }

  if (password.length > 128) {
    errors.push("Password cannot exceed 128 characters");
  } else {
    checks.maxLength = true;
  }

  if (/[A-Z]/.test(password)) {
    checks.hasUppercase = true;
  } else {
    errors.push("Password must contain at least one uppercase letter");
  }

  if (/[a-z]/.test(password)) {
    checks.hasLowercase = true;
  } else {
    errors.push("Password must contain at least one lowercase letter");
  }

  if (/[0-9]/.test(password)) {
    checks.hasNumber = true;
  } else {
    errors.push("Password must contain at least one number");
  }

  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    checks.hasSpecial = true;
  } else {
    errors.push("Password must contain at least one special character");
  }

  const isValid = errors.length === 0;
  const strength = calculatePasswordStrength(password);

  return {
    isValid,
    message: isValid ? "Password is valid" : errors[0],
    checks,
    errors,
    strength,
    strengthLabel: getStrengthLabel(strength),
    strengthColor: getStrengthColor(strength),
  };
};

export const calculatePasswordStrength = (password) => {
  let strength = 0;

  // Length contribution
  strength += Math.min(password.length * 2, 25);

  // Character variety
  if (/[a-z]/.test(password)) strength += 10;
  if (/[A-Z]/.test(password)) strength += 10;
  if (/[0-9]/.test(password)) strength += 10;
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) strength += 15;

  // Complexity bonus
  const uniqueChars = new Set(password).size;
  strength += Math.min(uniqueChars * 2, 20);

  // Penalty for common patterns
  if (/(.)\1{2,}/.test(password)) strength -= 10;
  if (/123|abc|qwerty|password/i.test(password)) strength -= 15;

  return Math.max(0, Math.min(100, strength));
};

export const getStrengthLabel = (strength) => {
  if (strength < 20) return "Very Weak";
  if (strength < 40) return "Weak";
  if (strength < 60) return "Fair";
  if (strength < 80) return "Strong";
  return "Very Strong";
};

export const getStrengthColor = (strength) => {
  if (strength < 20) return "#ef4444";
  if (strength < 40) return "#f97316";
  if (strength < 60) return "#eab308";
  if (strength < 80) return "#22c55e";
  return "#15803d";
};

export const validatePasswordMatch = (password, confirmation) => {
  if (!confirmation) {
    return { isValid: false, message: "Please confirm your password" };
  }

  if (password !== confirmation) {
    return { isValid: false, message: "Passwords do not match" };
  }

  return { isValid: true };
};

// ============================================
// NAME VALIDATION
// ============================================

export const validateName = (name, fieldName = "Name") => {
  if (!name) {
    return { isValid: false, message: `${fieldName} is required` };
  }

  if (name.length < 2) {
    return {
      isValid: false,
      message: `${fieldName} must be at least 2 characters`,
    };
  }

  if (name.length > 50) {
    return {
      isValid: false,
      message: `${fieldName} cannot exceed 50 characters`,
    };
  }

  const nameRegex = /^[a-zA-Z\s\-']+$/;
  if (!nameRegex.test(name)) {
    return {
      isValid: false,
      message: `${fieldName} can only contain letters, spaces, hyphens, and apostrophes`,
    };
  }

  return { isValid: true };
};

export const validateFullName = (fullName) => {
  if (!fullName) {
    return { isValid: false, message: "Full name is required" };
  }

  const parts = fullName.trim().split(/\s+/);
  if (parts.length < 2) {
    return {
      isValid: false,
      message: "Please provide both first and last name",
    };
  }

  return validateName(fullName, "Full name");
};

// ============================================
// USERNAME VALIDATION
// ============================================

export const validateUsername = (username) => {
  if (!username) {
    return { isValid: false, message: "Username is required" };
  }

  if (username.length < 3) {
    return {
      isValid: false,
      message: "Username must be at least 3 characters",
    };
  }

  if (username.length > 30) {
    return { isValid: false, message: "Username cannot exceed 30 characters" };
  }

  const usernameRegex = /^[a-zA-Z0-9_]+$/;
  if (!usernameRegex.test(username)) {
    return {
      isValid: false,
      message: "Username can only contain letters, numbers, and underscores",
    };
  }

  return { isValid: true };
};

// ============================================
// PHONE VALIDATION
// ============================================

export const validatePhone = (phone) => {
  if (!phone) {
    return { isValid: false, message: "Phone number is required" };
  }

  const phoneRegex = /^[\d\s\-\+\(\)]+$/;
  if (!phoneRegex.test(phone)) {
    return { isValid: false, message: "Please provide a valid phone number" };
  }

  const digitsOnly = phone.replace(/\D/g, "");
  if (digitsOnly.length < 10) {
    return {
      isValid: false,
      message: "Phone number must have at least 10 digits",
    };
  }

  if (digitsOnly.length > 20) {
    return { isValid: false, message: "Phone number cannot exceed 20 digits" };
  }

  return { isValid: true };
};

// ============================================
// OTP VALIDATION
// ============================================

export const validateOTP = (otp) => {
  if (!otp) {
    return { isValid: false, message: "OTP is required" };
  }

  const otpRegex = /^\d{6}$/;
  if (!otpRegex.test(otp)) {
    return { isValid: false, message: "OTP must be exactly 6 digits" };
  }

  return { isValid: true };
};

// ============================================
// URL VALIDATION
// ============================================

export const validateURL = (url, fieldName = "URL") => {
  if (!url) {
    return { isValid: true }; // Optional field
  }

  try {
    new URL(url);
    return { isValid: true };
  } catch {
    return { isValid: false, message: `Please provide a valid ${fieldName}` };
  }
};

export const validateLinkedIn = (url) => validateURL(url, "LinkedIn URL");
export const validateGitHub = (url) => validateURL(url, "GitHub URL");
export const validatePortfolio = (url) => validateURL(url, "Portfolio URL");
export const validateWebsite = (url) => validateURL(url, "Website URL");

// ============================================
// FILE VALIDATION
// ============================================

export const validateImageFile = (file) => {
  if (!file) {
    return { isValid: false, message: "Please select an image" };
  }

  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      message: "Only JPG, PNG, and WEBP images are allowed",
    };
  }

  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    return { isValid: false, message: "Image size cannot exceed 5MB" };
  }

  return { isValid: true };
};

export const validateResumeFile = (file) => {
  if (!file) {
    return { isValid: false, message: "Please select a resume" };
  }

  if (file.type !== "application/pdf") {
    return { isValid: false, message: "Only PDF files are allowed" };
  }

  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    return { isValid: false, message: "Resume size cannot exceed 10MB" };
  }

  return { isValid: true };
};

// ============================================
// JOB VALIDATION
// ============================================

export const validateJobTitle = (title) => {
  if (!title) {
    return { isValid: false, message: "Job title is required" };
  }

  if (title.length < 5) {
    return {
      isValid: false,
      message: "Job title must be at least 5 characters",
    };
  }

  if (title.length > 100) {
    return {
      isValid: false,
      message: "Job title cannot exceed 100 characters",
    };
  }

  return { isValid: true };
};

export const validateJobDescription = (description) => {
  if (!description) {
    return { isValid: false, message: "Job description is required" };
  }

  if (description.length < 50) {
    return {
      isValid: false,
      message: "Job description must be at least 50 characters",
    };
  }

  if (description.length > 10000) {
    return {
      isValid: false,
      message: "Job description cannot exceed 10,000 characters",
    };
  }

  return { isValid: true };
};

export const validateSalary = (salary) => {
  if (!salary && salary !== 0) {
    return { isValid: false, message: "Salary is required" };
  }

  if (salary < 0) {
    return { isValid: false, message: "Salary cannot be negative" };
  }

  return { isValid: true };
};

export const validateSkills = (skills) => {
  if (!skills || skills.length === 0) {
    return { isValid: false, message: "At least one skill is required" };
  }

  if (skills.length > 20) {
    return { isValid: false, message: "Cannot add more than 20 skills" };
  }

  return { isValid: true };
};

// ============================================
// ADDRESS VALIDATION
// ============================================

export const validateAddressLine1 = (line) => {
  if (!line || !line.trim()) {
    return { isValid: false, message: "Address Line 1 is required" };
  }

  if (line.length < 3) {
    return { isValid: false, message: "Address must be at least 3 characters" };
  }

  if (line.length > 200) {
    return { isValid: false, message: "Address cannot exceed 200 characters" };
  }

  return { isValid: true };
};

export const validateAddressLine2 = (line) => {
  if (line && line.length > 200) {
    return {
      isValid: false,
      message: "Address Line 2 cannot exceed 200 characters",
    };
  }
  return { isValid: true }; // Optional
};

export const validateCity = (city) => {
  if (!city || !city.trim()) {
    return { isValid: false, message: "City is required" };
  }

  if (city.length < 2) {
    return { isValid: false, message: "City must be at least 2 characters" };
  }

  if (city.length > 100) {
    return { isValid: false, message: "City cannot exceed 100 characters" };
  }

  if (!/^[a-zA-Z\s\-'.]+$/.test(city)) {
    return {
      isValid: false,
      message:
        "City can only contain letters, spaces, hyphens, and apostrophes",
    };
  }

  return { isValid: true };
};

export const validateState = (state) => {
  if (!state || !state.trim()) {
    return { isValid: false, message: "State / Province is required" };
  }

  if (state.length < 2) {
    return { isValid: false, message: "State must be at least 2 characters" };
  }

  if (state.length > 100) {
    return { isValid: false, message: "State cannot exceed 100 characters" };
  }

  return { isValid: true };
};

export const validateCountry = (country) => {
  if (!country || !country.trim()) {
    return { isValid: false, message: "Country is required" };
  }

  if (country.length < 2) {
    return { isValid: false, message: "Country must be at least 2 characters" };
  }

  if (country.length > 100) {
    return { isValid: false, message: "Country cannot exceed 100 characters" };
  }

  return { isValid: true };
};

export const validateZipCode = (zip) => {
  if (!zip || !zip.trim()) {
    return { isValid: false, message: "Postal / ZIP Code is required" };
  }

  if (zip.length > 20) {
    return { isValid: false, message: "ZIP Code cannot exceed 20 characters" };
  }

  // Accept alphanumeric postal codes (e.g., UK, Canada, India)
  if (!/^[a-zA-Z0-9\s\-]+$/.test(zip)) {
    return {
      isValid: false,
      message: "Please provide a valid postal / ZIP code",
    };
  }

  return { isValid: true };
};

export const validateLandmark = (landmark) => {
  if (landmark && landmark.length > 200) {
    return { isValid: false, message: "Landmark cannot exceed 200 characters" };
  }
  return { isValid: true }; // Optional
};

export const validateCoordinates = (coordinates) => {
  if (!coordinates || !coordinates.trim()) {
    return { isValid: true }; // Optional
  }

  // Accept Google Maps URL
  if (coordinates.startsWith("http://") || coordinates.startsWith("https://")) {
    return { isValid: true };
  }

  // Accept lat,lng format
  const coordRegex = /^-?\d+\.?\d*,\s*-?\d+\.?\d*$/;
  if (coordRegex.test(coordinates.trim())) {
    return { isValid: true };
  }

  return {
    isValid: false,
    message: "Please provide a valid Google Maps URL or coordinates (lat, lng)",
  };
};

// Validate a complete address object
export const validateAddress = (
  address,
  optionalFields = ["addressLine2", "landmark", "coordinates"],
) => {
  const errors = {};

  // Required fields
  const requiredChecks = {
    addressLine1: validateAddressLine1(address?.addressLine1),
    city: validateCity(address?.city),
    state: validateState(address?.state),
    country: validateCountry(address?.country),
    zipCode: validateZipCode(address?.zipCode),
  };

  Object.entries(requiredChecks).forEach(([field, result]) => {
    if (!result.isValid) {
      errors[field] = result.message;
    }
  });

  // Optional fields
  if (address?.addressLine2 && !optionalFields.includes("addressLine2")) {
    const line2Result = validateAddressLine2(address.addressLine2);
    if (!line2Result.isValid) errors.addressLine2 = line2Result.message;
  }

  if (address?.landmark && !optionalFields.includes("landmark")) {
    const landmarkResult = validateLandmark(address.landmark);
    if (!landmarkResult.isValid) errors.landmark = landmarkResult.message;
  }

  if (address?.coordinates && !optionalFields.includes("coordinates")) {
    const coordResult = validateCoordinates(address.coordinates);
    if (!coordResult.isValid) errors.coordinates = coordResult.message;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateLocation = (location) => {
  if (!location) {
    return { isValid: false, message: "Location is required" };
  }

  if (location.length < 2) {
    return {
      isValid: false,
      message: "Location must be at least 2 characters",
    };
  }

  if (location.length > 100) {
    return { isValid: false, message: "Location cannot exceed 100 characters" };
  }

  return { isValid: true };
};

export const validateDeadline = (deadline) => {
  if (!deadline) {
    return { isValid: true }; // Optional
  }

  const deadlineDate = new Date(deadline);
  const now = new Date();

  if (deadlineDate < now) {
    return { isValid: false, message: "Deadline cannot be in the past" };
  }

  return { isValid: true };
};

// ============================================
// GENERAL VALIDATION
// ============================================

export const validateRequired = (value, fieldName = "Field") => {
  if (!value || (typeof value === "string" && value.trim() === "")) {
    return { isValid: false, message: `${fieldName} is required` };
  }
  return { isValid: true };
};

export const validateMinLength = (value, min, fieldName = "Field") => {
  if (!value || value.length < min) {
    return {
      isValid: false,
      message: `${fieldName} must be at least ${min} characters`,
    };
  }
  return { isValid: true };
};

export const validateMaxLength = (value, max, fieldName = "Field") => {
  if (value && value.length > max) {
    return {
      isValid: false,
      message: `${fieldName} cannot exceed ${max} characters`,
    };
  }
  return { isValid: true };
};

export const validateRange = (value, min, max, fieldName = "Field") => {
  if (value < min || value > max) {
    return {
      isValid: false,
      message: `${fieldName} must be between ${min} and ${max}`,
    };
  }
  return { isValid: true };
};

// ============================================
// FORM VALIDATION HELPERS
// ============================================

export const validateForm = (formData, validationRules) => {
  const errors = {};
  let isValid = true;

  Object.keys(validationRules).forEach((field) => {
    const value = formData[field];
    const rules = validationRules[field];

    for (const rule of rules) {
      const result = rule(value);
      if (!result.isValid) {
        errors[field] = result.message;
        isValid = false;
        break;
      }
    }
  });

  return { isValid, errors };
};

export const getFirstError = (errors) => {
  const errorKeys = Object.keys(errors);
  return errorKeys.length > 0 ? errors[errorKeys[0]] : null;
};

export const hasErrors = (errors) => {
  return Object.keys(errors).length > 0;
};

// ============================================
// REAL-TIME VALIDATION
// ============================================

export const createValidator = (validationFn, debounceMs = 300) => {
  let timeoutId = null;

  return (value) => {
    return new Promise((resolve) => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      timeoutId = setTimeout(() => {
        resolve(validationFn(value));
      }, debounceMs);
    });
  };
};

// ============================================
// CAPS LOCK DETECTION
// ============================================

export const isCapsLockOn = (event) => {
  const isCaps = event.getModifierState && event.getModifierState("CapsLock");
  return isCaps;
};

// ============================================
// SANITIZATION
// ============================================

export const sanitizeInput = (input) => {
  if (typeof input !== "string") return input;

  return input
    .trim()
    .replace(/[<>]/g, "") // Remove potential HTML tags
    .replace(/[\x00-\x1F\x7F]/g, ""); // Remove control characters
};

export const sanitizeFormData = (formData) => {
  const sanitized = {};

  Object.keys(formData).forEach((key) => {
    const value = formData[key];

    if (typeof value === "string") {
      sanitized[key] = sanitizeInput(value);
    } else if (Array.isArray(value)) {
      sanitized[key] = value.map((item) =>
        typeof item === "string" ? sanitizeInput(item) : item,
      );
    } else {
      sanitized[key] = value;
    }
  });

  return sanitized;
};
