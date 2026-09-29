const { HttpStatus } = require("../config/constants");
const { errorResponse } = require("../config/response");

/**
 * Authorization Middleware Factory
 * Creates middleware that checks if user role is in allowed roles
 * Must be used AFTER authMiddleware (which sets req.user)
 *
 * Usage: router.delete("/users/:id", authorize("admin"), deleteUserController)
 */
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      // Check if user exists (authMiddleware should have set it)
      if (!req.user) {
        return errorResponse(res, {
          status: HttpStatus.UNAUTHORIZED,
          message: "Unauthorized access",
          error: "User not authenticated",
        });
      }

      // Check if user role is in allowed roles
      if (!allowedRoles.includes(req.user.role)) {
        return errorResponse(res, {
          status: HttpStatus.FORBIDDEN,
          message: "Forbidden",
          error: `This action requires one of these roles: ${allowedRoles.join(", ")}. Your role: ${req.user.role}`,
        });
      }

      next();
    } catch (error) {
      return errorResponse(res, {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: "Authorization check failed",
        error: error.message,
      });
    }
  };
};

module.exports = authorize;
