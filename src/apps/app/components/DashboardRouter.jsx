// src/apps/app/components/DashboardRouter.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Páginas internas del dashboard del usuario
import StoreOverviewPage from "../../shared/overview/StoreOverviewPage";
import ProductsList from "../../shared/components/ProductsList";
import ShoppingCart from "../../shared/components/ShoppingCart";
import SuccessMessage from "../../shared/components/SuccessMessage";

import {ErrorBoundary} from "../../shared/components/ErrorBoundary";
import ErrorMessage from "../../shared/components/ErrorMessage";

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
  handleSaveEdit,
}) => {
  if (loadingStores) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-400">Cargando tiendas...</p>
      </div>
    );
  }

  if (!stores || stores.length === 0) {
    return (
      <div className="text-center p-8 bg-gray-800/50 rounded-lg shadow-xl">
        <h2 className="text-2xl font-bold text-indigo-300 mb-4">
          No tienes tiendas creadas
        </h2>
        <div className="flex gap-4 justify-center">
          <input
            type="text"
            value={newStoreName}
            onChange={(e) => setNewStoreName(e.target.value)}
            placeholder="Nombre de la tienda"
            className="px-4 py-2 rounded-lg bg-gray-900 text-white border border-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={handleCreateStore}
            disabled={actionLoading}
            className="px-6 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 transition-all text-white font-semibold shadow-md"
          >
            {actionLoading ? "Creando..." : "Crear tienda"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary fallback={<ErrorMessage />}>
      <Routes>
        {/* Vista general de la tienda */}
        <Route
          path="/dashboard/:storeId/overview"
          element={<StoreOverviewPage />}
        />

        {/* Gestión de productos */}
        <Route
          path="/dashboard/:storeId/products"
          element={<ProductsList />}
        />

        {/* Carrito */}
        <Route
          path="/dashboard/:storeId/cart"
          element={<ShoppingCart />}
        />

        {/* Mensaje de éxito */}
        <Route
          path="/dashboard/:storeId/success"
          element={<SuccessMessage />}
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </ErrorBoundary>
  );
};

export default DashboardRouter;