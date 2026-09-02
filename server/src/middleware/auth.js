import { verifyToken, extractTokenFromHeader } from "../utils/crypto.js";
import { Errors } from "../utils/errors.js";

/**
 * Middleware to verify JWT token from Authorization header
 */
export const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = extractTokenFromHeader(authHeader);

    if (!token) {
      return res.status(401).json({
        error: {
          status: 401,
          message: "Missing authorization token",
        },
      });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({
        error: {
          status: 401,
          message: "Invalid or expired token",
        },
      });
    }

    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(500).json({
      error: {
        status: 500,
        message: "Internal server error",
      },
    });
  }
};

/**
 * Middleware to extract user ID from session
 */
export const sessionAuthMiddleware = (req, res, next) => {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({
      error: {
        status: 401,
        message: "Session expired. Please log in again.",
      },
    });
  }

  req.userId = req.session.userId;
  next();
};

/**
 * Middleware for error handling
 */
export const errorHandler = (err, req, res, next) => {
  console.error("Error:", err);

  const status = err.status || 500;
  const message = err.message || "Internal Server Error";

  res.status(status).json({
    error: {
      status,
      message,
      ...(process.env.NODE_ENV === "development" && { details: err.stack }),
    },
  });
};

/**
 * Middleware to validate required fields
 */
export const validateFields = (requiredFields) => {
  return (req, res, next) => {
    const missing = [];
    for (const field of requiredFields) {
      if (!req.body[field]) {
        missing.push(field);
      }
    }

    if (missing.length > 0) {
      return res.status(400).json({
        error: {
          status: 400,
          message: "Missing required fields",
          missing,
        },
      });
    }

    next();
  };
};

/**
 * Middleware to rate limit requests
 */
export const rateLimit = (maxRequests, windowMs) => {
  const requests = {};

  return (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress;
    const now = Date.now();

    if (!requests[ip]) {
      requests[ip] = [];
    }

    // Remove old requests outside the window
    requests[ip] = requests[ip].filter((time) => now - time < windowMs);

    if (requests[ip].length >= maxRequests) {
      return res.status(429).json({
        error: {
          status: 429,
          message: "Too many requests. Please try again later.",
        },
      });
    }

    requests[ip].push(now);
    next();
  };
};
