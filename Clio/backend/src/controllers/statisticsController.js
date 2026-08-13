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

    const byDateResult = await AppDataSource.query(
      byDateQuery,
      queryParams
    );

    const topKeywordsResult = await AppDataSource.query(
      `SELECT * FROM view_most_used_keywords LIMIT 15`
    );

    const topUsersResult = await AppDataSource.query(
      `SELECT * FROM view_top_users`
    );

    const summary = summaryResult[0] || {};

    return res.json({
      summary: {
        totalAnalyses: Number(summary.total_analyses) || 0,
        totalActiveUsers: Number(summary.total_active_users) || 0,

        verdictBreakdown: {
          veraz: Number(summary.truthful_total) || 0,
          dudoso: Number(summary.uncertain_total) || 0,
          falso: Number(summary.false_total) || 0,
        },
      },

      byDate: byDateResult.map((row) => ({
        date: row.analysis_date,
        total: Number(row.total) || 0,
        veraz: Number(row.truthful_count) || 0,
        dudoso: Number(row.uncertain_count) || 0,
        falso: Number(row.false_count) || 0,
      })),

      topKeywords: topKeywordsResult.map((row) => ({
        keyword: row.keyword,
        count: Number(row.usage_count) || 0,
      })),

      topUsers: topUsersResult.map((row) => ({
        userId: row.user_id,
        firstName: row.first_name,
        lastName: row.last_name,
        analysisCount: Number(row.analysis_count) || 0,
      })),
    });
  } catch (error) {
    console.error("Error al obtener estadísticas:", error);

    return res.status(500).json({
      error: "Error al obtener las estadísticas",
    });
  }
};