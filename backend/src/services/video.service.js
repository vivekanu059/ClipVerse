import Video from "../models/video.model.js";
import { videoTranscodeQueue } from "../config/queue.js";
import { uploadFile } from "../utils/minioUpload.js";
import path from "path";

class VideoService {
  async uploadVideo(userId, data) {
    const { title, description } = data;
    const file = data.videoFile;

    if (!file) throw new Error("Video file is required");

    const objectName = `original/${Date.now()}-${file.originalname}`;

    const originalUrl = await uploadFile(file.path, objectName);

    const video = await Video.create({
      title,
      description,
      owner: userId,
      originalUrl,
      status: "UPLOADED",
    });

    await videoTranscodeQueue.add("transcode", {
      videoId: video._id,
      originalUrl,
    });

    return video;
  }
}

export const videoService = new VideoService();
