import { BACKEND_URL } from "../../constants/configConstants";
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

import { getAuthToken } from "../../services/authStorage";
import Button from "../../common/Button";
import Loading from "../../common/Loading";
import adminDashboardCopy from "../../constants/adminDashboardConstants";
import {
  emptyValueStyles,
  tagsWrapperStyles,
  tagBadgeStyles,
  booleanValueStyles,
  jsonValueStyles,
  textValueStyles,
  fieldCardStyles,
  fieldLabelStyles,
  mutedTextStyles,
  changesStackStyles,
  creationBannerStyles,
  creationTitleStyles,
  creationDescriptionStyles,
  fieldsGridStyles,
  deletionBannerStyles,
  deletionTitleStyles,
  deletionDescriptionStyles,
  noChangeBoxStyles,
  noChangeTextStyles,
  changesListStyles,
  changeCountBannerStyles,
  changeCountTextStyles,
  changeFieldHeaderStyles,
  changeFieldNameStyles,
  changedBadgeStyles,
  changeCompareGridStyles,
  beforeBoxStyles,
  beforeLabelStyles,
  afterBoxStyles,
  afterLabelStyles,
  fullPageStateWrapperStyles,
  stateContentStyles,
  errorCardStyles,
  errorTitleStyles,
  errorMessageStyles,
  retryButtonStyles,
  pageWrapperStyles,
  pageHeaderStyles,
  pageTitleStyles,
  summaryGridStyles,
  summaryCardStyles,
  summaryCardValueStyles,
  summaryCardVerazStyles,
  summaryLabelVerazStyles,
  summaryValueVerazStyles,
  summaryCardDudosoStyles,
  summaryLabelDudosoStyles,
  summaryValueDudosoStyles,
  summaryCardFalsoStyles,
  summaryLabelFalsoStyles,
  summaryValueFalsoStyles,
  chartsGridStyles,
  chartSectionTitleStyles,
  emptyChartTextStyles,
  pieChartWrapperStyles,
  sectionCardStyles,
  tableWrapperStyles,
  tableBaseStyles,
  tableHeaderRowStyles,
  tableHeaderCellStyles,
  tableRowStyles,
  tableCellMutedStyles,
  tableCellNameStyles,
  tableCellTextStyles,
  sectionHeaderRowStyles,
  sectionTitleStyles,
  sectionDescriptionStyles,
  loadingBoxStyles,
  apiHintTextStyles,
  usersTableStyles,
  usersCellMutedStyles,
  usersCellNameStyles,
  usersCellStyles,
  roleBadgeStyles,
  usersCellDateStyles,
  auditTableStyles,
  auditRowStyles,
  auditUserNameStyles,
  auditUserEmailStyles,
  auditUnknownUserStyles,
  detailsGroupStyles,
  detailsSummaryStyles,
  detailsArrowStyles,
  detailsPanelStyles,
  statusBadgeBaseStyles,
  statusBadgeActiveStyles,
  statusBadgeInactiveStyles,
  operationBadgeBaseStyles,
} from "./AdminDashboard.styles";

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

const STATISTICS_URL = `${BACKEND_URL}/admin/statistics`;

const AUDIT_URL = `${BACKEND_URL}/admin/audit`;

const USERS_URL = `${BACKEND_URL}/admin/users`;

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
        <span className={emptyValueStyles}>
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
          <span className={emptyValueStyles}>
            {
              adminDashboardCopy
                .values.noValues
            }
          </span>
        );
      }

      return (
        <div className={tagsWrapperStyles}>
          {value.map(
            (item, index) => (
              <span
                key={`${item}-${index}`}
                className={tagBadgeStyles}
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
        <span className={booleanValueStyles}>
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
        <pre className={jsonValueStyles}>
          {JSON.stringify(
            value,
            null,
            2,
          )}
        </pre>
      );
    }

    return (
      <p className={textValueStyles}>
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
        className={fieldCardStyles}
      >
        <p className={fieldLabelStyles}>
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
          <p className={mutedTextStyles}>
            {
              adminDashboardCopy
                .audit.creation
                .noData
            }
          </p>
        );
      }

      return (
        <div className={changesStackStyles}>
          <div className={creationBannerStyles}>
            <p className={creationTitleStyles}>
              {
                adminDashboardCopy
                  .audit.creation
                  .title
              }
            </p>

            <p className={creationDescriptionStyles}>
              {
                adminDashboardCopy
                  .audit.creation
                  .description
              }
            </p>
          </div>

          <div className={fieldsGridStyles}>
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
          <p className={mutedTextStyles}>
            {
              adminDashboardCopy
                .audit.deletion
                .noData
            }
          </p>
        );
      }

      return (
        <div className={changesStackStyles}>
          <div className={deletionBannerStyles}>
            <p className={deletionTitleStyles}>
              {
                adminDashboardCopy
                  .audit.deletion
                  .title
              }
            </p>

            <p className={deletionDescriptionStyles}>
              {
                adminDashboardCopy
                  .audit.deletion
                  .description
              }
            </p>
          </div>

          <div className={fieldsGridStyles}>
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
          <div className={noChangeBoxStyles}>
            <p className={noChangeTextStyles}>
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
        <div className={changesListStyles}>
          <div className={changeCountBannerStyles}>
            <p className={changeCountTextStyles}>
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
                className={fieldCardStyles}
              >
                <div className={changeFieldHeaderStyles}>
                  <p className={changeFieldNameStyles}>
                    {getFieldLabel(
                      field,
                    )}
                  </p>

                  <span className={changedBadgeStyles}>
                    {
                      adminDashboardCopy
                        .audit.update
                        .changed
                    }
                  </span>
                </div>

                <div className={changeCompareGridStyles}>
                  <div className={beforeBoxStyles}>
                    <p className={beforeLabelStyles}>
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

                  <div className={afterBoxStyles}>
                    <p className={afterLabelStyles}>
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
      <div className={noChangeBoxStyles}>
        <p className={noChangeTextStyles}>
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
      <div className={fullPageStateWrapperStyles}>
        <div className={stateContentStyles}>
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
      <div className={fullPageStateWrapperStyles}>
        <div className={stateContentStyles}>
          <div className={errorCardStyles}>
            <h2 className={errorTitleStyles}>
              {
                adminDashboardCopy
                  .errors
                  .dashboard
              }
            </h2>

            <p className={errorMessageStyles}>
              {error}
            </p>

            <Button
              variant="primary"
              onClick={
                refreshDashboard
              }
              className={retryButtonStyles}
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
    <main className={pageWrapperStyles}>
      <div className={stateContentStyles}>

        <div className={pageHeaderStyles}>
          <div>
            <h1 className={pageTitleStyles}>
              {
                adminDashboardCopy
                  .title
              }
            </h1>

            <p className={errorMessageStyles}>
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

        <div className={summaryGridStyles}>

          <div className={summaryCardStyles}>
            <p className={mutedTextStyles}>
              {
                adminDashboardCopy
                  .summary
                  .totalAnalyses
              }
            </p>

            <p className={summaryCardValueStyles}>
              {totalAnalyses}
            </p>
          </div>

          <div className={summaryCardStyles}>
            <p className={mutedTextStyles}>
              {
                adminDashboardCopy
                  .summary
                  .activeUsers
              }
            </p>

            <p className={summaryCardValueStyles}>
              {
                Number(
                  summary.totalActiveUsers,
                ) || 0
              }
            </p>
          </div>

          <div className={summaryCardVerazStyles}>
            <p className={summaryLabelVerazStyles}>
              {
                adminDashboardCopy
                  .summary
                  .veraz
              }
            </p>

            <p className={summaryValueVerazStyles}>
              {truthfulTotal}
            </p>
          </div>

          <div className={summaryCardDudosoStyles}>
            <p className={summaryLabelDudosoStyles}>
              {
                adminDashboardCopy
                  .summary
                  .dudoso
              }
            </p>

            <p className={summaryValueDudosoStyles}>
              {uncertainTotal}
            </p>
          </div>

          <div className={summaryCardFalsoStyles}>
            <p className={summaryLabelFalsoStyles}>
              {
                adminDashboardCopy
                  .summary
                  .falso
              }
            </p>

            <p className={summaryValueFalsoStyles}>
              {falseTotal}
            </p>
          </div>

        </div>

        <div className={chartsGridStyles}>

          <section className={summaryCardStyles}>

            <h2 className={chartSectionTitleStyles}>
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
              <p className={emptyChartTextStyles}>
                {
                  adminDashboardCopy
                    .charts
                    .noAnalysisData
                }
              </p>
            )}

          </section>

          <section className={summaryCardStyles}>

            <h2 className={chartSectionTitleStyles}>
              {
                adminDashboardCopy
                  .charts
                  .distributionByVerdict
              }
            </h2>

            {totalAnalyses >
            0 ? (
              <div className={pieChartWrapperStyles}>
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
              <p className={emptyChartTextStyles}>
                {
                  adminDashboardCopy
                    .charts
                    .noVerdictData
                }
              </p>
            )}

          </section>

        </div>

        <section className={sectionCardStyles}>

          <h2 className={chartSectionTitleStyles}>
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
            <p className={emptyChartTextStyles}>
              {
                adminDashboardCopy
                  .charts
                  .noKeywords
              }
            </p>
          )}

        </section>

        <section className={sectionCardStyles}>

          <h2 className={chartSectionTitleStyles}>
            {
              adminDashboardCopy
                .users
                .title
            }
          </h2>

          {topUsers.length >
          0 ? (
            <div className={tableWrapperStyles}>

              <table className={tableBaseStyles}>

                <thead>
                  <tr className={tableHeaderRowStyles}>

                    <th className={tableHeaderCellStyles}>
                      {
                        adminDashboardCopy
                          .users
                          .position
                      }
                    </th>

                    <th className={tableHeaderCellStyles}>
                      {
                        adminDashboardCopy
                          .users
                          .user
                      }
                    </th>

                    <th className={tableHeaderCellStyles}>
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
                        className={tableRowStyles}
                      >

                        <td className={tableCellMutedStyles}>
                          {index + 1}
                        </td>

                        <td className={tableCellNameStyles}>
                          {
                            user.firstName
                          }{" "}
                          {
                            user.lastName
                          }
                        </td>

                        <td className={tableCellTextStyles}>
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
            <p className={emptyChartTextStyles}>
              {
                adminDashboardCopy
                  .users
                  .noUsers
              }
            </p>
          )}

        </section>

        <section className={sectionCardStyles}>

          <div className={sectionHeaderRowStyles}>

            <div>
              <h2 className={sectionTitleStyles}>
                {
                  adminDashboardCopy
                    .users
                    .management
                    .title
                }
              </h2>

              <p className={sectionDescriptionStyles}>
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
            <div className={loadingBoxStyles}>
              <Loading />
            </div>
          ) : usersError ? (
            <div className={deletionBannerStyles}>

              <p className={summaryLabelFalsoStyles}>
                {usersError}
              </p>

              <p className={apiHintTextStyles}>
                Make sure that the backend exposes:
                {" "}
                GET /api/admin/users
              </p>

            </div>
          ) : users.length ===
            0 ? (
            <p className={emptyChartTextStyles}>
              {
                adminDashboardCopy
                  .users
                  .management
                  .noUsers
              }
            </p>
          ) : (
            <div className={tableWrapperStyles}>

              <table className={usersTableStyles}>

                <thead>
                  <tr className={tableHeaderRowStyles}>

                    <th className={tableHeaderCellStyles}>
                      {
                        adminDashboardCopy
                          .users
                          .management
                          .id
                      }
                    </th>

                    <th className={tableHeaderCellStyles}>
                      {
                        adminDashboardCopy
                          .users
                          .management
                          .name
                      }
                    </th>

                    <th className={tableHeaderCellStyles}>
                      {
                        adminDashboardCopy
                          .users
                          .management
                          .email
                      }
                    </th>

                    <th className={tableHeaderCellStyles}>
                      {
                        adminDashboardCopy
                          .users
                          .management
                          .role
                      }
                    </th>

                    <th className={tableHeaderCellStyles}>
                      {
                        adminDashboardCopy
                          .users
                          .management
                          .status
                      }
                    </th>

                    <th className={tableHeaderCellStyles}>
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
                        className={tableRowStyles}
                      >

                        <td className={usersCellMutedStyles}>
                          #{user.id}
                        </td>

                        <td className={usersCellNameStyles}>
                          {
                            user.firstName
                          }{" "}
                          {
                            user.lastName
                          }
                        </td>

                        <td className={usersCellMutedStyles}>
                          {
                            user.email
                          }
                        </td>

                        <td className={usersCellStyles}>

                          <span className={roleBadgeStyles}>
                            {
                              user.role
                            }
                          </span>

                        </td>

                        <td className={usersCellStyles}>

                          <span
                            className={`${statusBadgeBaseStyles} ${
                              user.isActive
                                ? statusBadgeActiveStyles
                                : statusBadgeInactiveStyles
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

                        <td className={usersCellDateStyles}>
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

        <section className={sectionCardStyles}>

          <div className={sectionHeaderRowStyles}>

            <div>

              <h2 className={sectionTitleStyles}>
                {
                  adminDashboardCopy
                    .audit
                    .title
                }
              </h2>

              <p className={sectionDescriptionStyles}>
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
            <div className={loadingBoxStyles}>
              <Loading />
            </div>
          ) : auditError ? (
            <div className={deletionBannerStyles}>
              <p className={summaryLabelFalsoStyles}>
                {auditError}
              </p>
            </div>
          ) : auditLogs.length ===
            0 ? (
            <p className={emptyChartTextStyles}>
              {
                adminDashboardCopy
                  .audit
                  .noRecords
              }
            </p>
          ) : (
            <div className={tableWrapperStyles}>

              <table className={auditTableStyles}>

                <thead>
                  <tr className={tableHeaderRowStyles}>

                    <th className={tableHeaderCellStyles}>
                      {
                        adminDashboardCopy
                          .audit
                          .user
                      }
                    </th>

                    <th className={tableHeaderCellStyles}>
                      {
                        adminDashboardCopy
                          .audit
                          .operation
                      }
                    </th>

                    <th className={tableHeaderCellStyles}>
                      {
                        adminDashboardCopy
                          .audit
                          .analysis
                      }
                    </th>

                    <th className={tableHeaderCellStyles}>
                      {
                        adminDashboardCopy
                          .audit
                          .date
                      }
                    </th>

                    <th className={tableHeaderCellStyles}>
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
                          className={auditRowStyles}
                        >

                          <td className={usersCellStyles}>

                            {log.user ? (
                              <div>

                                <p className={auditUserNameStyles}>
                                  {
                                    log.user
                                      .firstName
                                  }{" "}
                                  {
                                    log.user
                                      .lastName
                                  }
                                </p>

                                <p className={auditUserEmailStyles}>
                                  {
                                    log.user
                                      .email
                                  }
                                </p>

                              </div>
                            ) : (
                              <span className={auditUnknownUserStyles}>
                                {
                                  adminDashboardCopy
                                    .audit
                                    .unknownUser
                                }
                              </span>
                            )}

                          </td>

                          <td className={usersCellStyles}>

                            <span
                              className={`${operationBadgeBaseStyles} ${getOperationStyle(
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

                          <td className={usersCellMutedStyles}>
                            #{entityId}
                          </td>

                          <td className={usersCellDateStyles}>
                            {formatDate(
                              log.createdAt ||
                                log.created_at,
                            )}
                          </td>

                          <td className={usersCellStyles}>

                            <details className={detailsGroupStyles}>

                              <summary className={detailsSummaryStyles}>

                                <span className={detailsArrowStyles}>
                                  ▶
                                </span>

                                {
                                  adminDashboardCopy
                                    .actions
                                    .viewChanges
                                }

                              </summary>

                              <div className={detailsPanelStyles}>

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