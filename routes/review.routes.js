import express from "express";
import { addReview, getReviews } from "../controllers/review.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/addReview", protectRoute, addReview);

router.get("/:productId", getReviews);

export default router;
