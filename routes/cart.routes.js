import express from "express";
import { protectRoute } from "../middlewares/auth.middleware.js";
import {
  getCart,
  deleteFromCart,
  addToCart,
  updateCart,
} from "../controllers/cart.controller.js";

const router = express.Router();

router.get("/", protectRoute, getCart);

router.post("/add", protectRoute, addToCart);

router.put("/update", protectRoute, updateCart);

router.delete("/delete/:productId", protectRoute, deleteFromCart);

export default router;
