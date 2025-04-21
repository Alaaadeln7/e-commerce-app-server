import bcrypt from "bcryptjs";
import { AppError } from "../middlewares/error.middleware.js";
import { asyncHandler } from "../middlewares/error.middleware.js";
import User from "../models/user.model.js";
import generateToken from "../middlewares/generateToken.js";
import {
  signUpValidationSchema,
  loginValidationSchema,
} from "../utils/validationAuth.js";
import { ERROR, SUCCESS, FAILED } from "../config/statusText.js";
import cloudinary from "../config/cloudinary.js";

export const register = asyncHandler(async (req, res) => {
  if (!req.body) {
    return res.status(400).json({ status: ERROR, message: "No data provided" });
  }
  const { fullName, email, password } = req.body;
  try {
    const validData = await signUpValidationSchema.validate(req.body, {
      abortEarly: false,
    });
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res
        .status(400)
        .json({ status: FAILED, message: "User already exists" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    const newUser = new User({ fullName, email, password: hashPassword });
    if (newUser) {
      await newUser.save();
      const user = await User.findById(newUser._id).select("-__v");
      generateToken(user._id, res);

      return res.status(201).json({ status: SUCCESS, data: user });
    } else {
      return res
        .status(400)
        .json({ status: ERROR, message: "Invalid User Data" });
    }
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ status: ERROR, message: error.errors });
    } else {
      console.error(error.message);
      return res
        .status(500)
        .json({ status: ERROR, message: "Internal Server Error" });
    }
  }
});
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  try {
    const validData = await loginValidationSchema.validate(req.body, {
      abortEarly: false,
    });

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        status: FAILED,
        message: "User not found, please sign up first",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({
        status: FAILED,
        message: "Incorrect email or password",
      });
    }
    generateToken(user._id, res);

    return res.status(200).json({ status: SUCCESS, data: { user } });
  } catch (error) {
    console.error(error.message);
    return res
      .status(500)
      .json({ status: ERROR, message: "Internal Server Error" });
  }
});

export const logout = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.clearCookie("jwt");
  res.status(200).json({
    status: SUCCESS,
    message: "Logged out successfully",
  });
});

export const updateProfile = async (req, res) => {
  try {
    const { avatar } = req.body;
    const userId = req.user._id;
    if (!avatar) {
      return res
        .status(400)
        .json({ status: ERROR, message: "Profile avatar is required" });
    }
    const uploadResponse = await cloudinary.uploader.upload(avatar);
    const updateUser = await User.findByIdAndUpdate(
      userId,
      {
        avatar: uploadResponse.secure_url,
      },
      { new: true }
    );
    return res.status(200).json({ status: SUCCESS, data: { updateUser } });
  } catch (error) {
    console.error("Error in update avatar", error.message);
    return res
      .status(500)
      .json({ status: ERROR, message: "Internal Server Error" });
  }
};

export const resetPassword = asyncHandler(async (req, res) => {
  const { email, currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id).select("+password");
  if (!user) {
    throw new AppError("User not found", 404);
  }
  if (
    currentPassword &&
    !(await bcrypt.compare(currentPassword, user.password))
  ) {
    throw new AppError("Current password is incorrect", 401);
  }

  if (email) user.email = email;

  if (newPassword) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
  }

  await user.save();

  // user.password = undefined;

  res.status(200).json({
    status: SUCCESS,
    data: user,
  });
});

export const checkAuth = asyncHandler((req, res) => {
  try {
    return res.status(200).json({ status: SUCCESS, data: req.user });
  } catch (error) {
    console.error(error.message);
    return res
      .status(500)
      .json({ status: ERROR, message: "Internal Server Error" });
  }
});

export const updateInfo = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  const info = req.body;

  if (!info || Object.keys(info).length === 0) {
    return next(new AppError("No update data provided", 400));
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: info },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return next(new AppError("User not found", 404));
    }

    const userObject = updatedUser.toObject();
    delete userObject.password;
    delete userObject.__v;

    res.status(200).json({
      status: SUCCESS,
      data: userObject,
    });
  } catch (error) {
    next(new AppError("Internal Server Error", 500));
  }
});
export const completeInfo = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;
  const { fullName, phoneNumber, city, area, street } = req.body;
  if (!fullName || !phoneNumber || !city || !area || !street) {
    return next(new AppError("All fields are required", 400));
  }
  try {
    const user = await User.findById(userId);
    if (!user) {
      return next(new AppError("User not found", 404));
    }
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { fullName, phoneNumber, city, area, street },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return next(new AppError("User not found", 404));
    }
    await user.save();
    res.status(200).json({
      status: SUCCESS,
      data: updatedUser,
    });
  } catch (error) {
    console.error(error.message);
    return res
      .status(500)
      .json({ status: ERROR, message: "Internal Server Error" });
  }
});
