import mongoose from "mongoose";
const discountSchema = new mongoose.Schema({
  code: { type: String, unique: true },
  discountPercentage: Number,
  expiryDate: Date,
  usedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

const Discount = mongoose.model("Discount", discountSchema);
export default Discount;
