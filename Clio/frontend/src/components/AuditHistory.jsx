import { useEffect, useState } from "react";

import { getAuditLog } from "../services/auditService";
import Loading from "../common/Loading";
import adminDashboardCopy from "../constants/adminDashboardConstants";
import {
  fieldLabelStyles,
  fieldValueStyles,
  dataCardWrapperStyles,
  dataCardTitleStyles,
  dataCardBoxStyles,
  dataCardListStyles,
  loadingWrapperStyles,
  errorWrapperStyles,
  errorTextStyles,
  emptyWrapperStyles,
  emptyTextStyles,
  sectionWrapperStyles,
  sectionHeaderStyles,
  sectionTitleStyles,
  sectionDescriptionStyles,
  logsListStyles,
  logArticleStyles,
  logHeaderStyles,
  logOperationStyles,
  logDateStyles,
  logUserInfoStyles,
} from "./AuditHistory.styles";

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

const formatAuditData = (data) => {
  if (!data) {
    return null;
  }

  return {
    id: data.id,
    userId: data.user_id,
    originalText: data.original_text,
    analyzedText: data.analyzed_text,
    verdict: data.verdict,
    explanation: data.explanation,
    keywords: data.keywords,

    isDeleted:
      data.is_deleted === true
        ? adminDashboardCopy.values.yes
        : adminDashboardCopy.values.no,

    createdAt: formatDate(data.created_at),
    updatedAt: formatDate(data.updated_at),
  };
};

const AuditDataField = ({ label, value }) => {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return null;
  }

  return (
    <div>
      <p className={fieldLabelStyles}>
        {label}
      </p>

      <p className={fieldValueStyles}>
        {String(value)}
      </p>
    </div>
  );
};

const AuditDataCard = ({ title, data }) => {
  if (!data) {
    return null;
  }

  return (
    <div className={dataCardWrapperStyles}>
      <p className={dataCardTitleStyles}>
        {title}
      </p>

      <div className={dataCardBoxStyles}>
        <div className={dataCardListStyles}>

          <AuditDataField
            label={adminDashboardCopy.fields.id}
            value={data.id}
          />

          <AuditDataField
            label={adminDashboardCopy.fields.user_id}
            value={data.userId}
          />

          <AuditDataField
            label={adminDashboardCopy.fields.verdict}
            value={data.verdict}
          />

          <AuditDataField
            label={adminDashboardCopy.fields.is_deleted}
            value={data.isDeleted}
          />

          <AuditDataField
            label={adminDashboardCopy.fields.created_at}
            value={data.createdAt}
          />

          <AuditDataField
            label={adminDashboardCopy.fields.updated_at}
            value={data.updatedAt}
          />

          <AuditDataField
            label={adminDashboardCopy.fields.original_text}
            value={data.originalText}
          />

          <AuditDataField
            label={adminDashboardCopy.fields.analyzed_text}
            value={data.analyzedText}
          />

          <AuditDataField
            label={adminDashboardCopy.fields.explanation}
            value={data.explanation}
          />

          <AuditDataField
            label={adminDashboardCopy.fields.keywords}
            value={
              Array.isArray(data.keywords)
                ? data.keywords.join(" · ")
                : data.keywords
            }
          />

        </div>
      </div>
    </div>
  );
};

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
            adminDashboardCopy.errors.audit,
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadAuditLogs();
  }, [analysisId]);

  if (isLoading) {
    return (
      <div className={loadingWrapperStyles}>
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className={errorWrapperStyles}>
        <p className={errorTextStyles}>
          {error}
        </p>
      </div>
    );
  }

  if (!auditLogs.length) {
    return (
      <div className={emptyWrapperStyles}>
        <p className={emptyTextStyles}>
          {adminDashboardCopy.audit.noRecords}
        </p>
      </div>
    );
  }

  return (
    <section className={sectionWrapperStyles}>

      <div className={sectionHeaderStyles}>
        <h2 className={sectionTitleStyles}>
          {adminDashboardCopy.audit.title}
        </h2>

        <p className={sectionDescriptionStyles}>
          {adminDashboardCopy.audit.description}
        </p>
      </div>

      <div className={logsListStyles}>

        {auditLogs.map((log) => {
          const previousData = formatAuditData(
            log.previousData,
          );

          const newData = formatAuditData(
            log.newData,
          );

          const operation =
            adminDashboardCopy.operations[
              log.operation
            ] ||
            adminDashboardCopy.operations.UNKNOWN;

          return (
            <article
              key={log.id}
              className={logArticleStyles}
            >

              <div className={logHeaderStyles}>

                <span className={logOperationStyles}>
                  {operation}
                </span>

                <span className={logDateStyles}>
                  {formatDate(log.createdAt)}
                </span>

              </div>

              <div className={logUserInfoStyles}>

                {log.user ? (
                  <>
                    <p>
                      <strong>
                        {adminDashboardCopy.audit.user}:
                      </strong>{" "}
                      {log.user.firstName}{" "}
                      {log.user.lastName}
                    </p>

                    <p>
                      <strong>
                        {adminDashboardCopy.fields.email}:
                      </strong>{" "}
                      {log.user.email}
                    </p>
                  </>
                ) : (
                  <p>
                    <strong>
                      {adminDashboardCopy.audit.user}:
                    </strong>{" "}
                    {adminDashboardCopy.audit.unknownUser}
                  </p>
                )}

              </div>

              <AuditDataCard
                title={
                  adminDashboardCopy.audit
                    .previousData
                }
                data={previousData}
              />

              <AuditDataCard
                title={
                  adminDashboardCopy.audit
                    .newData
                }
                data={newData}
              />

            </article>
          );
        })}

      </div>
    </section>
  );
};

export default AuditHistory;