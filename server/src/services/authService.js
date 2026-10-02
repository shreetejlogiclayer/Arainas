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
  isValidAadhaar,
  isValidPassword,
} from "../utils/validators.js";

export const prisma = new PrismaClient();
const ADDRESS_FIELDS = [
  "houseNumber",
  "building",
  "street",
  "area",
  "landmark",
  "village",
  "city",
  "district",
  "state",
  "pinCode",
];
const REQUIRED_ADDRESS_FIELDS = [
  "houseNumber",
  "street",
  "area",
  "city",
  "district",
  "state",
  "pinCode",
];
const ADDRESS_MAX_LENGTHS = {
  houseNumber: 100,
  building: 100,
  street: 255,
  area: 100,
  landmark: 100,
  village: 100,
  city: 100,
  district: 100,
  state: 100,
};

const normalizeAddress = (address) => {
  if (!address || typeof address !== "object" || Array.isArray(address)) {
    throw new Error("Complete your delivery address");
  }
  const normalized = {};
  for (const field of ADDRESS_FIELDS) {
    const value = address[field];
    if (value != null && typeof value !== "string") {
      throw new Error(`Enter a valid ${field}`);
    }
    normalized[field] = value?.trim() || null;
  }
  if (address.isDefault != null && typeof address.isDefault !== "boolean") {
    throw new Error("isDefault must be a boolean");
  }
  normalized.isDefault = address.isDefault === true;
  for (const field of REQUIRED_ADDRESS_FIELDS) {
    if (!normalized[field]) throw new Error(`${field} is required`);
  }
  for (const [field, maxLength] of Object.entries(ADDRESS_MAX_LENGTHS)) {
    if (normalized[field]?.length > maxLength) {
      throw new Error(`${field} must be ${maxLength} characters or fewer`);
    }
  }
  if (!/^\d{6}$/.test(normalized.pinCode)) {
    throw new Error("Enter a valid 6-digit PIN code");
  }
  return normalized;
};

/**
 * Register new user
 */
export const registerUser = async (email, mobile, password) => {
  // Normalize inputs
  const normalizedEmail = email?.trim() ? normalizeEmail(email) : null;
  const cleanedPhone = cleanPhone(mobile);

  // Validate inputs
  if (normalizedEmail && !isValidEmail(normalizedEmail)) {
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
      OR: [
        { mobile: cleanedPhone },
        ...(normalizedEmail ? [{ email: normalizedEmail }] : []),
      ],
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
export const loginUser = async (mobile, password) => {
  const cleanedPhone = cleanPhone(mobile);

  // Find user
  const user = await prisma.user.findUnique({
    where: { mobile: cleanedPhone },
    include: { profile: true, addresses: { where: { isDefault: true }, take: 1 } },
  });

  if (!user) {
    throw new Error("Invalid mobile number or password");
  }

  // Check if account is active
  if (user.status !== "active") {
    throw new Error("Account is not active");
  }

  // Verify password
  const isPasswordValid = await comparePassword(password, user.passwordHash);
  if (!isPasswordValid) {
    throw new Error("Invalid mobile number or password");
  }

  return {
    userId: user.id,
    email: user.email,
    mobile: user.mobile,
    emailVerified: user.emailVerified,
    mobileVerified: user.mobileVerified,
    profile: user.profile
      ? {
          fullName: user.profile.fullName,
          referralCode: user.profile.referralCode,
          address: user.addresses[0] || null,
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
    include: {
      profile: true,
      addresses: { orderBy: [{ isDefault: "desc" }, { createdAt: "asc" }] },
      aadhaarVerification: true,
      photos: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return {
    userId: user.id,
    email: user.email,
    mobile: user.mobile,
    role: user.role,
    emailVerified: user.emailVerified,
    mobileVerified: user.mobileVerified,
    status: user.status,
    createdAt: user.createdAt,
    profile: user.profile,
    addresses: user.addresses,
    address: user.addresses.find((address) => address.isDefault) || null,
    aadhaarVerification: user.aadhaarVerification
      ? {
          aadhaarLast4: user.aadhaarVerification.aadhaarLast4,
          verificationStatus: user.aadhaarVerification.verificationStatus,
          verifiedAt: user.aadhaarVerification.verifiedAt,
        }
      : null,
    photos: user.photos.map((photo) => ({
      id: photo.id,
      url: `/api/auth/profile/photos/${photo.id}`,
      verifiedAt: photo.verifiedAt,
      createdAt: photo.createdAt,
    })),
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
  const { fullName, alternateMobile, referredByCode, address } = profileData;
  if (typeof fullName !== "string") {
    throw new Error("Enter a valid full name (2 to 255 characters)");
  }

  const normalizedFullName = fullName.trim();
  if (normalizedFullName.length < 2 || normalizedFullName.length > 255) {
    throw new Error("Enter a valid full name (2 to 255 characters)");
  }

  if (
    alternateMobile != null &&
    typeof alternateMobile !== "string"
  ) {
    throw new Error("Enter a valid 10-digit Indian alternate mobile number");
  }

  if (referredByCode != null && typeof referredByCode !== "string") {
    throw new Error("Enter a valid referral code");
  }

  const normalizedAddress = normalizeAddress(address);

  const cleanedAlternateMobile = alternateMobile?.trim()
    ? cleanPhone(alternateMobile)
    : null;
  const normalizedReferralCode = referredByCode?.trim().toUpperCase() || null;

  if (
    cleanedAlternateMobile &&
    !isValidIndianPhone(cleanedAlternateMobile)
  ) {
    throw new Error("Enter a valid 10-digit Indian alternate mobile number");
  }

  if (normalizedReferralCode && normalizedReferralCode.length > 50) {
    throw new Error("Referral codes must be 50 characters or fewer");
  }

  const existingProfile = await prisma.profile.findUnique({
    where: { userId },
    select: { referredByCode: true },
  });
  if (
    existingProfile?.referredByCode &&
    normalizedReferralCode !== existingProfile.referredByCode
  ) {
    throw new Error("A referral code cannot be changed after it is saved");
  }

  let referrerUserId = null;
  if (normalizedReferralCode && !existingProfile?.referredByCode) {
    const referrer = await prisma.profile.findUnique({
      where: { referralCode: normalizedReferralCode },
      select: { userId: true },
    });

    if (!referrer) {
      throw new Error("Referral code was not found");
    }

    if (referrer.userId === userId) {
      throw new Error("You cannot use your own referral code");
    }
    referrerUserId = referrer.userId;
  }

  const profile = await prisma.$transaction(async (transaction) => {
    const updatedProfile = await transaction.profile.update({
      where: { userId },
      data: {
        fullName: normalizedFullName,
        alternateMobile: cleanedAlternateMobile,
        referredByCode: normalizedReferralCode,
      },
    });
    if (referrerUserId) {
      await transaction.referral.create({
        data: {
          referrerUserId,
          referredUserId: userId,
          referralCodeUsed: normalizedReferralCode,
          status: "completed",
          completedAt: new Date(),
        },
      });
    }
    const existingAddress = await transaction.address.findFirst({
      where: { userId },
      orderBy: [{ isDefault: "desc" }, { createdAt: "asc" }],
      select: { id: true },
    });
    const addressData = {
      ...normalizedAddress,
      country: "India",
      isDefault: true,
    };

    if (existingAddress) {
      await transaction.address.update({
        where: { id: existingAddress.id },
        data: addressData,
      });
    } else {
      await transaction.address.create({
        data: { ...addressData, userId },
      });
    }

    return updatedProfile;
  });

  return {
    ...profile,
    address: await prisma.address.findFirst({
      where: { userId, isDefault: true },
    }),
  };
};

export const createUserAddress = async (userId, address) => {
  const data = normalizeAddress(address);
  return prisma.$transaction(async (transaction) => {
    const count = await transaction.address.count({ where: { userId } });
    if (data.isDefault) {
      await transaction.address.updateMany({
        where: { userId },
        data: { isDefault: false },
      });
    }
    return transaction.address.create({
      data: {
        ...data,
        country: "India",
        userId,
        isDefault: data.isDefault || count === 0,
      },
    });
  });
};

export const updateUserAddress = async (userId, addressId, address) => {
  const data = normalizeAddress(address);
  return prisma.$transaction(async (transaction) => {
    const existing = await transaction.address.findFirst({
      where: { id: addressId, userId },
      select: { id: true, isDefault: true },
    });
    if (!existing) throw new Error("Address not found");
    if (data.isDefault) {
      await transaction.address.updateMany({
        where: { userId },
        data: { isDefault: false },
      });
    }
    return transaction.address.update({
      where: { id: existing.id },
      data: {
        ...data,
        country: "India",
        isDefault: data.isDefault || existing.isDefault,
      },
    });
  });
};

export const setDefaultUserAddress = async (userId, addressId) =>
  prisma.$transaction(async (transaction) => {
    const address = await transaction.address.findFirst({
      where: { id: addressId, userId },
      select: { id: true },
    });
    if (!address) throw new Error("Address not found");
    await transaction.address.updateMany({
      where: { userId },
      data: { isDefault: false },
    });
    return transaction.address.update({
      where: { id: address.id },
      data: { isDefault: true },
    });
  });

export const deleteUserAddress = async (userId, addressId) =>
  prisma.$transaction(async (transaction) => {
    const address = await transaction.address.findFirst({
      where: { id: addressId, userId },
      select: { id: true, isDefault: true },
    });
    if (!address) throw new Error("Address not found");
    await transaction.address.delete({ where: { id: address.id } });
    if (address.isDefault) {
      const replacement = await transaction.address.findFirst({
        where: { userId },
        orderBy: { createdAt: "asc" },
        select: { id: true },
      });
      if (replacement) {
        await transaction.address.update({
          where: { id: replacement.id },
          data: { isDefault: true },
        });
      }
    }
  });

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

  const referrals = await prisma.referral.findMany({
    where: {
      referrerUserId: userId,
    },
    include: {
      referred: { select: { profile: { select: { fullName: true } } } },
    },
    orderBy: { createdAt: "desc" },
  });

  const receivedReferral = await prisma.referral.findFirst({
    where: { referredUserId: userId },
    select: { referralCodeUsed: true, status: true, createdAt: true },
  });

  const coupons = await prisma.coupon.findMany({
    where: {
      userId,
      status: "available",
    },
  });

  const completedReferrals = referrals.filter(
    (referral) => referral.status === "completed",
  ).length;
  const referralsRequiredForCoupon = 5;
  const referralsToNextCoupon = Math.max(
    0,
    referralsRequiredForCoupon - (completedReferrals % referralsRequiredForCoupon),
  );

  return {
    referralCode: profile.referralCode,
    totalReferrals: referrals.length,
    completedReferrals,
    referralsToNextCoupon,
    availableCoupons: coupons.length,
    receivedReferral,
    referrals: referrals.map((referral) => ({
      id: referral.id,
      name: referral.referred.profile?.fullName || "Araina member",
      status: referral.status,
      createdAt: referral.createdAt,
      completedAt: referral.completedAt,
    })),
  };
};

const pendingAadhaarOtps = new Map();

export const requestAadhaarOtp = async (userId, aadhaar) => {
  if (
    process.env.NODE_ENV === "production" ||
    process.env.AADHAAR_PROVIDER !== "mock"
  ) {
    throw new Error(
      "Aadhaar verification is unavailable until an authorized production provider is configured",
    );
  }
  if (typeof aadhaar !== "string" || !isValidAadhaar(aadhaar.replace(/\D/g, ""))) {
    throw new Error("Enter a valid 12-digit Aadhaar number");
  }

  const digits = aadhaar.replace(/\D/g, "");
  const requestedAt = new Date();
  const otp = "123456";
  const existingRequest = pendingAadhaarOtps.get(userId);
  if (existingRequest && Date.now() - existingRequest.requestedAt < 60_000) {
    throw new Error("Please wait one minute before requesting another OTP");
  }
  pendingAadhaarOtps.set(userId, {
    otp,
    requestedAt: Date.now(),
    expiresAt: Date.now() + 5 * 60 * 1000,
    attempts: 0,
  });

  await prisma.$transaction([
    prisma.aadhaarVerification.upsert({
      where: { userId },
      create: {
        userId,
        aadhaarLast4: digits.slice(-4),
        verificationStatus: "otp_sent",
        otpRequestedAt: requestedAt,
      },
      update: {
        aadhaarLast4: digits.slice(-4),
        verificationStatus: "otp_sent",
        otpRequestedAt: requestedAt,
        verifiedAt: null,
      },
    }),
    prisma.profile.update({
      where: { userId },
      data: { aadhaarVerificationStatus: "pending" },
    }),
  ]);

  return {
    aadhaarLast4: digits.slice(-4),
    expiresInSeconds: 300,
    ...(process.env.NODE_ENV !== "production" && { developmentOtp: otp }),
  };
};

export const verifyAadhaarOtp = async (userId, otp) => {
  if (
    process.env.NODE_ENV === "production" ||
    process.env.AADHAAR_PROVIDER !== "mock"
  ) {
    throw new Error(
      "Aadhaar verification is unavailable until an authorized production provider is configured",
    );
  }
  const pending = pendingAadhaarOtps.get(userId);
  if (!pending || pending.expiresAt <= Date.now()) {
    pendingAadhaarOtps.delete(userId);
    throw new Error("Request a new Aadhaar OTP and try again");
  }
  if (typeof otp !== "string" || !/^\d{6}$/.test(otp)) {
    throw new Error("Enter the 6-digit OTP");
  }
  pending.attempts += 1;
  if (pending.attempts > 5) {
    pendingAadhaarOtps.delete(userId);
    throw new Error("Too many attempts. Request a new OTP");
  }
  if (otp !== pending.otp) {
    throw new Error("The OTP is incorrect");
  }

  const verifiedAt = new Date();
  const verification = await prisma.$transaction(async (transaction) => {
    const result = await transaction.aadhaarVerification.update({
      where: { userId },
      data: { verificationStatus: "verified", verifiedAt },
      select: {
        aadhaarLast4: true,
        verificationStatus: true,
        verifiedAt: true,
      },
    });
    await transaction.profile.update({
      where: { userId },
      data: { aadhaarVerificationStatus: "verified" },
    });
    return result;
  });

  pendingAadhaarOtps.delete(userId);
  return verification;
};
