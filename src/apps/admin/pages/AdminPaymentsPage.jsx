// src/apps/admin/pages/AdminPaymentsPage.jsx
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion as Motion } from 'framer-motion';
import AdminLayout from './AdminLayout';
import AdminTable from '../components/AdminTable';
import axios from 'axios';

const AdminPaymentsPage = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/payments`);
        setPayments(res.data);
      } catch (err) {
        console.error('Error al cargar pagos:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  return (
    <>
      <Helmet>
        <title>Pagos Procesados - mlpadigital</title>
        <meta name="description" content="Historial de pagos realizados en la plataforma." />
      </Helmet>

      <AdminLayout>
        <Motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="p-6"
        >
          <h1 className="text-3xl font-bold text-white mb-6">Pagos Procesados</h1>

          {loading ? (
            <p className="text-indigo-300">Cargando pagos...</p>
          ) : (
            <AdminTable
              columns={['Usuario', 'Email', 'Monto', 'Método', 'Estado', 'Fecha']}
              data={payments.map(payment => [
                payment.user,
                payment.email,
                `$${payment.amount}`,
                payment.method,
                payment.status,
                new Date(payment.createdAt).toLocaleDateString('es-AR'),
              ])}
            />
          )}
        </Motion.div>
      </AdminLayout>
    </>
  );
};

export default AdminPaymentsPage;