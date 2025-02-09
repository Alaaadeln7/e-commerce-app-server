import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    discountCode: { type: String, default: null },
    category: { type: String, required: true },
    stock: Number,
    images: { type: [String], required: false },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    thumbnail: { type: String, required: true },
  }, { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
