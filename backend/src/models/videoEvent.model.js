import mongoose from "mongoose";

const videoEventSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    videoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Video",
    },
    eventType: {
      type: String,
      enum: ["UPLOAD", "VIEW", "LIKE", "COMMENT", "SUBSCRIBE"],
      required: true,
    },
    watchTime: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);
videoEventSchema.index({ videoId: 1, eventType: 1 });
videoEventSchema.index({ userId: 1 });
videoEventSchema.index({ createdAt: -1 });


export default mongoose.model("VideoEvent", videoEventSchema);
