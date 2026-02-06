import api from "./axios";

export const loginUser = async ({ email, password }) => {
  const res = await api.post("/users/login", { email, password });
  return res.data;
};

export const registerUser = async (formData) => {
  const res = await api.post("/users/register", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const logoutUser = async () => {
  const res = await api.post("/users/logout");
  return res.data;
};
