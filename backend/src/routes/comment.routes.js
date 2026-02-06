import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {
  addCommentController,
  getCommentsController,
} from "../controllers/comments.controller.js";

const router = Router();

router.post("/:videoId", authMiddleware, addCommentController);
router.get("/:videoId", getCommentsController);

export default router;
