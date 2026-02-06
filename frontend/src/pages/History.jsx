import { useEffect, useState } from "react";
import api from "../api/axios";

export default function History() {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    api.get("/users/history").then(res => {
      setVideos(res.data.data || []);
    });
  }, []);

  return (
    <div>
      <h2>Watch History</h2>
      {videos.map(v => <p key={v._id}>{v.title}</p>)}
    </div>
  );
}
