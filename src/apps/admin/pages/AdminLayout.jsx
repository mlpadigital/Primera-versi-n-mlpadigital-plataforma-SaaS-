import React from 'react';
import AdminSidebar from '../components/AdminSidebar';
import AdminHeader from '../components/AdminHeader';

const AdminLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white">
      <AdminSidebar />
      <div className="flex flex-col flex-grow">
        <AdminHeader />
        <main className="flex-grow p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
};

export default AdminLayout;