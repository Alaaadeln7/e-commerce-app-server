import jwt from "jsonwebtoken";
import { AppError } from "./error.middleware.js";
import { asyncHandler } from "./error.middleware.js";
import User from "../models/user.model.js";
import { ROLES } from "../config/constants.js";
import { FAILED } from "../config/statusText.js";

export const isAdmin = asyncHandler(async (req, res, next) => {
  if (req.user.role !== ROLES.ADMIN) {
    throw new AppError("Admin access required", 403);
  }
  // const admins = await Admin.find();

  // if()
  next();
});

export const isSeller = asyncHandler(async (req, res, next) => {
  if (req.user.role !== ROLES.SELLER) {
    throw new AppError("Seller access required", 403);
  }
  next();
});

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(401).json({ status: FAILED, message: "Unauthorized" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ status: FAILED, message: "Unauthorized" });
    }
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res
        .status(404)
        .json({ status: FAILED, message: "User Not Found" });
    }
    req.user = user;

    next();
  } catch (error) {
    console.error(error.message);
    return res
      .status(500)
      .json({ status: FAILED, message: "Internal Server Error" });
  }
};
