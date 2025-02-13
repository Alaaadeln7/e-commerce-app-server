import express from "express";
import {
  createOrder,
  getAllOrders,
  getUserOrders,
  updateOrderStatus,
} from "../controllers/order.controller.js";
import { isAdmin, protectRoute } from "../middlewares/auth.middleware.js";
const router = express.Router();

router.post("/", protectRoute, createOrder);
router.get("/", protectRoute, getUserOrders);
router.get("/all", protectRoute, isAdmin, getAllOrders);
router.put("/update", protectRoute, isAdmin, updateOrderStatus);
export default router;
