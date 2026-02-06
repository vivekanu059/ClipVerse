export const getAuth = () => {
  try {
    const raw = localStorage.getItem("auth");
    return raw ? JSON.parse(raw) : null;
  } catch {
    localStorage.removeItem("auth");
    return null;
  }
};

export const setAuth = (data) => {
  localStorage.setItem("auth", JSON.stringify(data));
};

export const clearAuth = () => {
  localStorage.removeItem("auth");
};
