import { Navigate, Outlet } from "react-router-dom";
import { getAuthToken } from "../services/authStorage";
import { ROUTE_PATHS } from "../constants/routePaths";

const ProtectedRoute = () => {
  const token = getAuthToken();

  if (!token) {
    return <Navigate to={ROUTE_PATHS.LOGIN} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;