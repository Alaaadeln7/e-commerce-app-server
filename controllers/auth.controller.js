import bcrypt from "bcryptjs";
import { AppError } from "../middlewares/error.middleware.js";
import { asyncHandler } from "../middlewares/error.middleware.js";
import User from "../models/user.model.js";
import generateToken from "../middlewares/generateToken.js";
import {
  signUpValidationSchema,
  loginValidationSchema,
} from "../utils/validationAuth.js";
import { SUCCESS } from "../config/statusText.js";
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

const comparePasswords = async (inputPassword, hashedPassword) => {
  return bcrypt.compare(inputPassword, hashedPassword);
};

export const register = asyncHandler(async (req, res) => {
  const { fullName, email, password } = req.body;

  if (!req.body) {
    throw new AppError("No data provided", 400);
  }

  await signUpValidationSchema.validate(req.body, { abortEarly: false });

  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new AppError("User already exists", 400);
  }

  const hashedPassword = await hashPassword(password);
  const newUser = await User.create({
    fullName,
    email,
    password: hashedPassword,
  });
  const user = await User.findById(newUser._id).select("-password -__v");
  generateToken(user._id, res);

  res.status(201).json({
    status: SUCCESS,
    data: user,
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  await loginValidationSchema.validate(req.body, { abortEarly: false });

  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await comparePasswords(password, user.password))) {
    throw new AppError("Incorrect email or password", 401);
  }
  user.password = undefined;

  generateToken(user._id, res);
  res.status(200).json({
    status: SUCCESS,
    data: { user },
  });
});

export const logout = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({
    status: SUCCESS,
    message: "Logged out successfully",
  });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const { fullName, phoneNumber, address } = req.body;

  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    {
      fullName,
      phoneNumber,
      address,
    },
    {
      new: true,
      runValidators: true,
    }
  ).select("-password -__v");

  if (!updatedUser) {
    throw new AppError("User not found", 404);
  }

  res.status(200).json({
    status: SUCCESS,
    data: updatedUser,
  });
});

export const updateCredentials = asyncHandler(async (req, res) => {
  const { email, currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id).select("+password");
  if (!user) {
    throw new AppError("User not found", 404);
  }
  if (
    currentPassword &&
    !(await comparePasswords(currentPassword, user.password))
  ) {
    throw new AppError("Current password is incorrect", 401);
  }

  if (email) user.email = email;
  if (newPassword) user.password = await hashPassword(newPassword);

  await user.save();

  user.password = undefined;

  res.status(200).json({
    status: SUCCESS,
    data: user,
  });
});

export const checkAuth = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password -__v");
  if (!user) {
    throw new AppError("User not found", 404);
  }

  res.status(200).json({
    status: SUCCESS,
    data: user,
  });
});
