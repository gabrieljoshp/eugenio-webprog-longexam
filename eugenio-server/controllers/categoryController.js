const Category = require("../models/categoryModel");
const { HttpStatus } = require("../config/constants");
const { successResponse, errorResponse } = require("../config/response");

const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({});
    return successResponse(res, { message: "Categories retrieved successfully.", count: categories.length, data: categories });
  } catch (error) {
    return errorResponse(res, { status: HttpStatus.INTERNAL_SERVER_ERROR, message: error.message });
  }
};

const createCategory = async (req, res) => {
  try {
    const category = await Category.create(req.body);
    return successResponse(res, { status: HttpStatus.CREATED, message: "Category created successfully.", data: category });
  } catch (error) {
    return errorResponse(res, { status: HttpStatus.BAD_REQUEST, message: error.message });
  }
};

const updateCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!category) {
      return errorResponse(res, { status: HttpStatus.NOT_FOUND, message: "Category not found" });
    }

    return successResponse(res, { message: "Category updated successfully.", data: category });
  } catch (error) {
    return errorResponse(res, { status: HttpStatus.BAD_REQUEST, message: error.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) {
      return errorResponse(res, { status: HttpStatus.NOT_FOUND, message: "Category not found" });
    }

    return successResponse(res, { message: "Category deleted successfully.", data: category });
  } catch (error) {
    return errorResponse(res, { status: HttpStatus.INTERNAL_SERVER_ERROR, message: error.message });
  }
};

const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return errorResponse(res, { status: HttpStatus.NOT_FOUND, message: "Category not found" });
    return successResponse(res, { message: "Category retrieved successfully.", data: category });
  } catch (error) {
    return errorResponse(res, { status: HttpStatus.BAD_REQUEST, message: "Invalid category id.", error: error.message });
  }
};

module.exports = { getCategories, getCategoryById, createCategory, updateCategory, deleteCategory };
