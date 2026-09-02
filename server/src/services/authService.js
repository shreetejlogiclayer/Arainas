import { PrismaClient } from "@prisma/client";
import {
  hashPassword,
  comparePassword,
  generateRandomCode,
} from "../utils/crypto.js";
import {
  normalizeEmail,
  cleanPhone,
  isValidEmail,
  isValidIndianPhone,
  isValidPassword,
} from "../utils/validators.js";

const prisma = new PrismaClient();

/**
 * Register new user
 */
export const registerUser = async (email, mobile, password) => {
  // Normalize inputs
  const normalizedEmail = normalizeEmail(email);
  const cleanedPhone = cleanPhone(mobile);

  // Validate inputs
  if (!isValidEmail(normalizedEmail)) {
    throw new Error("Invalid email format");
  }

  if (!isValidIndianPhone(cleanedPhone)) {
    throw new Error("Invalid mobile number");
  }

  const passwordValidation = isValidPassword(password);
  if (!passwordValidation.isValid) {
    throw new Error("Password does not meet requirements");
  }

  // Check if user already exists
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ email: normalizedEmail }, { mobile: cleanedPhone }],
    },
  });

  if (existingUser) {
    throw new Error("Email or mobile number already registered");
  }

  // Hash password
  const passwordHash = await hashPassword(password);

  // Create user with profile
  const user = await prisma.user.create({
    data: {
      email: normalizedEmail,
      mobile: cleanedPhone,
      passwordHash,
      profile: {
        create: {
          fullName: "", // Will be set during profile creation
          referralCode: `ARAINA-${generateRandomCode(6)}`,
        },
      },
    },
    include: { profile: true },
  });

  return {
    userId: user.id,
    email: user.email,
    mobile: user.mobile,
    referralCode: user.profile.referralCode,
  };
};

/**
 * Login user
 */
export const loginUser = async (email, password) => {
  // Normalize inputs
  const normalizedEmail = normalizeEmail(email);

  // Find user
  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
    include: { profile: true },
  });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  // Check if account is active
  if (user.status !== "active") {
    throw new Error("Account is not active");
  }

  // Verify password
  const isPasswordValid = await comparePassword(password, user.passwordHash);
  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }

  return {
    userId: user.id,
    email: user.email,
    mobile: user.mobile,
    profile: user.profile
      ? {
          fullName: user.profile.fullName,
          referralCode: user.profile.referralCode,
        }
      : null,
  };
};

/**
 * Get user by ID
 */
export const getUserById = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { profile: true },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return {
    userId: user.id,
    email: user.email,
    mobile: user.mobile,
    profile: user.profile,
  };
};

/**
 * Initiate password reset
 */
export const initiatePasswordReset = async (email) => {
  const normalizedEmail = normalizeEmail(email);

  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
  });

  if (!user) {
    // Return success even if user doesn't exist (for security)
    return { email: normalizedEmail, tokenSent: true };
  }

  // Generate reset token
  const token = generateRandomCode(32);
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

  await prisma.passwordResetToken.create({
    data: {
      userId: user.id,
      token,
      expiresAt,
    },
  });

  return { email: normalizedEmail, token, tokenSent: true };
};

/**
 * Verify password reset token
 */
export const verifyResetToken = async (token) => {
  const resetToken = await prisma.passwordResetToken.findUnique({
    where: { token },
  });

  if (!resetToken) {
    throw new Error("Invalid or expired token");
  }

  if (resetToken.expiresAt < new Date()) {
    throw new Error("Token has expired");
  }

  return { userId: resetToken.userId, valid: true };
};

/**
 * Reset password with token
 */
export const resetPassword = async (token, newPassword) => {
  // Verify token
  const resetToken = await prisma.passwordResetToken.findUnique({
    where: { token },
  });

  if (!resetToken) {
    throw new Error("Invalid or expired token");
  }

  if (resetToken.expiresAt < new Date()) {
    throw new Error("Token has expired");
  }

  // Validate new password
  const passwordValidation = isValidPassword(newPassword);
  if (!passwordValidation.isValid) {
    throw new Error("Password does not meet requirements");
  }

  // Hash new password
  const passwordHash = await hashPassword(newPassword);

  // Update user password
  await prisma.user.update({
    where: { id: resetToken.userId },
    data: { passwordHash },
  });

  // Delete the reset token
  await prisma.passwordResetToken.delete({
    where: { id: resetToken.id },
  });

  return { success: true, message: "Password reset successfully" };
};

/**
 * Update user profile
 */
export const updateUserProfile = async (userId, profileData) => {
  const { fullName, alternateMobile, referredByCode } = profileData;

  const profile = await prisma.profile.update({
    where: { userId },
    data: {
      fullName: fullName || undefined,
      alternateMobile: alternateMobile || undefined,
      referredByCode: referredByCode || undefined,
    },
  });

  return profile;
};

/**
 * Get user's referral info
 */
export const getUserReferralInfo = async (userId) => {
  const profile = await prisma.profile.findUnique({
    where: { userId },
  });

  if (!profile) {
    throw new Error("User profile not found");
  }

  // Count successful referrals
  const referrals = await prisma.referral.findMany({
    where: {
      referrerUserId: userId,
      status: "completed",
    },
  });

  // Count available coupons
  const coupons = await prisma.coupon.findMany({
    where: {
      userId,
      status: "available",
    },
  });

  const referralsRequiredForCoupon = 5; // From config
  const referralsToNextCoupon = Math.max(
    0,
    referralsRequiredForCoupon -
      (referrals.length % referralsRequiredForCoupon),
  );

  return {
    referralCode: profile.referralCode,
    totalReferrals: referrals.length,
    completedReferrals: referrals.length,
    referralsToNextCoupon,
    availableCoupons: coupons.length,
  };
};
