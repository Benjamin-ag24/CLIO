import { getAuthToken } from "./authStorage";
import { BACKEND_URL } from "../constants/configConstants";

const USERS_URL = `${BACKEND_URL}/admin/users`;

export const updateUser = async (userId, userData) => {
  const token = getAuthToken();

  const response = await fetch(`${USERS_URL}/${userId}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.error || "Error al actualizar el usuario",
    );
  }

  return data;
};

export const deleteUser = async (userId) => {
  const token = getAuthToken();

  const response = await fetch(`${USERS_URL}/${userId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.error || "Error al eliminar el usuario",
    );
  }

  return data;
};