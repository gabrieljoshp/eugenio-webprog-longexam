const Product = require("../models/productModel");
const Category = require("../models/categoryModel");
const User = require("../models/userModel");
const mongoose = require("mongoose");
const { HttpStatus } = require("../config/constants");
const { successResponse, errorResponse } = require("../config/response");
const cloudinary = require("../config/cloudinary");
const {
  validateProductData,
  handleValidationErrors,
} = require("../middleware/validationMiddleware");

const uploadImage = (buffer) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "bulldogs-exchange/products", resource_type: "image" },
      (error, result) => (error ? reject(error) : resolve(result)),
    );
    stream.end(buffer);
  });

const normalizeProductBody = (body) => {
  const normalized = { ...body };
  for (const field of [
    "price",
    "compareAtPrice",
    "stock",
    "rating",
    "reviewCount",
  ]) {
    if (normalized[field] !== undefined && normalized[field] !== "") {
      normalized[field] = Number(normalized[field]);
    }
  }
  for (const field of ["tags", "images", "imagePublicIds"]) {
    if (typeof normalized[field] === "string") {
      try {
        normalized[field] = JSON.parse(normalized[field]);
      } catch {
        normalized[field] = normalized[field]
          .split(",")
          .map((value) => value.trim())
          .filter(Boolean);
      }
    }
  }
  return normalized;
};

const addUploadedImage = async (body, file) => {
  if (!file) return body;
  const result = await uploadImage(file.buffer);
  body.images = [result.secure_url];
  body.imagePublicIds = [result.public_id];
  return body;
};

const getProducts = async (req, res) => {
  try {
    const page = Math.max(Number.parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(
      Math.max(Number.parseInt(req.query.limit, 10) || 10, 1),
      100,
    );
    const { category, search, seller, sort = "-createdAt" } = req.query;
    const filter = {};

    if (search) {
      const searchPattern = new RegExp(search.trim(), "i");
      filter.$or = [
        { productName: searchPattern },
        { description: searchPattern },
        { tags: searchPattern },
      ];
    }

    if (category) {
      const categoryConditions = [
        { slug: category.toLowerCase() },
        { name: new RegExp(`^${category}$`, "i") },
      ];
      if (mongoose.isValidObjectId(category)) {
        categoryConditions.unshift({ _id: category });
      }
      const categoryRecord = await Category.findOne({
        $or: categoryConditions,
      }).select("_id");
      if (!categoryRecord) {
        return successResponse(res, {
          message: "Products retrieved successfully.",
          count: 0,
          data: [],
          pagination: { page, limit, total: 0, totalPages: 0 },
        });
      }
      filter.category = categoryRecord._id;
    }

    if (seller) {
      const sellerConditions = [{ username: seller }, { email: seller }];
      if (mongoose.isValidObjectId(seller)) {
        sellerConditions.unshift({ _id: seller });
      }
      const sellerRecord = await User.findOne({
        $or: sellerConditions,
      }).select("_id");
      if (!sellerRecord) {
        return successResponse(res, {
          message: "Products retrieved successfully.",
          count: 0,
          data: [],
          pagination: { page, limit, total: 0, totalPages: 0 },
        });
      }
      filter.seller = sellerRecord._id;
    }

    const sortField = sort.replace(/^-/, "");
    const allowedSortFields = ["price", "productName", "createdAt", "stock"];
    if (!allowedSortFields.includes(sortField)) {
      return errorResponse(res, {
        status: HttpStatus.BAD_REQUEST,
        message: `Invalid sort field. Use: ${allowedSortFields.join(", ")}.`,
      });
    }

    const total = await Product.countDocuments(filter);
    const products = await Product.find(filter)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("category", "name slug")
      .populate("seller", "username email");

    return successResponse(res, {
      message: "Products retrieved successfully.",
      count: products.length,
      data: products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return errorResponse(res, {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: error.message,
    });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("category", "name slug")
      .populate("seller", "username email");
    if (!product) {
      return errorResponse(res, {
        status: HttpStatus.NOT_FOUND,
        message: "Product not found",
      });
    }
    return successResponse(res, {
      message: "Product retrieved successfully.",
      data: product,
    });
  } catch (error) {
    return errorResponse(res, {
      status: HttpStatus.BAD_REQUEST,
      message: "Invalid product id.",
      error: error.message,
    });
  }
};

const createProduct = async (req, res) => {
  try {
    const productData = await addUploadedImage(
      normalizeProductBody(req.body),
      req.file,
    );
    // Validate input data
    const validationErrors = validateProductData(productData);
    const validationErrorResponse = handleValidationErrors(
      validationErrors,
      res,
    );
    if (validationErrorResponse) return validationErrorResponse;

    // Verify category exists
    if (productData.category) {
      const category = await Category.findById(productData.category);
      if (!category) {
        return errorResponse(res, {
          status: HttpStatus.NOT_FOUND,
          message: "Category not found",
          error: "The specified category does not exist",
        });
      }
    }

    // If not admin, set seller to current user
    if (!productData.seller || req.user.role !== "admin")
      productData.seller = req.user.id;

    const newProduct = await Product.create(productData);
    return successResponse(res, {
      status: HttpStatus.CREATED,
      message: "Product created successfully.",
      data: newProduct,
    });
  } catch (error) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return errorResponse(res, {
        status: HttpStatus.CONFLICT,
        message: `${field} already exists`,
        error: error.message,
      });
    }
    return errorResponse(res, {
      status: HttpStatus.BAD_REQUEST,
      message: error.message,
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const existingProduct = await Product.findById(req.params.id);
    if (!existingProduct) {
      return errorResponse(res, {
        status: HttpStatus.NOT_FOUND,
        message: "Product not found",
      });
    }

    if (
      req.user.role !== "admin" &&
      String(existingProduct.seller) !== String(req.user.id)
    ) {
      return errorResponse(res, {
        status: HttpStatus.FORBIDDEN,
        message: "Forbidden",
        error: "You can only update products you own.",
      });
    }

    const productData = await addUploadedImage(
      normalizeProductBody(req.body),
      req.file,
    );
    if (req.user.role !== "admin") productData.seller = existingProduct.seller;
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      productData,
      { new: true, runValidators: true },
    );
    return successResponse(res, {
      message: "Product updated successfully.",
      data: updatedProduct,
    });
  } catch (error) {
    return errorResponse(res, {
      status:
        error.code === 11000 ? HttpStatus.CONFLICT : HttpStatus.BAD_REQUEST,
      message: error.message,
    });
  }
};

const uploadProductImage = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return errorResponse(res, {
        status: HttpStatus.NOT_FOUND,
        message: "Product not found",
      });
    }
    if (
      req.user.role !== "admin" &&
      String(product.seller) !== String(req.user.id)
    ) {
      return errorResponse(res, {
        status: HttpStatus.FORBIDDEN,
        message: "You can only update products you own.",
      });
    }
    if (!req.file) {
      return errorResponse(res, {
        status: HttpStatus.BAD_REQUEST,
        message: "An image file is required.",
      });
    }

    const productData = await addUploadedImage({}, req.file);
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      productData,
      { new: true, runValidators: true },
    );
    return successResponse(res, {
      message: "Product image uploaded successfully.",
      data: updatedProduct,
    });
  } catch (error) {
    return errorResponse(res, {
      status: HttpStatus.BAD_REQUEST,
      message: error.message,
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return errorResponse(res, {
        status: HttpStatus.NOT_FOUND,
        message: "Product not found",
      });
    }
    return successResponse(res, {
      message: "Product deleted successfully.",
      data: deletedProduct,
    });
  } catch (error) {
    return errorResponse(res, {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: error.message,
    });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  uploadProductImage,
  deleteProduct,
};
