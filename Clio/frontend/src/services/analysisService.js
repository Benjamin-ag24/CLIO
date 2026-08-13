import { getAuthToken } from "./authStorage";

const API_URL = "http://localhost:3000/api/analysis";

export const analyzeText = async (text) => {
  try {
    if (!text || text.trim() === "") {
      throw {
        code: "EMPTY_TEXT",
        message: "No se ingresó ningún texto para analizar.",
      };
    }

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getAuthToken()}`,
      },
      body: JSON.stringify({
        original_text: text,
      }),
    });

    if (!response.ok) {
      throw {
        code: "API_ERROR",
        message:
          "Ocurrió un error al comunicarse con el servicio de inteligencia artificial.",
      };
    }

    const data = await response.json();

    return {
      verdict: data.verdict,
      explanation: data.explanation,
    };
  } catch (error) {
    throw {
      code: error.code || "NETWORK_ERROR",
      message:
        error.message ||
        "No fue posible conectarse con la inteligencia artificial.",
    };
  }
};

export const getAnalysisById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    });

    if (!response.ok) {
      throw {
        code: "API_ERROR",
        message: "No se pudo obtener el análisis.",
      };
    }

    return await response.json();
  } catch (error) {
    throw {
      code: error.code || "NETWORK_ERROR",
      message:
        error.message ||
        "No fue posible obtener el análisis.",
    };
  }
};

export const updateAnalysis = async (id, text) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getAuthToken()}`,
      },
      body: JSON.stringify({
        original_text: text,
      }),
    });

    if (!response.ok) {
      throw {
        code: "API_ERROR",
        message: "No se pudo editar el análisis.",
      };
    }

    return await response.json();
  } catch (error) {
    throw {
      code: error.code || "NETWORK_ERROR",
      message:
        error.message ||
        "No fue posible editar el análisis.",
    };
  }
};

export const deleteAnalysis = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    });

    if (!response.ok) {
      throw {
        code: "API_ERROR",
        message: "No se pudo eliminar el análisis.",
      };
    }

    return await response.json();
  } catch (error) {
    throw {
      code: error.code || "NETWORK_ERROR",
      message:
        error.message ||
        "No fue posible eliminar el análisis.",
    };
  }
};

export const getAnalysisHistory = async () => {
  try {
    const response = await fetch(API_URL, {
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
    });

    if (!response.ok) {
      throw {
        code: "API_ERROR",
        message: "No fue posible cargar el historial.",
      };
    }

    return await response.json();
  } catch (error) {
    throw {
      code: error.code || "NETWORK_ERROR",
      message:
        error.message ||
        "No fue posible cargar el historial.",
    };
  }
};