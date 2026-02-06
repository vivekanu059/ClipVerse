import mongoose from "mongoose";
import VideoEvent from "../models/videoEvent.model.js";
import { analyticsQueue } from "../config/queue.js";
import redis from "../config/redis.js";

export class AnalyticsService {

  /* ================================
     1️⃣ WRITE SIDE (QUEUE ONLY)
  ================================= */
  static async trackEvent({ userId, videoId, eventType, watchTime = 0 }) {
    if (!userId || !eventType) return false;

    console.log("[ANALYTICS] Sending event to queue", {
      userId,
      videoId,
      eventType,
    });

    // 1️⃣ Push event to queue
    await analyticsQueue.add("track-event", {
      userId,
      videoId,
      eventType,
      watchTime,
    });

    console.log("[ANALYTICS] Queue event sent");

    // 2️⃣ Cache invalidation (CONSISTENT)
    if (videoId) {
      await redis.del(`video:summary:${videoId}`);
      await redis.del(`video:trend:${videoId}`);
    }

    if (userId) {
      await redis.del(`creator:stats:${userId}`);
    }

    return true;
  }

  /* ================================
     2️⃣ VIDEO SUMMARY (CACHED)
  ================================= */
  static async getVideoSummary(videoId) {
    const cacheKey = `video:summary:${videoId}`;

    const cachedData = await redis.get(cacheKey);
    if (cachedData) {
      return JSON.parse(cachedData);
    }

    const summary = await VideoEvent.aggregate([
      {
        $match: {
          videoId: new mongoose.Types.ObjectId(videoId),
        },
      },
      {
        $group: {
          _id: "$eventType",
          count: { $sum: 1 },
        },
      },
    ]);

    await redis.set(cacheKey, JSON.stringify(summary), "EX", 60);
    return summary;
  }

  /* ================================
     3️⃣ VIDEO VIEW TREND (CACHED)
  ================================= */
  static async getVideoViewsTrend(videoId) {
    const cacheKey = `video:trend:${videoId}`;

    const cachedData = await redis.get(cacheKey);
    if (cachedData) {
      return JSON.parse(cachedData);
    }

    const trend = await VideoEvent.aggregate([
      {
        $match: {
          videoId: new mongoose.Types.ObjectId(videoId),
          eventType: "VIEW",
        },
      },
      {
        $group: {
          _id: {
            day: {
              $dateToString: {
                format: "%Y-%m-%d",
                date: "$createdAt",
              },
            },
          },
          views: { $sum: 1 },
        },
      },
      { $sort: { "_id.day": 1 } },
    ]);

    await redis.set(cacheKey, JSON.stringify(trend), "EX", 60);
    return trend;
  }

  /* ================================
     4️⃣ CREATOR STATS (CACHED)
  ================================= */
  static async getCreatorStats(userId) {
  const cacheKey = `creator:stats:${userId}`;

  const cachedData = await redis.get(cacheKey);
  if (cachedData) {
    return JSON.parse(cachedData);
  }

  const rawStats = await VideoEvent.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
      },
    },
    {
      $group: {
        _id: "$eventType",
        total: { $sum: 1 },
      },
    },
  ]);

  // 🔹 Convert to map
  const statsMap = {};
  rawStats.forEach((item) => {
    statsMap[item._id] = item.total;
  });

  const views = statsMap.VIEW || 0;
  const comments = statsMap.COMMENT || 0;

  // 🔹 Derived insights
  const engagementRate =
    views === 0 ? 0 : Number(((comments / views) * 100).toFixed(2));

  let contentHealth = "LOW";
  if (engagementRate >= 30) contentHealth = "EXCELLENT";
  else if (engagementRate >= 15) contentHealth = "GOOD";

  const finalStats = {
    totals: statsMap,
    insights: {
      engagementRate,
      contentHealth,
    },
  };

  await redis.set(cacheKey, JSON.stringify(finalStats), "EX", 60);

  return finalStats;
}
}
