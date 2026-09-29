const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorizationMiddleware");
const upload = require("../middleware/uploadImageMiddleware");
const { validateImageContent } = upload;

const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  uploadProductImage,
  deleteProduct,
} = require("../controllers/productController");

// Public routes - no authentication required
router.get("/", getProducts);
router.get("/:id", getProductById);

// Protected routes - admin/seller can create products
router.post(
  "/",
  authMiddleware,
  authorize("admin", "seller"),
  upload.single("image"),
  validateImageContent,
  createProduct,
);

// Protected routes - admin/seller can update/delete (with ownership check in controller)
router.put(
  "/:id",
  authMiddleware,
  authorize("admin", "seller"),
  upload.single("image"),
  validateImageContent,
  updateProduct,
);
router.post(
  "/:id/upload-image",
  authMiddleware,
  authorize("admin", "seller"),
  upload.single("image"),
  validateImageContent,
  uploadProductImage,
);
router.delete("/:id", authMiddleware, authorize("admin"), deleteProduct);

module.exports = router;
