/**
 * ARAINA PRODUCT CONFIGURATION
 *
 * ========================================
 * HOW TO CHANGE PRODUCT INFORMATION:
 * ========================================
 *
 * 1. PRODUCT NAME & DETAILS:
 *    Edit productName, description, sizes below
 *
 * 2. BOX QUANTITIES & PRICING:
 *    Edit quantities array
 *    Format: { boxes: NUMBER, pricePerBox: PRICE_IN_RUPEES }
 *    Example: { boxes: 50, pricePerBox: 500 }
 *
 * 3. PRODUCT SIZES:
 *    Edit sizes array if product has multiple sizes
 *
 * Example prices used here are DUMMY VALUES for development.
 * Update them to match your actual pricing structure.
 * ========================================
 */

export const PRODUCT_CONFIG = {
  productId: "araina-pads-001",
  productName: "Araina Sanitary Pads",
  description: "Premium sanitary pads designed with women's health in focus",
  image: "/assets/product/araina-pads.jpg",

  // Product sizes - modify as needed
  sizes: [
    {
      sizeId: "regular",
      sizeName: "Regular",
      description: "Standard length pads",
    },
    {
      sizeId: "extra-long",
      sizeName: "Extra Long",
      description: "Extra long for extra protection",
    },
  ],

  // Box quantities and pricing
  // MODIFY THESE VALUES FOR YOUR PRICING STRUCTURE
  quantities: [
    {
      boxes: 50,
      pricePerBox: 500,
      description: "Starter Pack",
    },
    {
      boxes: 100,
      pricePerBox: 300,
      description: "Popular Choice",
    },
    {
      boxes: 150,
      pricePerBox: 250,
      description: "Best Value",
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
