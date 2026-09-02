/**
 * ARAINA PORTAL UTILITIES
 * Formatting, masking, and validation helpers
 */

/**
 * Format Indian currency
 * @param {number} amount - Amount in rupees
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount) => {
  return `₹${amount.toLocaleString("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
};

/**
 * Format currency with decimals
 * @param {number} amount - Amount in rupees
 * @returns {string} Formatted currency string with decimals
 */
export const formatCurrencyWithDecimals = (amount) => {
  return `₹${amount.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

/**
 * Mask Aadhaar number - show only last 4 digits
 * @param {string} aadhaar - Full Aadhaar number (12 digits)
 * @returns {string} Masked Aadhaar (e.g., "XXXX XXXX 1234")
 */
export const maskAadhaar = (aadhaar) => {
  if (!aadhaar || aadhaar.length !== 12) return "Invalid Aadhaar";
  const last4 = aadhaar.slice(-4);
  return `XXXX XXXX ${last4}`;
};

/**
 * Mask phone number
 * @param {string} phone - Phone number
 * @returns {string} Masked phone (e.g., "+91 XXXXX 12345")
 */
export const maskPhone = (phone) => {
  if (!phone || phone.length < 5) return phone;
  const last5 = phone.slice(-5);
  return `+91 XXXXX ${last5}`;
};

/**
 * Format phone number for display
 * @param {string} phone - Indian phone number (10 digits)
 * @returns {string} Formatted phone number
 */
export const formatPhone = (phone) => {
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.length !== 10) return phone;
  return `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
};

/**
 * Validate Indian phone number
 * @param {string} phone - Phone number to validate
 * @returns {boolean} True if valid Indian phone
 */
export const isValidIndianPhone = (phone) => {
  const cleaned = phone.replace(/\D/g, "");
  return cleaned.length === 10 && /^[6-9]/.test(cleaned);
};

/**
 * Validate Aadhaar number (basic format check)
 * @param {string} aadhaar - Aadhaar number to validate
 * @returns {boolean} True if valid format (12 digits)
 */
export const isValidAadhaar = (aadhaar) => {
  const cleaned = aadhaar.replace(/\D/g, "");
  return cleaned.length === 12;
};

/**
 * Validate PIN code
 * @param {string} pin - PIN code to validate
 * @returns {boolean} True if valid PIN code (6 digits)
 */
export const isValidPIN = (pin) => {
  const cleaned = pin.replace(/\D/g, "");
  return cleaned.length === 6;
};

/**
 * Validate email
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid email
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {object} { isValid: boolean, errors: string[] }
 */
export const validatePassword = (password) => {
  const errors = [];

  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long");
  }
  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }
  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }
  if (!/[0-9]/.test(password)) {
    errors.push("Password must contain at least one number");
  }
  if (!/[!@#$%^&*]/.test(password)) {
    errors.push(
      "Password must contain at least one special character (!@#$%^&*)",
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Generate referral code
 * @param {string} userId - User ID or name
 * @returns {string} Unique referral code (e.g., "ARAINA-X8K29Q")
 */
export const generateReferralCode = (userId) => {
  // Generate a random alphanumeric string
  const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `ARAINA-${randomPart}`;
};

/**
 * Format date for display
 * @param {Date | string} date - Date to format
 * @returns {string} Formatted date (e.g., "02 Sep 2026")
 */
export const formatDate = (date) => {
  const d = new Date(date);
  const options = { day: "2-digit", month: "short", year: "numeric" };
  return d.toLocaleDateString("en-IN", options);
};

/**
 * Format date and time
 * @param {Date | string} date - Date to format
 * @returns {string} Formatted date and time (e.g., "02 Sep 2026, 2:30 PM")
 */
export const formatDateTime = (date) => {
  const d = new Date(date);
  const options = {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  return d.toLocaleDateString("en-IN", options);
};

/**
 * Generate order number
 * @param {number} orderId - Database order ID
 * @returns {string} Formatted order number (e.g., "AR-2026-000001")
 */
export const generateOrderNumber = (orderId) => {
  const year = new Date().getFullYear();
  const paddedId = String(orderId).padStart(6, "0");
  return `AR-${year}-${paddedId}`;
};

/**
 * Calculate total price including discount
 * @param {number} subtotal - Order subtotal
 * @param {number} discount - Discount amount
 * @returns {number} Final total
 */
export const calculateFinalTotal = (subtotal, discount = 0) => {
  return Math.max(0, subtotal - discount);
};

/**
 * Validate structured address
 * @param {object} address - Address object
 * @returns {boolean} True if all required fields are present
 */
export const isValidAddress = (address) => {
  const requiredFields = [
    "houseNumber",
    "street",
    "area",
    "city",
    "district",
    "state",
    "pinCode",
  ];
  return requiredFields.every(
    (field) => address[field] && address[field].trim(),
  );
};

/**
 * Format full address for display
 * @param {object} address - Address object
 * @returns {string} Formatted address
 */
export const formatAddress = (address) => {
  const parts = [
    address.houseNumber,
    address.building,
    address.street,
    address.area,
    address.landmark && `(${address.landmark})`,
    address.city,
    address.district,
    address.state,
    address.pinCode,
    address.country,
  ].filter(Boolean);

  return parts.join(", ");
};
