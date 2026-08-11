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
    return res.status(500).json({ error: "Error al obtener las palabras clave" });
  }
};

export const createKeyword = async (req, res) => {
  try {
    const { keyword } = req.body;

    if (!keyword || !keyword.trim()) {
      return res.status(400).json({ error: "La palabra clave es obligatoria" });
    }

    const existing = await keywordRepository.findOneBy({
      keyword: keyword.trim(),
    });

    if (existing) {
      return res.status(400).json({ error: "Esa palabra clave ya existe" });
    }

    const newKeyword = keywordRepository.create({ keyword: keyword.trim() });
    const saved = await keywordRepository.save(newKeyword);

    return res.status(201).json(saved);
  } catch (error) {
    console.error("Error al crear keyword:", error);
    return res.status(500).json({ error: "Error al crear la palabra clave" });
  }
};

export const deleteKeyword = async (req, res) => {
  try {
    const keywordId = Number(req.params.id);

    const existing = await keywordRepository.findOneBy({ id: keywordId });

    if (!existing) {
      return res.status(404).json({ error: "Palabra clave no encontrada" });
    }

    await keywordRepository.remove(existing);

    return res.json({ message: "Palabra clave eliminada correctamente" });
  } catch (error) {
    console.error("Error al eliminar keyword:", error);
    return res.status(500).json({ error: "Error al eliminar la palabra clave" });
  }
};