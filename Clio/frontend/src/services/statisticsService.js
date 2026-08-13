import { getAuthToken } from "./authStorage";

const API_URL = "http://localhost:3000/api/statistics";

export const getStatistics = async (from, to) => {
  const params = new URLSearchParams();

  if (from) {
    params.append("from", from);
  }

  if (to) {
    params.append("to", to);
  }

  const queryString = params.toString();

  const url = queryString
    ? `${API_URL}?${queryString}`
    : API_URL;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.error || "Error al obtener las estadísticas",
    );
  }

  return data;
};