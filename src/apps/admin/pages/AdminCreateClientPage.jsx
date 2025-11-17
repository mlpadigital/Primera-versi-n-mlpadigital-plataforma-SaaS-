import React, { useState } from 'react';
import axios from 'axios';
import { Helmet } from 'react-helmet';
import AdminLayout from './AdminLayout';

const initialState = {
  nombre: '',
  email: '',
  tienda: '',
  tipo: 'premium',
  frecuencia: 'mensual',
  moneda: 'usd',
  pais: '',
  telefono: '',
};

export default function AdminCreateClientPage() {
  const [form, setForm] = useState(initialState);
  const [mensaje, setMensaje] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/clientes/crear`, {
        ...form,
        estado_pago: 'pagado',
        plan_status: 'activo',
        fecha_inicio: new Date(),
        proximo_pago: new Date(new Date().setMonth(new Date().getMonth() + 1)),
      });
      setMensaje('✅ Cliente creado con éxito');
      setForm(initialState);
    } catch (err) {
      console.error('❌ Error al crear cliente:', err);
      setMensaje('❌ Error al crear cliente');
    }
  };

  return (
    <>
      <Helmet>
        <title>Crear Cliente - mlpadigital</title>
      </Helmet>

      <AdminLayout>
        <div className="max-w-2xl mx-auto bg-black/30 backdrop-blur-md p-8 rounded-xl shadow-xl text-white">
          <h1 className="text-3xl font-bold mb-6">Crear nuevo cliente</h1>

          <form onSubmit={handleSubmit} className="grid gap-4">
            {Object.entries(form).map(([key, value]) => (
              <div key={key}>
                <label className="block mb-1 capitalize">{key}</label>
                <input
                  type="text"
                  name={key}
                  value={value}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg bg-gray-900 text-white border border-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            ))}

            <button
              type="submit"
              className="mt-4 px-6 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 transition-all text-white font-semibold shadow-md"
            >
              Crear cliente
            </button>
          </form>

          {mensaje && <p className="mt-4 text-green-400">{mensaje}</p>}
        </div>
      </AdminLayout>
    </>
  );
}