import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

export default function UserDashboard() {
  const { tienda } = useParams();
  const [cliente, setCliente] = useState(null);

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/api/clientes/tienda/${tienda}`)
      .then((res) => setCliente(res.data))
      .catch((err) => console.error('Error al cargar cliente:', err));
  }, [tienda]);

  if (!cliente) {
    return <div className="min-h-screen flex items-center justify-center text-white">Cargando...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <div className="glass-effect p-6 rounded-xl max-w-2xl mx-auto shadow-2xl">
        <h1 className="text-3xl font-bold mb-4 text-purple-300">Bienvenido, {cliente.nombre}</h1>
        <p><strong>Tienda:</strong> {cliente.tienda}</p>
        <p><strong>Email:</strong> {cliente.email}</p>
        <p><strong>Teléfono:</strong> {cliente.telefono}</p>
        <p><strong>País:</strong> {cliente.pais}</p>
        <p><strong>Tipo de cliente:</strong> {cliente.tipo}</p>
        <p><strong>Frecuencia:</strong> {cliente.frecuencia}</p>
        <p><strong>Moneda:</strong> {cliente.moneda.toUpperCase()}</p>
        <p><strong>Estado de pago:</strong> {cliente.estado_pago}</p>
        <p><strong>Plan:</strong> {cliente.plan_status}</p>
        <p><strong>Inicio:</strong> {new Date(cliente.fecha_inicio).toLocaleDateString()}</p>
        <p><strong>Próximo pago:</strong> {new Date(cliente.proximo_pago).toLocaleDateString()}</p>
      </div>
    </div>
  );
}