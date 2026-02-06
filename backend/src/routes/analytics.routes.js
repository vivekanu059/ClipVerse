import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {
  getVideoAnalytics,
  getCreatorAnalytics,
} from "../controllers/analytics.controller.js";

const router = express.Router();

router.get("/video/:videoId", authMiddleware, getVideoAnalytics);
router.get("/creator", authMiddleware, getCreatorAnalytics);

export default router;
