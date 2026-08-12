import { Navigate, Outlet, useLocation } from "react-router-dom";
import { getAuthToken } from "../services/authStorage";
import { ROUTE_PATHS } from "./routePaths";

const ProtectedRoute = () => {
  const location = useLocation();
  const token = getAuthToken();

  if (!token) {
    return (
      <Navigate
        to={ROUTE_PATHS.LOGIN}
        replace
        state={{ from: location }}
      />
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;