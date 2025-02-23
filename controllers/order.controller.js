import { ERROR, SUCCESS } from "../config/statusText.js";
import { asyncHandler } from "../middlewares/error.middleware.js";
import Cart from "../models/cart.model.js";
import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
export const createOrder = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  const { city, area, street, paymentStatus, totalPrice, phoneNumber } =
    req.body;
  try {
    const cart = await Cart.findOne({ user: userId }).populate("items.product");
    if (!cart || cart.items.length === 0) {
      return res.status(404).json({ status: ERROR, message: "Cart not found" });
    }
    const orderNumber = `${Math.floor(100 + Math.random() * 900)}-${Math.floor(
      100 + Math.random() * 900
    )}-${Math.floor(100 + Math.random() * 900)}`;
    const newOrder = new Order({
      user: userId,
      items: cart.items.map((item) => ({
        product: item.product._id,
        quantity: item.quantity,
        price: item.product.price,
      })),
      totalPrice,
      paymentStatus,
      orderStatus: "processing",
      city,
      area,
      street,
      phoneNumber,
      orderNumber,
    });
    await newOrder.save();
    await Cart.findOneAndDelete({ user: userId });
    return res.status(200).json({ status: SUCCESS, data: newOrder });
  } catch (error) {
    console.error(error.message);
    return res
      .status(500)
      .json({ status: ERROR, message: "Internal Server Error" });
  }
});
export const getUserOrders = asyncHandler(async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).populate(
      "items.product"
    );
    res.status(200).json({ status: SUCCESS, data: orders });
  } catch (error) {
    res.status(500).json({
      status: ERROR,
      message: "An error occurred",
      error: error.message,
    });
  }
});

export const getAllOrders = asyncHandler(async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "fullName email")
      .populate("items.product");
    res.status(200).json({ status: SUCCESS, data: orders });
  } catch (error) {
    res.status(500).json({
      status: ERROR,
      message: "An error occurred",
      error: error.message,
    });
  }
});
export const updateOrderStatus = asyncHandler(async (req, res) => {
  try {
    const { orderId, status } = req.body;
    const userId = req.user?.id;
    const statuses = ["processing", "shipped", "delivered", "cancelled"];
    if (!statuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = status;
    await order.save();

    const notificationMessage = `Your order status has been updated to: ${status}`;
    const notification = new Notification({
      user: userId,
      message: notificationMessage,
    });
    await notification.save();

    res.status(200).json({ message: "Order status updated successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "An error occurred", error: error.message });
  }
});
export const updateProductSales = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  try {
    const order = await Order.findById(orderId).populate("items.product");
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { sold: item.quantity },
      });
    }
  } catch (error) {
    console.log(error.message);
    res
      .status(500)
      .json({ message: "An error occurred", error: error.message });
  }
});
