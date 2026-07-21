// backend/server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Configurar Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// System Prompt (las reglas de Clio)
const SYSTEM_PROMPT = `
Eres "Clio", un asistente de inteligencia artificial experto en verificar la veracidad de información histórica.

Tu tarea es analizar el texto que el usuario te proporciona y determinar si la información es verdadera, dudosa o falsa.

Reglas que debes seguir de manera estricta:
1. **Solo respondes en formato JSON.** Tu respuesta debe ser un objeto JSON válido con la siguiente estructura:
   {
     "veredicto": "veraz" | "dudoso" | "falso",
     "explicacion": "Aquí va tu explicación detallada en lenguaje simple."
   }
2. **No incluyas texto adicional** fuera del objeto JSON.
3. **Eres estricto con el tema:** Si el texto no es sobre un hecho histórico, el veredicto debe ser "falso" y la explicación debe indicar que el tema no es histórico.
4. **Explica tu razonamiento:** Siempre debes proporcionar una explicación clara.
`;

// Endpoint para analizar texto
app.post("/api/analisar", async (req, res) => {
  try {
    const { texto } = req.body;

    // Validar que llegue texto
    if (!texto || texto.trim() === "") {
      return res.status(400).json({
        error: "El texto es obligatorio",
      });
    }

    // Configurar el modelo de Gemini
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash-exp", // o 'gemini-1.5-pro'
    });

    // Construir el prompt combinando System + User
    const prompt = `${SYSTEM_PROMPT}\n\nTexto del usuario: ${texto}`;

    // Llamar a Gemini
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Intentar parsear JSON
    let parsedResponse;
    try {
      // Limpiar posibles marcadores de código (```json ... ```)
      const cleanJson = text
        .replace(/```json\s*/g, "")
        .replace(/```\s*/g, "")
        .trim();
      parsedResponse = JSON.parse(cleanJson);
    } catch (parseError) {
      console.error("Error al parsear JSON:", text);
      return res.status(500).json({
        error: "La IA no devolvió un formato válido",
      });
    }

    // Devolver respuesta estructurada
    res.json({
      veredicto: parsedResponse.veredicto || "dudoso",
      explicacion:
        parsedResponse.explicacion || "No se pudo determinar el resultado.",
    });
  } catch (error) {
    console.error("Error en el servidor:", error);
    res.status(500).json({
      error: "Error al procesar la solicitud con IA",
    });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`✅ Servidor Clio corriendo en http://localhost:${PORT}`);
});
