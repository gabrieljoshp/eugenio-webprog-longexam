const express = require("express");
// import functions
const {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  loginUser,
  logoutUser,
  refreshToken,
  getCurrentUser,
  updateCurrentUser,
} = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorizationMiddleware");
const { loginLimiter, loginLockout, trackLoginAttempt } = require("../middleware/rateLimiterMiddleware");
const { loginValidation, userRegistrationValidation, userUpdateValidation } = require("../middleware/validationMiddleware");

const router = express.Router();

// Public routes - no authentication required
// Login route must come before /:id route to avoid conflicts
router.post("/login", loginLimiter, loginValidation, loginLockout, trackLoginAttempt, loginUser);

// Signup route
router.post("/signup", userRegistrationValidation, createUser);

// Protected routes - require authentication
// Logout route
router.post("/logout", authMiddleware, logoutUser);

// Refresh token route
router.post("/refresh", authMiddleware, refreshToken);
router.get("/me", authMiddleware, getCurrentUser);
router.put("/me", authMiddleware, userUpdateValidation, updateCurrentUser);

// Admin-only routes
router.get("/", authMiddleware, authorize("admin"), getUsers);
router.get("/:id", authMiddleware, authorize("admin"), getUserById);
router.put("/:id", authMiddleware, authorize("admin"), userUpdateValidation, updateUser);
router.delete("/:id", authMiddleware, authorize("admin"), deleteUser);

module.exports = router;
