import React from 'react';
import { Routes, Route, useParams, Link, Outlet, Navigate } from 'react-router-dom';
import { Button } from "../../../components/ui/button";
import { Loader2 } from 'lucide-react';
import ProductManagementPage from '../ProductManagement';
import DashboardHomeContent from './DashboardHomeContent';
import StoreDesignPage from '../design/StoreDesignPage';
import PaymentSettingsPage from '../payments/PaymentSettingsPage';
import MarketingAIAssistantPage from '../marketing/MarketingAIAssistantPage';
import AnalyticsPage from '../analytics/AnalyticsPage';
import StoreSettingsPage from '../settings/StoreSettingsPage';
import StoreOverviewPage from '../overview/StoreOverviewPage';
import OrderManagementPage from '../orders/OrderManagementPage';

const isValidUUID = (uuid) => {
  if (!uuid) return false;
  const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
  return uuidRegex.test(uuid);
};

const StoreRouteGuard = ({ stores, loadingStores }) => {
  const { storeId } = useParams();

  if (loadingStores) {
    return <div className="flex justify-center items-center h-full"><Loader2 className="h-12 w-12 animate-spin text-yellow-400" /></div>;
  }

  if (!isValidUUID(storeId)) {
    return (
      <div className="text-center py-10 flex flex-col items-center justify-center h-full">
        <h2 className="text-2xl font-semibold text-red-400">ID de Tienda Inválido en URL</h2>
        <p className="text-indigo-200">El ID proporcionado en la URL no es válido.</p>
        <Button asChild className="mt-4 bg-yellow-400 text-purple-700 hover:bg-yellow-500">
          <Link to="/dashboard">Volver al Dashboard</Link>
        </Button>
      </div>
    );
  }
  
  const storeExists = stores.some(s => s.id === storeId);
  if (!storeExists && !loadingStores) { 
     return (
      <div className="text-center py-10 flex flex-col items-center justify-center h-full">
        <h2 className="text-2xl font-semibold text-red-400">Tienda no encontrada</h2>
        <p className="text-indigo-200">La tienda que buscas no existe o no tienes permiso para verla.</p>
        <Button asChild className="mt-4 bg-yellow-400 text-purple-700 hover:bg-yellow-500">
          <Link to="/dashboard">Volver al Dashboard</Link>
        </Button>
      </div>
    );
  }

  return <Outlet />; 
};


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
  return (
    <Routes>
      <Route 
        index 
        element={
          <DashboardHomeContent 
            stores={stores}
            loadingStores={loadingStores}
            actionLoading={actionLoading}
            handleCreateStore={handleCreateStore}
            newStoreName={newStoreName}
            setNewStoreName={setNewStoreName}
            handleEditStore={handleEditStore}
            handleDeleteStore={handleDeleteStore}
            handleManageStoreClick={handleManageStoreClick}
            editingStore={editingStore}
            setEditingStore={setEditingStore}
            handleSaveEdit={handleSaveEdit}
          />
        } 
      />
      <Route element={<StoreRouteGuard stores={stores} loadingStores={loadingStores} />}>
        <Route path=":storeId/overview" element={<StoreOverviewPage />} />
        <Route path=":storeId/products" element={<ProductManagementPage />} />
        <Route path=":storeId/orders" element={<OrderManagementPage />} />
        <Route path=":storeId/design" element={<StoreDesignPage />} />
        <Route path=":storeId/marketing" element={<MarketingAIAssistantPage />} />
        <Route path=":storeId/payments" element={<PaymentSettingsPage />} />
        <Route path=":storeId/analytics" element={<AnalyticsPage />} />
        <Route path=":storeId/settings" element={<StoreSettingsPage />} />
        <Route path=":storeId/*" element={<Navigate to="overview" replace />} />
      </Route>
       <Route path="*" element={ <Navigate to="/dashboard" replace /> } />
    </Routes>
  );
};

export default DashboardRouter;