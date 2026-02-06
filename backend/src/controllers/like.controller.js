import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { likeService } from "../services/like.service.js";

export const likeVideoController = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const userId = req.user._id;

  const result = await likeService.likeVideo({ userId, videoId });

  return res
    .status(201)
    .json(new ApiResponse(201, result, "Video liked"));
});

export const unlikeVideoController = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const userId = req.user._id;

  await likeService.unlikeVideo({ userId, videoId });

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Like removed"));
});
