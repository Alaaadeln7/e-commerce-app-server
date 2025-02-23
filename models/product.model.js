import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },

    category: { type: String, required: true },

    stock: { type: Number, default: 0 },
    sold: { type: Number, default: 0 },

    images: { type: [String], default: [], required: false },
    thumbnail: { type: String, required: true },

    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
    rating: { type: Number, default: 0 },

    sizes: [
      {
        value: { type: Number, required: true },
        unit: {
          type: String,
          required: true,
          enum: ["m", "cm", "l", "ml", "piece"],
        },
      },
    ],
    freeReturn: { type: Boolean, default: false },
    freeShipping: { type: Boolean, default: false },
    discount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
