import express from "express";

import { isAdmin, protectRoute } from "../middlewares/auth.middleware.js";
import { makeAdmin } from "../controllers/admin.controller.js";

const router = express.Router();

router.put("/makeAdmin/:userId", protectRoute, isAdmin, makeAdmin);

export default router;
