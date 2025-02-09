import Review from "../models/review.model.js";
import Product from "../models/product.model.js";
import { ERROR, SUCCESS } from "../config/statusText.js";

export const addReview = async (req, res) => {
  try {
    const { productId, rating, reviewText } = req.body;
    const userId  = req.user?.id;

    const existingReview = await Review.findOne({ product: productId, user: userId });
    if (existingReview) {
      return res.status(400).json({ message: "You have already reviewed this product" });
    }

    const newReview = new Review({
      product: productId,
      user: userId,
      rating,
      reviewText
    });
    await newReview.save();

    const product = await Product.findById(productId);
    product.averageRating = await calculateAverageRating(productId); // function to calculate average rating
    await product.save();

    res.status(201).json({ message: "Review added successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error adding review", error });
  }
};


const calculateAverageRating = async (productId) => {
  const reviews = await Review.find({ product: productId });
  const totalRatings = reviews.reduce((acc, review) => acc + review.rating, 0);
  return totalRatings / reviews.length;
};


export const getReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const reviews = await Review.find({ product: productId }).populate("user", "name email");
    res.status(200).json({ status: SUCCESS, message: "Reviews fetched successfully", data: reviews });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ status: ERROR, message: "Error fetching reviews", error });
  }
};
