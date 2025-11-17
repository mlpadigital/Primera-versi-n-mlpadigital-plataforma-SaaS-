// src/apps/auth/index.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "../shared/contexts/AuthContext";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";

const AuthApp = () => (
  <AuthProvider>
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/auth/login" element={<LoginPage />} />
      <Route path="/auth/register" element={<RegisterPage />} />
      <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="*" element={<h1>404 - Página no encontrada</h1>} />
    </Routes>
  </AuthProvider>
);

export default AuthApp;