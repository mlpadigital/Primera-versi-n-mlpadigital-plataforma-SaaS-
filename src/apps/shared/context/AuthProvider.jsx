import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AuthContext from './AuthContext';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);     // datos del usuario autenticado
  const [loading, setLoading] = useState(true); // estado de carga inicial

  // Validar sesión persistente al montar
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios
        .get(`${import.meta.env.VITE_API_URL}/api/auth/session`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setUser(res.data.user);
        })
        .catch(() => {
          setUser(null);
          localStorage.removeItem('token'); // limpiar token inválido
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  // Login y guardar token
  const login = async (email, password) => {
    const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
      email,
      password,
    });
    localStorage.setItem('token', res.data.token);
    setUser(res.data.user);
    return res.data.user; // 👈 devolvemos el usuario para redirección según rol
  };

  // Logout y limpieza
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

//src/apps/shared/context/AuthProvider.jsx