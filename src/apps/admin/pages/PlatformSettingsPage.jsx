import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion as Motion } from 'framer-motion';
import AdminLayout from './AdminLayout';
import axios from 'axios';

const PlatformSettingsPage = () => {
  const [settings, setSettings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/platform-settings`);
        setSettings(res.data);
      } catch (err) {
        console.error('Error al cargar configuración:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  return (
    <>
      <Helmet>
        <title>Configuración de Plataforma - mlpadigital</title>
        <meta name="description" content="Gestiona los módulos activos y configuraciones globales de mlpadigital." />
      </Helmet>

      <AdminLayout>
        <Motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="p-6"
        >
          <h1 className="text-3xl font-bold text-white mb-6">Configuración de Plataforma</h1>

          {loading ? (
            <p className="text-indigo-300">Cargando configuración...</p>
          ) : (
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {settings.map((setting, index) => (
                <li
                  key={index}
                  className="glass-effect p-6 rounded-xl shadow-lg flex flex-col gap-2"
                >
                  <h2 className="text-xl font-semibold text-white">{setting.module}</h2>
                  <p className="text-indigo-200">Estado: {setting.enabled ? 'Activo' : 'Desactivado'}</p>
                  <p className="text-sm text-indigo-400">{setting.description}</p>
                </li>
              ))}
            </ul>
          )}
        </Motion.div>
      </AdminLayout>
    </>
  );
};

export default PlatformSettingsPage;