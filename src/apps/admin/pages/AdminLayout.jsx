import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';
import AdminHeader from '../components/AdminHeader';

const AdminLayout = () => {
  return (
    <div className="min-h-screen flex bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white">
      <AdminSidebar />
      <div className="flex flex-col flex-grow bg-gray-950 text-white">
        <AdminHeader />
        <main className="flex-grow p-6 overflow-y-auto">
          <Outlet /> {/* Aquí se renderizan las subrutas como /admin/nuevo-cliente */}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;