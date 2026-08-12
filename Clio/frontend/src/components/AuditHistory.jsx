import { useEffect, useState } from "react";
import { getAuditLog } from "../services/auditService";
import Loading from "../common/Loading";

const AuditHistory = ({ analysisId = null }) => {
  const [auditLogs, setAuditLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadAuditLogs = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const logs = await getAuditLog(analysisId);

        setAuditLogs(logs);
      } catch (err) {
        setError(
          err?.message ||
            "No fue posible obtener el historial de auditoría.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadAuditLogs();
  }, [analysisId]);

  if (isLoading) {
    return (
      <div className="mt-8">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-8 rounded-xl bg-red-50 p-4 text-sm text-red-700">
        {error}
      </div>
    );
  }

  if (!auditLogs.length) {
    return (
      <div className="mt-8 rounded-2xl bg-white p-6 text-center shadow-sm">
        <p className="text-[#7b5f49]">
          No hay registros de auditoría disponibles.
        </p>
      </div>
    );
  }

  return (
    <section className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[#5b3f2d]">
          Audit History
        </h2>

        <p className="mt-1 text-sm text-[#7b5f49]">
          Registro de cambios realizados sobre los análisis.
        </p>
      </div>

      <div className="space-y-4">
        {auditLogs.map((log) => (
          <article
            key={log.id}
            className="rounded-xl border border-[#eadfd5] p-4"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-semibold text-[#5b3f2d]">
                {log.operation}
              </span>

              <span className="text-sm text-[#a6886a]">
                {new Date(log.createdAt).toLocaleString()}
              </span>
            </div>

            <div className="mt-3 text-sm text-[#7b5f49]">
              {log.user ? (
                <>
                  <p>
                    <strong>User:</strong>{" "}
                    {log.user.firstName} {log.user.lastName}
                  </p>

                  <p>
                    <strong>Email:</strong> {log.user.email}
                  </p>
                </>
              ) : (
                <p>
                  <strong>User:</strong> Unknown
                </p>
              )}
            </div>

            {log.previousData && (
              <div className="mt-4">
                <p className="mb-1 text-sm font-semibold text-[#5b3f2d]">
                  Previous Data
                </p>

                <pre className="overflow-x-auto rounded-lg bg-[#f8f4f0] p-3 text-xs text-[#5b3f2d]">
                  {JSON.stringify(log.previousData, null, 2)}
                </pre>
              </div>
            )}

            {log.newData && (
              <div className="mt-4">
                <p className="mb-1 text-sm font-semibold text-[#5b3f2d]">
                  New Data
                </p>

                <pre className="overflow-x-auto rounded-lg bg-[#f8f4f0] p-3 text-xs text-[#5b3f2d]">
                  {JSON.stringify(log.newData, null, 2)}
                </pre>
              </div>
            )}
          </article>
        ))}
      </div>
    </section>
  );
};

export default AuditHistory;