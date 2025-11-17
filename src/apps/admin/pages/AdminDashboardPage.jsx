// src/apps/admin/pages/AdminDashboardPage.jsx
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion as Motion } from 'framer-motion';
import { Users, Store, CreditCard, Settings } from 'lucide-react';
import axios from 'axios';

import AdminLayout from './AdminLayout';

const AdminDashboardPage = () => {
  const [clientes, setClientes] = useState([]);
  const [filtro, setFiltro] = useState('todos');

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/clientes/listar`)
      .then((res) => setClientes(res.data))
      .catch((err) => console.error('Error al cargar clientes:', err));
  }, []);

  const hoy = new Date();

  const filtrados = clientes.filter((c) => {
    if (filtro === 'pagados') return c.estado_pago === 'pagado';
    if (filtro === 'pendientes') return c.estado_pago !== 'pagado';
    if (filtro === 'vencidos') return new Date(c.proximo_pago) < hoy;
    return true;
  });

  const stats = [
    {
      title: 'Usuarios Registrados',
      value: clientes.length,
      icon: <Users className="h-8 w-8 text-yellow-400" />,
    },
    {
      title: 'Tiendas Activas',
      value: clientes.filter(c => c.plan_status === 'activo').length,
      icon: <Store className="h-8 w-8 text-green-400" />,
    },
    {
      title: 'Pagos Procesados',
      value: clientes.filter(c => c.estado_pago === 'pagado').length,
      icon: <CreditCard className="h-8 w-8 text-blue-400" />,
    },
    {
      title: 'Configuraciones',
      value: '4 módulos',
      icon: <Settings className="h-8 w-8 text-purple-400" />,
    },
  ];

  return (
    <>
      <Helmet>
        <title>Dashboard Admin - mlpadigital</title>
        <meta name="description" content="Panel de control administrativo de la plataforma." />
      </Helmet>

      <AdminLayout>
        <Motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="p-6"
        >
          <h1 className="text-4xl font-bold text-white mb-8">Dashboard Administrativo</h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="glass-effect p-6 rounded-xl shadow-lg flex flex-col items-center text-center"
              >
                <div className="mb-4">{stat.icon}</div>
                <h2 className="text-2xl font-semibold text-white">{stat.value}</h2>
                <p className="text-indigo-200">{stat.title}</p>
              </div>
            ))}
          </div>

          <div className="flex gap-4 mb-6">
            <button onClick={() => setFiltro('todos')} className="btn-glass">Todos</button>
            <button onClick={() => setFiltro('pagados')} className="btn-glass">Pagados</button>
            <button onClick={() => setFiltro('pendientes')} className="btn-glass">Pendientes</button>
            <button onClick={() => setFiltro('vencidos')} className="btn-glass">Vencidos</button>
          </div>

          <div className="grid gap-4">
            {filtrados.map((c) => (
              <div key={c._id} className="glass-effect p-4 rounded-xl shadow-md">
                <p><strong>{c.nombre}</strong> — {c.email}</p>
                <p>Tienda: {c.tienda} | Tipo: {c.tipo}</p>
                <p>Frecuencia: {c.frecuencia} | Moneda: {c.moneda.toUpperCase()}</p>
                <p>Estado: <span className={c.estado_pago === 'pagado' ? 'text-green-400' : 'text-red-400'}>{c.estado_pago}</span></p>
                <p>Próximo pago: {new Date(c.proximo_pago).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        </Motion.div>
      </AdminLayout>
    </>
  );
};

export default AdminDashboardPage;