import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion as Motion } from 'framer-motion';
import AdminLayout from './AdminLayout';
import AdminTable from '../components/AdminTable';
import axios from 'axios';

const AdminUserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/users`);
        setUsers(res.data);
      } catch (err) {
        console.error('Error al cargar usuarios:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <>
      <Helmet>
        <title>Gestión de Usuarios - mlpadigital</title>
        <meta name="description" content="Administra los usuarios registrados en la plataforma." />
      </Helmet>

      <AdminLayout>
        <Motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="p-6"
        >
          <h1 className="text-3xl font-bold text-white mb-6">Usuarios Registrados</h1>

          {loading ? (
            <p className="text-indigo-300">Cargando usuarios...</p>
          ) : (
            <AdminTable
              columns={['Nombre', 'Email', 'Plan', 'Estado']}
              data={users.map(user => [
                user.name,
                user.email,
                user.plan_status,
                user.active ? 'Activo' : 'Suspendido',
              ])}
            />
          )}
        </Motion.div>
      </AdminLayout>
    </>
  );
};

export default AdminUserManagementPage;