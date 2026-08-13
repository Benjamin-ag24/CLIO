import { AppDataSource } from "../config/database.js";

const keywordRepository = AppDataSource.getRepository("Keyword");

export const listKeywords = async (req, res) => {
  try {
    const keywords = await AppDataSource.query(
      `SELECT * FROM view_keywords_catalog`
    );

    return res.json(keywords);
  } catch (error) {
    console.error("Error al listar keywords:", error);

    return res.status(500).json({
      error: "Error al obtener las palabras clave",
    });
  }
};

export const createKeyword = async (req, res) => {
  try {
    const { keyword } = req.body;

    const userId = Number(
      req.user?.sub ?? req.user?.id
    );

    if (!Number.isInteger(userId) || userId <= 0) {
      return res.status(401).json({
        error: "Usuario no autenticado",
      });
    }

    if (!keyword || !keyword.trim()) {
      return res.status(400).json({
        error: "La palabra clave es obligatoria",
      });
    }

    const existing = await keywordRepository.findOneBy({
      keyword: keyword.trim(),
    });

    if (existing) {
      return res.status(400).json({
        error: "Esa palabra clave ya existe",
      });
    }

    const saved = await AppDataSource.transaction(
      async (manager) => {
        await manager.query(
          "SET LOCAL app.current_user_id = $1",
          [userId]
        );

        const keywordRepo = manager.getRepository("Keyword");

        const newKeyword = keywordRepo.create({
          keyword: keyword.trim(),
        });

        return await keywordRepo.save(newKeyword);
      }
    );

    return res.status(201).json(saved);
  } catch (error) {
    console.error("Error al crear keyword:", error);

    return res.status(500).json({
      error: "Error al crear la palabra clave",
    });
  }
};

export const deleteKeyword = async (req, res) => {
  try {
    const keywordId = Number(req.params.id);

    const userId = Number(
      req.user?.sub ?? req.user?.id
    );

    if (!Number.isInteger(userId) || userId <= 0) {
      return res.status(401).json({
        error: "Usuario no autenticado",
      });
    }

    if (!Number.isInteger(keywordId) || keywordId <= 0) {
      return res.status(400).json({
        error: "ID de keyword inválido",
      });
    }

    const existing = await keywordRepository.findOneBy({
      id: keywordId,
    });

    if (!existing) {
      return res.status(404).json({
        error: "Palabra clave no encontrada",
      });
    }

    await AppDataSource.transaction(
      async (manager) => {
        await manager.query(
          "SET LOCAL app.current_user_id = $1",
          [userId]
        );

        const keywordRepo = manager.getRepository("Keyword");

        await keywordRepo.remove(existing);
      }
    );

    return res.json({
      message: "Palabra clave eliminada correctamente",
    });
  } catch (error) {
    console.error("Error al eliminar keyword:", error);

    return res.status(500).json({
      error: "Error al eliminar la palabra clave",
    });
  }
};