import Order from "../models/order.model.js";
import { FAILED, SUCCESS } from "../config/statusText.js";
import { asyncHandler } from "../middlewares/error.middleware.js";

export const markAsShipped = asyncHandler(async (req, res) => {
  const { orderId, carrier, trackingNumber, estimatedDeliveryDate } = req.body;

  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return res
        .status(404)
        .json({ status: FAILED, message: "Order not found" });
    }

    if (order.paymentStatus !== "paid") {
      return res
        .status(400)
        .json({ status: FAILED, message: "Cannot ship unpaid order" });
    }

    order.orderStatus = "shipped";
    order.shippingDetails = { carrier, trackingNumber, estimatedDeliveryDate };
    await order.save();

    res.json({
      status: SUCCESS,
      message: "Order updated to 'Shipped'",
      data: order,
    });
  } catch (error) {
    res
      .status(500)
      .json({ status: FAILED, message: "Error updating order status", error });
  }
});

export const markAsDelivered = asyncHandler(async (req, res) => {
  const { orderId } = req.body;

  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return res
        .status(404)
        .json({ status: FAILED, message: "Order not found" });
    }

    if (order.orderStatus !== "shipped") {
      return res
        .status(400)
        .json({ status: FAILED, message: "Cannot deliver unshipped order" });
    }

    order.orderStatus = "delivered";
    await order.save();

    res.json({
      status: SUCCESS,
      message: "Order updated to 'Delivered'",
      data: order,
    });
  } catch (error) {
    console.error(error.message);
    res
      .status(500)
      .json({ status: FAILED, message: "Error updating order status", error });
  }
});
