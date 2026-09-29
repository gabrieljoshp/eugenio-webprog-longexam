const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorizationMiddleware");

const { getCarts, getCartById, createCart, updateCart, deleteCart } = require("../controllers/cartController");

// Protected routes - admin only can see all carts
router.get("/", authMiddleware, authorize("admin"), getCarts);

// Protected routes - authenticated users can create their own cart
router.post("/", authMiddleware, createCart);

// Protected routes - authenticated users can get/update/delete their own cart (ownership check in controller)
router.get("/:id", authMiddleware, getCartById);
router.put("/:id", authMiddleware, updateCart);
router.delete("/:id", authMiddleware, deleteCart);

module.exports = router;
