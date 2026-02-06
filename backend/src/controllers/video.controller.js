import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import Video from "../models/videoModel.js";
import { videoService } from "../services/video.service.js";
import { ApiError } from "../utils/apiError.js";

import { User } from "../models/userModel.js";
import { AnalyticsService } from "../services/analytics.service.js";

export const uploadVideoController = asyncHandler(async (req, res) => {
  const video = await videoService.uploadVideo(req.user._id, {
  title: req.body.title,
  description: req.body.description,
  videoFilePath: req.file?.path, // 👈 PASS PATH, NOT OBJECT
});


  return res.status(201).json(
    new ApiResponse(201, video, "Video uploaded successfully")
  );
});

export const getVideoByIdController = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const userId = req.user?._id;

  if (!userId) {
    throw new ApiError(401, "Unauthorized");
  }

  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  /* 1️⃣ Track VIEW analytics */
  await AnalyticsService.trackEvent({
    userId,
    videoId,
    eventType: "VIEW",
  });

  /* 2️⃣ Update watch history */
  await User.findByIdAndUpdate(
    userId,
    {
      $addToSet: { watchHistory: videoId },
    },
    { new: true }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, video, "Video fetched successfully"));
});

export const getAllVideosController = asyncHandler(async (req, res) => {
  const videos = await Video.find()
    .populate("owner", "username avatar")
    .sort({ createdAt: -1 });

  return res.status(200).json(
    new ApiResponse(200, videos, "Videos fetched successfully")
  );
});


