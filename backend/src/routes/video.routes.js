import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";

import {
  uploadVideoController,
  getVideoByIdController,getAllVideosController
} from "../controllers/video.controller.js";
import { upload } from "../middlewares/multer.middlewares.js";

const router = express.Router();

/**
 * Upload a new video
 * POST /api/v1/videos/upload
 */

router.get("/", getAllVideosController);

router.post(
  "/upload",
  authMiddleware,
  upload.single("videoFile"),
  uploadVideoController
);

/**
 * Get video by ID
 * GET /api/v1/videos/:videoId
 */


router.get(
  "/:videoId",
  authMiddleware,
  getVideoByIdController
);


export default router;
