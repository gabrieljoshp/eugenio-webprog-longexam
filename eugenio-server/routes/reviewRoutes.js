const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorizationMiddleware");

const {
  getReviews,
  getReviewById,
  createReview,
  updateReview,
  deleteReview,
} = require("../controllers/reviewController");

// Public routes - anyone can view reviews
router.get("/", getReviews);
router.get("/:id", getReviewById);

// Protected routes - authenticated users can create reviews
router.post("/", authMiddleware, createReview);

// Protected routes - admin or review owner can update/delete (ownership check in controller)
router.put("/:id", authMiddleware, updateReview);
router.delete("/:id", authMiddleware, deleteReview);

module.exports = router;
