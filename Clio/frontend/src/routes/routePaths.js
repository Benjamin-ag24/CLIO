export const ROUTE_PATHS = {
  LOGIN: "/login",
  REGISTER: "/register",
  DASHBOARD: "/dashboard",

  ADMIN: "/admin",
  ADMIN_AUDIT: "/admin/audit",

  ANALYSIS: "/analysis/:id",
  ANALYSIS_BY_ID: (id) => `/analysis/${id}`,
};