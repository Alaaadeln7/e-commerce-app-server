import express from "express";
import {
  createDiscount,
  validateDiscount,
  useDiscount,
  deleteDiscount,
  getAllDiscounts,
} from "../controllers/discount.controller.js";
import { protectRoute, isAdmin } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/create", protectRoute, isAdmin, createDiscount);
router.post("/validate", protectRoute, validateDiscount);
router.post("/use", protectRoute, useDiscount);
router.delete("/:discountId", protectRoute, isAdmin, deleteDiscount);
router.get("/", protectRoute, isAdmin, getAllDiscounts);

export default router;
