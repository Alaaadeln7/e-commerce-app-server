import express from "express";
import { getNotifications, markAsRead } from "../controllers/notification.controller.js";

const router = express.Router();


router.get("/", getNotifications);
router.post("/markAsRead", markAsRead);

export default router;
