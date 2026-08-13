import { Navigate, Route, Routes } from "react-router-dom";

import Home from "../pages/Home";
import AnalysisPage from "../pages/AnalysisPage";
import LoginPage from "../pages/Auth/LoginPage";
import RegisterPage from "../pages/Auth/RegisterPage";
import AdminDashboard from "../components/AdminDashboard";

import ProtectedRoute from "./ProtectedRoute";
import AdminRoute from "./AdminRoute";
import { ROUTE_PATHS } from "./routePaths";

const AppRoutes = () => {
  return (
    <Routes>
      <Route
        path={ROUTE_PATHS.LOGIN}
        element={<LoginPage />}
      />

      <Route
        path={ROUTE_PATHS.REGISTER}
        element={<RegisterPage />}
      />

      <Route element={<ProtectedRoute />}>
        <Route
          path={ROUTE_PATHS.DASHBOARD}
          element={<Home />}
        />

        <Route
          path={ROUTE_PATHS.AUDIT}
          element={<Home />}
        />

        <Route
          path={ROUTE_PATHS.ANALYSIS}
          element={<AnalysisPage />}
        />
      </Route>

      <Route element={<AdminRoute />}>
        <Route
          path={ROUTE_PATHS.ADMIN}
          element={<AdminDashboard />}
        />
      </Route>

      <Route
        path="*"
        element={
          <Navigate
            to={ROUTE_PATHS.DASHBOARD}
            replace
          />
        }
      />
    </Routes>
  );
};

export default AppRoutes;