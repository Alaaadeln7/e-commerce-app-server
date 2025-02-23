import express from "express";
import {
  checkIsRead,
  getNotifications,
  markAllAsRead,
  markAsRead,
} from "../controllers/notification.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", protectRoute, getNotifications);
router.post("/markAsRead", markAsRead);
router.post("/markAllAsRead", protectRoute, markAllAsRead);
router.get("/checkIsRead", protectRoute, checkIsRead);
export default router;
