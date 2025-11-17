// src/apps/shared/context/AuthContext.js
import { createContext } from "react";

/**
 * Contexto de autenticación global
 * Contiene:
 * - user: datos del usuario autenticado
 * - login: función para iniciar sesión
 * - logout: función para cerrar sesión
 * - loading: estado de carga inicial
 */
const AuthContext = createContext({
  user: null,
  login: async () => {},
  logout: () => {},
  loading: true,
});

export default AuthContext;