const Cart = require("../models/cartModel");
const { HttpStatus } = require("../config/constants");
const { successResponse, errorResponse } = require("../config/response");

const getCarts = async (req, res) => {
  try {
    const filter = req.user.role === "admin" ? {} : { user: req.user.id };
    const carts = await Cart.find(filter).populate("user", "firstName lastName email").populate("items.product");
    return successResponse(res, { message: "Carts retrieved successfully.", count: carts.length, data: carts });
  } catch (error) {
    return errorResponse(res, { status: HttpStatus.INTERNAL_SERVER_ERROR, message: error.message });
  }
};

const createCart = async (req, res) => {
  try {
    const cart = await Cart.findOneAndUpdate(
      { user: req.user.id },
      { $set: { ...req.body, user: req.user.id } },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true },
    );
    return successResponse(res, { status: HttpStatus.CREATED, message: "Cart created successfully.", data: cart });
  } catch (error) {
    return errorResponse(res, { status: HttpStatus.BAD_REQUEST, message: error.message });
  }
};

const updateCart = async (req, res) => {
  try {
    const existingCart = await Cart.findOne({
      _id: req.params.id,
      ...(req.user.role === "admin" ? {} : { user: req.user.id }),
    });
    if (!existingCart) return errorResponse(res, { status: HttpStatus.NOT_FOUND, message: "Cart not found" });
    const cart = await Cart.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!cart) {
      return errorResponse(res, { status: HttpStatus.NOT_FOUND, message: "Cart not found" });
    }

    return successResponse(res, { message: "Cart updated successfully.", data: cart });
  } catch (error) {
    return errorResponse(res, { status: HttpStatus.BAD_REQUEST, message: error.message });
  }
};

const deleteCart = async (req, res) => {
  try {
    const cart = await Cart.findOneAndDelete({
      _id: req.params.id,
      ...(req.user.role === "admin" ? {} : { user: req.user.id }),
    });
    if (!cart) {
      return errorResponse(res, { status: HttpStatus.NOT_FOUND, message: "Cart not found" });
    }

    return successResponse(res, { message: "Cart deleted successfully.", data: cart });
  } catch (error) {
    return errorResponse(res, { status: HttpStatus.INTERNAL_SERVER_ERROR, message: error.message });
  }
};

const getCartById = async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.id).populate("user").populate("items.product");
    if (!cart) return errorResponse(res, { status: HttpStatus.NOT_FOUND, message: "Cart not found" });
    if (req.user.role !== "admin" && String(cart.user._id || cart.user) !== String(req.user.id)) {
      return errorResponse(res, { status: HttpStatus.FORBIDDEN, message: "Forbidden" });
    }
    return successResponse(res, { message: "Cart retrieved successfully.", data: cart });
  } catch (error) {
    return errorResponse(res, { status: HttpStatus.BAD_REQUEST, message: "Invalid cart id.", error: error.message });
  }
};

module.exports = { getCarts, getCartById, createCart, updateCart, deleteCart };
