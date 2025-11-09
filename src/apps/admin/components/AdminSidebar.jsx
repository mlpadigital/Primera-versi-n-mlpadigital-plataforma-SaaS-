import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Store, CreditCard, Settings } from 'lucide-react';

const links = [
  { to: '/', label: 'Dashboard', icon: <LayoutDashboard className="h-5 w-5" /> },
  { to: '/users', label: 'Usuarios', icon: <Users className="h-5 w-5" /> },
  { to: '/stores', label: 'Tiendas', icon: <Store className="h-5 w-5" /> },
  { to: '/payments', label: 'Pagos', icon: <CreditCard className="h-5 w-5" /> },
  { to: '/settings', label: 'Configuración', icon: <Settings className="h-5 w-5" /> },
];

const AdminSidebar = () => {
  return (
    <aside className="w-64 bg-black/30 backdrop-blur-md p-6 border-r border-white/10">
      <h2 className="text-2xl font-bold mb-8">mlpadigital Admin</h2>
      <nav className="flex flex-col gap-4">
        {links.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                isActive ? 'bg-white/10 text-yellow-400' : 'hover:bg-white/5'
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
};

export default AdminSidebar;