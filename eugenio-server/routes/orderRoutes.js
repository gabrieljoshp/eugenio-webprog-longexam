const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorizationMiddleware");

const { getOrders, getOrderById, createOrder, updateOrder, deleteOrder } = require("../controllers/orderController");

// Protected routes - authenticated users required
// Admin can see all orders, customers see only their own (handled in controller)
router.get("/", authMiddleware, getOrders);

// Authenticated users can create orders
router.post("/", authMiddleware, createOrder);

// Authenticated users can view/update their orders (ownership check in controller)
router.get("/:id", authMiddleware, getOrderById);
router.put("/:id", authMiddleware, updateOrder);

// Admin only can delete orders
router.delete("/:id", authMiddleware, authorize("admin"), deleteOrder);

module.exports = router;
