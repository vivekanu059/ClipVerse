import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import { Worker } from "bullmq";
import Redis from "ioredis";
import fs from "fs";
import path from "path";
import util from "util";
import { exec } from "child_process";

import Video from "../models/videoModel.js";
import { uploadFile } from "../utils/minioUpload.js";

const execAsync = util.promisify(exec);

/* ===============================
   MongoDB
================================ */
await mongoose.connect(process.env.MONGODB_URI);
console.log("✅ Transcode Worker MongoDB connected");

/* ===============================
   Redis (BullMQ requirement)
================================ */
const redisConnection = new Redis({
  host: process.env.REDIS_HOST || "redis",
  port: Number(process.env.REDIS_PORT) || 6379,
  maxRetriesPerRequest: null, // REQUIRED by BullMQ
});

/* ===============================
   Worker
================================ */
const worker = new Worker(
  "video-transcode",
  async (job) => {
    const { videoId, originalUrl } = job.data;
    console.log("🎬 Transcoding started", videoId);

    const baseDir = path.join("/tmp", videoId.toString());
    const inputPath = path.join(baseDir, "input.mp4");
    const outputDir = path.join(baseDir, "hls");

    fs.mkdirSync(outputDir, { recursive: true });

    await execAsync(`curl -L "${originalUrl}" -o "${inputPath}"`);

    await execAsync(`
      ffmpeg -y -i "${inputPath}" \
      -filter_complex "[0:v]split=3[v1][v2][v3]" \
      -map "[v1]" -s 426x240 -b:v 400k \
      -map "[v2]" -s 640x360 -b:v 800k \
      -map "[v3]" -s 1280x720 -b:v 2500k \
      -f hls \
      -hls_time 4 \
      -hls_playlist_type vod \
      "${outputDir}/master.m3u8"
    `);

    const masterUrl = await uploadFile(
      path.join(outputDir, "master.m3u8"),
      `hls/${videoId}/master.m3u8`
    );

    await Video.findByIdAndUpdate(videoId, {
      status: "READY",
      hls: { masterPlaylist: masterUrl },
    });

    console.log("✅ Transcoding completed", videoId);
  },
  { connection: redisConnection }
);
