import Discount from "../models/discount.model.js";
import { SUCCESS, ERROR } from "../config/statusText.js";
import { asyncHandler } from "../middlewares/error.middleware.js";

export const createDiscount = asyncHandler(async (req, res) => {
  try {
    const { code, discountPercentage, expiryDate } = req.body;

    const existingDiscount = await Discount.findOne({ code });
    if (existingDiscount) {
      return res
        .status(400)
        .json({ status: ERROR, message: "Discount code already exists" });
    }

    const newDiscount = new Discount({
      code,
      discountPercentage,
      expiryDate,
    });

    await newDiscount.save();
    res.status(201).json({
      status: SUCCESS,
      message: "Discount code created successfully",
      discount: newDiscount,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      status: ERROR,
      message: "An error occurred while creating discount code",
      error: error.message,
    });
  }
});

export const deleteDiscount = asyncHandler(async (req, res) => {
  try {
    const { discountId } = req.params;
    const deletedDiscount = await Discount.findByIdAndDelete(discountId);
    if (deletedDiscount) {
      res.status(200).json({
        status: SUCCESS,
        message: "Discount code deleted successfully",
      });
    } else {
      res
        .status(404)
        .json({ status: ERROR, message: "Discount code not found" });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      status: ERROR,
      message: "An error occurred while deleting discount code",
      error: error.message,
    });
  }
});

export const getAllDiscounts = asyncHandler(async (req, res) => {
  try {
    const discounts = await Discount.find();
    if (!discounts) {
      return res
        .status(404)
        .json({ status: ERROR, message: "No discount codes found" });
    }
    res.status(200).json({
      status: SUCCESS,
      message: "All discount codes fetched successfully",
      data: discounts,
    });
  } catch (error) {
    console;
    res.status(500).json({
      status: ERROR,
      message: "An error occurred while getting all discount codes",
      error: error.message,
    });
  }
});

export const validateGenralDiscount = asyncHandler(async (req, res) => {
  const { code } = req.body;
  const discount = await Discount.findOne({ code });
  if (discount) {
    return res.status(200).json({
      status: SUCCESS,
      message: "Discount code is valid",
      discountPercentage: discount.discountPercentage,
      validtion: true,
    });
  } else {
    return res.status(200).json({
      status: ERROR,
      message: "Discount code is not found",
      validtion: false,
    });
  }
});
