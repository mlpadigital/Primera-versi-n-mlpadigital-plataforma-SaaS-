import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../../shared/context/AuthProvider';

import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminUserManagementPage from './pages/AdminUserManagementPage';
import AdminPaymentsPage from './pages/AdminPaymentsPage';
import AdminStoreManagementPage from './pages/AdminStoreManagementPage';
import PlatformSettingsPage from './pages/PlatformSettingsPage';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AdminDashboardPage />} />
          <Route path="/users" element={<AdminUserManagementPage />} />
          <Route path="/payments" element={<AdminPaymentsPage />} />
          <Route path="/stores" element={<AdminStoreManagementPage />} />
          <Route path="/settings" element={<PlatformSettingsPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);