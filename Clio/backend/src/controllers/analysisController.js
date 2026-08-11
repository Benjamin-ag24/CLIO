import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { AppDataSource } from "../config/database.js";

dotenv.config();

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const analysisRepository = AppDataSource.getRepository("Analysis");
const keywordRepository = AppDataSource.getRepository("Keyword"); // NUEVO

const RESPONSE_SCHEMA = {
  type: "object",
  properties: {
    verdict: {
      type: "string",
      enum: ["veraz", "dudoso", "falso"],
    },
    explanation: {
      type: "string",
    },
    keywords: {
      type: "array",
      items: { type: "string" },
    },
  },
  required: ["verdict", "explanation", "keywords"],
  additionalProperties: false,
};

const SYSTEM_PROMPT = `
Eres "Clio", un asistente de inteligencia artificial experto en verificar la veracidad de información histórica.

Tu tarea es analizar el texto que el usuario te proporciona y determinar si la información es verdadera, dudosa o falsa.

Reglas que debes seguir de manera estricta:
1. Solo respondes en formato JSON.
2. No incluyas texto adicional fuera del objeto JSON.
3. Si el texto no es sobre un hecho histórico, el veredicto debe ser "falso".
4. Explica siempre tu razonamiento de forma clara.
5. Solo analizas párrafos o afirmaciones desarrolladas, no preguntas ni enunciados sueltos.
6. Identifica entre 3 y 5 términos clave del texto (personas, lugares, fechas o eventos históricos relevantes) en "keywords".
`;

const generateWithRetries = async (params, maxAttempts = 3) => {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
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
};

const parseGeminiResponse = (text) => {
  try {
    const cleanJson = text
      .replace(/```json\s*/g, "")
      .replace(/```\s*/g, "")
      .trim();

    const parsedResponse = JSON.parse(cleanJson);

    return {
      verdict: parsedResponse.verdict || "dudoso",
      explanation:
        parsedResponse.explanation || "No se pudo determinar el resultado.",
      keywords: parsedResponse.keywords || [],
    };
  } catch {
    console.error("Error al parsear JSON de Gemini:", text);
    throw new Error("La IA no devolvió un formato válido");
  }
};

const getOriginalText = (body) => {
  const text = body?.text ?? body?.original_text;

  if (typeof text !== "string") {
    return "";
  }

  return text.trim();
};

// NUEVO: inserta cada keyword nueva en el catálogo, ignorando las que ya existen
const syncKeywordsCatalog = async (keywords) => {
  if (!Array.isArray(keywords) || keywords.length === 0) return;

  for (const keyword of keywords) {
    const trimmed = keyword.trim();
    if (!trimmed) continue;

    try {
      const existing = await keywordRepository.findOneBy({ keyword: trimmed });
      if (!existing) {
        const newKeyword = keywordRepository.create({ keyword: trimmed });
        await keywordRepository.save(newKeyword);
      }
    } catch (error) {
      console.error(`Error al sincronizar keyword "${trimmed}":`, error);
    }
  }
};

export const createAnalysis = async (req, res) => {
  try {
    const originalText = getOriginalText(req.body);

    if (!originalText) {
      return res.status(400).json({
        error: "El texto es obligatorio",
      });
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

    let savedAnalysis = null;
    let saved = true;

    try {
      const analysis = analysisRepository.create({
        user: {
          id: userId,
        },
        originalText,
        analyzedText: parsedResponse.explanation,
        verdict: parsedResponse.verdict,
        explanation: parsedResponse.explanation,
        keywords: parsedResponse.keywords,
        isDeleted: false,
      });

      savedAnalysis = await analysisRepository.save(analysis);

      await syncKeywordsCatalog(parsedResponse.keywords); // NUEVO
    } catch (dbError) {
      console.error("Error al guardar el análisis en la base de datos:", dbError);
      saved = false;
    }

    if (saved) {
      return res.status(201).json(savedAnalysis);
    }

    return res.status(201).json({
      verdict: parsedResponse.verdict,
      explanation: parsedResponse.explanation,
      keywords: parsedResponse.keywords,
      saved: false,
    });
  } catch (error) {
    console.error("Error al crear análisis:", error);

    if (error.message === "La IA no devolvió un formato válido") {
      return res.status(500).json({
        error: error.message,
      });
    }

    return res.status(500).json({
      error: "Error al procesar la solicitud con IA",
    });
  }
};

export const listAnalysis = async (req, res) => {
  try {
    const userId = Number(req.user?.sub ?? req.user?.id);

    const analyses = await analysisRepository.find({
      where: {
        user: {
          id: userId,
        },
        isDeleted: false,
      },
      order: {
        createdAt: "DESC",
      },
    });

    return res.json(analyses);
  } catch (error) {
    console.error("Error al listar análisis:", error);

    return res.status(500).json({
      error: "Error al obtener los análisis",
    });
  }
};

export const updateAnalysis = async (req, res) => {
  try {
    const analysisId = Number(req.params.id);
    const originalText = getOriginalText(req.body);
    const userId = Number(req.user?.sub ?? req.user?.id);

    if (!originalText) {
      return res.status(400).json({
        error: "El texto es obligatorio",
      });
    }

    const analysis = await analysisRepository.findOne({
      where: {
        id: analysisId,
        isDeleted: false,
      },
      relations: {
        user: true,
      },
    });

    if (!analysis) {
      return res.status(404).json({
        error: "Análisis no encontrado",
      });
    }

    if (analysis.user.id !== userId) {
      return res.status(403).json({
        error: "No tienes permisos para editar este análisis",
      });
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

    analysis.originalText = originalText;
    analysis.analyzedText = parsedResponse.explanation;
    analysis.verdict = parsedResponse.verdict;
    analysis.explanation = parsedResponse.explanation;
    analysis.keywords = parsedResponse.keywords;

    const updatedAnalysis = await analysisRepository.save(analysis);

    await syncKeywordsCatalog(parsedResponse.keywords); // NUEVO

    return res.json(updatedAnalysis);
  } catch (error) {
    console.error("Error al actualizar análisis:", error);

    return res.status(500).json({
      error: "Error al actualizar el análisis",
    });
  }
};

export const deleteAnalysis = async (req, res) => {
  try {
    const analysisId = Number(req.params.id);
    const userId = Number(req.user?.sub ?? req.user?.id);

    const analysis = await analysisRepository.findOne({
      where: {
        id: analysisId,
        isDeleted: false,
      },
      relations: {
        user: true,
      },
    });

    if (!analysis) {
      return res.status(404).json({
        error: "Análisis no encontrado",
      });
    }

    if (analysis.user.id !== userId) {
      return res.status(403).json({
        error: "No tienes permisos para eliminar este análisis",
      });
    }

    analysis.isDeleted = true;

    const deletedAnalysis = await analysisRepository.save(analysis);

    return res.json({
      message: "Análisis eliminado correctamente",
      analysis: deletedAnalysis,
    });
  } catch (error) {
    console.error("Error al eliminar análisis:", error);

    return res.status(500).json({
      error: "Error al eliminar el análisis",
    });
  }
};