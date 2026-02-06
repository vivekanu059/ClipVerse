import api from "./axios";

export const getVideoById = async (videoId) => {
  const res = await api.get(`/videos/${videoId}`);
  return res.data;
};

export const likeVideo = async (videoId) => {
  const res = await api.post(`/likes/${videoId}`);
  return res.data;
};

export const unlikeVideo = async (videoId) => {
  const res = await api.delete(`/likes/${videoId}`);
  return res.data;
};

export const getComments = async (videoId) => {
  const res = await api.get(`/comments/${videoId}`);
  return res.data;
};

export const addComment = async (videoId, text) => {
  const res = await api.post(`/comments/${videoId}`, { text });
  return res.data;
};
