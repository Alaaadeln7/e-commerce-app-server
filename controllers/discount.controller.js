import Discount from "../models/discount.model.js";
import { SUCCESS, ERROR } from "../config/statusText.js";
export const createDiscount = async (req, res) => {
  try {
    const { code, discountPercentage, expiryDate } = req.body;

    const existingDiscount = await Discount.findOne({ code });
    if (existingDiscount) {
      return res.status(400).json({ status: ERROR, message: "Discount code already exists" });
    }

    const newDiscount = new Discount({
      code,
      discountPercentage,
      expiryDate,
    });

    await newDiscount.save();
    res.status(201).json({ status: SUCCESS, message: "Discount code created successfully", discount: newDiscount });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ status: ERROR, message: "An error occurred while creating discount code", error: error.message });
  }
};

export const validateDiscount = async (req, res) => {
  try {
    const { code } = req.body;
    const userId = req.user.id;

    const discount = await Discount.findOne({ code });
    if (!discount) {
      return res.status(404).json({ status: ERROR, message: "Invalid discount code" });
    }

    if (discount.expiryDate < new Date()) {
      return res.status(400).json({ status: ERROR, message: "Discount code expired" });
    }

    if (discount.usedBy.includes(userId)) {
      return res.status(400).json({ status: ERROR, message: "You have already used this discount code" });
    }

    res.status(200).json({ status: SUCCESS, message: "Discount code is valid", discount });
  } catch (error) {
    res.status(500).json({ message: "An error occurred while validating discount code", error: error.message });
  }
};

export const useDiscount = async (req, res) => {
  try {
    const { code } = req.body;
    const userId = req.user.id;

    const discount = await Discount.findOne({ code });
    if (!discount) {
      return res.status(404).json({ status: ERROR, message: "Invalid discount code" });
    }

    if (discount.expiryDate < new Date()) {
      return res.status(400).json({ status: ERROR, message: "Discount code expired" });
    }

    if (discount.usedBy.includes(userId)) {
      return res.status(400).json({ status: ERROR, message: "You have already used this discount code" });
    }
    discount.usedBy.push(userId);
    await discount.save();
    res.status(200).json({ status: SUCCESS, message: "Discount code used successfully", discount });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ status: ERROR, message: "An error occurred while using discount code", error: error.message });
  }
};

export const deleteDiscount = async (req, res) => {
  try {
    const { discountId } = req.params;
    const deletedDiscount = await Discount.findByIdAndDelete(discountId);
    if(deletedDiscount){
      res.status(200).json({ status: SUCCESS, message: "Discount code deleted successfully" });
    }else{
      res.status(404).json({ status: ERROR, message: "Discount code not found" });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ status: ERROR, message: "An error occurred while deleting discount code", error: error.message });
  }
};

export const getAllDiscounts = async (req, res) => {
  try {
    const discounts = await Discount.find();
    if(!discounts){
      return res.status(404).json({ status: ERROR, message: "No discount codes found" });
    }
    res.status(200).json({status: SUCCESS, message:"All discount codes fetched successfully", data: discounts});
  } catch (error) {
    console
    res.status(500).json({ status: ERROR, message: "An error occurred while getting all discount codes", error: error.message });
  }
};
