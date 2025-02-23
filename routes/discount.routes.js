import express from "express";
import {
  createDiscount,
  deleteDiscount,
  getAllDiscounts,
  validateGenralDiscount,
} from "../controllers/discount.controller.js";
import { protectRoute, isAdmin } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/create", protectRoute, isAdmin, createDiscount);
router.delete("/:discountId", protectRoute, isAdmin, deleteDiscount);
router.get("/", protectRoute, isAdmin, getAllDiscounts);
router.post("/validate", validateGenralDiscount);
export default router;
