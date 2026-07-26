/**
 * Profile completion check utility.
 * Determines if a candidate has enough profile data to apply for jobs.
 */

// Fields that are REQUIRED before a candidate can apply
export const REQUIRED_APPLY_FIELDS = [
  "firstName",
  "lastName",
  "phone",
  "resume",
];

// Fields that count toward profile completion percentage
export const PROFILE_FIELDS = [
  { key: "firstName", label: "First Name", weight: 5 },
  { key: "lastName", label: "Last Name", weight: 5 },
  { key: "phone", label: "Phone Number", weight: 10 },
  { key: "bio", label: "Professional Summary", weight: 10 },
  { key: "resume", label: "Resume / CV", weight: 15 },
  { key: "skills", label: "Skills", weight: 12.5, isArray: true },
  { key: "education", label: "Education", weight: 17.5, isArray: true },
  { key: "location.addressLine1", label: "Address Line 1", weight: 5 },
  { key: "location.city", label: "City", weight: 5 },
  { key: "location.state", label: "State", weight: 2.5 },
  { key: "location.country", label: "Country", weight: 5 },
  { key: "location.zipCode", label: "ZIP Code", weight: 2.5 },
  { key: "socialLinks.linkedin", label: "LinkedIn", weight: 2.5 },
  { key: "socialLinks.github", label: "GitHub", weight: 2.5 },
  { key: "socialLinks.portfolio", label: "Portfolio", weight: 2.5 },
];

/**
 * Check if a user profile has all required fields to apply for a job.
 * @param {Object} user - The user object from auth context
 * @returns {{ canApply: boolean, missingFields: string[] }}
 */
export const canApplyToJob = (user) => {
  if (!user) {
    return {
      canApply: false,
      missingFields: REQUIRED_APPLY_FIELDS,
      completionPercentage: 0,
    };
  }

  const missingFields = [];

  REQUIRED_APPLY_FIELDS.forEach((field) => {
    const value = getNestedValue(user, field);
    if (!value || (Array.isArray(value) && value.length === 0)) {
      missingFields.push(
        PROFILE_FIELDS.find((f) => f.key === field)?.label || field,
      );
    }
  });

  return {
    canApply: missingFields.length === 0,
    missingFields,
    completionPercentage: calculateProfileCompletion(user),
  };
};

/**
 * Calculate profile completion percentage based on filled fields.
 * @param {Object} user - The user object
 * @returns {number} Percentage 0-100
 */
export const calculateProfileCompletion = (user) => {
  if (!user) return 0;

  let totalWeight = 0;
  let filledWeight = 0;

  PROFILE_FIELDS.forEach((field) => {
    totalWeight += field.weight;
    const value = getNestedValue(user, field.key);
    const isFilled = field.isArray
      ? Array.isArray(value) && value.length > 0
      : value !== undefined && value !== null && value !== "" && value !== " ";

    if (isFilled) {
      filledWeight += field.weight;
    }
  });

  return Math.round((filledWeight / totalWeight) * 100);
};

/**
 * Get the missing profile fields for display.
 * @param {Object} user
 * @returns {Array<{key: string, label: string}>}
 */
export const getMissingProfileFields = (user) => {
  if (!user) return PROFILE_FIELDS;

  return PROFILE_FIELDS.filter((field) => {
    const value = getNestedValue(user, field.key);
    return field.isArray
      ? !Array.isArray(value) || value.length === 0
      : value === undefined || value === null || value === "" || value === " ";
  });
};

/**
 * Get nested object value from dot notation key.
 * @param {Object} obj
 * @param {string} path - Dot notation path e.g. "location.city"
 * @returns {*}
 */
function getNestedValue(obj, path) {
  return path.split(".").reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : undefined;
  }, obj);
}

export default {
  canApplyToJob,
  calculateProfileCompletion,
  getMissingProfileFields,
  REQUIRED_APPLY_FIELDS,
  PROFILE_FIELDS,
};
