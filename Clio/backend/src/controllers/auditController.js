import { AppDataSource } from "../config/database.js";

export const getAuditLog = async (req, res) => {
  try {
    const { analysisId } = req.query;

    let query = `
      SELECT
        al.id,
        al.user_id,
        u.first_name,
        u.last_name,
        u.email,
        al.affected_table,
        al.operation,
        al.previous_data,
        al.new_data,
        al.created_at
      FROM audit_log al
      LEFT JOIN users u ON u.id = al.user_id
      WHERE al.affected_table = 'analysis'
    `;

    const params = [];

    if (analysisId) {
      query += ` AND (
        (al.previous_data->>'id')::int = $1
        OR (al.new_data->>'id')::int = $1
      )`;
      params.push(Number(analysisId));
    }

    query += ` ORDER BY al.created_at DESC`;

    const logs = await AppDataSource.query(query, params);

    return res.json(
      logs.map((log) => ({
        id: log.id,
        operation: log.operation,
        previousData: log.previous_data,
        newData: log.new_data,
        createdAt: log.created_at,
        user: log.user_id
          ? {
              id: log.user_id,
              firstName: log.first_name,
              lastName: log.last_name,
              email: log.email,
            }
          : null,
      }))
    );
  } catch (error) {
    console.error("Error al obtener el registro de auditoría:", error);
    return res.status(500).json({
      error: "Error al obtener el registro de auditoría",
    });
  }
};