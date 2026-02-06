import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { commentService } from "../services/comment.service.js";

export const addCommentController = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { content } = req.body;

  const comment = await commentService.addComment({
    userId: req.user._id,
    videoId,
    content,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, comment, "Comment added successfully"));
});

export const getCommentsController = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  const comments = await commentService.getComments(videoId);

  return res
    .status(200)
    .json(new ApiResponse(200, comments, "Comments fetched successfully"));
});
