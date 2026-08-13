import { Navigate, Outlet, useLocation } from "react-router-dom";
import {
  getAuthToken,
  getAuthUser,
} from "../services/authStorage";
import { ROUTE_PATHS } from "./routePaths";

const AdminRoute = () => {
  const location = useLocation();

  const token = getAuthToken();
  const user = getAuthUser();

  if (!token) {
    return (
      <Navigate
        to={ROUTE_PATHS.LOGIN}
        replace
        state={{ from: location }}
      />
    );
  }

  if (user?.role !== "admin") {
    return (
      <Navigate
        to={ROUTE_PATHS.DASHBOARD}
        replace
      />
    );
  }

  return <Outlet />;
};

export default AdminRoute;