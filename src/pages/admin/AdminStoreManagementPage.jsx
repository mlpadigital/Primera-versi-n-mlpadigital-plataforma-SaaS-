
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
//import { supabase } from './lib/customSupabaseClient';
import { useToast } from '../../components/ui/use-toast';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../../components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '../../components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { MoreHorizontal, ArrowUpDown, Loader2, ExternalLink, Play, Pause, Trash2, PlusCircle, Repeat } from 'lucide-react';
import { Badge } from '../../components/ui/badge';
import { Link } from 'react-router-dom';
import { Label } from '../../components/ui/label';
//import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';

const AdminStoreManagementPage = () => {
    const [stores, setStores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [sorting, setSorting] = useState({ key: 'created_at', order: 'desc' });
    const { toast } = useToast();
    const { session } = useAuth();
    
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isReassignOpen, setIsReassignOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [newStoreName, setNewStoreName] = useState('');
    const [selectedStore, setSelectedStore] = useState(null);
    const [selectedUserId, setSelectedUserId] = useState(null);
    
    const [availableUsers, setAvailableUsers] = useState([]);
    const [loadingUsers, setLoadingUsers] = useState(false);

    const fetchStores = useCallback(async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase.rpc('get_all_stores_with_user_email');
            
            if (error) throw error;
            
            setStores(data || []);
        } catch (error) {
            toast({ title: "Error", description: "No se pudieron cargar las tiendas. " + error.message, variant: "destructive" });
        } finally {
            setLoading(false);
        }
    }, [toast]);
    
    const fetchAvailableUsers = useCallback(async (storeToReassign = null) => {
        setLoadingUsers(true);
        try {
            const { data: allUsers, error: usersError } = await supabase
                .from('users_view')
                .select('id, email');
            if (usersError) throw usersError;
            
            const { data: storesWithOwners, error: storesError } = await supabase
                .from('stores')
                .select('user_id');
            if (storesError) throw storesError;

            const ownedUserIds = new Set(storesWithOwners.map(s => s.user_id));

            const unassignedUsers = allUsers.filter(user => {
                if (storeToReassign && user.id === storeToReassign.user_id) {
                    return false;
                }
                return !ownedUserIds.has(user.id);
            });
            
            setAvailableUsers(unassignedUsers);

        } catch (error) {
            toast({ title: "Error", description: "No se pudieron cargar los usuarios disponibles.", variant: "destructive" });
        } finally {
            setLoadingUsers(false);
        }
    }, [toast]);

    useEffect(() => {
        fetchStores();
    }, [fetchStores]);

    useEffect(() => {
        if (isAddOpen) {
            fetchAvailableUsers();
        }
    }, [isAddOpen, fetchAvailableUsers]);

    useEffect(() => {
        if (isReassignOpen && selectedStore) {
            fetchAvailableUsers(selectedStore);
        }
    }, [isReassignOpen, selectedStore, fetchAvailableUsers]);
    
    const handleAddStore = async () => {
        if (!newStoreName || !selectedUserId) {
            toast({ title: "Faltan datos", description: "Por favor, ingresa un nombre para la tienda y selecciona un usuario.", variant: "destructive" });
            return;
        }
        setIsSubmitting(true);
        try {
            const { error } = await supabase.functions.invoke('create-store', {
                body: { name: newStoreName, user_id: selectedUserId },
                headers: { Authorization: `Bearer ${session.access_token}` },
            });
            if (error) throw error;
            toast({ title: "Éxito", description: "Tienda creada correctamente." });
            fetchStores();
            setIsAddOpen(false);
            setNewStoreName('');
            setSelectedUserId(null);
        } catch (error) {
            let errorMessage = "No se pudo crear la tienda.";
            if(error.context?.error_message) {
              const parsedError = JSON.parse(error.context.error_message);
              errorMessage = parsedError.error;
            } else if (error.message) {
              errorMessage = error.message;
            }

            toast({ title: "Error", description: errorMessage, variant: "destructive" });
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const handleReassignStore = async () => {
        if (!selectedStore || !selectedUserId) {
            toast({ title: "Faltan datos", description: "Por favor, selecciona una tienda y un nuevo usuario.", variant: "destructive" });
            return;
        }
        setIsSubmitting(true);
        try {
            const { error } = await supabase.functions.invoke('reassign-store', {
                body: { store_id: selectedStore.id, new_user_id: selectedUserId, old_user_id: selectedStore.user_id },
                 headers: { Authorization: `Bearer ${session.access_token}` },
            });
            if (error) throw error;
            toast({ title: "Éxito", description: "Tienda reasignada correctamente." });
            fetchStores();
            setIsReassignOpen(false);
            setSelectedStore(null);
            setSelectedUserId(null);
        } catch (error) {
            let errorMessage = "No se pudo reasignar la tienda.";
            if(error.context?.error_message) {
              const parsedError = JSON.parse(error.context.error_message);
              errorMessage = parsedError.error;
            } else if (error.message) {
              errorMessage = error.message;
            }
            toast({ title: "Error", description: errorMessage, variant: "destructive" });
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const handleDeleteStore = async () => {
        if (!selectedStore) return;
        setIsSubmitting(true);
        try {
            const { error } = await supabase.functions.invoke('delete-store', {
                body: { store_id: selectedStore.id },
                 headers: { Authorization: `Bearer ${session.access_token}` },
            });
            if (error) throw error;
            toast({ title: "Éxito", description: "Tienda eliminada correctamente." });
            fetchStores();
            setIsDeleteOpen(false);
            setSelectedStore(null);
        } catch (error) {
            toast({ title: "Error", description: `No se pudo eliminar la tienda: ${error.message}`, variant: "destructive" });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSort = (key) => setSorting(prev => ({ key, order: prev.key === key && prev.order === 'asc' ? 'desc' : 'asc' }));
    const filteredAndSortedStores = useMemo(() => {
        if (!stores) return [];
        return stores
            .filter(store =>
                (store.name && store.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (store.user_email && store.user_email.toLowerCase().includes(searchTerm.toLowerCase()))
            )
            .sort((a, b) => {
                if (a[sorting.key] < b[sorting.key]) return sorting.order === 'asc' ? -1 : 1;
                if (a[sorting.key] > b[sorting.key]) return sorting.order === 'asc' ? 1 : -1;
                return 0;
            });
    }, [stores, searchTerm, sorting]);

    const updateStoreStatus = async (storeId, newStatus) => {
        try {
            const { error } = await supabase.from('stores').update({ status: newStatus }).eq('id', storeId);
            if (error) throw error;
            setStores(stores.map(s => s.id === storeId ? { ...s, status: newStatus } : s));
            toast({ title: "Éxito", description: `La tienda ha sido ${newStatus === 'active' ? 'activada' : 'suspendida'}.` });
        } catch (error) {
            toast({ title: "Error", description: "No se pudo actualizar el estado de la tienda.", variant: "destructive" });
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'active': return <Badge variant="secondary" className="bg-green-500/20 text-green-300 border-green-500/50">Activa</Badge>;
            case 'suspended': return <Badge variant="destructive" className="bg-red-500/20 text-red-300 border-red-500/50">Suspendida</Badge>;
            default: return <Badge variant="outline">Desconocido</Badge>;
        }
    };

    const UserSelector = ({ onSelectUser, isLoading, users, keyReset, currentSelection }) => {
        const handleSelect = (userId) => {
            onSelectUser(userId);
        };
    
        return (
            <Select onValueChange={handleSelect} value={currentSelection || ''} key={keyReset}>
                <SelectTrigger className="w-full bg-slate-800 border-slate-700">
                    <SelectValue placeholder={isLoading ? 'Cargando usuarios...' : 'Selecciona un usuario'} />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700 text-white">
                    {isLoading ? (
                        <SelectItem value="loading" disabled>Cargando...</SelectItem>
                    ) : (
                        users.length > 0 ? users.map(user => (
                            <SelectItem key={user.id} value={user.id}>{user.email}</SelectItem>
                        )) : <SelectItem value="none" disabled>No hay usuarios sin tienda</SelectItem>
                    )}
                </SelectContent>
            </Select>
        );
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 sm:p-8 text-white">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                 <h1 className="text-3xl sm:text-4xl font-bold">Gestión de Tiendas</h1>
                 <Button onClick={() => { setIsAddOpen(true); setSelectedUserId(null); }} className="bg-yellow-400 text-slate-900 hover:bg-yellow-500">
                    <PlusCircle className="mr-2 h-4 w-4" /> Agregar Tienda
                </Button>
            </div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <Input placeholder="Buscar por nombre o email..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full sm:max-w-sm bg-slate-800 border-slate-700" />
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-900 overflow-x-auto">
                <Table>
                    <TableHeader><TableRow className="border-b-slate-800 hover:bg-slate-800/50">
                        <TableHead className="text-white"><Button variant="ghost" className="px-2" onClick={() => handleSort('name')}>Nombre <ArrowUpDown className="ml-2 h-4 w-4" /></Button></TableHead>
                        <TableHead className="text-white"><Button variant="ghost" className="px-2" onClick={() => handleSort('user_email')}>Usuario <ArrowUpDown className="ml-2 h-4 w-4" /></Button></TableHead>
                        <TableHead className="text-white"><Button variant="ghost" className="px-2" onClick={() => handleSort('status')}>Estado <ArrowUpDown className="ml-2 h-4 w-4" /></Button></TableHead>
                        <TableHead className="text-white"><Button variant="ghost" className="px-2" onClick={() => handleSort('created_at')}>Creación <ArrowUpDown className="ml-2 h-4 w-4" /></Button></TableHead>
                        <TableHead className="text-right text-white">Acciones</TableHead>
                    </TableRow></TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow><TableCell colSpan={5} className="text-center py-10"><Loader2 className="mx-auto h-8 w-8 animate-spin" /></TableCell></TableRow>
                        ) : filteredAndSortedStores.map(store => (
                            <TableRow key={store.id} className="border-b-slate-800 hover:bg-slate-800/50">
                                <TableCell className="font-medium">{store.name}</TableCell>
                                <TableCell>{store.user_email || 'N/A'}</TableCell>
                                <TableCell>{getStatusBadge(store.status)}</TableCell>
                                <TableCell>{new Date(store.created_at).toLocaleDateString()}</TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild><Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="bg-slate-800 border-slate-700 text-white">
                                            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                                            {store.store_slug && <DropdownMenuItem asChild><Link to={`/${store.store_slug}`} target="_blank" rel="noopener noreferrer" className="flex items-center cursor-pointer"><ExternalLink className="mr-2 h-4 w-4" /> Ver Tienda</Link></DropdownMenuItem>}
                                            <DropdownMenuItem onClick={() => { setSelectedStore(store); setIsReassignOpen(true); setSelectedUserId(null); }}><Repeat className="mr-2 h-4 w-4" /> Reasignar</DropdownMenuItem>
                                            <DropdownMenuSeparator className="bg-slate-700" />
                                            {store.status === 'active' ? <DropdownMenuItem onClick={() => updateStoreStatus(store.id, 'suspended')} className="text-yellow-400 focus:bg-yellow-400/10 focus:text-yellow-300"><Pause className="mr-2 h-4 w-4" /> Suspender</DropdownMenuItem> : <DropdownMenuItem onClick={() => updateStoreStatus(store.id, 'active')} className="text-green-400 focus:bg-green-400/10 focus:text-green-300"><Play className="mr-2 h-4 w-4" /> Activar</DropdownMenuItem>}
                                            <DropdownMenuItem onClick={() => { setSelectedStore(store); setIsDeleteOpen(true); }} className="text-red-400 focus:bg-red-400/10 focus:text-red-300"><Trash2 className="mr-2 h-4 w-4" /> Eliminar</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            
            <Dialog open={isAddOpen} onOpenChange={(isOpen) => { setIsAddOpen(isOpen); if (!isOpen) { setSelectedUserId(null); setNewStoreName('') } }}>
                <DialogContent className="sm:max-w-md bg-slate-900 border-slate-800 text-white">
                    <DialogHeader><DialogTitle className="text-yellow-400">Agregar Nueva Tienda</DialogTitle><DialogDescription>Crea una nueva tienda y asígnala a un usuario.</DialogDescription></DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="store-name">Nombre de la Tienda</Label>
                            <Input id="store-name" value={newStoreName} onChange={(e) => setNewStoreName(e.target.value)} className="bg-slate-800 border-slate-700" />
                        </div>
                        <div className="space-y-2">
                           <Label>Asignar a Usuario</Label>
                           <UserSelector onSelectUser={setSelectedUserId} isLoading={loadingUsers} users={availableUsers} keyReset={isAddOpen} currentSelection={selectedUserId} />
                        </div>
                    </div>
                    <DialogFooter><Button onClick={handleAddStore} disabled={isSubmitting || !selectedUserId || !newStoreName} className="bg-yellow-400 text-slate-900 hover:bg-yellow-500">{isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}Crear Tienda</Button></DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={isReassignOpen} onOpenChange={(isOpen) => { setIsReassignOpen(isOpen); if (!isOpen) { setSelectedUserId(null); } }}>
                <DialogContent className="sm:max-w-md bg-slate-900 border-slate-800 text-white">
                    <DialogHeader><DialogTitle>Reasignar Tienda</DialogTitle><DialogDescription>Transfiere la propiedad de <strong className="text-yellow-400">{selectedStore?.name}</strong> a otro usuario.</DialogDescription></DialogHeader>
                     <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                           <Label>Nuevo Propietario</Label>
                           <UserSelector onSelectUser={setSelectedUserId} isLoading={loadingUsers} users={availableUsers} keyReset={isReassignOpen} currentSelection={selectedUserId} />
                        </div>
                     </div>
                    <DialogFooter><Button onClick={handleReassignStore} disabled={isSubmitting || !selectedUserId}>{isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}Reasignar</Button></DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <DialogContent className="sm:max-w-md bg-slate-900 border-red-500/50 text-white">
                    <DialogHeader><DialogTitle className="text-red-400">¿Estás seguro?</DialogTitle><DialogDescription>Esta acción no se puede deshacer. Eliminará permanentemente la tienda <strong className="text-white">{selectedStore?.name}</strong> y todos sus productos asociados.</DialogDescription></DialogHeader>
                    <DialogFooter className="sm:justify-end gap-2">
                        <DialogClose asChild><Button type="button" variant="secondary">Cancelar</Button></DialogClose>
                        <Button type="button" variant="destructive" onClick={handleDeleteStore} disabled={isSubmitting}>{isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin"/>}Sí, eliminar tienda</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </motion.div>
    );
};

export default AdminStoreManagementPage;
