import express from "express";
import { generateAccessToken, generateRefreshToken } from "../utils/crypto.js";
import { sessionAuthMiddleware } from "../middleware/auth.js";
import * as authService from "../services/authService.js";
import {
  deleteProfilePhoto,
  getProfilePhoto,
  saveProfilePhoto,
} from "../services/profileMediaService.js";

const router = express.Router();

/**
 * POST /api/auth/register
 * Register a new user
 */
router.post("/register", async (req, res) => {
  try {
    const { email, mobile, password, confirmPassword } = req.body;

    // Validate required fields
    if (!mobile || !password || !confirmPassword) {
      return res.status(400).json({
        error: {
          status: 400,
          message:
            "Missing required fields: mobile, password, confirmPassword",
        },
      });
    }

    // Validate password match
    if (password !== confirmPassword) {
      return res.status(400).json({
        error: {
          status: 400,
          message: "Passwords do not match",
        },
      });
    }

    // Register user
    const user = await authService.registerUser(email, mobile, password);

    // Create session
    req.session.userId = user.userId;
    req.session.userEmail = user.email;
    req.session.userMobile = user.mobile;

    res.status(201).json({
      success: true,
      message: "Account created successfully",
      data: {
        userId: user.userId,
        email: user.email,
      },
    });
  } catch (error) {
    const statusCode = error.message.includes("already registered") ? 409 : 400;
    res.status(statusCode).json({
      error: {
        status: statusCode,
        message: error.message,
      },
    });
  }
});

/**
 * POST /api/auth/login
 * Login user
 */
router.post("/login", async (req, res) => {
  try {
    const { mobile, password, rememberMe } = req.body;

    if (!mobile || !password) {
      return res.status(400).json({
        error: {
          status: 400,
          message: "Missing mobile number or password",
        },
      });
    }

    // Login user
    const user = await authService.loginUser(mobile, password);

    // Create session
    req.session.userId = user.userId;
    req.session.userEmail = user.email;
    req.session.userMobile = user.mobile;

    // Set session expiry based on rememberMe
    if (rememberMe) {
      req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000; // 30 days
    }

    res.json({
      success: true,
      message: "Login successful",
      data: {
        userId: user.userId,
        email: user.email,
        profile: user.profile,
      },
    });
  } catch (error) {
    res.status(401).json({
      error: {
        status: 401,
        message: error.message || "Invalid credentials",
      },
    });
  }
});

/**
 * POST /api/auth/logout
 * Logout user
 */
router.post("/logout", sessionAuthMiddleware, (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({
        error: {
          status: 500,
          message: "Error logging out",
        },
      });
    }

    res.json({
      success: true,
      message: "Logged out successfully",
    });
  });
});

/**
 * POST /api/auth/forgot-password
 * Request password reset
 */
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        error: {
          status: 400,
          message: "Email is required",
        },
      });
    }

    const result = await authService.initiatePasswordReset(email);

    // Note: In production, send email with reset link
    // For now, return token for development
    res.json({
      success: true,
      message: "Password reset email sent",
      data: {
        email: result.email,
        // Token should NOT be returned in production
        // Only included here for development testing
        ...(process.env.NODE_ENV === "development" && {
          resetToken: result.token,
        }),
      },
    });
  } catch (error) {
    res.status(400).json({
      error: {
        status: 400,
        message: error.message,
      },
    });
  }
});

/**
 * POST /api/auth/reset-password
 * Reset password with token
 */
router.post("/reset-password", async (req, res) => {
  try {
    const { token, newPassword, confirmPassword } = req.body;

    if (!token || !newPassword || !confirmPassword) {
      return res.status(400).json({
        error: {
          status: 400,
          message: "Missing required fields",
        },
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        error: {
          status: 400,
          message: "Passwords do not match",
        },
      });
    }

    const result = await authService.resetPassword(token, newPassword);

    res.json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    res.status(400).json({
      error: {
        status: 400,
        message: error.message,
      },
    });
  }
});

/**
 * GET /api/auth/me
 * Get current authenticated user
 */
router.get("/me", sessionAuthMiddleware, async (req, res) => {
  try {
    const user = await authService.getUserById(req.userId);

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(404).json({
      error: {
        status: 404,
        message: error.message,
      },
    });
  }
});

/**
 * PUT /api/auth/profile
 * Update user profile
 */
router.put("/profile", sessionAuthMiddleware, async (req, res) => {
  try {
    const { fullName, alternateMobile, referredByCode, address } = req.body;

    const profile = await authService.updateUserProfile(req.userId, {
      fullName,
      alternateMobile,
      referredByCode,
      address,
    });

    res.json({
      success: true,
      message: "Profile updated",
      data: profile,
    });
  } catch (error) {
    res.status(400).json({
      error: {
        status: 400,
        message: error.message,
      },
    });
  }
});

router.post("/addresses", sessionAuthMiddleware, async (req, res) => {
  try {
    const address = await authService.createUserAddress(
      req.userId,
      req.body.address,
    );
    res.status(201).json({ success: true, data: address });
  } catch (error) {
    res.status(400).json({ error: { status: 400, message: error.message } });
  }
});

router.put("/addresses/:addressId", sessionAuthMiddleware, async (req, res) => {
  try {
    const address = await authService.updateUserAddress(
      req.userId,
      req.params.addressId,
      req.body.address,
    );
    res.json({ success: true, data: address });
  } catch (error) {
    res.status(400).json({ error: { status: 400, message: error.message } });
  }
});

router.patch(
  "/addresses/:addressId/default",
  sessionAuthMiddleware,
  async (req, res) => {
    try {
      const address = await authService.setDefaultUserAddress(
        req.userId,
        req.params.addressId,
      );
      res.json({ success: true, data: address });
    } catch (error) {
      res.status(400).json({ error: { status: 400, message: error.message } });
    }
  },
);

router.delete(
  "/addresses/:addressId",
  sessionAuthMiddleware,
  async (req, res) => {
    try {
      await authService.deleteUserAddress(req.userId, req.params.addressId);
      res.json({ success: true, message: "Address deleted" });
    } catch (error) {
      res.status(400).json({ error: { status: 400, message: error.message } });
    }
  },
);

router.post(
  "/profile/photo",
  sessionAuthMiddleware,
  express.raw({
    type: ["image/jpeg", "image/png", "image/webp"],
    limit: "3mb",
  }),
  async (req, res) => {
    try {
      const photo = await saveProfilePhoto(
        req.userId,
        req.headers["content-type"]?.split(";")[0],
        req.body,
      );
      res.status(201).json({ success: true, data: photo });
    } catch (error) {
      res.status(400).json({ error: { status: 400, message: error.message } });
    }
  },
);

router.get(
  "/profile/photos/:photoId",
  sessionAuthMiddleware,
  async (req, res, next) => {
    try {
      const photo = await getProfilePhoto(req.userId, req.params.photoId);
      if (!photo) {
        return res.status(404).json({
          error: { status: 404, message: "Profile photo not found" },
        });
      }
      res.set({
        "Cache-Control": "private, max-age=3600",
        "Content-Type": photo.contentType,
        "X-Content-Type-Options": "nosniff",
      });
      return res.sendFile(photo.path, (error) => {
        if (error && !res.headersSent) next(error);
      });
    } catch (error) {
      next(error);
    }
  },
);

router.delete(
  "/profile/photos/:photoId",
  sessionAuthMiddleware,
  async (req, res) => {
    try {
      await deleteProfilePhoto(req.userId, req.params.photoId);
      res.json({ success: true, message: "Profile photo deleted" });
    } catch (error) {
      res.status(400).json({ error: { status: 400, message: error.message } });
    }
  },
);

router.post(
  "/aadhaar/request-otp",
  sessionAuthMiddleware,
  async (req, res) => {
    try {
      const data = await authService.requestAadhaarOtp(
        req.userId,
        req.body.aadhaar,
      );
      res.json({ success: true, data });
    } catch (error) {
      const status = error.message.includes("unavailable") ? 503 : 400;
      res.status(status).json({ error: { status, message: error.message } });
    }
  },
);

router.post(
  "/aadhaar/verify-otp",
  sessionAuthMiddleware,
  async (req, res) => {
    try {
      const data = await authService.verifyAadhaarOtp(
        req.userId,
        req.body.otp,
      );
      res.json({ success: true, data });
    } catch (error) {
      const status = error.message.includes("unavailable") ? 503 : 400;
      res.status(status).json({ error: { status, message: error.message } });
    }
  },
);

/**
 * GET /api/auth/referrals
 * Get user's referral information
 */
router.get("/referrals", sessionAuthMiddleware, async (req, res) => {
  try {
    const referralInfo = await authService.getUserReferralInfo(req.userId);

    res.json({
      success: true,
      data: referralInfo,
    });
  } catch (error) {
    res.status(400).json({
      error: {
        status: 400,
        message: error.message,
      },
    });
  }
});

export default router;
