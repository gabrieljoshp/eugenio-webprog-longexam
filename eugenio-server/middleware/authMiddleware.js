const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config/config");
const { HttpStatus } = require("../config/constants");
const { errorResponse } = require("../config/response");

/**
 * Authentication Middleware
 * Verifies JWT token from cookies or Authorization header
 * Attaches decoded user data to req.user
 * Returns 401 if token is missing, invalid, or expired
 */
const authMiddleware = (req, res, next) => {
  try {
    // Get token from cookies first, then fall back to a Bearer authorization header.
    const authorizationHeader = req.headers.authorization;
    const headerToken = authorizationHeader?.match(/^Bearer\s+(.+)$/i)?.[1];
    const token = req.cookies?.token || headerToken;

    // Check if token exists
    if (!token) {
      return errorResponse(res, {
        status: HttpStatus.UNAUTHORIZED,
        message: "Unauthorized access",
        error: "Token missing. Please login again.",
      });
    }

    // Verify and decode the token
    const decoded = jwt.verify(token, SECRET_KEY);

    // Attach decoded user data to the request object
    req.user = decoded;

    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return errorResponse(res, {
        status: HttpStatus.UNAUTHORIZED,
        message: "Session expired",
        error: "Your token has expired. Please login again.",
      });
    }

    if (error.name === "JsonWebTokenError") {
      return errorResponse(res, {
        status: HttpStatus.UNAUTHORIZED,
        message: "Invalid token",
        error: "Your session is invalid. Please login again.",
      });
    }

    return errorResponse(res, {
      status: HttpStatus.UNAUTHORIZED,
      message: "Authentication failed",
      error: error.message,
    });
  }
};

module.exports = authMiddleware;
