import { getAuthToken } from "./authStorage";

const API_URL = "http://localhost:3000/api/analysis";

export const analyzeText = async (text) => {
  try {
    // Validar que exista texto
    if (!text || text.trim() === "") {
      throw {
        code: "EMPTY_TEXT",
        message: "No se ingresó ningún texto para analizar.",
      };
    }

    // Enviar texto al backend
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

    // Verificar si la API respondió con error
    if (!response.ok) {
      throw {
        code: "API_ERROR",
        message:
          "Ocurrió un error al comunicarse con el servicio de inteligencia artificial.",
      };
    }

    // Obtener respuesta del backend
    const data = await response.json();

    // Devolver objeto estructurado
    return {
      verdict: data.verdict,
      explanation: data.explanation,
    };
  } catch (error) {
    // Error de red o error controlado
    throw {
      code: error.code || "NETWORK_ERROR",
      message:
        error.message ||
        "No fue posible conectarse con la inteligencia artificial.",
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
      message: error.message || "No fue posible editar el análisis.",
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
      message: error.message || "No fue posible eliminar el análisis.",
    };
  }
};
