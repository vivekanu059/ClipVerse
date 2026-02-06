import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { likeVideoController,unlikeVideoController } from "../controllers/like.controller.js";

const router = express.Router();

router.post("/:videoId", authMiddleware, likeVideoController);
router.delete("/:videoId", authMiddleware, unlikeVideoController);

export default router;
