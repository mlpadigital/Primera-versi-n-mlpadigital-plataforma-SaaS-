import React from "react";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "../shared/contexts/AuthContext";

import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminUserManagementPage from "./pages/AdminUserManagementPage";
import AdminPaymentsPage from "./pages/AdminPaymentsPage";
import AdminStoreManagementPage from "./pages/AdminStoreManagementPage";
import PlatformSettingsPage from "./pages/PlatformSettingsPage";

const AdminApp = () => (
  <AuthProvider>
    <Routes>
      <Route path="/" element={<AdminDashboardPage />} />
      <Route path="/users" element={<AdminUserManagementPage />} />
      <Route path="/payments" element={<AdminPaymentsPage />} />
      <Route path="/stores" element={<AdminStoreManagementPage />} />
      <Route path="/settings" element={<PlatformSettingsPage />} />
    </Routes>
  </AuthProvider>
);

export default AdminApp;