const Review = require("../models/reviewModel");
const { HttpStatus } = require("../config/constants");
const { successResponse, errorResponse } = require("../config/response");

const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({}).populate("product").populate("user");
    return successResponse(res, {
      message: "Reviews retrieved successfully.",
      count: reviews.length,
      data: reviews,
    });
  } catch (error) {
    return errorResponse(res, {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: error.message,
    });
  }
};

const createReview = async (req, res) => {
  try {
    const review = await Review.create({ ...req.body, user: req.user.id });
    return successResponse(res, {
      status: HttpStatus.CREATED,
      message: "Review created successfully.",
      data: review,
    });
  } catch (error) {
    return errorResponse(res, {
      status: HttpStatus.BAD_REQUEST,
      message: error.message,
    });
  }
};

const updateReview = async (req, res) => {
  try {
    const existingReview = await Review.findById(req.params.id);
    if (!existingReview)
      return errorResponse(res, {
        status: HttpStatus.NOT_FOUND,
        message: "Review not found",
      });
    if (
      req.user.role !== "admin" &&
      String(existingReview.user) !== String(req.user.id)
    ) {
      return errorResponse(res, {
        status: HttpStatus.FORBIDDEN,
        message: "Forbidden",
      });
    }
    const review = await Review.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!review) {
      return errorResponse(res, {
        status: HttpStatus.NOT_FOUND,
        message: "Review not found",
      });
    }

    return successResponse(res, {
      message: "Review updated successfully.",
      data: review,
    });
  } catch (error) {
    return errorResponse(res, {
      status: HttpStatus.BAD_REQUEST,
      message: error.message,
    });
  }
};

const deleteReview = async (req, res) => {
  try {
    const existingReview = await Review.findById(req.params.id);
    if (!existingReview) {
      return errorResponse(res, {
        status: HttpStatus.NOT_FOUND,
        message: "Review not found",
      });
    }

    if (
      req.user.role !== "admin" &&
      String(existingReview.user) !== String(req.user.id)
    ) {
      return errorResponse(res, {
        status: HttpStatus.FORBIDDEN,
        message: "Forbidden",
      });
    }

    const review = await Review.findByIdAndDelete(req.params.id);

    return successResponse(res, {
      message: "Review deleted successfully.",
      data: review,
    });
  } catch (error) {
    return errorResponse(res, {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: error.message,
    });
  }
};

const getReviewById = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id)
      .populate("product")
      .populate("user");
    if (!review)
      return errorResponse(res, {
        status: HttpStatus.NOT_FOUND,
        message: "Review not found",
      });
    return successResponse(res, {
      message: "Review retrieved successfully.",
      data: review,
    });
  } catch (error) {
    return errorResponse(res, {
      status: HttpStatus.BAD_REQUEST,
      message: "Invalid review id.",
      error: error.message,
    });
  }
};

module.exports = {
  getReviews,
  getReviewById,
  createReview,
  updateReview,
  deleteReview,
};
