const User = require("../models/userModel");
const bcrypt = require("bcryptjs"); // For password hashing
const jwt = require("jsonwebtoken"); // For generating tokens
const { SECRET_KEY } = require("../config/config");
const { HttpStatus } = require("../config/constants");
const { successResponse, errorResponse } = require("../config/response");
const {
  validateUserData,
  handleValidationErrors,
} = require("../middleware/validationMiddleware");

const getUsers = async (req, res) => {
  try {
    const users = await User.find({}, "-password"); // Exclude the password field
    return successResponse(res, {
      message: "Users retrieved successfully.",
      count: users.length,
      data: users,
    });
  } catch (error) {
    return errorResponse(res, {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: error.message,
    });
  }
};

const createUser = async (req, res) => {
  try {
    // Validate input data
    const validationErrors = validateUserData(req.body);
    const validationErrorResponse = handleValidationErrors(
      validationErrors,
      res,
    );
    if (validationErrorResponse) return validationErrorResponse;

    // Check if user already exists
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return errorResponse(res, {
        status: HttpStatus.CONFLICT,
        message: "Email already registered",
        error: "An account with this email address already exists",
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // Create the user with the hashed password
    const user = await User.create({
      ...req.body,
      role: "customer",
      password: hashedPassword,
    });

    // Generate a JWT token so the user is logged in automatically after signup
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      SECRET_KEY,
      { expiresIn: "1h" },
    );

    // Set HTTP-only cookie with the token
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      sameSite: "strict",
      maxAge: 3600000, // 1 hour
    });

    return successResponse(res, {
      status: HttpStatus.CREATED,
      message: "User created successfully.",
      data: {
        user: {
          id: user._id,
          firstName: user.firstName,
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      // Handle duplicate key error
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

const updateUser = async (req, res) => {
  try {
    // Validate input data (update mode)
    const validationErrors = validateUserData(req.body, true);
    const validationErrorResponse = handleValidationErrors(
      validationErrors,
      res,
    );
    if (validationErrorResponse) return validationErrorResponse;

    // Check if the password is being updated
    if (req.body.password) {
      // Hash the new password
      req.body.password = await bcrypt.hash(req.body.password, 10);
    }

    // Update the user with the new data
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!user)
      return errorResponse(res, {
        status: HttpStatus.NOT_FOUND,
        message: "User not found",
      });
    user.password = undefined;
    return successResponse(res, {
      message: "User updated successfully.",
      data: user,
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

const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user)
      return errorResponse(res, {
        status: HttpStatus.NOT_FOUND,
        message: "User not found",
      });
    return successResponse(res, {
      message: "User deleted successfully.",
      data: user,
    });
  } catch (error) {
    return errorResponse(res, {
      status: HttpStatus.BAD_REQUEST,
      message: error.message,
    });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id, "-password");
    if (!user)
      return errorResponse(res, {
        status: HttpStatus.NOT_FOUND,
        message: "User not found",
      });
    return successResponse(res, {
      message: "User retrieved successfully.",
      data: user,
    });
  } catch (error) {
    return errorResponse(res, {
      status: HttpStatus.BAD_REQUEST,
      message: "Invalid user id.",
      error: error.message,
    });
  }
};

const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id, "-password");
    if (!user)
      return errorResponse(res, {
        status: HttpStatus.NOT_FOUND,
        message: "User not found",
      });
    return successResponse(res, {
      message: "Profile retrieved successfully.",
      data: user,
    });
  } catch (error) {
    return errorResponse(res, {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: error.message,
    });
  }
};

const updateCurrentUser = async (req, res) => {
  req.params.id = req.user.id;
  const allowedFields = [
    "firstName",
    "lastName",
    "contactNumber",
    "address",
    "password",
    "profileImage",
  ];
  req.body = Object.fromEntries(
    Object.entries(req.body).filter(([field]) => allowedFields.includes(field)),
  );
  return updateUser(req, res);
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email) {
      return errorResponse(res, {
        status: HttpStatus.BAD_REQUEST,
        message: "Validation failed",
        error: { email: "Email is required" },
      });
    }

    if (!password) {
      return errorResponse(res, {
        status: HttpStatus.BAD_REQUEST,
        message: "Validation failed",
        error: { password: "Password is required" },
      });
    }

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return errorResponse(res, {
        status: HttpStatus.UNAUTHORIZED,
        message: "Invalid credentials",
        error: "Email or password is incorrect",
      });
    }

    // Check if the user is active
    if (!user.isActive) {
      return errorResponse(res, {
        status: HttpStatus.FORBIDDEN,
        message: "Account disabled",
        error: "Your account is inactive. Please contact support.",
      });
    }

    // Compare the provided password with the hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return errorResponse(res, {
        status: HttpStatus.UNAUTHORIZED,
        message: "Invalid credentials",
        error: "Email or password is incorrect",
      });
    }

    // Enhancement 1: Viewers cannot log in
    if (user.role === "viewer") {
      return errorResponse(res, {
        status: HttpStatus.FORBIDDEN,
        message: "Access denied",
        error: "Viewers are not allowed to log in.",
      });
    }

    // Generate a JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role }, // Include role in the token
      SECRET_KEY,
      { expiresIn: "1h" },
    );

    // Set HTTP-only cookie with the token
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      sameSite: "strict",
      maxAge: 3600000, // 1 hour
    });

    return successResponse(res, {
      message: "Login successful",
      data: {
        user: {
          id: user._id,
          firstName: user.firstName,
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch (error) {
    return errorResponse(res, {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: error.message,
    });
  }
};

const logoutUser = async (req, res) => {
  try {
    // Clear the HTTP-only cookie
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return successResponse(res, {
      message: "Logout successful",
      data: {},
    });
  } catch (error) {
    return errorResponse(res, {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: error.message,
    });
  }
};

const refreshToken = async (req, res) => {
  try {
    // Get token from cookie or header
    const authorizationHeader = req.headers.authorization;
    const headerToken = authorizationHeader?.match(/^Bearer\s+(.+)$/i)?.[1];
    const token = req.cookies?.token || headerToken;

    if (!token) {
      return errorResponse(res, {
        status: HttpStatus.UNAUTHORIZED,
        message: "No token provided",
        error: "Token is required to refresh",
      });
    }

    // Verify the token (even if expired, we need to check its structure)
    let decoded;
    try {
      decoded = jwt.verify(token, SECRET_KEY);
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        // If expired, we can still decode to get the payload
        decoded = jwt.decode(token);
        if (!decoded) {
          return errorResponse(res, {
            status: HttpStatus.UNAUTHORIZED,
            message: "Invalid token",
            error: "Cannot refresh with invalid token",
          });
        }
      } else {
        return errorResponse(res, {
          status: HttpStatus.UNAUTHORIZED,
          message: "Invalid token",
          error: error.message,
        });
      }
    }

    // Find the user to ensure they still exist and are active
    const user = await User.findById(decoded.id);
    if (!user) {
      return errorResponse(res, {
        status: HttpStatus.NOT_FOUND,
        message: "User not found",
      });
    }

    if (!user.isActive) {
      return errorResponse(res, {
        status: HttpStatus.FORBIDDEN,
        message: "User account is inactive",
      });
    }

    // Generate a new token
    const newToken = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      SECRET_KEY,
      { expiresIn: "1h" },
    );

    // Set the new token in cookie
    res.cookie("token", newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3600000, // 1 hour
    });

    return successResponse(res, {
      message: "Token refreshed successfully",
      data: {
        user: {
          id: user._id,
          firstName: user.firstName,
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch (error) {
    return errorResponse(res, {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: error.message,
    });
  }
};

module.exports = {
  getUsers,
  getUserById,
  getCurrentUser,
  updateCurrentUser,
  createUser,
  updateUser,
  deleteUser,
  loginUser,
  logoutUser,
  refreshToken,
};
