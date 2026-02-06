import { Queue } from "bullmq";
import Redis from "ioredis";

export const connection = new Redis({
  host: process.env.REDIS_HOST || "redis",
  port: process.env.REDIS_PORT || 6379,
  maxRetriesPerRequest: null, // 🔑 REQUIRED
});

export const analyticsQueue = new Queue("analytics-queue", {
  connection: Redis,
});

export const videoTranscodeQueue = new Queue("video-transcode", {
  connection: Redis,
});
