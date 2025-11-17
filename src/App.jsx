import React from "react";
import { Routes, Route } from "react-router-dom";
import {AuthProvider} from "./apps/shared/context/AuthProvider";
import PrivateRoute from "./routes/PrivateRoute";

// Páginas
import LandingPage from "./apps/public/pages/HomePage";
import LoginPage from "./apps/auth/pages/LoginPage";
import DashboardPage from "./apps/app/pages/DashboardPage";
import AdminDashboardPage from "./apps/admin/pages/AdminDashboardPage";
import UnauthorizedPage from "./apps/shared/UnauthorizedPage";

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Ruta pública: landing */}
        <Route path="/" element={<LandingPage />} />

        {/* Ruta pública: login */}
        <Route path="/auth/login" element={<LoginPage />} />

        {/* Alias opcional para evitar 404 si alguien usa /login */}
        <Route path="/login" element={<LoginPage />} />

        {/* Dashboard usuario protegido */}
        <Route element={<PrivateRoute roles={["user", "cliente"]} />}>
          <Route path="/app/dashboard/*" element={<DashboardPage />} />
        </Route>

        {/* Dashboard admin protegido */}
        <Route element={<PrivateRoute roles={["admin"]} />}>
          <Route path="/admin/dashboard/*" element={<AdminDashboardPage />} />
        </Route>

        {/* Página de acceso no autorizado */}
        <Route path="/unauthorized" element={<UnauthorizedPage />} />

        {/* Fallback 404 */}
        <Route path="*" element={<h1>404 - Página no encontrada</h1>} />
      </Routes>
    </AuthProvider>
  );
}

export default App;