const adminDashboardCopy = {
  title: "Admin Dashboard",

  description:
    "Real-time information from the Clio database.",

  actions: {
    refreshData: "Refresh data",
    refreshAudit: "Refresh audit",
    tryAgain: "Try again",
    viewChanges: "View changes",
  },

  loading: {
    dashboard: "Loading dashboard...",
    audit: "Loading audit history...",
  },

  errors: {
    dashboard:
      "Unable to load the statistics.",
    audit:
      "Unable to load the audit history.",
    noDashboardData:
      "Unable to retrieve the statistics.",
    noAuditData:
      "Unable to retrieve the audit history.",
  },

  summary: {
    totalAnalyses: "Total analyses",
    activeUsers: "Active users",
    veraz: "True",
    dudoso: "Uncertain",
    falso: "False",
  },

  charts: {
    analysesOverTime: "Analyses over time",
    distributionByVerdict:
      "Distribution by verdict",
    mostUsedKeywords: "Most used keywords",
    totalAnalyses: "Total analyses",
    usage: "Usage",
    noAnalysisData:
      "No analysis data available.",
    noVerdictData:
      "No verdict data available.",
    noKeywords:
      "No keywords available.",
  },

  users: {
    title: "Top users",
    position: "#",
    user: "User",
    analyses: "Analyses",
    noUsers:
      "No users with analyses available.",
  },

  audit: {
    title: "Audit history",

    description:
      "Record of operations performed on analyses.",

    user: "User",
    operation: "Operation",
    analysis: "Analysis",
    date: "Date",
    changes: "Changes",

    previousData: "Previous data",
    newData: "New data",

    unknownUser: "Unknown user",

    creation: {
      label: "Creation",
      title: "Analysis created",
      description:
        "The following information was registered.",
      noData:
        "No creation data available.",
    },

    update: {
      label: "Update",
      changedOne: "field was changed",
      changedMany: "fields were changed",
      changed: "Changed",
      before: "Before",
      after: "After",
      noChanges:
        "No visible changes were detected.",
    },

    deletion: {
      label: "Deletion",
      title: "Analysis deleted",
      description:
        "This is the information that existed before deletion.",
      noData:
        "No deletion data available.",
    },

    noRecords:
      "No audit records available.",

    noChangeInformation:
      "No change information available.",
  },

  fields: {
    id: "Analysis ID",
    user_id: "User ID",
    first_name: "First name",
    last_name: "Last name",
    email: "Email",
    veredicto: "Verdict",
    verdict: "Verdict",
    "palabras clave": "Keywords",
    keywords: "Keywords",
    created_at: "Created at",
    actualizado_en: "Updated at",
    updated_at: "Updated at",
    is_deleted: "Deleted",
    explanation: "Explanation",
    analyzed_text: "Analyzed text",
    original_text: "Original text",
  },

  values: {
    empty: "—",
    noValue: "No value",
    noValues: "No values",
    invalidDate: "Invalid date",
    yes: "Yes",
    no: "No",
  },

  operations: {
    INSERT: "Creation",
    CREATE: "Creation",
    UPDATE: "Update",
    DELETE: "Deletion",
    UNKNOWN: "Unknown",
  },
};

export default adminDashboardCopy;