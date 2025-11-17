
import React from "react";
import { NavLink } from "react-router-dom";
import { X, Home, Package, ShoppingCart, BarChart } from "lucide-react";
import { motion as Motion, AnimatePresence } from "framer-motion";

const StoreNavigation = ({
  storeName,
  storeId,
  onClose,
  isMobileOpen,
  setIsMobileOpen,
}) => {
  const links = [
    { to: `/dashboard/${storeId}/overview`, label: "Overview", icon: Home },
    { to: `/dashboard/${storeId}/products`, label: "Productos", icon: Package },
    { to: `/dashboard/${storeId}/cart`, label: "Carrito", icon: ShoppingCart },
    { to: `/dashboard/${storeId}/stats`, label: "Estadísticas", icon: BarChart },
  ];

  return (
    <>
      {/* Sidebar en desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-gray-900 text-white p-6 border-r border-gray-800">
        <h2 className="text-xl font-bold mb-6">{storeName}</h2>
        <nav className="flex flex-col gap-4">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                  isActive
                    ? "bg-indigo-600 text-white"
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                }`
              }
            >
              <Icon className="h-5 w-5" /> {/* 👈 ahora sí se usa */}
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Sidebar en mobile */}
      <AnimatePresence>
        {isMobileOpen && (
          <Motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-y-0 left-0 w-64 bg-gray-900 text-white p-6 z-50 shadow-lg lg:hidden"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">{storeName}</h2>
              <button
                onClick={() => {
                  setIsMobileOpen(false);
                  onClose();
                }}
                className="text-gray-400 hover:text-white"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <nav className="flex flex-col gap-4">
              {links.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={() => setIsMobileOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                      isActive
                        ? "bg-indigo-600 text-white"
                        : "text-gray-300 hover:bg-gray-800 hover:text-white"
                    }`
                  }
                >
                  <Icon className="h-5 w-5" /> {/* 👈 ahora sí se usa */}
                  {label}
                </NavLink>
              ))}
            </nav>
          </Motion.aside>
        )}
      </AnimatePresence>
    </>
  );
};

export default StoreNavigation;