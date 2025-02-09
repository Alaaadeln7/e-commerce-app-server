import { FAILED, SUCCESS } from "../config/statusText.js";
import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";

export const addToCart = async (req, res) => {
  const { productId, quantity } = req.body;
  const user = req.user;
  try {
    const product = await Product.findById(productId);
    if(!product){
      return res.status(404).json({ status: FAILED, message: "Product not found" });
    }
    const cart = await Cart.findOne({user: user._id});
    if(!cart){
      return res.status(404).json({ status: FAILED, message: "Cart not found" });
    }else{
      cart = new Cart({
        user: user._id,
        items: []
      })
    }
    const itemIndex = cart.items.findIndex((item) => item.product.toString() === productId );
    if(itemIndex > -1){
      cart.items[itemIndex].quantity += quantity;
    }else{
      cart.items.push({product: productId, quantity: quantity})
    }
    await cart.save();
    res.status(200).json({ status: SUCCESS, data: cart });
  } catch (error) {
    console.error(error.message);
    return res
      .status(500)
      .json({ status: FAILED, message: "Internal Server Error" });
  }
}
export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({user: req.user._id}).populate('items.product');
    if(!cart){
      return res.status(404).json({ status: FAILED, message: "Cart not found" });
    }
    res.status(200).json({ status: SUCCESS, data: cart });
  } catch (error) {
    console.error(error.message);
    return res
      .status(500)
      .json({ status: FAILED, message: "Internal Server Error" });
  }
}
export const updateCart = async (req, res) => {
  const {productId, quantity} = req.body;
  const user = req.user;
  try {
    const cart = await Cart.findOne({user: user._id});
    if(!cart){
      return res.status(404).json({ status: FAILED, message: "Cart not found" });
    }
    const itemIndex = cart.items.findIndex((item) => item.product.toString() === productId );
    if(itemIndex > -1){
      cart.items[itemIndex].quantity = quantity;
    }
    await cart.save();
    res.status(200).json({ status: SUCCESS, data: cart });
  } catch (error) {
    console.error(error.message);
    return res
      .status(500)
      .json({ status: FAILED, message: "Internal Server Error" });
  }
}
export const deleteFromCart = async (req, res) => {
  const {productId} = req.params;
  const user = req.user;
  try {
    const cart = await Cart.findOne({user: user._id});
    if(!cart){
      return res.status(404).json({ status: FAILED, message: "Cart not found" });
    }
    cart.items = cart.items.filter((item) => item.product.toString() !== productId);
    await cart.save();
    res.status(200).json({ status: SUCCESS, data: cart });
    
  } catch (error) {
    console.error(error.message);
    return res
      .status(500)
      .json({ status: FAILED, message: "Internal Server Error" });
  }
}