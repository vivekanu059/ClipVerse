import { Worker } from "bullmq";
import Redis from "ioredis";
import mongoose from "mongoose";
import dotenv from "dotenv";
import VideoEvent from "../models/videoEvent.model.js";

dotenv.config({ path: ".env.local" });

/* ================================
   1️⃣ CONNECT TO MONGODB (MANDATORY)
================================ */

const connectDB = async () => {
  try {
    console.log("Worker MONGO URI:", process.env.MONGODB_URI);

    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Worker connected to MongoDB");
  } catch (err) {
    console.error("❌ Worker MongoDB connection failed", err);
    process.exit(1);
  }
};

await connectDB();

/* ================================
   2️⃣ REDIS CONNECTION
================================ */

const connection = new Redis({
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: process.env.REDIS_PORT || 6379,
  maxRetriesPerRequest: null, // required by bullmq
});

/* ================================
   3️⃣ ANALYTICS WORKER
================================ */

const analyticsWorker = new Worker(
  "analytics-queue", // 🔥 MUST MATCH QUEUE NAME
  async (job) => {
    console.log("[WORKER] Job received", {
      jobId: job.id,
      eventType: job.data.eventType,
    });

    // Persist analytics event
    await VideoEvent.create({
      userId: job.data.userId,
      videoId: job.data.videoId,
      eventType: job.data.eventType,
      watchTime: job.data.watchTime || 0,
    });

    console.log("[WORKER] Job processed successfully", {
      jobId: job.id,
    });
  },
  { connection }
);

/* ================================
   4️⃣ WORKER EVENTS
================================ */

analyticsWorker.on("completed", (job) => {
  console.log(`✅ Analytics job completed: ${job.id}`);
});

analyticsWorker.on("failed", (job, err) => {
  console.error("[❌ WORKER ERROR]", {
    jobId: job?.id,
    error: err.message,
  });
});

/* ================================
   5️⃣ GRACEFUL SHUTDOWN
================================ */

const shutdown = async () => {
  console.log("🛑 Shutting down analytics worker...");
  await analyticsWorker.close();
  await mongoose.connection.close();
  process.exit(0);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
