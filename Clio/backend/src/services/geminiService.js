import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { SYSTEM_PROMPT, RESPONSE_SCHEMA } from "../config/aiPrompt.js";

dotenv.config();

const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

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
      .replace(/```json\s*/gi, "")
      .replace(/```\s*/g, "")
      .trim();

    const parsedResponse = JSON.parse(cleanJson);

    return {
      verdict: parsedResponse.verdict || "dudoso",
      explanation:
        parsedResponse.explanation || "No se pudo determinar el resultado.",
      keywords: Array.isArray(parsedResponse.keywords)
        ? parsedResponse.keywords
        : [],
    };
  } catch {
    console.error("Error al parsear JSON de Gemini:", text);

    throw new Error("La IA no devolvió un formato válido");
  }
};

export const analyzeWithGemini = async (originalText) => {
  const result = await generateWithRetries({
    model: "gemini-3.5-flash",
    contents: originalText,
    config: {
      systemInstruction: SYSTEM_PROMPT,
      responseMimeType: "application/json",
      responseJsonSchema: RESPONSE_SCHEMA,
    },
  });

  return parseGeminiResponse(result.text);
};