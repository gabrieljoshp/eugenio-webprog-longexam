const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorizationMiddleware");

const {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");

// Public routes - anyone can view categories
router.get("/", getCategories);
router.get("/:id", getCategoryById);

// Protected routes - admin only can create/update/delete categories
router.post("/", authMiddleware, authorize("admin"), createCategory);
router.put("/:id", authMiddleware, authorize("admin"), updateCategory);
router.delete("/:id", authMiddleware, authorize("admin"), deleteCategory);

module.exports = router;
