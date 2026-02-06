import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,getWatchHistory
} from "../controllers/user.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middlewares.js";

const router = express.Router();

router.post(
  "/register",
  upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  registerUser
);

router.post("/login", loginUser);
router.post("/refresh-token", refreshAccessToken);
router.post("/logout", authMiddleware, logoutUser);
router.get("/history", authMiddleware, getWatchHistory);
export default router;
