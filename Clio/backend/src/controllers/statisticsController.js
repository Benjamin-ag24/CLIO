import { AppDataSource } from "../config/database.js";

export const getStatistics = async (req, res) => {
  try {
    const { from, to } = req.query;

    const summaryResult = await AppDataSource.query(
      `SELECT * FROM view_general_summary`
    );

    let byDateQuery = `SELECT * FROM view_analysis_by_date`;
    const queryParams = [];

    if (from && to) {
      byDateQuery += ` WHERE analysis_date BETWEEN $1 AND $2`;
      queryParams.push(from, to);
    }

    byDateQuery += ` ORDER BY analysis_date ASC`;

    const byDateResult = await AppDataSource.query(byDateQuery, queryParams);

    const topKeywordsResult = await AppDataSource.query(
      `SELECT * FROM view_most_used_keywords LIMIT 15`
    );

    const summary = summaryResult[0] || {};

    return res.json({
      summary: {
        totalAnalyses: Number(summary.total_analyses) || 0,
        totalActiveUsers: Number(summary.total_active_users) || 0,
        verdictBreakdown: {
          veraz: Number(summary.veraz_total) || 0,
          dudoso: Number(summary.dudoso_total) || 0,
          falso: Number(summary.falso_total) || 0,
        },
      },
      byDate: byDateResult.map((row) => ({
        date: row.analysis_date,
        total: Number(row.total),
        veraz: Number(row.veraz_count),
        dudoso: Number(row.dudoso_count),
        falso: Number(row.falso_count),
      })),
      topKeywords: topKeywordsResult.map((row) => ({
        keyword: row.keyword,
        count: Number(row.usage_count),
      })),
    });
  } catch (error) {
    console.error("Error al obtener estadísticas:", error);
    return res.status(500).json({
      error: "Error al obtener las estadísticas",
    });
  }
};