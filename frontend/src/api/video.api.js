import api from "./axios";

/* Upload video */
export const uploadVideo = async (formData) => {
  const res = await api.post("/videos/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

/* Get all videos (Home page) */
export const getAllVideos = async () => {
  const res = await api.get("/videos");
  return res.data;
};

/* Get single video */
export const getVideoById = async (videoId) => {
  const res = await api.get(`/videos/${videoId}`);
  return res.data;
};
