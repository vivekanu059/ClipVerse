import Comment from "../models/comment.model.js";
import { ApiError } from "../utils/apiError.js";
import { AnalyticsService } from "./analytics.service.js";

class CommentService {
  async addComment({ userId, videoId, content }) {
    if (!content || !content.trim()) {
      throw new ApiError(400, "Comment content is required");
    }

    // 1️⃣ Create comment
    const comment = await Comment.create({
      content,
      owner: userId,
      video: videoId,
    });

    // 2️⃣ 🔥 TRACK ANALYTICS EVENT (THIS WAS MISSING)
    await AnalyticsService.trackEvent({
      userId,
      videoId,
      eventType: "COMMENT",
    });

    return comment;
  }

  async getComments(videoId) {
    return Comment.find({ video: videoId })
      .populate("owner", "username avatar")
      .sort({ createdAt: -1 });
  }
}

export const commentService = new CommentService();
