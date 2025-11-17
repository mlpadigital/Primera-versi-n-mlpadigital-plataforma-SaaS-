import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../apps/shared/hooks/useAuth"; // tu hook de auth

/**
 * @param {ReactNode} children - componente protegido
 * @param {string[]} roles - roles permitidos (ej: ["admin"])
 */
const PrivateRoute = ({ children, roles }) => {
  const { user } = useAuth(); // viene de AuthContext

  // No autenticado → redirigir al login
  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  // Autenticado pero rol incorrecto
  if (roles && !roles.includes(user.role)) {
    return user.role === "admin"
      ? <Navigate to="/admin/dashboard" replace />
      : <Navigate to="/app/dashboard" replace />;
  }

  // Autenticado y rol correcto → renderizar children o Outlet
  return children ? children : <Outlet />;
};

export default PrivateRoute;