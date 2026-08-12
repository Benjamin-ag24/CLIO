import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import Home from "./pages/Home";
import AnalysisPage from "./pages/AnalysisPage";
import LoginPage from "./pages/Auth/LoginPage";
import RegisterPage from "./pages/Auth/RegisterPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { ROUTE_PATHS } from "./constants/routePaths";

const App = () => {
  return (
    <BrowserRouter>
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
    </BrowserRouter>
  );
};

export default App;