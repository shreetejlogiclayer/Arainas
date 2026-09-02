/**
 * ARAINA REFERRAL & COUPON CONFIGURATION
 *
 * ========================================
 * HOW TO CHANGE REFERRAL SETTINGS:
 * ========================================
 *
 * 1. REFERRALS REQUIRED FOR COUPON:
 *    Edit REFERRALS_REQUIRED_FOR_COUPON
 *    Default: 5 (user gets 1 coupon after 5 successful referrals)
 *
 * 2. COUPON DISCOUNT TYPE:
 *    Change between "flat" (₹100 off) or "percentage" (10% off)
 *
 * 3. COUPON DISCOUNT VALUE:
 *    Edit DISCOUNT_VALUE
 *    If type is "flat": value in rupees (e.g., 100)
 *    If type is "percentage": value in percent (e.g., 10)
 *
 * 4. COUPON EXPIRY (optional):
 *    Edit COUPON_EXPIRY_DAYS (0 = never expires)
 *
 * ========================================
 */

export const REFERRAL_CONFIG = {
  // After how many successful referrals does user get a coupon?
  referralsRequiredForCoupon: 5,

  // Description for UI display
  referralDescription:
    "Invite your friends to Araina and earn coupons. Get a coupon for every 5 successful referrals.",

  // Coupon earned after reaching the referral threshold
  couponRewardDescription:
    "Referral Reward Coupon - Earn this after every 5 successful referrals",
};

export const COUPON_CONFIG = {
  // Discount type: "flat" or "percentage"
  // "flat": Fixed amount off (e.g., ₹100 off)
  // "percentage": Percentage discount (e.g., 10% off)
  discountType: "flat", // or "percentage"

  // Discount value
  // If discountType is "flat": value in rupees (e.g., 100)
  // If discountType is "percentage": value in percent (e.g., 10)
  discountValue: 100,

  // Coupon expiry in days (0 = never expires)
  expiryDays: 0,

  // Minimum order amount to apply coupon (0 = no minimum)
  minimumOrderAmount: 0,

  // Maximum uses per coupon (0 = unlimited)
  maxUses: 1,
};

/**
 * Helper function to format coupon description for display
 */
export const formatCouponDescription = () => {
  const { discountType, discountValue } = COUPON_CONFIG;

  if (discountType === "percentage") {
    return `${discountValue}% OFF`;
  }
  return `₹${discountValue} OFF`;
};

/**
 * Helper function to calculate coupon discount amount
 */
export const calculateCouponDiscount = (subtotal) => {
  const { discountType, discountValue } = COUPON_CONFIG;

  if (discountType === "percentage") {
    return Math.round((subtotal * discountValue) / 100);
  }
  return discountValue;
};

/**
 * Helper function to format discount for display
 */
export const formatDiscountDisplay = (amount) => {
  return `₹${amount.toLocaleString("en-IN")}`;
};
