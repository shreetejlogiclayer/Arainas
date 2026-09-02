import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

/**
 * Hash password using bcrypt
 */
export const hashPassword = async (password) => {
  const salt = await bcryptjs.genSalt(10);
  return bcryptjs.hash(password, salt);
};

/**
 * Compare password with hash
 */
export const comparePassword = async (password, hash) => {
  return bcryptjs.compare(password, hash);
};

/**
 * Generate JWT access token
 */
export const generateAccessToken = (userId, expiresIn = "1h") => {
  return jwt.sign(
    { userId, type: "access" },
    process.env.JWT_SECRET || "your-jwt-secret",
    { expiresIn },
  );
};

/**
 * Generate JWT refresh token
 */
export const generateRefreshToken = (userId, expiresIn = "7d") => {
  return jwt.sign(
    { userId, type: "refresh" },
    process.env.JWT_SECRET || "your-jwt-secret",
    { expiresIn },
  );
};

/**
 * Verify JWT token
 */
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || "your-jwt-secret");
  } catch (error) {
    return null;
  }
};

/**
 * Extract token from Authorization header
 */
export const extractTokenFromHeader = (authHeader) => {
  if (!authHeader) return null;
  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") return null;
  return parts[1];
};

/**
 * Generate random code (for referral codes, reset tokens, etc.)
 */
export const generateRandomCode = (length = 10) => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

/**
 * Mask Aadhaar number (show only last 4 digits)
 */
export const maskAadhaar = (aadhaar) => {
  if (!aadhaar || aadhaar.length !== 12) return null;
  return aadhaar.slice(-4);
};

/**
 * Generate order number
 */
export const generateOrderNumber = (orderId) => {
  const year = new Date().getFullYear();
  const paddedId = String(orderId).padStart(6, "0");
  return `AR-${year}-${paddedId}`;
};

/**
 * Calculate coupon discount
 */
export const calculateCouponDiscount = (
  subtotal,
  discountType,
  discountValue,
) => {
  if (discountType === "percentage") {
    return Math.round((subtotal * discountValue) / 100);
  }
  return discountValue;
};
