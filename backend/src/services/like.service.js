import Like from "../models/like.model.js";
import { ApiError } from "../utils/apiError.js";
import { AnalyticsService } from "./analytics.service.js";

class LikeService {
  async likeVideo({ userId, videoId }) {
    const alreadyLiked = await Like.findOne({
      user: userId,
      video: videoId,
    });

    if (alreadyLiked) {
      throw new ApiError(400, "Video already liked");
    }

    const like = await Like.create({
      user: userId,
      video: videoId,
    });

    await AnalyticsService.trackEvent({
      userId,
      videoId,
      eventType: "LIKE",
    });

    return like;
  }

  async unlikeVideo({ userId, videoId }) {
    await Like.findOneAndDelete({
      user: userId,
      video: videoId,
    });
  }
}

export const likeService = new LikeService();
