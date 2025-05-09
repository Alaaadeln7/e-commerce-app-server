import express from "express";
import {
  checkAuth,
  completeInfo,
  login,
  logout,
  register,
  resetPassword,
  updateInfo,
  updateProfile,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.put("/update-profile", protectRoute, updateProfile);
router.get("/check", protectRoute, checkAuth);
router.put("/update", protectRoute, updateInfo);
router.put("/reset-password", protectRoute, resetPassword);
router.put("/complete-info", protectRoute, completeInfo);
export default router;
