import React from 'react';

const AdminHeader = () => {
  return (
    <header className="w-full px-6 py-4 border-b border-white/10 bg-black/20 backdrop-blur-md">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold text-white">Panel Administrativo</h1>
        <div className="text-sm text-indigo-300">Bienvenido, Admin</div>
      </div>
    </header>
  );
};

export default AdminHeader;