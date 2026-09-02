/**
 * Validate Indian phone number (10 digits)
 */
export const isValidIndianPhone = (phone) => {
  const cleaned = phone.replace(/\D/g, "");
  return cleaned.length === 10 && /^[6-9]/.test(cleaned);
};

/**
 * Validate email
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate Aadhaar number (12 digits)
 */
export const isValidAadhaar = (aadhaar) => {
  const cleaned = aadhaar.replace(/\D/g, "");
  return cleaned.length === 12;
};

/**
 * Validate PIN code (6 digits)
 */
export const isValidPIN = (pin) => {
  const cleaned = pin.replace(/\D/g, "");
  return cleaned.length === 6;
};

/**
 * Validate password strength
 * - At least 8 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 * - At least one special character
 */
export const isValidPassword = (password) => {
  const rules = {
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecial: /[!@#$%^&*]/.test(password),
  };

  return {
    isValid: Object.values(rules).every(Boolean),
    rules,
  };
};

/**
 * Sanitize input to prevent XSS
 */
export const sanitizeInput = (input) => {
  if (typeof input !== "string") return input;
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
};

/**
 * Trim and lowercase email
 */
export const normalizeEmail = (email) => {
  return email.trim().toLowerCase();
};

/**
 * Remove non-numeric characters from phone
 */
export const cleanPhone = (phone) => {
  return phone.replace(/\D/g, "");
};

/**
 * Validate required fields
 */
export const validateRequiredFields = (obj, fields) => {
  const missing = [];
  for (const field of fields) {
    if (!obj[field] || (typeof obj[field] === "string" && !obj[field].trim())) {
      missing.push(field);
    }
  }
  return {
    isValid: missing.length === 0,
    missing,
  };
};
