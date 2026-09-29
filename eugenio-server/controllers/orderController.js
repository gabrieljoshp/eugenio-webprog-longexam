const Order = require("../models/orderModel");
const { HttpStatus } = require("../config/constants");
const { successResponse, errorResponse } = require("../config/response");

const getOrders = async (req, res) => {
  try {
    const filter = req.user.role === "admin" ? {} : { user: req.user.id };
    const orders = await Order.find(filter).populate("user", "firstName lastName email").populate("items.product");
    return successResponse(res, { message: "Orders retrieved successfully.", count: orders.length, data: orders });
  } catch (error) {
    return errorResponse(res, { status: HttpStatus.INTERNAL_SERVER_ERROR, message: error.message });
  }
};

const createOrder = async (req, res) => {
  try {
    const order = await Order.create({ ...req.body, user: req.user.id });
    return successResponse(res, { status: HttpStatus.CREATED, message: "Order created successfully.", data: order });
  } catch (error) {
    return errorResponse(res, { status: HttpStatus.BAD_REQUEST, message: error.message });
  }
};

const updateOrder = async (req, res) => {
  try {
    const existingOrder = await Order.findById(req.params.id);
    if (!existingOrder) return errorResponse(res, { status: HttpStatus.NOT_FOUND, message: "Order not found" });
    if (req.user.role !== "admin" && String(existingOrder.user) !== String(req.user.id)) {
      return errorResponse(res, { status: HttpStatus.FORBIDDEN, message: "Forbidden" });
    }
    const updates = req.user.role === "admin"
      ? req.body
      : { shippingAddress: req.body.shippingAddress, paymentMethod: req.body.paymentMethod };
    const order = await Order.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    });

    if (!order) {
      return errorResponse(res, { status: HttpStatus.NOT_FOUND, message: "Order not found" });
    }

    return successResponse(res, { message: "Order updated successfully.", data: order });
  } catch (error) {
    return errorResponse(res, { status: HttpStatus.BAD_REQUEST, message: error.message });
  }
};

const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
      return errorResponse(res, { status: HttpStatus.NOT_FOUND, message: "Order not found" });
    }

    return successResponse(res, { message: "Order deleted successfully.", data: order });
  } catch (error) {
    return errorResponse(res, { status: HttpStatus.INTERNAL_SERVER_ERROR, message: error.message });
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("user").populate("items.product");
    if (!order) return errorResponse(res, { status: HttpStatus.NOT_FOUND, message: "Order not found" });
    if (req.user.role !== "admin" && String(order.user._id || order.user) !== String(req.user.id)) {
      return errorResponse(res, { status: HttpStatus.FORBIDDEN, message: "Forbidden" });
    }
    return successResponse(res, { message: "Order retrieved successfully.", data: order });
  } catch (error) {
    return errorResponse(res, { status: HttpStatus.BAD_REQUEST, message: "Invalid order id.", error: error.message });
  }
};

module.exports = { getOrders, getOrderById, createOrder, updateOrder, deleteOrder };
