import api from "./axios";

export const likeVideo = async (videoId) => {
  const res = await api.post(`/likes/${videoId}`);
  return res.data;
};

export const unlikeVideo = async (videoId) => {
  const res = await api.delete(`/likes/${videoId}`);
  return res.data;
};
