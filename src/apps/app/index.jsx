// src/apps/app/index.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "../shared/contexts/AuthContext";

import DashboardPage from "./pages/DashboardPage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";

const UserApp = () => (
  <AuthProvider>
    <Routes>
      <Route path="/app/dashboard" element={<DashboardPage />} />
      <Route path="/app/profile" element={<ProfilePage />} />
      <Route path="/app/settings" element={<SettingsPage />} />
      <Route path="*" element={<h1>404 - Página no encontrada</h1>} />
    </Routes>
  </AuthProvider>
);

export default UserApp;