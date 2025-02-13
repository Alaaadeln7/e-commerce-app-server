import express from "express";
import {
  createCheckoutSession,
  handlePaymentSuccess,
} from "../controllers/payment.controller.js";

const router = express.Router();

router.post("/create-checkout-session", createCheckoutSession);
router.post("/payment-success", handlePaymentSuccess);

export default router;
