import { getAuthToken } from "./authStorage";

const API_URL =
  "http://localhost:3000/api/admin/audit";

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