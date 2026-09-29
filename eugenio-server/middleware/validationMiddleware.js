const { HttpStatus } = require("../config/constants");
const { errorResponse } = require("../config/response");

/**
 * Validation Middleware Factory
 * Creates middleware for request body validation with field-level error messages
 */

// Email validation regex
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password validation - min 8 chars, at least 1 uppercase, 1 number, 1 special char
const isValidPassword = (password) => {
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
  return passwordRegex.test(password);
};

// Contact number validation (Philippine format: 09XXXXXXXXX or +639XXXXXXXXX)
const isValidContactNumber = (phone) => {
  const phoneRegex = /^(09\d{9}|\+639\d{9})$/;
  return phoneRegex.test(phone);
};

/**
 * User validation helper
 */
const validateUserData = (data, isUpdate = false) => {
  const errors = {};

  if (!isUpdate || data.firstName !== undefined) {
    if (!data.firstName) {
      errors.firstName = "First name is required";
    } else if (data.firstName.length < 2) {
      errors.firstName = "First name must be at least 2 characters";
    } else if (data.firstName.length > 50) {
      errors.firstName = "First name must not exceed 50 characters";
    }
  }

  if (!isUpdate || data.username !== undefined) {
    if (!data.username) {
      errors.username = "Username is required";
    } else if (typeof data.username !== "string" || data.username.trim().length < 3) {
      errors.username = "Username must be at least 3 characters";
    }
  }

  if (!isUpdate || data.lastName !== undefined) {
    if (!data.lastName) {
      errors.lastName = "Last name is required";
    } else if (data.lastName.length < 2) {
      errors.lastName = "Last name must be at least 2 characters";
    } else if (data.lastName.length > 50) {
      errors.lastName = "Last name must not exceed 50 characters";
    }
  }

  if (!isUpdate || data.email !== undefined) {
    if (!data.email) {
      errors.email = "Email is required";
    } else if (!isValidEmail(data.email)) {
      errors.email = "Please enter a valid email address";
    }
  }

  if (!isUpdate || data.password !== undefined) {
    if (data.password) {
      if (!isValidPassword(data.password)) {
        errors.password = "Password must be at least 8 characters with uppercase, number, and special character";
      }
    } else if (!isUpdate) {
      errors.password = "Password is required";
    }
  }

  if (!isUpdate || data.contactNumber !== undefined) {
    if (data.contactNumber && !isValidContactNumber(data.contactNumber)) {
      errors.contactNumber = "Contact number must be in format 09XXXXXXXXX or +639XXXXXXXXX";
    }
  }

  if (!isUpdate || data.address !== undefined) {
    if (!data.address) {
      errors.address = "Address is required";
    } else if (data.address.length < 5) {
      errors.address = "Address must be at least 5 characters";
    }
  }

  if (!isUpdate || data.role !== undefined) {
    const validRoles = ["admin", "seller", "customer"];
    if (data.role && !validRoles.includes(data.role)) {
      errors.role = `Role must be one of: ${validRoles.join(", ")}`;
    }
  }

  return errors;
};

/**
 * Product validation helper
 */
const validateProductData = (data, isUpdate = false) => {
  const errors = {};

  if (!isUpdate || data.productName !== undefined) {
    if (!data.productName) {
      errors.productName = "Product name is required";
    } else if (data.productName.length < 3) {
      errors.productName = "Product name must be at least 3 characters";
    } else if (data.productName.length > 100) {
      errors.productName = "Product name must not exceed 100 characters";
    }
  }

  if (!isUpdate || data.description !== undefined) {
    if (!data.description) {
      errors.description = "Description is required";
    } else if (data.description.length < 10) {
      errors.description = "Description must be at least 10 characters";
    }
  }

  if (!isUpdate || data.price !== undefined) {
    if (data.price === undefined || data.price === null) {
      errors.price = "Price is required";
    } else if (typeof data.price !== "number" || data.price <= 0) {
      errors.price = "Price must be a positive number";
    }
  }

  if (!isUpdate || data.compareAtPrice !== undefined) {
    if (data.compareAtPrice !== undefined && data.compareAtPrice !== null) {
      if (typeof data.compareAtPrice !== "number") {
        errors.compareAtPrice = "Compare at price must be a number";
      } else if (data.compareAtPrice < data.price) {
        errors.compareAtPrice = "Compare at price must be greater than or equal to price";
      }
    }
  }

  if (!isUpdate || data.stock !== undefined) {
    if (data.stock === undefined || data.stock === null) {
      errors.stock = "Stock is required";
    } else if (!Number.isInteger(data.stock) || data.stock < 0) {
      errors.stock = "Stock must be a non-negative whole number";
    }
  }

  if (!isUpdate || data.images !== undefined) {
    if (!isUpdate && (!data.images || !Array.isArray(data.images) || data.images.length === 0)) {
      errors.images = "At least one product image is required";
    }
  }

  if (!isUpdate || data.rating !== undefined) {
    if (data.rating !== undefined && data.rating !== null) {
      if (typeof data.rating !== "number" || data.rating < 0 || data.rating > 5) {
        errors.rating = "Rating must be between 0 and 5";
      }
    }
  }

  return errors;
};

/**
 * Review validation helper
 */
const validateReviewData = (data, isUpdate = false) => {
  const errors = {};

  if (!isUpdate || data.rating !== undefined) {
    if (data.rating === undefined || data.rating === null) {
      errors.rating = "Rating is required";
    } else if (!Number.isInteger(data.rating) || data.rating < 1 || data.rating > 5) {
      errors.rating = "Rating must be an integer between 1 and 5";
    }
  }

  if (!isUpdate || data.title !== undefined) {
    if (!data.title) {
      errors.title = "Review title is required";
    } else if (data.title.length < 3) {
      errors.title = "Title must be at least 3 characters";
    }
  }

  if (!isUpdate || data.comment !== undefined) {
    if (!data.comment) {
      errors.comment = "Review comment is required";
    } else if (data.comment.length < 5) {
      errors.comment = "Comment must be at least 5 characters";
    } else if (data.comment.length > 500) {
      errors.comment = "Comment must not exceed 500 characters";
    }
  }

  return errors;
};

/**
 * Order validation helper
 */
const validateOrderData = (data, isUpdate = false) => {
  const errors = {};

  if (!isUpdate || data.shippingAddress !== undefined) {
    if (!data.shippingAddress) {
      errors.shippingAddress = "Shipping address is required";
    } else if (data.shippingAddress.length < 5) {
      errors.shippingAddress = "Shipping address must be at least 5 characters";
    }
  }

  if (!isUpdate || data.paymentMethod !== undefined) {
    const validPaymentMethods = ["gcash", "card", "cash", "paymaya"];
    if (!data.paymentMethod) {
      errors.paymentMethod = "Payment method is required";
    } else if (!validPaymentMethods.includes(data.paymentMethod)) {
      errors.paymentMethod = `Payment method must be one of: ${validPaymentMethods.join(", ")}`;
    }
  }

  if (!isUpdate || data.status !== undefined) {
    const validStatuses = ["pending", "processing", "shipped", "delivered", "cancelled"];
    if (data.status && !validStatuses.includes(data.status)) {
      errors.status = `Status must be one of: ${validStatuses.join(", ")}`;
    }
  }

  return errors;
};

/**
 * Middleware to handle validation errors and return formatted response
 */
const handleValidationErrors = (errors, res) => {
  if (Object.keys(errors).length > 0) {
    return errorResponse(res, {
      status: HttpStatus.BAD_REQUEST,
      message: "Validation failed",
      error: errors,
    });
  }
  return null;
};

const userRegistrationValidation = (req, res, next) => {
  const errors = validateUserData(req.body);
  return handleValidationErrors(errors, res) || next();
};

const userUpdateValidation = (req, res, next) => {
  const errors = validateUserData(req.body, true);
  return handleValidationErrors(errors, res) || next();
};

const loginValidation = (req, res, next) => {
  const errors = {};
  if (!isValidEmail(req.body?.email || "")) errors.email = "Please enter a valid email address";
  if (typeof req.body?.password !== "string" || !req.body.password) errors.password = "Password is required";
  return handleValidationErrors(errors, res) || next();
};

module.exports = {
  validateUserData,
  validateProductData,
  validateReviewData,
  validateOrderData,
  handleValidationErrors,
  isValidEmail,
  isValidPassword,
  isValidContactNumber,
  userRegistrationValidation,
  userUpdateValidation,
  loginValidation,
};
