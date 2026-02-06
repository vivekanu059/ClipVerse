import { useEffect, useState } from "react";
import { getAllVideos } from "../api/video.api";
import { Link } from "react-router-dom";

export default function Home() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadVideos = async () => {
      const res = await getAllVideos();
      setVideos(res.data.data || []);
      setLoading(false);
    };
    loadVideos();
  }, []);

  if (loading) return <p>Loading videos...</p>;

  return (
    <div>
      <h2>Videos</h2>

      {videos.map((video) => (
        <div key={video._id} style={{ marginBottom: 20 }}>
          <h4>{video.title}</h4>

          {video.status === "READY" && (
            <Link to={`/watch/${video._id}`}>▶ Watch</Link>
          )}

          {video.status === "PROCESSING" && (
            <p>⏳ Processing video…</p>
          )}

          {video.status === "UPLOADED" && (
            <p>📥 Queued for processing</p>
          )}

          {video.status === "FAILED" && (
            <p style={{ color: "red" }}>❌ Processing failed</p>
          )}
        </div>
      ))}
    </div>
  );
}
