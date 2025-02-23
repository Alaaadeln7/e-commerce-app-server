import { ERROR, SUCCESS } from "../config/statusText.js";
import Product from "../models/product.model.js";
import { asyncHandler } from "../middlewares/error.middleware.js";
import cloudinary from "../config/cloudinary.js";
export const getAllProducts = asyncHandler(async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const totalProducts = await Product.countDocuments();
    let products;
    totalProducts <= 10
      ? (products = await Product.find())
      : (products = await Product.find().skip(skip).limit(limit));

    return res.status(200).json({
      status: SUCCESS,
      data: products,
      totalPages: Math.ceil(totalProducts / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error(error.message);
    return res
      .status(500)
      .json({ status: ERROR, message: "Internal Server Error" });
  }
});

export const getProductById = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  try {
    const product = await Product.findById(productId);
    if (product) {
      return res.status(200).json({ status: SUCCESS, data: product });
    } else {
      return res
        .status(404)
        .json({ status: ERROR, message: "Product not found" });
    }
  } catch (error) {
    console.error(error.message);
    return res
      .status(500)
      .json({ status: ERROR, message: "Internal Server Error" });
  }
});

export const createProduct = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    price,
    category,
    stock,
    thumbnail,
    discount,
    freeReturn,
    freeShipping,
    sizes,
  } = req.body;
  const user = req.user;
  try {
    if (user?.role === "seller") {
      let thumbnailUrl = null;
      if (thumbnail) {
        const uploadResponse = await cloudinary.uploader.upload(thumbnail, {
          folder: "products",
        });
        thumbnailUrl = uploadResponse.secure_url;
      }

      const newProduct = new Product({
        title,
        description,
        price,
        category,
        stock,
        seller: user._id,
        thumbnail: thumbnailUrl,
        discount,
        freeReturn,
        freeShipping,
        sizes,
      });

      await newProduct.save();
      return res.status(201).json({ status: SUCCESS, data: newProduct });
    } else {
      return res.status(403).json({
        status: ERROR,
        message: "you must be a seller to create a product",
      });
    }
  } catch (error) {
    console.error(error.message);
    return res
      .status(500)
      .json({ status: ERROR, message: "Internal Server Error" });
  }
});

export const updateProduct = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const updates = req.body;
  const user = req.user;
  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res
        .status(404)
        .json({ status: ERROR, message: "Product not found" });
    }
    if (product.seller.toString() === user._id) {
      const updatedProduct = await Product.findByIdAndUpdate(
        productId,
        updates,
        { new: true }
      );
      return res.status(200).json({ status: SUCCESS, data: updatedProduct });
    } else {
      return res.status(403).json({
        status: ERROR,
        message: "you must be the seller of this product to update it",
      });
    }
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ status: ERROR, message: "Internal Server Error" });
  }
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const user = req.user;
  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res
        .status(404)
        .json({ status: ERROR, message: "Product not found" });
    }
    if (product.seller.toString() === user._id) {
      await Product.findByIdAndDelete(productId);
      return res
        .status(200)
        .json({ status: SUCCESS, message: "Product deleted" });
    } else {
      return res.status(403).json({
        status: ERROR,
        message: "you must be the seller of this product to delete it",
      });
    }
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ status: ERROR, message: "Internal Server Error" });
  }
});

export const getBestSellers = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find().sort({ sales: -1 }).limit(10);
    return res.status(200).json({ status: SUCCESS, data: products });
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ status: ERROR, message: "Internal Server Error" });
  }
});
