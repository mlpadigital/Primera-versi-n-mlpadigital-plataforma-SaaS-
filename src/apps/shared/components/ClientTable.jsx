import { useEffect, useState } from 'react';
import axios from 'axios';
import { motion as Motion } from 'framer-motion';

export default function ClientTable() {
  const [clientes, setClientes] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/clientes`);
        setClientes(res.data);
      } catch (err) {
        console.error('❌ Error al obtener clientes:', err);
      }
    };
    fetchClientes();
  }, []);

  const clientesFiltrados = clientes.filter((c) =>
    (filtro ? c.tipo === filtro : true) &&
    (busqueda ? c.nombre.toLowerCase().includes(busqueda.toLowerCase()) || c.email.toLowerCase().includes(busqueda.toLowerCase()) : true)
  );

  return (
    <Motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 bg-[#0f172a] text-white rounded-xl shadow-lg glass-effect"
    >
      <h2 className="text-2xl font-bold mb-4">Clientes registrados</h2>

      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="Buscar por nombre o email"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="input w-full"
        />
        <select value={filtro} onChange={(e) => setFiltro(e.target.value)} className="input">
          <option value="">Todos</option>
          <option value="Emprendedor">Emprendedor</option>
          <option value="Escalable">Escalable</option>
          <option value="Reseller PRO">Reseller PRO</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#1e293b]">
              <th className="px-4 py-2">Nombre</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Tienda</th>
              <th className="px-4 py-2">Tipo</th>
              <th className="px-4 py-2">Fecha</th>
            </tr>
          </thead>
          <tbody>
            {clientesFiltrados.map((c) => (
              <tr key={c._id} className="hover:bg-[#334155] transition">
                <td className="px-4 py-2">{c.nombre}</td>
                <td className="px-4 py-2">{c.email}</td>
                <td className="px-4 py-2">{c.tienda}</td>
                <td className="px-4 py-2">{c.tipo}</td>
                <td className="px-4 py-2">{new Date(c.creadoEn).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Motion.div>
  );
}