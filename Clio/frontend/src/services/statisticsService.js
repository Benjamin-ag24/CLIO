import { getAuthToken } from "./authStorage";

const API_URL = "http://localhost:3000/api/admin/statistics";

export const getStatistics = async ({ from, to } = {}) => {
  try {
    const params = new URLSearchParams();
    if (from) params.append("from", from);
    if (to) params.append("to", to);

    const url = params.toString() ? `${API_URL}?${params}` : API_URL;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    });

    if (!response.ok) {
      throw {
        code: "STATISTICS_ERROR",
        message: "No fue posible cargar las estadísticas.",
      };
    }

    return await response.json();
  } catch (error) {
    throw {
      code: error.code || "NETWORK_ERROR",
      message: error.message || "No fue posible conectarse con el servidor.",
    };
  }
};