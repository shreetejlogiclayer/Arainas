/**
 * Custom error class for API errors
 */
export class ApiError extends Error {
  constructor(status, message, details = null) {
    super(message);
    this.status = status;
    this.details = details;
    this.name = "ApiError";
  }
}

/**
 * Create error response object
 */
export const createErrorResponse = (status, message, details = null) => {
  return {
    error: {
      status,
      message,
      ...(details && { details }),
    },
  };
};

/**
 * Create success response object
 */
export const createSuccessResponse = (data, message = "Success") => {
  return {
    success: true,
    message,
    data,
  };
};

/**
 * Common API errors
 */
export const Errors = {
  UNAUTHORIZED: new ApiError(401, "Unauthorized access"),
  FORBIDDEN: new ApiError(403, "Access forbidden"),
  NOT_FOUND: new ApiError(404, "Resource not found"),
  BAD_REQUEST: new ApiError(400, "Bad request"),
  CONFLICT: new ApiError(409, "Resource already exists"),
  UNPROCESSABLE_ENTITY: new ApiError(422, "Unprocessable entity"),
  INTERNAL_SERVER_ERROR: new ApiError(500, "Internal server error"),

  // Auth errors
  INVALID_CREDENTIALS: new ApiError(401, "Invalid email or password"),
  USER_ALREADY_EXISTS: new ApiError(409, "Email already registered"),
  USER_NOT_FOUND: new ApiError(404, "User not found"),
  INVALID_TOKEN: new ApiError(401, "Invalid or expired token"),
  SESSION_EXPIRED: new ApiError(401, "Session expired"),

  // Validation errors
  INVALID_EMAIL: new ApiError(400, "Invalid email format"),
  INVALID_PHONE: new ApiError(400, "Invalid phone number"),
  INVALID_PASSWORD: new ApiError(400, "Password does not meet requirements"),
  INVALID_AADHAAR: new ApiError(400, "Invalid Aadhaar number"),

  // Business logic errors
  REFERRAL_LIMIT_EXCEEDED: new ApiError(409, "Referral limit exceeded"),
  COUPON_NOT_AVAILABLE: new ApiError(400, "Coupon is not available"),
  COUPON_ALREADY_USED: new ApiError(409, "Coupon has already been used"),
  INSUFFICIENT_REFERRALS: new ApiError(
    400,
    "Insufficient referrals for coupon",
  ),
  ORDER_NOT_FOUND: new ApiError(404, "Order not found"),
  PROFILE_INCOMPLETE: new ApiError(400, "User profile is incomplete"),
};
