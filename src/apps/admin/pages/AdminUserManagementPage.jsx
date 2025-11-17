import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion as Motion } from 'framer-motion';
import AdminLayout from './AdminLayout';
import AdminTable from '../components/AdminTable';
import axios from 'axios';

const AdminStoreManagementPage = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/stores`);
        setStores(res.data);
      } catch (err) {
        console.error('Error al cargar tiendas:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, []);

  return (
    <>
      <Helmet>
        <title>Gestión de Tiendas - mlpadigital</title>
        <meta name="description" content="Administra las tiendas creadas por los usuarios." />
      </Helmet>

      <AdminLayout>
        <Motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="p-6"
        >
          <h1 className="text-3xl font-bold text-white mb-6">Tiendas Activas</h1>
          <h1 className="text-white text-3xl">Gestión de Usuarios</h1>;


          {loading ? (
            <p className="text-indigo-300">Cargando tiendas...</p>
          ) : (
            <AdminTable
              columns={['Nombre', 'Slug', 'Estado', 'Creada']}
              data={stores.map(store => [
                store.name,
                store.ownerSlug,
                store.status,
                new Date(store.createdAt).toLocaleDateString('es-AR'),
              ])}
            />
          )}
        </Motion.div>
      </AdminLayout>
    </>
  );
};

export default AdminStoreManagementPage;