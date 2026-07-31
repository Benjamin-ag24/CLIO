// backend/server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import jwt from "jsonwebtoken"; // NUEVO
import bcrypt from "bcryptjs"; // NUEVO
import { findUserByUsername } from "./users.js"; // NUEVO
import { verifyToken } from "./authMiddleware.js"; // NUEVO

dotenv.config();

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Configurar Gemini
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
5. **Solo analizas párrafos o afirmaciones desarrolladas, no preguntas ni enunciados sueltos.** Si el usuario envía una pregunta (por ejemplo, algo que termina en "?" o empieza con "¿", "quién fue...", "cuándo ocurrió...") o una afirmación demasiado corta y sin contexto (menos de una oración completa con sujeto, verbo y detalle), el veredicto debe ser "dudoso" y la explicación debe indicar que el sistema analiza párrafos o afirmaciones desarrolladas sobre hechos históricos, no preguntas sueltas, y pedirle al usuario que reformule su texto como un enunciado afirmativo con más contexto (ejemplo: en vez de "¿Simón Bolívar fue conquistador de Europa?", escribir "Simón Bolívar fue un conquistador que dominó gran parte de Europa en el siglo XIX").
`;

// Función auxiliar: reintenta la llamada a Gemini si hay error 503 (saturación)
async function generarConReintentos(params, maxIntentos = 3) {
  for (let intento = 1; intento <= maxIntentos; intento++) {
    try {
      return await genAI.models.generateContent(params);
    } catch (error) {
      const esSaturacion = error.status === 503;
      const esUltimoIntento = intento === maxIntentos;

      if (!esSaturacion || esUltimoIntento) {
        throw error; // no reintentar otros errores, o si ya se acabaron los intentos
      }

      const espera = 1000 * intento; // 1s, 2s, 3s
      console.log(
        `Gemini saturado, reintentando en ${espera}ms (intento ${intento}/${maxIntentos})`
      );
      await new Promise((resolve) => setTimeout(resolve, espera));
    }
  }
}

// NUEVO: Endpoint de login
app.post("/api/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "Usuario y contraseña son obligatorios" });
    }

    const user = findUserByUsername(username);
    if (!user) {
      return res.status(400).json({ error: "Usuario no encontrado" });
    }

    const validPassword = await bcrypt.compare(password, user.passwordHash);
    if (!validPassword) {
      return res.status(400).json({ error: "Contraseña incorrecta" });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.json({ token });
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ error: "Error al iniciar sesión" });
  }
});

// Endpoint para analizar texto
// NUEVO: se agregó "verifyToken" como segundo argumento para proteger esta ruta
app.post("/api/analisar", verifyToken, async (req, res) => {
  try {
    const { texto } = req.body;

    // Validar que llegue texto
    if (!texto || texto.trim() === "") {
      return res.status(400).json({
        error: "El texto es obligatorio",
      });
    }

    // Llamar a Gemini (con reintentos automáticos si está saturado)
    const result = await generarConReintentos({
      model: "gemini-3.5-flash",
      contents: texto.trim(),
      config: {
        systemInstruction: SYSTEM_PROMPT,
        responseMimeType: "application/json",
        responseJsonSchema: RESPONSE_SCHEMA,
      },
    });
    const text = result.text;

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