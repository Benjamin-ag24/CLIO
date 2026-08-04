import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { pool } from "../db.js";

dotenv.config();

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const RESPONSE_SCHEMA = {
  type: "object",
  properties: {
    veredicto: {
      type: "string",
      enum: ["veraz", "dudoso", "falso"],
    },
    explicacion: {
      type: "string",
    },
  },
  required: ["veredicto", "explicacion"],
  additionalProperties: false,
};

const SYSTEM_PROMPT = `
Eres "Clio", un asistente de inteligencia artificial experto en verificar la veracidad de información histórica.

Tu tarea es analizar el texto que el usuario te proporciona y determinar si la información es verdadera, dudosa o falsa.

Reglas que debes seguir de manera estricta:
1. Solo respondes en formato JSON. Tu respuesta debe ser un objeto JSON válido con la siguiente estructura:
   {
     "veredicto": "veraz" | "dudoso" | "falso",
     "explicacion": "Aquí va tu explicación detallada en lenguaje simple."
   }
2. No incluyas texto adicional fuera del objeto JSON.
3. Eres estricto con el tema: si el texto no es sobre un hecho histórico, el veredicto debe ser "falso" y la explicación debe indicar que el tema no es histórico.
4. Explica tu razonamiento: siempre debes proporcionar una explicación clara.
5. Solo analizas párrafos o afirmaciones desarrolladas, no preguntas ni enunciados sueltos. Si el usuario envía una pregunta o una afirmación demasiado corta y sin contexto, el veredicto debe ser "dudoso" y la explicación debe indicar que el sistema analiza párrafos o afirmaciones desarrolladas sobre hechos históricos, no preguntas sueltas, y pedirle al usuario que reformule su texto como un enunciado afirmativo con más contexto.
`;

async function generateWithRetries(params, maxAttempts = 3) {
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      return await genAI.models.generateContent(params);
    } catch (error) {
      const isRateLimit = error.status === 503;
      const isLastAttempt = attempt === maxAttempts;

      if (!isRateLimit || isLastAttempt) {
        throw error;
      }

      const waitTime = 1000 * attempt;
      console.log(
        `Gemini saturado, reintentando en ${waitTime}ms (intento ${attempt}/${maxAttempts})`,
      );
      await new Promise((resolve) => setTimeout(resolve, waitTime));
    }
  }
}

function parseGeminiResponse(text) {
  try {
    const cleanJson = text
      .replace(/```json\s*/g, "")
      .replace(/```\s*/g, "")
      .trim();

    const parsedResponse = JSON.parse(cleanJson);

    return {
      verdict: parsedResponse.veredicto || "dudoso",
      explanation:
        parsedResponse.explicacion || "No se pudo determinar el resultado.",
    };
  } catch (parseError) {
    console.error("Error al parsear JSON de Gemini:", text);
    throw new Error("La IA no devolvió un formato válido");
  }
}

function getOriginalText(body) {
  const text = body?.text ?? body?.texto ?? body?.original_text;

  if (typeof text !== "string") {
    return "";
  }

  return text.trim();
}

export const createAnalysis = async (req, res) => {
  try {
    const originalText = getOriginalText(req.body);

    if (!originalText) {
      return res.status(400).json({ error: "El texto es obligatorio" });
    }

    const result = await generateWithRetries({
      model: "gemini-3.5-flash",
      contents: originalText,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        responseMimeType: "application/json",
        responseJsonSchema: RESPONSE_SCHEMA,
      },
    });

    const parsedResponse = parseGeminiResponse(result.text);
    const userId = Number(req.user?.sub ?? req.user?.id);

    const inserted = await pool.query(
      `INSERT INTO analysis (
        user_id,
        original_text,
        analyzed_text,
        verdict,
        explanation,
        keywords,
        is_deleted
      ) VALUES ($1, $2, $3, $4, $5, $6, false)
      RETURNING id, user_id, original_text, analyzed_text, verdict, explanation, keywords, is_deleted, created_at, updated_at`,
      [
        userId,
        originalText,
        parsedResponse.explanation,
        parsedResponse.verdict,
        parsedResponse.explanation,
        JSON.stringify([]),
      ],
    );

    return res.status(201).json(inserted.rows[0]);
  } catch (error) {
    console.error("Error al crear análisis:", error);

    if (error.message === "La IA no devolvió un formato válido") {
      return res.status(500).json({ error: error.message });
    }

    return res
      .status(500)
      .json({ error: "Error al procesar la solicitud con IA" });
  }
};

export const listAnalysis = async (req, res) => {
  try {
    const userId = Number(req.user?.sub ?? req.user?.id);

    const result = await pool.query(
      `SELECT id, user_id, original_text, analyzed_text, verdict, explanation, keywords, is_deleted, created_at, updated_at
       FROM analysis
       WHERE user_id = $1 AND is_deleted = false
       ORDER BY created_at DESC`,
      [userId],
    );

    return res.json(result.rows);
  } catch (error) {
    console.error("Error al listar análisis:", error);
    return res.status(500).json({ error: "Error al obtener los análisis" });
  }
};

export const updateAnalysis = async (req, res) => {
  try {
    const analysisId = Number(req.params.id);
    const originalText = getOriginalText(req.body);
    const userId = Number(req.user?.sub ?? req.user?.id);

    if (!originalText) {
      return res.status(400).json({ error: "El texto es obligatorio" });
    }

    const existing = await pool.query(
      `SELECT user_id FROM analysis WHERE id = $1 AND is_deleted = false`,
      [analysisId],
    );

    if (existing.rows.length === 0) {
      return res.status(404).json({ error: "Análisis no encontrado" });
    }

    if (existing.rows[0].user_id !== userId) {
      return res
        .status(403)
        .json({ error: "No tienes permisos para editar este análisis" });
    }

    const updated = await pool.query(
      `UPDATE analysis
       SET original_text = $1, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2 AND user_id = $3
       RETURNING id, user_id, original_text, analyzed_text, verdict, explanation, keywords, is_deleted, created_at, updated_at`,
      [originalText, analysisId, userId],
    );

    return res.json(updated.rows[0]);
  } catch (error) {
    console.error("Error al actualizar análisis:", error);
    return res.status(500).json({ error: "Error al actualizar el análisis" });
  }
};

export const deleteAnalysis = async (req, res) => {
  try {
    const analysisId = Number(req.params.id);
    const userId = Number(req.user?.sub ?? req.user?.id);

    const existing = await pool.query(
      `SELECT user_id FROM analysis WHERE id = $1 AND is_deleted = false`,
      [analysisId],
    );

    if (existing.rows.length === 0) {
      return res.status(404).json({ error: "Análisis no encontrado" });
    }

    if (existing.rows[0].user_id !== userId) {
      return res
        .status(403)
        .json({ error: "No tienes permisos para eliminar este análisis" });
    }

    const deleted = await pool.query(
      `UPDATE analysis
       SET is_deleted = true, updated_at = CURRENT_TIMESTAMP
       WHERE id = $1 AND user_id = $2
       RETURNING id, user_id, original_text, analyzed_text, verdict, explanation, keywords, is_deleted, created_at, updated_at`,
      [analysisId, userId],
    );

    return res.json({
      message: "Análisis eliminado correctamente",
      analysis: deleted.rows[0],
    });
  } catch (error) {
    console.error("Error al eliminar análisis:", error);
    return res.status(500).json({ error: "Error al eliminar el análisis" });
  }
};
