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

const USERS_URL =
  "http://localhost:3000/api/admin/users";

const ECUADOR_TIME_ZONE =
  "America/Guayaquil";

const formatDate = (dateValue) => {
  if (!dateValue) {
    return adminDashboardCopy.values.noValue;
  }

  let normalizedDate =
    String(dateValue).trim();

  const hasTimezone =
    normalizedDate.endsWith("Z") ||
    /[+-]\d{2}:\d{2}$/.test(
      normalizedDate,
    );

  if (!hasTimezone) {
    normalizedDate =
      `${normalizedDate}-05:00`;
  }

  const date =
    new Date(normalizedDate);

  if (Number.isNaN(date.getTime())) {
    return adminDashboardCopy.values.invalidDate;
  }

  return new Intl.DateTimeFormat(
    "es-EC",
    {
      timeZone:
        ECUADOR_TIME_ZONE,

      day: "2-digit",

      month: "2-digit",

      year: "numeric",

      hour: "2-digit",

      minute: "2-digit",

      second: "2-digit",

      hour12: false,
    },
  ).format(date);
};

const formatChartDate = (
  dateValue,
) => {
  if (!dateValue) {
    return "";
  }

  const date =
    new Date(
      `${dateValue}T00:00:00`,
    );

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return dateValue;
  }

  return new Intl.DateTimeFormat(
    "es-EC",
    {
      day: "2-digit",
      month: "2-digit",
    },
  ).format(date);
};

const AdminDashboard = () => {
  const [statistics, setStatistics] =
    useState(null);

  const [auditLogs, setAuditLogs] =
    useState([]);

  const [users, setUsers] =
    useState([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [isAuditLoading, setIsAuditLoading] =
    useState(true);

  const [isUsersLoading, setIsUsersLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [auditError, setAuditError] =
    useState("");

  const [usersError, setUsersError] =
    useState("");

  const fetchStatistics = async () => {
    try {
      setIsLoading(true);
      setError("");

      const token =
        getAuthToken();

      const response =
        await fetch(
          STATISTICS_URL,
          {
            method: "GET",

            headers: {
              Authorization:
                `Bearer ${token}`,

              "Content-Type":
                "application/json",
            },
          },
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error ||
            adminDashboardCopy.errors
              .noDashboardData,
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
          adminDashboardCopy.errors
            .dashboard,
      );
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAuditLogs = async () => {
    try {
      setIsAuditLoading(true);
      setAuditError("");

      const token =
        getAuthToken();

      const response =
        await fetch(
          AUDIT_URL,
          {
            method: "GET",

            headers: {
              Authorization:
                `Bearer ${token}`,

              "Content-Type":
                "application/json",
            },
          },
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error ||
            adminDashboardCopy.errors
              .noAuditData,
        );
      }

      setAuditLogs(
        Array.isArray(data)
          ? data
          : data?.data || [],
      );
    } catch (err) {
      console.error(
        "Error loading audit logs:",
        err,
      );

      setAuditError(
        err?.message ||
          adminDashboardCopy.errors
            .audit,
      );
    } finally {
      setIsAuditLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      setIsUsersLoading(true);
      setUsersError("");

      const token =
        getAuthToken();

      const response =
        await fetch(
          USERS_URL,
          {
            method: "GET",

            headers: {
              Authorization:
                `Bearer ${token}`,

              "Content-Type":
                "application/json",
            },
          },
        );

      const contentType =
        response.headers.get(
          "content-type",
        );

      let data = null;

      if (
        contentType &&
        contentType.includes(
          "application/json",
        )
      ) {
        data =
          await response.json();
      }

      if (!response.ok) {
        throw new Error(
          data?.error ||
            adminDashboardCopy.errors
              .noUsersData,
        );
      }

      const usersData =
        Array.isArray(data)
          ? data
          : data?.users ||
            data?.data ||
            [];

      setUsers(usersData);
    } catch (err) {
      console.error(
        "Error loading users:",
        err,
      );

      setUsers([]);

      setUsersError(
        err?.message ||
          adminDashboardCopy.errors
            .users,
      );
    } finally {
      setIsUsersLoading(false);
    }
  };

  const refreshDashboard = async () => {
    await Promise.all([
      fetchStatistics(),
      fetchAuditLogs(),
      fetchUsers(),
    ]);
  };

  useEffect(() => {
    refreshDashboard();
  }, []);

  const getOperationLabel = (
    operation,
  ) => {
    return (
      adminDashboardCopy.operations[
        operation
      ] ||
      adminDashboardCopy.operations
        .UNKNOWN
    );
  };

  const getOperationStyle = (
    operation,
  ) => {
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

  const getFieldLabel = (
    field,
  ) => {
    const label =
      adminDashboardCopy.fields[
        field
      ];

    if (label) {
      return label;
    }

    return String(field)
      .replaceAll("_", " ")
      .replace(
        /\b\w/g,
        (letter) =>
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
    const previous =
      previousData || {};

    const current =
      newData || {};

    const fields =
      new Set([
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

        previousValue:
          previous[field],

        newValue:
          current[field],
      }));
  };

  const renderValue = (
    value,
  ) => {
    if (
      value === null ||
      value === undefined ||
      value === ""
    ) {
      return (
        <span className="italic text-[#B3A392]">
          {
            adminDashboardCopy
              .values.noValue
          }
        </span>
      );
    }

    if (Array.isArray(value)) {
      if (value.length === 0) {
        return (
          <span className="italic text-[#B3A392]">
            {
              adminDashboardCopy
                .values.noValues
            }
          </span>
        );
      }

      return (
        <div className="flex flex-wrap gap-2">
          {value.map(
            (item, index) => (
              <span
                key={`${item}-${index}`}
                className="rounded-full bg-[#F1E8DE] px-3 py-1 text-xs font-medium text-[#7B5F49]"
              >
                {item}
              </span>
            ),
          )}
        </div>
      );
    }

    if (
      typeof value ===
      "boolean"
    ) {
      return (
        <span className="font-medium">
          {value
            ? adminDashboardCopy
                .values.yes
            : adminDashboardCopy
                .values.no}
        </span>
      );
    }

    if (
      typeof value ===
      "object"
    ) {
      return (
        <pre className="overflow-auto rounded-lg bg-[#F7F2EC] p-3 text-xs text-[#4A3226]">
          {JSON.stringify(
            value,
            null,
            2,
          )}
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

        {renderValue(
          formattedValue,
        )}
      </div>
    );
  };

  const renderAuditChanges = (
    log,
  ) => {
    const operation =
      log.operation;

    const previousData =
      log.previousData ||
      log.previous_data ||
      null;

    const newData =
      log.newData ||
      log.new_data ||
      null;

    if (
      operation === "INSERT" ||
      operation === "CREATE"
    ) {
      if (!newData) {
        return (
          <p className="text-sm text-[#93816F]">
            {
              adminDashboardCopy
                .audit.creation
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
                adminDashboardCopy
                  .audit.creation
                  .title
              }
            </p>

            <p className="mt-1 text-xs text-[#3E7C50]">
              {
                adminDashboardCopy
                  .audit.creation
                  .description
              }
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            {Object.entries(
              newData,
            ).map(
              ([
                field,
                value,
              ]) =>
                renderSingleField(
                  field,
                  value,
                ),
            )}
          </div>
        </div>
      );
    }

    if (
      operation === "DELETE"
    ) {
      if (!previousData) {
        return (
          <p className="text-sm text-[#93816F]">
            {
              adminDashboardCopy
                .audit.deletion
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
                adminDashboardCopy
                  .audit.deletion
                  .title
              }
            </p>

            <p className="mt-1 text-xs text-[#C3564F]">
              {
                adminDashboardCopy
                  .audit.deletion
                  .description
              }
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            {Object.entries(
              previousData,
            ).map(
              ([
                field,
                value,
              ]) =>
                renderSingleField(
                  field,
                  value,
                ),
            )}
          </div>
        </div>
      );
    }

    if (
      operation === "UPDATE"
    ) {
      const changedFields =
        getChangedFields(
          previousData,
          newData,
        );

      if (
        !changedFields.length
      ) {
        return (
          <div className="rounded-xl bg-[#F7F2EC] p-4">
            <p className="text-sm text-[#7B5F49]">
              {
                adminDashboardCopy
                  .audit.update
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
              {
                changedFields.length
              }{" "}
              {changedFields.length ===
              1
                ? adminDashboardCopy
                    .audit.update
                    .changedOne
                : adminDashboardCopy
                    .audit.update
                    .changedMany}
            </p>
          </div>

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
                    {getFieldLabel(
                      field,
                    )}
                  </p>

                  <span className="rounded-full bg-[#F1DFC0] px-3 py-1 text-xs font-semibold text-[#8C6239]">
                    {
                      adminDashboardCopy
                        .audit.update
                        .changed
                    }
                  </span>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-lg bg-[#FBEAE8] p-4">
                    <p className="mb-2 text-xs font-bold uppercase tracking-wide text-[#C3564F]">
                      {
                        adminDashboardCopy
                          .audit.update
                          .before
                      }
                    </p>

                    {renderValue(
                      field ===
                        "created_at" ||
                      field ===
                        "updated_at"
                        ? formatDate(
                            previousValue,
                          )
                        : previousValue,
                    )}
                  </div>

                  <div className="rounded-lg bg-[#EAF5EC] p-4">
                    <p className="mb-2 text-xs font-bold uppercase tracking-wide text-[#3E7C50]">
                      {
                        adminDashboardCopy
                          .audit.update
                          .after
                      }
                    </p>

                    {renderValue(
                      field ===
                        "created_at" ||
                      field ===
                        "updated_at"
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
      );
    }

    return (
      <div className="rounded-xl bg-[#F7F2EC] p-4">
        <p className="text-sm text-[#7B5F49]">
          {
            adminDashboardCopy
              .audit
              .noChangeInformation
          }
        </p>
      </div>
    );
  };

  if (
    isLoading &&
    !statistics
  ) {
    return (
      <div className="min-h-screen bg-[#F7F2EC] p-8">
        <div className="mx-auto max-w-7xl">
          <Loading />
        </div>
      </div>
    );
  }

  if (
    error &&
    !statistics
  ) {
    return (
      <div className="min-h-screen bg-[#F7F2EC] p-8">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-2xl border border-[#E9E1D3] bg-white p-6">
            <h2 className="text-xl font-bold text-[#C3564F]">
              {
                adminDashboardCopy
                  .errors
                  .dashboard
              }
            </h2>

            <p className="mt-2 text-[#7B5F49]">
              {error}
            </p>

            <Button
              variant="primary"
              onClick={
                refreshDashboard
              }
              className="mt-4"
            >
              {
                adminDashboardCopy
                  .actions
                  .tryAgain
              }
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const summary =
    statistics?.summary ||
    {};

  const verdictBreakdown =
    summary.verdictBreakdown ||
    {};

  const totalAnalyses =
    Number(
      summary.totalAnalyses,
    ) || 0;

  const truthfulTotal =
    Number(
      verdictBreakdown.veraz,
    ) || 0;

  const uncertainTotal =
    Number(
      verdictBreakdown.dudoso,
    ) || 0;

  const falseTotal =
    Number(
      verdictBreakdown.falso,
    ) || 0;

  const byDate =
    Array.isArray(
      statistics?.byDate,
    )
      ? statistics.byDate
      : [];

  const topKeywords =
    Array.isArray(
      statistics?.topKeywords,
    )
      ? statistics.topKeywords
      : [];

  const topUsers =
    Array.isArray(
      statistics?.topUsers,
    )
      ? statistics.topUsers
      : [];

  const lineData = {
    labels: byDate.map(
      (item) =>
        formatChartDate(
          item.date,
        ),
    ),

    datasets: [
      {
        label:
          adminDashboardCopy
            .charts
            .totalAnalyses,

        data: byDate.map(
          (item) =>
            Number(
              item.total,
            ) || 0,
        ),

        borderColor:
          "#6FA8C9",

        backgroundColor:
          "#DCEBF3",

        tension: 0.3,

        borderWidth: 3,

        pointRadius: 4,

        pointBackgroundColor:
          "#6FA8C9",

        pointBorderColor:
          "#FFFFFF",

        pointBorderWidth: 2,
      },

      {
        label:
          adminDashboardCopy
            .summary
            .veraz,

        data: byDate.map(
          (item) =>
            Number(
              item.veraz,
            ) || 0,
        ),

        borderColor:
          "#3E7C50",

        backgroundColor:
          "#EAF5EC",

        tension: 0.3,

        borderWidth: 2,

        pointRadius: 4,

        pointBackgroundColor:
          "#3E7C50",

        pointBorderColor:
          "#FFFFFF",

        pointBorderWidth: 2,
      },

      {
        label:
          adminDashboardCopy
            .summary
            .dudoso,

        data: byDate.map(
          (item) =>
            Number(
              item.dudoso,
            ) || 0,
        ),

        borderColor:
          "#8C6239",

        backgroundColor:
          "#F1DFC0",

        tension: 0.3,

        borderWidth: 2,

        pointRadius: 4,

        pointBackgroundColor:
          "#8C6239",

        pointBorderColor:
          "#FFFFFF",

        pointBorderWidth: 2,
      },

      {
        label:
          adminDashboardCopy
            .summary
            .falso,

        data: byDate.map(
          (item) =>
            Number(
              item.falso,
            ) || 0,
        ),

        borderColor:
          "#C3564F",

        backgroundColor:
          "#FBEAE8",

        tension: 0.3,

        borderWidth: 2,

        pointRadius: 4,

        pointBackgroundColor:
          "#C3564F",

        pointBorderColor:
          "#FFFFFF",

        pointBorderWidth: 2,
      },
    ],
  };

  const verdictData = {
    labels: [
      adminDashboardCopy
        .summary
        .veraz,

      adminDashboardCopy
        .summary
        .dudoso,

      adminDashboardCopy
        .summary
        .falso,
    ],

    datasets: [
      {
        data: [
          truthfulTotal,
          uncertainTotal,
          falseTotal,
        ],

        backgroundColor: [
          "#3E7C50",
          "#8C6239",
          "#C3564F",
        ],

        borderColor:
          "#FFFFFF",

        borderWidth: 3,

        hoverOffset: 8,
      },
    ],
  };

  const keywordsData = {
    labels:
      topKeywords.map(
        (item) =>
          item.keyword,
      ),

    datasets: [
      {
        label:
          adminDashboardCopy
            .charts
            .usage,

        data:
          topKeywords.map(
            (item) =>
              Number(
                item.count,
              ) || 0,
          ),

        backgroundColor: [
          "#6FA8C9",
          "#8C6239",
          "#3E7C50",
          "#C3564F",
          "#A68A6D",
          "#7B5F49",
          "#9CB8C7",
          "#B58A5A",
        ],

        borderColor:
          "#FFFFFF",

        borderWidth: 1,

        borderRadius: 6,
      },
    ],
  };

  return (
    <main className="min-h-screen bg-[#F7F2EC] px-6 py-8">
      <div className="mx-auto max-w-7xl">

        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#4A3226]">
              {
                adminDashboardCopy
                  .title
              }
            </h1>

            <p className="mt-2 text-[#7B5F49]">
              {
                adminDashboardCopy
                  .description
              }
            </p>
          </div>

          <Button
            variant="primary"
            onClick={
              refreshDashboard
            }
          >
            {
              adminDashboardCopy
                .actions
                .refreshData
            }
          </Button>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm text-[#93816F]">
              {
                adminDashboardCopy
                  .summary
                  .totalAnalyses
              }
            </p>

            <p className="mt-2 text-3xl font-bold text-[#4A3226]">
              {totalAnalyses}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm text-[#93816F]">
              {
                adminDashboardCopy
                  .summary
                  .activeUsers
              }
            </p>

            <p className="mt-2 text-3xl font-bold text-[#4A3226]">
              {
                Number(
                  summary.totalActiveUsers,
                ) || 0
              }
            </p>
          </div>

          <div className="rounded-2xl bg-[#EAF5EC] p-6">
            <p className="text-sm text-[#3E7C50]">
              {
                adminDashboardCopy
                  .summary
                  .veraz
              }
            </p>

            <p className="mt-2 text-3xl font-bold text-[#3E7C50]">
              {truthfulTotal}
            </p>
          </div>

          <div className="rounded-2xl bg-[#F1DFC0] p-6">
            <p className="text-sm text-[#8C6239]">
              {
                adminDashboardCopy
                  .summary
                  .dudoso
              }
            </p>

            <p className="mt-2 text-3xl font-bold text-[#8C6239]">
              {uncertainTotal}
            </p>
          </div>

          <div className="rounded-2xl bg-[#FBEAE8] p-6">
            <p className="text-sm text-[#C3564F]">
              {
                adminDashboardCopy
                  .summary
                  .falso
              }
            </p>

            <p className="mt-2 text-3xl font-bold text-[#C3564F]">
              {falseTotal}
            </p>
          </div>

        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">

          <section className="rounded-2xl bg-white p-6 shadow-sm">

            <h2 className="mb-5 text-lg font-bold text-[#4A3226]">
              {
                adminDashboardCopy
                  .charts
                  .analysesOverTime
              }
            </h2>

            {byDate.length >
            0 ? (
              <Line
                data={
                  lineData
                }
                options={{
                  responsive: true,

                  maintainAspectRatio:
                    true,

                  scales: {
                    y: {
                      beginAtZero:
                        true,

                      ticks: {
                        precision: 0,
                      },
                    },
                  },

                  plugins: {
                    legend: {
                      display: true,
                    },
                  },
                }}
              />
            ) : (
              <p className="py-10 text-center text-[#93816F]">
                {
                  adminDashboardCopy
                    .charts
                    .noAnalysisData
                }
              </p>
            )}

          </section>

          <section className="rounded-2xl bg-white p-6 shadow-sm">

            <h2 className="mb-5 text-lg font-bold text-[#4A3226]">
              {
                adminDashboardCopy
                  .charts
                  .distributionByVerdict
              }
            </h2>

            {totalAnalyses >
            0 ? (
              <div className="mx-auto max-w-sm">
                <Pie
                  data={
                    verdictData
                  }
                  options={{
                    responsive: true,

                    maintainAspectRatio:
                      true,

                    plugins: {
                      legend: {
                        display: true,

                        position:
                          "bottom",
                      },
                    },
                  }}
                />
              </div>
            ) : (
              <p className="py-10 text-center text-[#93816F]">
                {
                  adminDashboardCopy
                    .charts
                    .noVerdictData
                }
              </p>
            )}

          </section>

        </div>

        <section className="mt-8 rounded-2xl bg-white p-6 shadow-sm">

          <h2 className="mb-5 text-lg font-bold text-[#4A3226]">
            {
              adminDashboardCopy
                .charts
                .mostUsedKeywords
            }
          </h2>

          {topKeywords.length >
          0 ? (
            <Bar
              data={
                keywordsData
              }
              options={{
                responsive: true,

                maintainAspectRatio:
                  true,

                indexAxis: "y",

                scales: {
                  x: {
                    beginAtZero:
                      true,

                    ticks: {
                      precision: 0,
                    },
                  },
                },

                plugins: {
                  legend: {
                    display: true,
                  },
                },
              }}
            />
          ) : (
            <p className="py-10 text-center text-[#93816F]">
              {
                adminDashboardCopy
                  .charts
                  .noKeywords
              }
            </p>
          )}

        </section>

        <section className="mt-8 rounded-2xl bg-white p-6 shadow-sm">

          <h2 className="mb-5 text-lg font-bold text-[#4A3226]">
            {
              adminDashboardCopy
                .users
                .title
            }
          </h2>

          {topUsers.length >
          0 ? (
            <div className="overflow-x-auto">

              <table className="w-full text-left">

                <thead>
                  <tr className="border-b border-[#E9E1D3]">

                    <th className="px-4 py-3 text-sm font-semibold text-[#7B5F49]">
                      {
                        adminDashboardCopy
                          .users
                          .position
                      }
                    </th>

                    <th className="px-4 py-3 text-sm font-semibold text-[#7B5F49]">
                      {
                        adminDashboardCopy
                          .users
                          .user
                      }
                    </th>

                    <th className="px-4 py-3 text-sm font-semibold text-[#7B5F49]">
                      {
                        adminDashboardCopy
                          .users
                          .analyses
                      }
                    </th>

                  </tr>
                </thead>

                <tbody>
                  {topUsers.map(
                    (
                      user,
                      index,
                    ) => (
                      <tr
                        key={
                          user.userId ||
                          index
                        }
                        className="border-b border-[#F0EAE2]"
                      >

                        <td className="px-4 py-3 text-[#93816F]">
                          {index + 1}
                        </td>

                        <td className="px-4 py-3 font-medium text-[#4A3226]">
                          {
                            user.firstName
                          }{" "}
                          {
                            user.lastName
                          }
                        </td>

                        <td className="px-4 py-3 text-[#7B5F49]">
                          {
                            user.analysisCount
                          }
                        </td>

                      </tr>
                    ),
                  )}
                </tbody>

              </table>

            </div>
          ) : (
            <p className="py-10 text-center text-[#93816F]">
              {
                adminDashboardCopy
                  .users
                  .noUsers
              }
            </p>
          )}

        </section>

        <section className="mt-8 rounded-2xl bg-white p-6 shadow-sm">

          <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">

            <div>
              <h2 className="text-lg font-bold text-[#4A3226]">
                {
                  adminDashboardCopy
                    .users
                    .management
                    .title
                }
              </h2>

              <p className="mt-1 text-sm text-[#93816F]">
                {
                  adminDashboardCopy
                    .users
                    .management
                    .description
                }
              </p>
            </div>

            <Button
              variant="secondary"
              onClick={
                fetchUsers
              }
            >
              {
                adminDashboardCopy
                  .actions
                  .refreshUsers
              }
            </Button>

          </div>

          {isUsersLoading ? (
            <div className="py-10">
              <Loading />
            </div>
          ) : usersError ? (
            <div className="rounded-xl bg-[#FBEAE8] p-4">

              <p className="text-sm text-[#C3564F]">
                {usersError}
              </p>

              <p className="mt-2 text-xs text-[#93816F]">
                Make sure that the backend exposes:
                {" "}
                GET /api/admin/users
              </p>

            </div>
          ) : users.length ===
            0 ? (
            <p className="py-10 text-center text-[#93816F]">
              {
                adminDashboardCopy
                  .users
                  .management
                  .noUsers
              }
            </p>
          ) : (
            <div className="overflow-x-auto">

              <table className="w-full min-w-[800px] text-left">

                <thead>
                  <tr className="border-b border-[#E9E1D3]">

                    <th className="px-4 py-3 text-sm font-semibold text-[#7B5F49]">
                      {
                        adminDashboardCopy
                          .users
                          .management
                          .id
                      }
                    </th>

                    <th className="px-4 py-3 text-sm font-semibold text-[#7B5F49]">
                      {
                        adminDashboardCopy
                          .users
                          .management
                          .name
                      }
                    </th>

                    <th className="px-4 py-3 text-sm font-semibold text-[#7B5F49]">
                      {
                        adminDashboardCopy
                          .users
                          .management
                          .email
                      }
                    </th>

                    <th className="px-4 py-3 text-sm font-semibold text-[#7B5F49]">
                      {
                        adminDashboardCopy
                          .users
                          .management
                          .role
                      }
                    </th>

                    <th className="px-4 py-3 text-sm font-semibold text-[#7B5F49]">
                      {
                        adminDashboardCopy
                          .users
                          .management
                          .status
                      }
                    </th>

                    <th className="px-4 py-3 text-sm font-semibold text-[#7B5F49]">
                      {
                        adminDashboardCopy
                          .users
                          .management
                          .createdAt
                      }
                    </th>

                  </tr>
                </thead>

                <tbody>

                  {users.map(
                    (user) => (
                      <tr
                        key={
                          user.id
                        }
                        className="border-b border-[#F0EAE2]"
                      >

                        <td className="px-4 py-4 text-sm text-[#7B5F49]">
                          #{user.id}
                        </td>

                        <td className="px-4 py-4 font-medium text-[#4A3226]">
                          {
                            user.firstName
                          }{" "}
                          {
                            user.lastName
                          }
                        </td>

                        <td className="px-4 py-4 text-sm text-[#7B5F49]">
                          {
                            user.email
                          }
                        </td>

                        <td className="px-4 py-4">

                          <span className="rounded-full bg-[#F1E8DE] px-3 py-1 text-xs font-semibold text-[#7B5F49]">
                            {
                              user.role
                            }
                          </span>

                        </td>

                        <td className="px-4 py-4">

                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                              user.isActive
                                ? "bg-[#EAF5EC] text-[#3E7C50]"
                                : "bg-[#FBEAE8] text-[#C3564F]"
                            }`}
                          >
                            {user.isActive
                              ? adminDashboardCopy
                                  .users
                                  .management
                                  .active
                              : adminDashboardCopy
                                  .users
                                  .management
                                  .inactive}
                          </span>

                        </td>

                        <td className="px-4 py-4 text-sm text-[#93816F]">
                          {formatDate(
                            user.createdAt ||
                              user.created_at,
                          )}
                        </td>

                      </tr>
                    ),
                  )}

                </tbody>

              </table>

            </div>
          )}

        </section>

        <section className="mt-8 rounded-2xl bg-white p-6 shadow-sm">

          <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">

            <div>

              <h2 className="text-lg font-bold text-[#4A3226]">
                {
                  adminDashboardCopy
                    .audit
                    .title
                }
              </h2>

              <p className="mt-1 text-sm text-[#93816F]">
                {
                  adminDashboardCopy
                    .audit
                    .description
                }
              </p>

            </div>

            <Button
              variant="secondary"
              onClick={
                fetchAuditLogs
              }
            >
              {
                adminDashboardCopy
                  .actions
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
          ) : auditLogs.length ===
            0 ? (
            <p className="py-10 text-center text-[#93816F]">
              {
                adminDashboardCopy
                  .audit
                  .noRecords
              }
            </p>
          ) : (
            <div className="overflow-x-auto">

              <table className="w-full min-w-[850px] text-left">

                <thead>
                  <tr className="border-b border-[#E9E1D3]">

                    <th className="px-4 py-3 text-sm font-semibold text-[#7B5F49]">
                      {
                        adminDashboardCopy
                          .audit
                          .user
                      }
                    </th>

                    <th className="px-4 py-3 text-sm font-semibold text-[#7B5F49]">
                      {
                        adminDashboardCopy
                          .audit
                          .operation
                      }
                    </th>

                    <th className="px-4 py-3 text-sm font-semibold text-[#7B5F49]">
                      {
                        adminDashboardCopy
                          .audit
                          .analysis
                      }
                    </th>

                    <th className="px-4 py-3 text-sm font-semibold text-[#7B5F49]">
                      {
                        adminDashboardCopy
                          .audit
                          .date
                      }
                    </th>

                    <th className="px-4 py-3 text-sm font-semibold text-[#7B5F49]">
                      {
                        adminDashboardCopy
                          .audit
                          .changes
                      }
                    </th>

                  </tr>
                </thead>

                <tbody>

                  {auditLogs.map(
                    (log) => {

                      const entityId =
                        log.newData
                          ?.id ||
                        log.new_data
                          ?.id ||
                        log.previousData
                          ?.id ||
                        log.previous_data
                          ?.id ||
                        adminDashboardCopy
                          .values
                          .empty;

                      return (
                        <tr
                          key={
                            log.id
                          }
                          className="border-b border-[#F0EAE2] align-top"
                        >

                          <td className="px-4 py-4">

                            {log.user ? (
                              <div>

                                <p className="font-medium text-[#4A3226]">
                                  {
                                    log.user
                                      .firstName
                                  }{" "}
                                  {
                                    log.user
                                      .lastName
                                  }
                                </p>

                                <p className="text-xs text-[#93816F]">
                                  {
                                    log.user
                                      .email
                                  }
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
                              {
                                getOperationLabel(
                                  log.operation,
                                )
                              }
                            </span>

                          </td>

                          <td className="px-4 py-4 text-sm text-[#7B5F49]">
                            #{entityId}
                          </td>

                          <td className="px-4 py-4 text-sm text-[#93816F]">
                            {formatDate(
                              log.createdAt ||
                                log.created_at,
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

                                {
                                  renderAuditChanges(
                                    log,
                                  )
                                }

                              </div>

                            </details>

                          </td>

                        </tr>
                      );
                    },
                  )}

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