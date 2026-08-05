// frontend/src/services/authStorage.js

const TOKEN_KEY = "clio_token";
const USER_KEY = "clio_usuario";

export const saveAuthSession = (token, user) => {
  localStorage.setItem(TOKEN_KEY, token);

  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
};

export const getAuthToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const getAuthUser = () => {
  const data = localStorage.getItem(USER_KEY);

  if (!data || data === "undefined") {
    return null;
  }

  try {
    return JSON.parse(data);
  } catch (error) {
    console.error("Invalid auth user data:", error);
    localStorage.removeItem(USER_KEY);
    return null;
  }
};

export const clearAuthSession = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};