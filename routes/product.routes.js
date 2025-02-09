import express from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  updateProduct,
} from "../controllers/product.controller.js";
import validateProduct from "../utils/productValidator.js";
import { protectRoute ,isSeller} from "../middlewares/auth.middleware.js";
const router = express.Router();
router.post("/create",protectRoute,isSeller,validateProduct, createProduct);
router.delete("/delete/:productId", protectRoute,isSeller,deleteProduct);
router.put("/update/:productId", protectRoute,isSeller,validateProduct,updateProduct);
router.get("/:productId",getProductById);
router.get("/",getAllProducts);
export default router;