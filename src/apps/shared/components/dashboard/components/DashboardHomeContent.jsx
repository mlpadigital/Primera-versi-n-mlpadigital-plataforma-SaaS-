import React from 'react';
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../../../components/ui/card";
import { Package, PlusCircle, Edit2, Trash2, Loader2, Settings as SettingsIcon } from 'lucide-react';
import { motion } from 'framer-motion';

const isValidUUID = (uuid) => {
  if (!uuid) return false;
  const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
  return uuidRegex.test(uuid);
};

const DashboardHomeContent = ({ 
  session, 
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
    <>
      <h1 className="text-4xl md:text-5xl font-bold mb-4">Bienvenido a tu Dashboard, <span className="text-yellow-400">{session?.user?.email?.split('@')[0]}</span>!</h1>
      <p className="text-indigo-200 mb-10 text-lg">Gestiona tus tiendas y accede a todas las herramientas desde aquí.</p>

      <Card className="mb-12 glass-effect border-purple-500 shadow-xl">
        <CardHeader>
          <CardTitle className="text-3xl text-yellow-400">Crear Nueva Tienda</CardTitle>
          <CardDescription className="text-indigo-300">Dale un nombre a tu nueva tienda online.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row gap-4">
          <Input 
            type="text" 
            placeholder="Nombre de tu tienda (ej: MiTiendaDeModa)" 
            value={newStoreName}
            onChange={(e) => setNewStoreName(e.target.value)}
            className="flex-grow"
            disabled={actionLoading}
          />
          <Button onClick={handleCreateStore} className="bg-yellow-400 text-purple-700 hover:bg-yellow-500 font-semibold" disabled={actionLoading || !newStoreName.trim()}>
            {actionLoading && newStoreName ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <PlusCircle className="mr-2 h-5 w-5" />}
            Crear Tienda
          </Button>
        </CardContent>
      </Card>

      {editingStore && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[60] p-4"
          onClick={() => setEditingStore(null)}
        >
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.7, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
          >
            <Card className="glass-effect border-yellow-500 shadow-lg w-full max-w-lg">
              <CardHeader>
                <CardTitle className="text-2xl text-yellow-400">Editando Tienda: {stores.find(s=>s.id === editingStore.id)?.name}</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col sm:flex-row gap-4">
                <Input
                  type="text"
                  value={editingStore.name}
                  onChange={(e) => setEditingStore({ ...editingStore, name: e.target.value })}
                  className="flex-grow"
                  disabled={actionLoading}
                />
                <Button onClick={handleSaveEdit} className="bg-green-500 hover:bg-green-600 text-white" disabled={actionLoading || !editingStore.name.trim()}>
                  {actionLoading && editingStore ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
                  Guardar Cambios
                </Button>
                <Button onClick={() => setEditingStore(null)} variant="outline" className="text-white hover:bg-white/10" disabled={actionLoading}>Cancelar</Button>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      )}

      {loadingStores ? (
        <div className="flex justify-center items-center py-10">
          <Loader2 className="h-12 w-12 animate-spin text-yellow-400" />
          <p className="ml-4 text-xl">Cargando tus tiendas...</p>
        </div>
      ) : stores.length > 0 ? (
        <div className="grid md:grid-cols-1 lg:grid-cols-1 gap-8">
          {stores.map(store => (
            <motion.div key={store.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}>
              <Card className={`glass-effect hover:shadow-purple-400/30 shadow-lg border-purple-500/50 transition-all duration-300`}>
                <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                  <div>
                    <CardTitle className="text-2xl text-yellow-400">{store.name}</CardTitle>
                    <CardDescription className="text-indigo-300">Creada: {new Date(store.created_at).toLocaleDateString()}</CardDescription>
                  </div>
                  <div className="flex gap-2 mt-3 sm:mt-0">
                    <Button variant="outline" size="sm" className="text-white hover:bg-white/10" onClick={() => handleEditStore(store)} disabled={actionLoading}>
                      <Edit2 className="h-4 w-4 mr-1 sm:mr-2" /> <span className="hidden sm:inline">Editar Nombre</span>
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDeleteStore(store.id, store.name)} disabled={actionLoading}>
                      <Trash2 className="h-4 w-4 mr-1 sm:mr-2" /> <span className="hidden sm:inline">Eliminar</span>
                    </Button>
                  </div>
                </CardHeader>
                <CardFooter className="flex justify-center mt-4">
                   <Button 
                    className={`bg-purple-500 hover:bg-purple-600 text-white font-semibold w-full sm:w-auto`}
                    onClick={() => handleManageStoreClick(store)}
                    disabled={actionLoading || !isValidUUID(store.id)}
                  >
                     <SettingsIcon className="mr-2 h-5 w-5" /> 
                     Administrar Tienda "{store.name}"
                   </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
        <Card className="glass-effect text-center py-12">
          <CardContent>
            <Package className="h-20 w-20 text-yellow-400 mx-auto mb-6" />
            <h2 className="text-3xl font-semibold mb-3">Aún no tienes tiendas</h2>
            <p className="text-indigo-200 mb-6">¡Crea tu primera tienda para empezar a vender online!</p>
            <Button onClick={() => document.querySelector('input[placeholder*="Nombre de tu tienda"]')?.focus()} className="bg-yellow-400 text-purple-700 hover:bg-yellow-500 font-semibold">
              <PlusCircle className="mr-2 h-5 w-5" />
              Crear mi Primera Tienda
            </Button>
          </CardContent>
        </Card>
        </motion.div>
      )}
    </>
  );
};

export default DashboardHomeContent;