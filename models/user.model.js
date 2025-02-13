import mongoose from "mongoose";
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
    logo: String,
    sellerRequestStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: null,
    },
  },
  { timestamps: true }
);
const User = mongoose.model("User", userSchema);

export default User;
