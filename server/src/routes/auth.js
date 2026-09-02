import express from "express";
import { generateAccessToken, generateRefreshToken } from "../utils/crypto.js";
import { authMiddleware } from "../middleware/auth.js";
import * as authService from "../services/authService.js";

const router = express.Router();

/**
 * POST /api/auth/register
 * Register a new user
 */
router.post("/register", async (req, res) => {
  try {
    const { email, mobile, password, confirmPassword } = req.body;

    // Validate required fields
    if (!email || !mobile || !password || !confirmPassword) {
      return res.status(400).json({
        error: {
          status: 400,
          message:
            "Missing required fields: email, mobile, password, confirmPassword",
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
    const { email, password, rememberMe } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: {
          status: 400,
          message: "Missing email or password",
        },
      });
    }

    // Login user
    const user = await authService.loginUser(email, password);

    // Create session
    req.session.userId = user.userId;
    req.session.userEmail = user.email;

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
router.post("/logout", authMiddleware, (req, res) => {
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
router.get("/me", authMiddleware, async (req, res) => {
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
router.put("/profile", authMiddleware, async (req, res) => {
  try {
    const { fullName, alternateMobile, referredByCode } = req.body;

    const profile = await authService.updateUserProfile(req.userId, {
      fullName,
      alternateMobile,
      referredByCode,
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

/**
 * GET /api/auth/referrals
 * Get user's referral information
 */
router.get("/referrals", authMiddleware, async (req, res) => {
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
