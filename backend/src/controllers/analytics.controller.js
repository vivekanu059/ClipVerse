import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { AnalyticsService } from "../services/analytics.service.js";

/* 📊 Video analytics */
export const getVideoAnalytics = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  const summary = await AnalyticsService.getVideoSummary(videoId);
  const trend = await AnalyticsService.getVideoViewsTrend(videoId);

  return res.status(200).json(
    new ApiResponse(200, { summary, trend }, "Video analytics fetched successfully")
  );
});


/* 👤 Creator dashboard */
export const getCreatorAnalytics = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const stats = await AnalyticsService.getCreatorStats(userId);

  return res.status(200).json(
    new ApiResponse(200, stats, "Creator analytics fetched successfully")
  );
});
