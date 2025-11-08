import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useToast } from "../../components/ui/use-toast.js";
import { AnimatePresence } from 'framer-motion';
//import { supabase } from '../../lib/customSupabaseClient';
import StoreNavigation from '../../components/StoreNavigation';
import DashboardRouter from '../../pages/dashboard/components/DashboardRouter';
import { Button } from '../../components/ui/button';
import { ArrowRight, Menu, Loader2 } from 'lucide-react';
//import { useAuth } from '../../contexts/SupabaseAuthContext';

const isValidUUID = (uuid) => {
  if (!uuid) return false;
  const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
  return uuidRegex.test(uuid);
};

const DashboardPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { session, userProfile } = useAuth();
  
  const [stores, setStores] = useState([]);
  const [newStoreName, setNewStoreName] = useState('');
  const [editingStore, setEditingStore] = useState(null);
  const [loadingStores, setLoadingStores] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [currentManagingStore, setCurrentManagingStore] = useState(null);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const fetchStores = useCallback(async () => {
    if (!session?.user) {
      setLoadingStores(false);
      return;
    }
    setLoadingStores(true);
    
    const { data, error } = await supabase
      .from('stores')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });

    if (error) {
      toast({ title: "Error al cargar tiendas", description: error.message, variant: "destructive" });
      setStores([]);
    } else {
      setStores(data || []);
    }

    setLoadingStores(false);
  }, [session, toast]);

  useEffect(() => {
    if (userProfile) { 
        if (userProfile.plan_status === 'paid') {
            fetchStores();
        } else {
            setLoadingStores(false);
        }
    } else {
        setLoadingStores(true);
    }
  }, [userProfile, fetchStores]);

  useEffect(() => {
    const pathParts = location.pathname.split('/');
    let currentPathStoreId = null;
    
    if (pathParts.length > 2 && pathParts[1] === 'dashboard') {
      currentPathStoreId = pathParts[2]; 
    }
    
    if (currentPathStoreId && isValidUUID(currentPathStoreId)) {
      if (!loadingStores && stores.length > 0) {
        const store = stores.find(s => s.id === currentPathStoreId);
        setCurrentManagingStore(store || null);
      }
    } else {
      setCurrentManagingStore(null);
      setIsMobileNavOpen(false);
    }
  }, [location.pathname, stores, loadingStores]);


  const handleCreateStore = async () => {
    if (!newStoreName.trim()) {
      toast({ title: "Error", description: "El nombre de la tienda no puede estar vacío.", variant: "destructive" });
      return;
    }
    if (!session?.user) {
      toast({ title: "Error", description: "Debes estar autenticado para crear una tienda.", variant: "destructive" });
      return;
    }
    
    if (userProfile?.plan_status !== 'paid') {
      toast({
        title: "Plan Requerido",
        description: "Necesitas un plan activo para crear una tienda.",
        variant: "destructive"
      });
      navigate('/subscribe');
      return;
    }
    
    if (stores.length > 0) {
        toast({
            title: "Límite de tiendas alcanzado",
            description: "Tu plan actual solo permite una tienda. Contacta a soporte para más información.",
            variant: "default"
        });
        return;
    }
    
    setActionLoading(true);

    const { data: storeData, error: storeError } = await supabase
      .from('stores')
      .insert({ name: newStoreName.trim(), user_id: session.user.id })
      .select()
      .single();

    if (storeError) {
      toast({ title: "Error al crear la tienda", description: storeError.message, variant: "destructive" });
      setActionLoading(false);
      return;
    }

    const v_store_slug = newStoreName.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') + '-' + storeData.id.substring(0,4);

    const { error: settingsError } = await supabase
      .from('store_settings')
      .insert({
        id: storeData.id,
        user_id: session.user.id,
        store_slug: v_store_slug,
        settings: { features: { aiChatbotEnabled: false } }
      });

    if (settingsError) {
        await supabase.from('stores').delete().eq('id', storeData.id);
        toast({ title: "Error al configurar la tienda", description: settingsError.message, variant: "destructive" });
    } else {
        await fetchStores();
        toast({ title: "¡Tienda Creada!", description: `"${newStoreName.trim()}" está lista para que la administres.` });
        setNewStoreName('');
        navigate(`/dashboard/${storeData.id}/overview`);
    }

    setActionLoading(false);
  };

  const handleDeleteStore = async (storeIdToDelete, storeName) => {
    if (!isValidUUID(storeIdToDelete)) {
      toast({ title: "Error", description: "ID de tienda inválido para eliminar.", variant: "destructive" });
      return;
    }
    if (window.confirm(`¿Estás seguro de que quieres eliminar la tienda "${storeName}"? Esta acción no se puede deshacer.`)) {
      setActionLoading(true);
      
      const { error } = await supabase.rpc('delete_store', { store_id_to_delete: storeIdToDelete });
      
      setActionLoading(false);
      if (error) {
        toast({ title: "Error al eliminar tienda", description: error.message, variant: "destructive" });
      } else {
        const pathStoreId = location.pathname.split('/')[2];
        if (pathStoreId === storeIdToDelete) {
          navigate('/dashboard', { replace: true });
          setCurrentManagingStore(null); 
        }
        await fetchStores(); 
        toast({ title: "Tienda Eliminada", description: `La tienda "${storeName}" ha sido eliminada.` });
      }
    }
  };
  
  const handleEditStore = (store) => {
    if (!store || !isValidUUID(store.id)) {
      toast({ title: "Error", description: "ID de tienda inválido para editar.", variant: "destructive" });
      return;
    }
    setEditingStore({ ...store }); 
  };

  const handleSaveEdit = async () => {
    if (!editingStore || !isValidUUID(editingStore.id) || !editingStore.name.trim()) {
      toast({ title: "Error", description: "Datos de edición inválidos o nombre vacío.", variant: "destructive" });
      return;
    }
    setActionLoading(true);
    const { data, error } = await supabase
      .from('stores')
      .update({ name: editingStore.name.trim() })
      .eq('id', editingStore.id)
      .eq('user_id', session.user.id)
      .select();
    
    setActionLoading(false);
    if (error) {
      toast({ title: "Error al actualizar tienda", description: error.message, variant: "destructive" });
    } else if (data && data.length > 0) {
      await fetchStores(); 
      if (currentManagingStore && currentManagingStore.id === data[0].id) {
        setCurrentManagingStore(data[0]); 
      }
      toast({ title: "Tienda Actualizada", description: `La tienda "${data[0].name}" ha sido actualizada.` });
      setEditingStore(null);
    }
  };
  
  const handleManageStoreClick = (store) => {
    if (!store || !isValidUUID(store.id)) {
      toast({ title: "Error de Navegación", description: "No se puede administrar la tienda: ID de tienda no válido o tienda no proporcionada.", variant: "destructive" });
      console.error("Intento de navegar con tienda inválida:", store);
      return;
    }
    navigate(`/dashboard/${store.id}/overview`);
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
            <div 
                className="text-center p-8 bg-purple-800/50 rounded-lg shadow-xl"
            >
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
            storeId={currentManagingStore.id}
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