// src/apps/admin/components/AdminSidebar.jsx
import { NavLink } from 'react-router-dom';
import { Users, Store, CreditCard, Settings, PlusCircle } from 'lucide-react';

const links = [
  { to: '/admin', label: 'Dashboard', icon: <Settings /> },
  { to: '/admin/usuarios', label: 'Usuarios', icon: <Users /> },
  { to: '/admin/tiendas', label: 'Tiendas', icon: <Store /> },
  { to: '/admin/pagos', label: 'Pagos', icon: <CreditCard /> },
  { to: '/admin/configuracion', label: 'Configuración', icon: <Settings /> },
  { to: '/admin/nuevo-cliente', label: 'Crear Cliente', icon: <PlusCircle /> },
];

export default function AdminSidebar() {
  return (
    <aside className="fixed top-0 left-0 h-screen w-64 bg-gradient-to-br from-[#0f0f0f] via-[#1f1f1f] to-[#2f2f2f] backdrop-blur-lg shadow-xl border-r border-gray-800 z-50">
      <div className="p-6 text-white text-2xl font-bold tracking-wide">mlpadigital</div>
      <nav className="flex flex-col gap-4 px-4 mt-6">
        {links.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-lg transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-lg'
                  : 'text-indigo-300 hover:bg-indigo-800 hover:text-white'
              }`
            }
          >
            {icon}
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}