import React from 'react';
import StoreOverviewPage from '../../pages/dashboard/overview/StoreOverviewPage';
import ProductManagement from '../../pages/dashboard/ProductManagement';

const DashboardRouter = ({
  stores,
  loadingStores,
  actionLoading,
  handleCreateStore,
  newStoreName,
  setNewStoreName,
  handleEditStore,
  handleDeleteStore,
  handleManageStoreClick,
  editingStore,
  setEditingStore,
  handleSaveEdit
}) => {
  // Aquí iría tu lógica de enrutamiento interno o renderizado condicional
  return (
    <div>
      {/* Ejemplo de vista */}
      <StoreOverviewPage />
    </div>
  );
};

export default DashboardRouter;