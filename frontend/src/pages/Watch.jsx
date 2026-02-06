import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import Hls from "hls.js";
import { getVideoById } from "../api/video.api";

export default function Watch() {
  const { videoId } = useParams();
  const videoRef = useRef(null);

  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadVideo = async () => {
      const res = await getVideoById(videoId);
      setVideo(res.data.data);
      setLoading(false);
    };
    loadVideo();
  }, [videoId]);

  useEffect(() => {
    if (!video || video.status !== "READY") return;

    const videoEl = videoRef.current;
    const hlsUrl = video.hls?.masterPlaylist;

    if (!hlsUrl) return;

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(hlsUrl);
      hls.attachMedia(videoEl);
      return () => hls.destroy();
    } else if (videoEl.canPlayType("application/vnd.apple.mpegurl")) {
      videoEl.src = hlsUrl;
    }
  }, [video]);

  if (loading) return <p>Loading video...</p>;

  if (video.status === "PROCESSING") {
    return <p>⏳ Video is still processing. Please wait.</p>;
  }

  if (video.status === "FAILED") {
    return <p>❌ Video processing failed.</p>;
  }

  return (
    <div>
      <h2>{video.title}</h2>

      <video
        ref={videoRef}
        controls
        style={{ width: "100%", maxWidth: 800 }}
      />
    </div>
  );
}
