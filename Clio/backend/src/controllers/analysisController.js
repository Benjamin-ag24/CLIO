import { AppDataSource } from "../config/database.js";
import { analyzeWithGemini } from "../services/geminiService.js";

const analysisRepository = AppDataSource.getRepository("Analysis");

const getOriginalText = (body) => {
  const text = body?.text ?? body?.original_text;

  if (typeof text !== "string") {
    return "";
  }

  return text.trim();
};

const syncKeywordsCatalog = async (keywords, manager) => {
  if (!Array.isArray(keywords) || keywords.length === 0) {
    return;
  }

  const keywordRepository = manager.getRepository("Keyword");

  for (const keyword of keywords) {
    if (typeof keyword !== "string") {
      continue;
    }

    const trimmed = keyword.trim();

    if (!trimmed) {
      continue;
    }

    try {
      const existing = await keywordRepository.findOneBy({
        keyword: trimmed,
      });

      if (!existing) {
        const newKeyword = keywordRepository.create({
          keyword: trimmed,
        });

        await keywordRepository.save(newKeyword);
      }
    } catch (error) {
      console.error(
        `Error al sincronizar keyword "${trimmed}":`,
        error,
      );
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

    const parsedResponse = await analyzeWithGemini(originalText);

    const userId = Number(req.user?.sub ?? req.user?.id);

    if (!Number.isInteger(userId) || userId <= 0) {
      return res.status(401).json({
        error: "Usuario no autenticado",
      });
    }

    const savedAnalysis = await AppDataSource.transaction(
      async (manager) => {
        // Set the current user only for this transaction.
        await manager.query(
          "SELECT set_config('app.current_user_id', $1, true)",
          [String(userId)],
        );

        const analysisRepository =
          manager.getRepository("Analysis");

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

        const savedAnalysis =
          await analysisRepository.save(analysis);

        await syncKeywordsCatalog(
          parsedResponse.keywords,
          manager,
        );

        return savedAnalysis;
      },
    );

    return res.status(201).json(savedAnalysis);
  } catch (error) {
    console.error("Error al crear análisis:", error);

    if (
      error.message ===
      "La IA no devolvió un formato válido"
    ) {
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
    const userId = Number(
      req.user?.sub ?? req.user?.id,
    );

    if (!Number.isInteger(userId) || userId <= 0) {
      return res.status(401).json({
        error: "Usuario no autenticado",
      });
    }

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

export const getAnalysisById = async (req, res) => {
  try {
    const analysisId = Number(req.params.id);
    const userId = Number(
      req.user?.sub ?? req.user?.id,
    );

    if (!Number.isInteger(analysisId) || analysisId <= 0) {
      return res.status(400).json({
        error: "ID de análisis inválido",
      });
    }

    if (!Number.isInteger(userId) || userId <= 0) {
      return res.status(401).json({
        error: "Usuario no autenticado",
      });
    }

    const analysis = await analysisRepository.findOne({
      where: {
        id: analysisId,
        isDeleted: false,
        user: {
          id: userId,
        },
      },
    });

    if (!analysis) {
      return res.status(404).json({
        error: "Análisis no encontrado",
      });
    }

    return res.json(analysis);
  } catch (error) {
    console.error("Error al obtener análisis:", error);

    return res.status(500).json({
      error: "Error al obtener el análisis",
    });
  }
};

export const updateAnalysis = async (req, res) => {
  try {
    const analysisId = Number(req.params.id);
    const originalText = getOriginalText(req.body);
    const userId = Number(
      req.user?.sub ?? req.user?.id,
    );

    if (!Number.isInteger(analysisId) || analysisId <= 0) {
      return res.status(400).json({
        error: "ID de análisis inválido",
      });
    }

    if (!originalText) {
      return res.status(400).json({
        error: "El texto es obligatorio",
      });
    }

    if (!Number.isInteger(userId) || userId <= 0) {
      return res.status(401).json({
        error: "Usuario no autenticado",
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

    const parsedResponse =
      await analyzeWithGemini(originalText);

    analysis.originalText = originalText;
    analysis.analyzedText = parsedResponse.explanation;
    analysis.verdict = parsedResponse.verdict;
    analysis.explanation = parsedResponse.explanation;
    analysis.keywords = parsedResponse.keywords;

    const updatedAnalysis =
      await AppDataSource.transaction(
        async (manager) => {
          // Set the current user only for this transaction.
          await manager.query(
            "SELECT set_config('app.current_user_id', $1, true)",
            [String(userId)],
          );

          const analysisRepository =
            manager.getRepository("Analysis");

          const savedAnalysis =
            await analysisRepository.save(analysis);

          await syncKeywordsCatalog(
            parsedResponse.keywords,
            manager,
          );

          return savedAnalysis;
        },
      );

    return res.json(updatedAnalysis);
  } catch (error) {
    console.error(
      "Error al actualizar análisis:",
      error,
    );

    if (
      error.message ===
      "La IA no devolvió un formato válido"
    ) {
      return res.status(500).json({
        error: error.message,
      });
    }

    return res.status(500).json({
      error: "Error al actualizar el análisis",
    });
  }
};

export const deleteAnalysis = async (req, res) => {
  try {
    const analysisId = Number(req.params.id);
    const userId = Number(
      req.user?.sub ?? req.user?.id,
    );

    if (!Number.isInteger(analysisId) || analysisId <= 0) {
      return res.status(400).json({
        error: "ID de análisis inválido",
      });
    }

    if (!Number.isInteger(userId) || userId <= 0) {
      return res.status(401).json({
        error: "Usuario no autenticado",
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
        error: "No tienes permisos para eliminar este análisis",
      });
    }

    analysis.isDeleted = true;

    const deletedAnalysis =
      await AppDataSource.transaction(
        async (manager) => {
          // Set the current user only for this transaction.
          await manager.query(
            "SELECT set_config('app.current_user_id', $1, true)",
            [String(userId)],
          );

          const analysisRepository =
            manager.getRepository("Analysis");

          return await analysisRepository.save(analysis);
        },
      );

    return res.json({
      message: "Análisis eliminado correctamente",
      analysis: deletedAnalysis,
    });
  } catch (error) {
    console.error(
      "Error al eliminar análisis:",
      error,
    );

    return res.status(500).json({
      error: "Error al eliminar el análisis",
    });
  }
};