import Stripe from "stripe";
import Order from "../models/order.model.js";
import { ERROR, SUCCESS } from "../config/statusText.js";
import { config } from "dotenv";
import { asyncHandler } from "../middlewares/error.middleware.js";

config();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createCheckoutSession = asyncHandler(async (req, res) => {
  const { orderId } = req.body;
  try {
    const order = await Order.findById(orderId).populate("items.product");
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const lineItems = order.items.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: { name: item.product.title },
        unit_amount: item.product.price * 100, 
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `http://localhost:5173/success?orderId=${orderId}`,
      cancel_url: `http://localhost:5173/cancel`,
    });

    res.json({status: SUCCESS, message: "Checkout session created", url: session.url });
  } catch (error) {
    res.status(500).json({ status: ERROR, message: "Error creating checkout session", error });
  }
});

export const handlePaymentSuccess = asyncHandler(async (req, res) => {
  try {
    const { orderId } = req.body;
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({status: ERROR, message: "Order not found" });
    }

    order.paymentStatus = "paid"; 
    await order.save();

    res.json({ status: SUCCESS, message: "Payment successful and order updated" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ status: ERROR, message: "Error updating order status", error });
  }
});
