import { getAuthToken } from "./authStorage";
import { BACKEND_URL } from "../constants/configConstants";

const API_URL = `${BACKEND_URL}/admin/audit`;

export const getAuditLog = async (
  analysisId = null,
) => {
  const token = getAuthToken();

  const url = analysisId
    ? `${API_URL}?analysisId=${analysisId}`
    : API_URL;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data?.error ||
        "No fue posible obtener el registro de auditoría.",
    );
  }

  return data;
};