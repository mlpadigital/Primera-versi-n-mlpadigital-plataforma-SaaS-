import React from 'react';
import { Helmet } from 'react-helmet';
import { motion as Motion } from 'framer-motion';
import { Users, Store, CreditCard, Settings } from 'lucide-react';

import AdminLayout from './AdminLayout';

const stats = [
  {
    title: 'Usuarios Registrados',
    value: 1280,
    icon: <Users className="h-8 w-8 text-yellow-400" />,
  },
  {
    title: 'Tiendas Activas',
    value: 342,
    icon: <Store className="h-8 w-8 text-green-400" />,
  },
  {
    title: 'Pagos Procesados',
    value: '$24,500',
    icon: <CreditCard className="h-8 w-8 text-blue-400" />,
  },
  {
    title: 'Configuraciones',
    value: '4 módulos',
    icon: <Settings className="h-8 w-8 text-purple-400" />,
  },
];

const AdminDashboardPage = () => {
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
        </Motion.div>
      </AdminLayout>
    </>
  );
};

export default AdminDashboardPage;