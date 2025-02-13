import express from "express";
import {
  getAllSellerRequests,
  reviewSellerRequest,
  requestSellerRole,
  checkRequestSellerStatus,
} from "../controllers/sellerRequest.controller.js";
import { protectRoute, isAdmin } from "../middlewares/auth.middleware.js";
const router = express.Router();

router.get(
  "/getAllSellerRequests",
  protectRoute,
  isAdmin,
  getAllSellerRequests
);
router.post("/request", protectRoute, isAdmin, requestSellerRole);
router.put("/review/", protectRoute, isAdmin, reviewSellerRequest);
router.get(
  "/checkRequestSellerStatus",
  protectRoute,
  isAdmin,
  checkRequestSellerStatus
);
export default router;
