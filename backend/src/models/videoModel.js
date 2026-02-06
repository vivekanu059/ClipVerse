import mongoose from "mongoose";

const videoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: String,

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    /* ORIGINAL FILE */
    originalUrl: {
      type: String,
      required: true,
    },

    /* HLS OUTPUT */
    hls: {
      masterPlaylist: String, // master.m3u8
      variants: [
        {
          resolution: String, // "240p", "360p", "720p"
          playlist: String,   // .m3u8 path
        },
      ],
    },

    /* PROCESSING STATUS */
    status: {
      type: String,
      enum: ["UPLOADED", "PROCESSING", "READY", "FAILED"],
      default: "UPLOADED",
    },

    duration: Number,
  },
  { timestamps: true }
);

export default mongoose.model("Video", videoSchema);
