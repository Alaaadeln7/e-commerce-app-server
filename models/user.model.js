import mongoose from "mongoose";
import { config } from "dotenv";
config();
const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default: `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/v1735715517/avatars/default-avatar.png.jpg`,
      required: false,
    },
    role: {
      type: String,
      enum: ["customer", "seller", "admin"],
      default: "customer",
    },
    city: {
      type: String,
      required: false,
    },
    area: {
      type: String,
      required: false,
    },
    street: {
      type: String,
      required: false,
    },
    phone: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);
const User = mongoose.model("User", userSchema);

export default User;
