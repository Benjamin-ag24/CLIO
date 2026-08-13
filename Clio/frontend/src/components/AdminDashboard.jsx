// frontend/src/components/AdminDashboard.jsx

import { useEffect, useState } from "react";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Line, Bar, Pie } from "react-chartjs-2";

import { getAuthToken } from "../services/authStorage";
import Button from "../common/Button";
import Loading from "../common/Loading";
import adminDashboardCopy from "../constants/adminDashboardConstants";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
);

const STATISTICS_URL =
  "http://localhost:3000/api/admin/statistics";

const AUDIT_URL =
  "http://localhost:3000/api/admin/audit";

const ECUADOR_TIME_ZONE = "America/Guayaquil";

const formatDate = (dateValue) => {
  if (!dateValue) {
    return adminDashboardCopy.values.noValue;
  }

  let normalizedDate = String(dateValue).trim();

  const hasTimezone =
    normalizedDate.endsWith("Z") ||
    /[+-]\d{2}:\d{2}$/.test(normalizedDate);

  if (!hasTimezone) {
    normalizedDate = `${normalizedDate}-05:00`;
  }

  const date = new Date(normalizedDate);

  if (Number.isNaN(date.getTime())) {
    return adminDashboardCopy.values.invalidDate;
  }

  return new Intl.DateTimeFormat("es-EC", {
    timeZone: ECUADOR_TIME_ZONE,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(date);
};

const AdminDashboard = () => {
  const [statistics, setStatistics] = useState(null);
  const [auditLogs, setAuditLogs] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isAuditLoading, setIsAuditLoading] =
    useState(true);

  const [error, setError] = useState("");
  const [auditError, setAuditError] = useState("");

  const fetchStatistics = async () => {
    try {
      setIsLoading(true);
      setError("");

      const token = getAuthToken();

      const response = await fetch(
        STATISTICS_URL,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error ||
            adminDashboardCopy.errors.noDashboardData,
        );
      }

      setStatistics(data);
    } catch (err) {
      console.error(
        "Error loading statistics:",
        err,
      );

      setError(
        err?.message ||
          adminDashboardCopy.errors.dashboard,
      );
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAuditLogs = async () => {
    try {
      setIsAuditLoading(true);
      setAuditError("");

      const token = getAuthToken();

      const response = await fetch(
        AUDIT_URL,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error ||
            adminDashboardCopy.errors.noAuditData,
        );
      }

      setAuditLogs(data);
    } catch (err) {
      console.error(
        "Error loading audit logs:",
        err,
      );

      setAuditError(
        err?.message ||
          adminDashboardCopy.errors.audit,
      );
    } finally {
      setIsAuditLoading(false);
    }
  };

  const refreshDashboard = async () => {
    await Promise.all([
      fetchStatistics(),
      fetchAuditLogs(),
    ]);
  };

  useEffect(() => {
    refreshDashboard();
  }, []);

  const getOperationLabel = (operation) => {
    return (
      adminDashboardCopy.operations[operation] ||
      adminDashboardCopy.operations.UNKNOWN
    );
  };

  const getOperationStyle = (operation) => {
    if (
      operation === "INSERT" ||
      operation === "CREATE"
    ) {
      return "bg-[#EAF5EC] text-[#3E7C50]";
    }

    if (operation === "UPDATE") {
      return "bg-[#F1DFC0] text-[#8C6239]";
    }

    if (operation === "DELETE") {
      return "bg-[#FBEAE8] text-[#C3564F]";
    }

    return "bg-gray-100 text-gray-600";
  };

  const getFieldLabel = (field) => {
    const label =
      adminDashboardCopy.fields[field];

    if (label) {
      return label;
    }

    return field
      .replaceAll("_", " ")
      .replace(/\b\w/g, (letter) =>
        letter.toUpperCase(),
      );
  };

  const valuesAreDifferent = (
    previous,
    current,
  ) => {
    return (
      JSON.stringify(previous) !==
      JSON.stringify(current)
    );
  };

  const getChangedFields = (
    previousData,
    newData,
  ) => {
    const previous = previousData || {};
    const current = newData || {};

    const fields = new Set([
      ...Object.keys(previous),
      ...Object.keys(current),
    ]);

    return [...fields]
      .filter((field) =>
        valuesAreDifferent(
          previous[field],
          current[field],
        ),
      )
      .map((field) => ({
        field,
        previousValue: previous[field],
        newValue: current[field],
      }));
  };

  const renderValue = (value) => {
    if (
      value === null ||
      value === undefined ||
      value === ""
    ) {
      return (
        <span className="italic text-[#B3A392]">
          {adminDashboardCopy.values.noValue}
        </span>
      );
    }

    if (Array.isArray(value)) {
      if (value.length === 0) {
        return (
          <span className="italic text-[#B3A392]">
            {adminDashboardCopy.values.noValues}
          </span>
        );
      }

      return (
        <div className="flex flex-wrap gap-2">
          {value.map((item, index) => (
            <span
              key={`${item}-${index}`}
              className="rounded-full bg-[#F1E8DE] px-3 py-1 text-xs font-medium text-[#7B5F49]"
            >
              {item}
            </span>
          ))}
        </div>
      );
    }

    if (typeof value === "boolean") {
      return (
        <span className="font-medium">
          {value
            ? adminDashboardCopy.values.yes
            : adminDashboardCopy.values.no}
        </span>
      );
    }

    if (typeof value === "object") {
      return (
        <pre className="overflow-auto rounded-lg bg-[#F7F2EC] p-3 text-xs text-[#4A3226]">
          {JSON.stringify(value, null, 2)}
        </pre>
      );
    }

    return (
      <p className="whitespace-pre-wrap break-words text-sm text-[#4A3226]">
        {String(value)}
      </p>
    );
  };

  const renderSingleField = (
    field,
    value,
  ) => {
    const formattedValue =
      field === "created_at" ||
      field === "updated_at"
        ? formatDate(value)
        : value;

    return (
      <div
        key={field}
        className="rounded-xl border border-[#E9E1D3] bg-white p-4"
      >
        <p className="mb-2 text-xs font-bold uppercase tracking-wide text-[#93816F]">
          {getFieldLabel(field)}
        </p>

        {renderValue(formattedValue)}
      </div>
    );
  };

  const renderAuditChanges = (log) => {
    const operation = log.operation;

    const previousData =
      log.previousData || null;

    const newData =
      log.newData || null;

    /*
     * Creation
     */
    if (
      operation === "INSERT" ||
      operation === "CREATE"
    ) {
      if (!newData) {
        return (
          <p className="text-sm text-[#93816F]">
            {
              adminDashboardCopy.audit.creation
                .noData
            }
          </p>
        );
      }

      return (
        <div className="space-y-3">
          <div className="rounded-xl bg-[#EAF5EC] p-4">
            <p className="text-sm font-semibold text-[#3E7C50]">
              {
                adminDashboardCopy.audit.creation
                  .title
              }
            </p>

            <p className="mt-1 text-xs text-[#3E7C50]">
              {
                adminDashboardCopy.audit.creation
                  .description
              }
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            {Object.entries(newData).map(
              ([field, value]) =>
                renderSingleField(
                  field,
                  value,
                ),
            )}
          </div>
        </div>
      );
    }

    /*
     * Deletion
     */
    if (operation === "DELETE") {
      if (!previousData) {
        return (
          <p className="text-sm text-[#93816F]">
            {
              adminDashboardCopy.audit.deletion
                .noData
            }
          </p>
        );
      }

      return (
        <div className="space-y-3">
          <div className="rounded-xl bg-[#FBEAE8] p-4">
            <p className="text-sm font-semibold text-[#C3564F]">
              {
                adminDashboardCopy.audit.deletion
                  .title
              }
            </p>

            <p className="mt-1 text-xs text-[#C3564F]">
              {
                adminDashboardCopy.audit.deletion
                  .description
              }
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            {Object.entries(previousData).map(
              ([field, value]) =>
                renderSingleField(
                  field,
                  value,
                ),
            )}
          </div>
        </div>
      );
    }

    /*
     * Update
     */
    if (operation === "UPDATE") {
      const changedFields =
        getChangedFields(
          previousData,
          newData,
        );

      if (!changedFields.length) {
        return (
          <div className="rounded-xl bg-[#F7F2EC] p-4">
            <p className="text-sm text-[#7B5F49]">
              {
                adminDashboardCopy.audit.update
                  .noChanges
              }
            </p>
          </div>
        );
      }

      return (
        <div className="space-y-4">
          <div className="rounded-xl bg-[#F1DFC0] p-4">
            <p className="text-sm font-semibold text-[#8C6239]">
              {changedFields.length}{" "}
              {changedFields.length === 1
                ? adminDashboardCopy.audit.update
                    .changedOne
                : adminDashboardCopy.audit.update
                    .changedMany}
            </p>
          </div>

          <div className="space-y-4">
            {changedFields.map(
              ({
                field,
                previousValue,
                newValue,
              }) => (
                <div
                  key={field}
                  className="rounded-xl border border-[#E9E1D3] bg-white p-4"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <p className="font-semibold text-[#4A3226]">
                      {getFieldLabel(field)}
                    </p>

                    <span className="rounded-full bg-[#F1DFC0] px-3 py-1 text-xs font-semibold text-[#8C6239]">
                      {
                        adminDashboardCopy.audit
                          .update.changed
                      }
                    </span>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">

                    <div className="rounded-lg bg-[#FBEAE8] p-4">
                      <p className="mb-2 text-xs font-bold uppercase tracking-wide text-[#C3564F]">
                        {
                          adminDashboardCopy.audit
                            .update.before
                        }
                      </p>

                      {renderValue(
                        field === "created_at" ||
                        field === "updated_at"
                          ? formatDate(
                              previousValue,
                            )
                          : previousValue,
                      )}
                    </div>

                    <div className="rounded-lg bg-[#EAF5EC] p-4">
                      <p className="mb-2 text-xs font-bold uppercase tracking-wide text-[#3E7C50]">
                        {
                          adminDashboardCopy.audit
                            .update.after
                        }
                      </p>

                      {renderValue(
                        field === "created_at" ||
                        field === "updated_at"
                          ? formatDate(
                              newValue,
                            )
                          : newValue,
                      )}
                    </div>

                  </div>
                </div>
              ),
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="rounded-xl bg-[#F7F2EC] p-4">
        <p className="text-sm text-[#7B5F49]">
          {
            adminDashboardCopy.audit
              .noChangeInformation
          }
        </p>
      </div>
    );
  };

  if (isLoading && !statistics) {
    return (
      <div className="min-h-screen bg-[#F7F2EC] p-8">
        <div className="mx-auto max-w-7xl">
          <Loading />
        </div>
      </div>
    );
  }

  if (error && !statistics) {
    return (
      <div className="min-h-screen bg-[#F7F2EC] p-8">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-2xl border border-[#E9E1D3] bg-white p-6">

            <h2 className="text-xl font-bold text-[#C3564F]">
              {adminDashboardCopy.errors.dashboard}
            </h2>

            <p className="mt-2 text-[#7B5F49]">
              {error}
            </p>

            <Button
              variant="primary"
              onClick={refreshDashboard}
              className="mt-4"
            >
              {
                adminDashboardCopy.actions
                  .tryAgain
              }
            </Button>

          </div>
        </div>
      </div>
    );
  }

  const summary =
    statistics?.summary || {};

  const verdictBreakdown =
    summary.verdictBreakdown || {};

  const byDate =
    statistics?.byDate || [];

  const topKeywords =
    statistics?.topKeywords || [];

  const topUsers =
    statistics?.topUsers || [];

  const lineData = {
    labels: byDate.map(
      (item) => item.date,
    ),

    datasets: [
      {
        label:
          adminDashboardCopy.charts
            .totalAnalyses,

        data: byDate.map(
          (item) => item.total,
        ),

        tension: 0.3,
      },
    ],
  };

  const verdictData = {
    labels: [
      adminDashboardCopy.summary.veraz,
      adminDashboardCopy.summary.dudoso,
      adminDashboardCopy.summary.falso,
    ],

    datasets: [
      {
        data: [
          verdictBreakdown.veraz || 0,
          verdictBreakdown.dudoso || 0,
          verdictBreakdown.falso || 0,
        ],
      },
    ],
  };

  const keywordsData = {
    labels: topKeywords.map(
      (item) => item.keyword,
    ),

    datasets: [
      {
        label:
          adminDashboardCopy.charts.usage,

        data: topKeywords.map(
          (item) => item.count,
        ),
      },
    ],
  };

  return (
    <main className="min-h-screen bg-[#F7F2EC] px-6 py-8">
      <div className="mx-auto max-w-7xl">

        {/* HEADER */}

        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

          <div>
            <h1 className="text-3xl font-bold text-[#4A3226]">
              {adminDashboardCopy.title}
            </h1>

            <p className="mt-2 text-[#7B5F49]">
              {adminDashboardCopy.description}
            </p>
          </div>

          <Button
            variant="primary"
            onClick={refreshDashboard}
          >
            {adminDashboardCopy.actions.refreshData}
          </Button>

        </div>

        {/* SUMMARY */}

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm text-[#93816F]">
              {
                adminDashboardCopy.summary
                  .totalAnalyses
              }
            </p>

            <p className="mt-2 text-3xl font-bold text-[#4A3226]">
              {summary.totalAnalyses || 0}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm text-[#93816F]">
              {
                adminDashboardCopy.summary
                  .activeUsers
              }
            </p>

            <p className="mt-2 text-3xl font-bold text-[#4A3226]">
              {summary.totalActiveUsers || 0}
            </p>
          </div>

          <div className="rounded-2xl bg-[#EAF5EC] p-6">
            <p className="text-sm text-[#3E7C50]">
              {adminDashboardCopy.summary.veraz}
            </p>

            <p className="mt-2 text-3xl font-bold text-[#3E7C50]">
              {verdictBreakdown.veraz || 0}
            </p>
          </div>

          <div className="rounded-2xl bg-[#F1DFC0] p-6">
            <p className="text-sm text-[#8C6239]">
              {adminDashboardCopy.summary.dudoso}
            </p>

            <p className="mt-2 text-3xl font-bold text-[#8C6239]">
              {verdictBreakdown.dudoso || 0}
            </p>
          </div>

          <div className="rounded-2xl bg-[#FBEAE8] p-6">
            <p className="text-sm text-[#C3564F]">
              {adminDashboardCopy.summary.falso}
            </p>

            <p className="mt-2 text-3xl font-bold text-[#C3564F]">
              {verdictBreakdown.falso || 0}
            </p>
          </div>

        </div>

        {/* CHARTS */}

        <div className="mt-8 grid gap-6 lg:grid-cols-2">

          <section className="rounded-2xl bg-white p-6 shadow-sm">

            <h2 className="mb-5 text-lg font-bold text-[#4A3226]">
              {
                adminDashboardCopy.charts
                  .analysesOverTime
              }
            </h2>

            {byDate.length > 0 ? (
              <Line
                data={lineData}
                options={{
                  responsive: true,
                  maintainAspectRatio: true,
                }}
              />
            ) : (
              <p className="py-10 text-center text-[#93816F]">
                {
                  adminDashboardCopy.charts
                    .noAnalysisData
                }
              </p>
            )}

          </section>

          <section className="rounded-2xl bg-white p-6 shadow-sm">

            <h2 className="mb-5 text-lg font-bold text-[#4A3226]">
              {
                adminDashboardCopy.charts
                  .distributionByVerdict
              }
            </h2>

            {summary.totalAnalyses > 0 ? (
              <div className="mx-auto max-w-sm">
                <Pie
                  data={verdictData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: true,
                  }}
                />
              </div>
            ) : (
              <p className="py-10 text-center text-[#93816F]">
                {
                  adminDashboardCopy.charts
                    .noVerdictData
                }
              </p>
            )}

          </section>

        </div>

        {/* KEYWORDS */}

        <section className="mt-8 rounded-2xl bg-white p-6 shadow-sm">

          <h2 className="mb-5 text-lg font-bold text-[#4A3226]">
            {
              adminDashboardCopy.charts
                .mostUsedKeywords
            }
          </h2>

          {topKeywords.length > 0 ? (
            <Bar
              data={keywordsData}
              options={{
                responsive: true,
                maintainAspectRatio: true,
                indexAxis: "y",
              }}
            />
          ) : (
            <p className="py-10 text-center text-[#93816F]">
              {
                adminDashboardCopy.charts
                  .noKeywords
              }
            </p>
          )}

        </section>

        {/* TOP USERS */}

        <section className="mt-8 rounded-2xl bg-white p-6 shadow-sm">

          <h2 className="mb-5 text-lg font-bold text-[#4A3226]">
            {adminDashboardCopy.users.title}
          </h2>

          {topUsers.length > 0 ? (
            <div className="overflow-x-auto">

              <table className="w-full text-left">

                <thead>
                  <tr className="border-b border-[#E9E1D3]">

                    <th className="px-4 py-3 text-sm font-semibold text-[#7B5F49]">
                      {adminDashboardCopy.users.position}
                    </th>

                    <th className="px-4 py-3 text-sm font-semibold text-[#7B5F49]">
                      {adminDashboardCopy.users.user}
                    </th>

                    <th className="px-4 py-3 text-sm font-semibold text-[#7B5F49]">
                      {adminDashboardCopy.users.analyses}
                    </th>

                  </tr>
                </thead>

                <tbody>

                  {topUsers.map(
                    (user, index) => (
                      <tr
                        key={user.userId}
                        className="border-b border-[#F0EAE2]"
                      >

                        <td className="px-4 py-3 text-[#93816F]">
                          {index + 1}
                        </td>

                        <td className="px-4 py-3 font-medium text-[#4A3226]">
                          {user.firstName}{" "}
                          {user.lastName}
                        </td>

                        <td className="px-4 py-3 text-[#7B5F49]">
                          {user.analysisCount}
                        </td>

                      </tr>
                    ),
                  )}

                </tbody>

              </table>

            </div>
          ) : (
            <p className="py-10 text-center text-[#93816F]">
              {adminDashboardCopy.users.noUsers}
            </p>
          )}

        </section>

        {/* AUDIT */}

        <section className="mt-8 rounded-2xl bg-white p-6 shadow-sm">

          <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">

            <div>

              <h2 className="text-lg font-bold text-[#4A3226]">
                {adminDashboardCopy.audit.title}
              </h2>

              <p className="mt-1 text-sm text-[#93816F]">
                {
                  adminDashboardCopy.audit
                    .description
                }
              </p>

            </div>

            <Button
              variant="secondary"
              onClick={fetchAuditLogs}
            >
              {
                adminDashboardCopy.actions
                  .refreshAudit
              }
            </Button>

          </div>

          {isAuditLoading ? (
            <div className="py-10">
              <Loading />
            </div>
          ) : auditError ? (
            <div className="rounded-xl bg-[#FBEAE8] p-4">

              <p className="text-sm text-[#C3564F]">
                {auditError}
              </p>

            </div>
          ) : auditLogs.length === 0 ? (
            <p className="py-10 text-center text-[#93816F]">
              {
                adminDashboardCopy.audit
                  .noRecords
              }
            </p>
          ) : (
            <div className="overflow-x-auto">

              <table className="w-full min-w-[900px] text-left">

                <thead>
                  <tr className="border-b border-[#E9E1D3]">

                    <th className="px-4 py-3 text-sm font-semibold text-[#7B5F49]">
                      {adminDashboardCopy.audit.user}
                    </th>

                    <th className="px-4 py-3 text-sm font-semibold text-[#7B5F49]">
                      {
                        adminDashboardCopy.audit
                          .operation
                      }
                    </th>

                    <th className="px-4 py-3 text-sm font-semibold text-[#7B5F49]">
                      {
                        adminDashboardCopy.audit
                          .analysis
                      }
                    </th>

                    <th className="px-4 py-3 text-sm font-semibold text-[#7B5F49]">
                      {adminDashboardCopy.audit.date}
                    </th>

                    <th className="px-4 py-3 text-sm font-semibold text-[#7B5F49]">
                      {
                        adminDashboardCopy.audit
                          .changes
                      }
                    </th>

                  </tr>
                </thead>

                <tbody>

                  {auditLogs.map((log) => {

                    const analysisId =
                      log.newData?.id ||
                      log.previousData?.id ||
                      adminDashboardCopy.values.empty;

                    return (
                      <tr
                        key={log.id}
                        className="border-b border-[#F0EAE2] align-top"
                      >

                        <td className="px-4 py-4">

                          {log.user ? (
                            <div>

                              <p className="font-medium text-[#4A3226]">
                                {log.user.firstName}{" "}
                                {log.user.lastName}
                              </p>

                              <p className="text-xs text-[#93816F]">
                                {log.user.email}
                              </p>

                            </div>
                          ) : (
                            <span className="text-[#93816F]">
                              {
                                adminDashboardCopy
                                  .audit
                                  .unknownUser
                              }
                            </span>
                          )}

                        </td>

                        <td className="px-4 py-4">

                          <span
                            className={`rounded-full px-3 py-1 text-xs font-bold ${getOperationStyle(
                              log.operation,
                            )}`}
                          >
                            {getOperationLabel(
                              log.operation,
                            )}
                          </span>

                        </td>

                        <td className="px-4 py-4 text-sm text-[#7B5F49]">
                          #{analysisId}
                        </td>

                        <td className="px-4 py-4 text-sm text-[#93816F]">
                          {formatDate(
                            log.createdAt,
                          )}
                        </td>

                        <td className="px-4 py-4">

                          <details className="group">

                            <summary className="flex cursor-pointer list-none items-center gap-2 text-sm font-semibold text-[#6FA8C9]">

                              <span className="transition-transform group-open:rotate-90">
                                ▶
                              </span>

                              {
                                adminDashboardCopy
                                  .actions
                                  .viewChanges
                              }

                            </summary>

                            <div className="mt-4 rounded-2xl border border-[#E9E1D3] bg-[#FBFAF6] p-5">

                              {renderAuditChanges(
                                log,
                              )}

                            </div>

                          </details>

                        </td>

                      </tr>
                    );
                  })}

                </tbody>

              </table>

            </div>
          )}

        </section>

      </div>
    </main>
  );
};

export default AdminDashboard;