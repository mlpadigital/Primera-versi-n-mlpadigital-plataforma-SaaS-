import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Menu, Loader2, ArrowRight } from 'lucide-react';

import { useToast } from '../../../shared/ui/use-toast';
import { Button } from '../../../shared/ui/button';
import { useAuth } from '../hooks/useAuth';
import { useStores } from '../hooks/useStores';

import StoreNavigation from '../components/StoreNavigation';
import DashboardRouter from '../components/DashboardRouter';

const isValidUUID = (uuid) => /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(uuid);

const DashboardPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, userProfile } = useAuth();
  const { fetchStores, createStore, updateStore, deleteStore } = useStores(user?._id);

  const [stores, setStores] = useState([]);
  const [newStoreName, setNewStoreName] = useState('');
  const [editingStore, setEditingStore] = useState(null);
  const [loadingStores, setLoadingStores] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [currentManagingStore, setCurrentManagingStore] = useState(null);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const loadStores = useCallback(async () => {
    if (!user) return setLoadingStores(false);
    setLoadingStores(true);
    try {
      const data = await fetchStores();
      setStores(data || []);
    } catch (err) {
      toast({ title: "Error al cargar tiendas", description: err.message, variant: "destructive" });
    }
    setLoadingStores(false);
  }, [user, fetchStores, toast]);

  useEffect(() => {
    if (userProfile?.plan_status === 'paid') {
      loadStores();
    } else {
      setLoadingStores(false);
    }
  }, [userProfile, loadStores]);

  useEffect(() => {
    const pathParts = location.pathname.split('/');
    const storeId = pathParts[1] === 'dashboard' ? pathParts[2] : null;
    if (storeId && isValidUUID(storeId)) {
      const store = stores.find(s => s._id === storeId);
      setCurrentManagingStore(store || null);
    } else {
      setCurrentManagingStore(null);
      setIsMobileNavOpen(false);
    }
  }, [location.pathname, stores]);

  const handleCreateStore = async () => {
    if (!newStoreName.trim()) {
      toast({ title: "Error", description: "El nombre de la tienda no puede estar vacío.", variant: "destructive" });
      return;
    }
    if (!user) {
      toast({ title: "Error", description: "Debes estar autenticado para crear una tienda.", variant: "destructive" });
      return;
    }
    if (userProfile?.plan_status !== 'paid') {
      toast({ title: "Plan Requerido", description: "Necesitas un plan activo para crear una tienda.", variant: "destructive" });
      navigate('/subscribe');
      return;
    }
    if (stores.length > 0) {
      toast({ title: "Límite de tiendas alcanzado", description: "Tu plan actual solo permite una tienda.", variant: "default" });
      return;
    }

    setActionLoading(true);
    try {
      const store = await createStore(newStoreName.trim());
      await loadStores();
      toast({ title: "¡Tienda Creada!", description: `"${store.name}" está lista para que la administres.` });
      setNewStoreName('');
      navigate(`/dashboard/${store._id}/overview`);
    } catch (err) {
      toast({ title: "Error al crear tienda", description: err.message, variant: "destructive" });
    }
    setActionLoading(false);
  };

  const handleDeleteStore = async (storeId, storeName) => {
    if (!isValidUUID(storeId)) {
      toast({ title: "Error", description: "ID de tienda inválido para eliminar.", variant: "destructive" });
      return;
    }
    if (window.confirm(`¿Eliminar la tienda "${storeName}"? Esta acción no se puede deshacer.`)) {
      setActionLoading(true);
      try {
        await deleteStore(storeId);
        await loadStores();
        toast({ title: "Tienda Eliminada", description: `La tienda "${storeName}" ha sido eliminada.` });
        if (location.pathname.includes(storeId)) {
          navigate('/dashboard');
          setCurrentManagingStore(null);
        }
      } catch (err) {
        toast({ title: "Error al eliminar tienda", description: err.message, variant: "destructive" });
      }
      setActionLoading(false);
    }
  };

  const handleEditStore = (store) => {
    if (!store || !isValidUUID(store._id)) {
      toast({ title: "Error", description: "ID de tienda inválido para editar.", variant: "destructive" });
      return;
    }
    setEditingStore({ ...store });
  };

  const handleSaveEdit = async () => {
    if (!editingStore || !isValidUUID(editingStore._id) || !editingStore.name.trim()) {
      toast({ title: "Error", description: "Datos inválidos o nombre vacío.", variant: "destructive" });
      return;
    }
    setActionLoading(true);
    try {
      const updated = await updateStore(editingStore._id, editingStore.name.trim());
      await loadStores();
      if (currentManagingStore?._id === updated._id) {
        setCurrentManagingStore(updated);
      }
      toast({ title: "Tienda Actualizada", description: `La tienda "${updated.name}" ha sido actualizada.` });
      setEditingStore(null);
    } catch (err) {
      toast({ title: "Error al actualizar tienda", description: err.message, variant: "destructive" });
    }
    setActionLoading(false);
  };

  const handleManageStoreClick = (store) => {
    if (!store || !isValidUUID(store._id)) {
      toast({ title: "Error de Navegación", description: "ID de tienda no válido.", variant: "destructive" });
      return;
    }
    navigate(`/dashboard/${store._id}/overview`);
  };

  const handleCloseNavigation = () => {
    navigate('/dashboard');
    setCurrentManagingStore(null);
  };

  if (!userProfile) {
    return (
      <div className="flex flex-1 h-full overflow-hidden items-center justify-center">
        <Loader2 className="h-16 w-16 animate-spin text-secondary" />
      </div>
    );
  }

  if (userProfile.plan_status !== 'paid') {
    return (
      <div className="flex flex-1 h-full overflow-hidden items-center justify-center">
        <div className="text-center p-8 bg-purple-800/50 rounded-lg shadow-xl">
          <h2 className="text-3xl font-bold text-yellow-300 mb-4">Activa tu Plan</h2>
          <p className="text-indigo-200 mb-6">Necesitas un plan activo para crear y administrar tus tiendas.</p>
          <Button onClick={() => navigate('/subscribe')} size="lg" className="bg-yellow-400 text-purple-700 hover:bg-yellow-500">
            Ir a la Página de Pago <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 h-full overflow-hidden relative">
      <AnimatePresence>
        {currentManagingStore && (
          <StoreNavigation
            storeName={currentManagingStore.name}
            onClose={handleCloseNavigation}
            storeId={currentManagingStore._id}
            isMobileOpen={isMobileNavOpen}
            setIsMobileOpen={setIsMobileNavOpen}
          />
        )}
      </AnimatePresence>

      <main className="flex-1 overflow-y-auto">
        {currentManagingStore && (
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden fixed top-20 left-4 z-50 bg-purple-800/50 text-white backdrop-blur-sm"
            onClick={() => setIsMobileNavOpen(true)}
          >
            <Menu />
          </Button>
        )}
        <div className="px-6 py-12 md:px-12 w-full">
          <DashboardRouter
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
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
