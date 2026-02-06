import api from "./axios";

export const getComments = async (videoId) => {
  const res = await api.get(`/comments/${videoId}`);
  return res.data;
};

export const addComment = async (videoId, content) => {
  const res = await api.post(`/comments/${videoId}`, { content });
  return res.data;
};
