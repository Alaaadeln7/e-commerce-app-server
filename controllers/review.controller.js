import Review from "../models/review.model.js";
import Product from "../models/product.model.js";
import { ERROR, SUCCESS } from "../config/statusText.js";
import { asyncHandler } from "../middlewares/error.middleware.js";

const calculateAverageRating = async (productId) => {
  const reviews = await Review.find({ product: productId });
  const totalRatings = reviews.reduce((acc, review) => acc + review.rating, 0);
  return reviews.length > 0 ? totalRatings / reviews.length : 0;
};

export const addReview = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  try {
    const { productId, rating, reviewText } = req.body;
    const existingReview = await Review.findOne({
      product: productId,
      user: userId,
    });
    if (existingReview) {
      return res.status(400).json({
        status: ERROR,
        message: "You have already reviewed this product",
      });
    }

    const newReview = new Review({
      productId,
      user: userId,
      rating,
      reviewText,
    });

    if (newReview) {
      await newReview.save();
      const product = await Product.findById(productId);
      product.averageRating = await calculateAverageRating(productId);
      await product.save();

      res
        .status(201)
        .json({ status: SUCCESS, message: "Review added successfully" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ status: ERROR, message: "Error adding review", error });
  }
});

export const getReviews = asyncHandler(async (req, res) => {
  try {
    const { productId } = req.params;
    const reviews = await Review.find({ productId }).populate(
      "user",
      "fullName avatar"
    );
    res.status(200).json({
      status: SUCCESS,
      message: "Reviews fetched successfully",
      data: reviews,
    });
  } catch (error) {
    console.error(error.message);
    res
      .status(500)
      .json({ status: ERROR, message: "Error fetching reviews", error });
  }
});
