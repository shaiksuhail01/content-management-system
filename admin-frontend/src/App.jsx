import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./components/AdminLayout";

import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import StandardsPage from "./pages/StandardsPage";
import StandardDetailPage from "./pages/StandardDetailPage";
import VersionSectionsPage from "./pages/VersionSectionsPage";
import SectionContentPage from "./pages/SectionContentPage";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>

        {/* PUBLIC LOGIN */}
        <Route
          path="/login"
          element={<LoginPage />}
        />

        {/* PROTECTED ADMIN */}
        <Route
          element={<ProtectedRoute />}
        >
          <Route
            element={<AdminLayout />}
          >
            {/* DASHBOARD */}
            <Route
              index
              element={<DashboardPage />}
            />

            {/* STANDARDS */}
            <Route
              path="standards"
              element={<StandardsPage />}
            />

            {/* SINGLE STANDARD */}
            <Route
              path="standards/:id"
              element={
                <StandardDetailPage />
              }
            />

            {/* VERSION + SECTIONS */}
            <Route
              path="standards/:standardId/versions/:versionId"
              element={
                <VersionSectionsPage />
              }
            />

            {/* SECTION CONTENT EDITOR */}
            <Route
              path="standards/:standardId/versions/:versionId/sections/:sectionId"
              element={
                <SectionContentPage />
              }
            />
          </Route>
        </Route>

        {/* FALLBACK */}
        <Route
          path="*"
          element={
            <Navigate
              to="/"
              replace
            />
          }
        />

      </Routes>
    </BrowserRouter>
  );
};

export default App;