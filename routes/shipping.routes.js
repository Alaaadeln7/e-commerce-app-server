import express from "express";
import { markAsShipped, markAsDelivered } from "../controllers/shipping.controller.js";

const router = express.Router();

router.post("/markOrderAsShipped", markAsShipped);
router.post("/markOrderAsDelivered", markAsDelivered);

export default router;
