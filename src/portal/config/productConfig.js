/**
 * ARAINA PRODUCT CONFIGURATION
 *
 * ========================================
 * HOW TO CHANGE PRODUCT INFORMATION:
 * ========================================
 *
 * 1. PRODUCT NAME & DETAILS:
 *    Edit productName and description below
 *
 * 2. BOX QUANTITIES & PRICING:
 *    Edit quantities array
 *    Format: { boxes: NUMBER, pricePerBox: PRICE_IN_RUPEES }
 *    Example: { boxes: 50, pricePerBox: 500 }
 *
 * Quantity pricing matches the current Mega Box rate card.
 * ========================================
 */

export const PRODUCT_CONFIG = {
  productId: "araina-pads-001",
  productName: "Araina Sanitary Pads",
  description: "Premium sanitary pads designed with women's health in focus",
  image: "/assets/product/araina-pads.jpg",

  // Box quantities and pricing
  // MODIFY THESE VALUES FOR YOUR PRICING STRUCTURE
  quantities: [
    {
      boxes: 1,
      mrp: 4400,
      discount: 1400,
      discountPercent: 31.82,
      executiveRate: 3000,
    },
    {
      boxes: 2,
      mrp: 8800,
      discount: 2900,
      discountPercent: 32.95,
      executiveRate: 5900,
    },
    {
      boxes: 3,
      mrp: 13200,
      discount: 4500,
      discountPercent: 34.09,
      executiveRate: 8700,
    },
    {
      boxes: 4,
      mrp: 17600,
      discount: 6200,
      discountPercent: 35.23,
      executiveRate: 11400,
    },
    {
      boxes: 5,
      mrp: 22000,
      discount: 8000,
      discountPercent: 36.36,
      executiveRate: 14000,
    },
  ],
};

/**
 * STORAGE CONFIGURATION
 * For uploading live photos and other user assets
 *
 * Currently: STORAGE_PROVIDER=none (no uploads)
 * Future: S3, Supabase, Cloudinary, etc.
 */
export const STORAGE_CONFIG = {
  provider: process.env.VITE_STORAGE_PROVIDER || "none", // none, s3, supabase, cloudinary
  bucket: process.env.VITE_STORAGE_BUCKET || "",
  region: process.env.VITE_STORAGE_REGION || "",
  publicUrl: process.env.VITE_STORAGE_PUBLIC_URL || "",
};

/**
 * PAYMENT CONFIGURATION
 * For processing user payments
 *
 * Currently: PAYMENT_PROVIDER=none (payments disabled)
 * Future: Razorpay, Cashfree, PhonePe, etc.
 */
export const PAYMENT_CONFIG = {
  provider: process.env.VITE_PAYMENT_PROVIDER || "none", // none, razorpay, cashfree, phonepe
  enabled:
    process.env.VITE_PAYMENT_PROVIDER !== "none" &&
    process.env.VITE_PAYMENT_PROVIDER !== undefined,
  // Current order status when payment is not configured
  defaultOrderStatus: "PENDING",
  defaultPaymentStatus: "NOT_CONFIGURED",
};

/**
 * AADHAAR VERIFICATION CONFIGURATION
 * For Aadhaar OTP verification
 *
 * Currently: AADHAAR_PROVIDER=mock (development mode)
 * Future: UIDAI authorized production provider
 */
export const AADHAAR_CONFIG = {
  provider: process.env.VITE_AADHAAR_PROVIDER || "mock", // mock, production
  isMockMode: process.env.VITE_AADHAAR_PROVIDER !== "production",
  mockOTP: "123456", // Development only - for testing
};
