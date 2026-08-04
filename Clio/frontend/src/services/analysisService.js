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
        text,
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
      verdict: data.veredicto,

      explanation: data.explicacion,
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
