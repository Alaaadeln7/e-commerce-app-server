import mongoose from "mongoose";
const discountSchema = new mongoose.Schema(
  {
    code: { type: String, unique: true },
    discountPercentage: Number,
    expiryDate: { type: Date, required: true },
    usedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

const Discount = mongoose.model("Discount", discountSchema);
export default Discount;
