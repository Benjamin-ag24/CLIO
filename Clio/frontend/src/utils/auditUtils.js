import adminDashboardCopy from "../constants/adminDashboardConstants";

export const formatDate = (dateValue) => {
  if (!dateValue) {
    return adminDashboardCopy.values.empty;
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return adminDashboardCopy.values.empty;
  }

  return date.toLocaleString("es-EC", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
};

export const formatAuditData = (data) => {
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
        ? "Sí"
        : "No",

    createdAt: formatDate(data.created_at),
    updatedAt: formatDate(data.updated_at),
  };
};

export const valuesAreDifferent = (
  previous,
  current,
) => {
  return (
    JSON.stringify(previous) !==
    JSON.stringify(current)
  );
};

export const getChangedFields = (
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

export const getFieldLabel = (field) => {
  return (
    adminDashboardCopy.fields[field] ||
    field
      .replaceAll("_", " ")
      .replace(/\b\w/g, (letter) =>
        letter.toUpperCase(),
      )
  );
};

export const formatValue = (value) => {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return adminDashboardCopy.values.empty;
  }

  if (Array.isArray(value)) {
    if (value.length === 0) {
      return adminDashboardCopy.values.empty;
    }

    return value.join(" · ");
  }

  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }

  return String(value);
};

export const getAnalysisIdFromAudit = (log) => {
  return (
    log?.newData?.id ||
    log?.previousData?.id ||
    adminDashboardCopy.values.empty
  );
};