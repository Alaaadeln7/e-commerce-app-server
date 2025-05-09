import { FAILED, SUCCESS } from "../config/statusText.js";
import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";
import { asyncHandler } from "../middlewares/error.middleware.js";

export const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;
  const user = req.user;
  let cart = await Cart.findOne({ user: user._id });
  if (!cart) {
    cart = new Cart({
      user: user._id,
      items: [],
    });
  }

  const itemIndex = cart.items.findIndex(
    (item) => item.product.toString() === productId
  );
  if (itemIndex > -1) {
    cart.items[itemIndex].quantity += quantity;
  } else {
    cart.items.push({ product: productId, quantity: quantity });
  }

  await cart.save();
  res.status(200).json({ status: SUCCESS, data: cart });
});

export const getCart = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  try {
    let cart = await Cart.findOne({ user: userId }).populate("items.product");

    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
      await cart.save();
      return res.status(201).json({ status: "SUCCESS", data: cart });
    }
    const totalPrices = cart.items.reduce((acc, item) => {
      return acc + (item.product?.price || 0) * item.quantity;
    }, 0);
    cart.totalPrice = totalPrices;
    await cart.save();
    res.status(200).json({ status: "SUCCESS", data: cart });
  } catch (error) {
    console.error(error.message);
    res
      .status(500)
      .json({ status: "FAILED", message: "Internal Server Error" });
  }
});

export const updateCart = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;
  const user = req.user;

  const cart = await Cart.findOne({ user: user._id });
  if (!cart) {
    return res.status(404).json({ status: FAILED, message: "Cart not found" });
  }

  const itemIndex = cart.items.findIndex(
    (item) => item.product.toString() === productId
  );
  if (itemIndex > -1) {
    cart.items[itemIndex].quantity = quantity;
  } else {
    return res
      .status(404)
      .json({ status: FAILED, message: "Item not found in cart" });
  }

  await cart.save();
  res.status(200).json({ status: SUCCESS, data: cart });
});

export const deleteFromCart = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const user = req.user;

  const cart = await Cart.findOne({ user: user?._id });
  if (!cart) {
    return res.status(404).json({ status: FAILED, message: "Cart not found" });
  }

  cart.items = cart.items.filter(
    (item) => item.product.toString() !== productId
  );
  await cart.save();

  res.status(200).json({ status: SUCCESS, message: "Item removed from cart" });
});
