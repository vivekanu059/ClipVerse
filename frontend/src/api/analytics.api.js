import api from "./axios";

/* Creator dashboard analytics */
export const getCreatorAnalytics = async () => {
  const res = await api.get("/analytics/creator");
  return res.data;
};

/* Per-video analytics (optional but backend-ready) */
export const getVideoAnalytics = async (videoId) => {
  const res = await api.get(`/analytics/video/${videoId}`);
  return res.data;
};
