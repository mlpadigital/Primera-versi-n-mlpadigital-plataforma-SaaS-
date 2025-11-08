import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
//import { supabase } from './lib/customSupabaseClient';
import { useToast } from '../../components/ui/use-toast';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuRadioGroup, DropdownMenuRadioItem
} from '../../components/ui/dropdown-menu';
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose
} from '../../components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { MoreHorizontal, ArrowUpDown, Loader2, UserCheck, UserX, Shield, UserPlus, Trash2, CreditCard } from 'lucide-react';
import { Badge } from '../../components/ui/badge';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
//import { useAuth } from '@/contexts/SupabaseAuthContext';

const AdminUserManagementPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [sorting, setSorting] = useState({ key: 'created_at', order: 'desc' });
    const [isAddUserOpen, setIsAddUserOpen] = useState(false);
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [newUserForm, setNewUserForm] = useState({
        email: '',
        password: '',
        first_name: '',
        last_name: '',
        role: 'user',
    });
    const { toast } = useToast();
    const { session } = useAuth();

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        try {
            const { data: authUsers, error: authError } = await supabase
                .from('users_view')
                .select('id, email');

            if (authError) throw authError;

            if (!authUsers || authUsers.length === 0) {
                setUsers([]);
                setLoading(false);
                return;
            }

            const userIds = authUsers.map(u => u.id);

            const { data: profiles, error: profileError } = await supabase
                .from('user_profiles')
                .select(`id, first_name, last_name, role, plan_status, created_at`)
                .in('id', userIds);

            if (profileError) throw profileError;

            const profilesMap = profiles.reduce((acc, profile) => {
                acc[profile.id] = profile;
                return acc;
            }, {});

            const combinedUsers = authUsers.map(user => {
                const profile = profilesMap[user.id];
                return {
                    ...user,
                    ...profile,
                    created_at: profile?.created_at || new Date().toISOString(),
                };
            });

            setUsers(combinedUsers);
        } catch (error) {
            toast({ title: "Error", description: "No se pudieron cargar los usuarios. " + error.message, variant: "destructive" });
        } finally {
            setLoading(false);
        }
    }, [toast]);

    useEffect(() => {
        fetchUsers();

        const userProfilesChannel = supabase
            .channel('public:user_profiles')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'user_profiles' },
                (payload) => {
                    console.log('Change received!', payload);
                    fetchUsers();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(userProfilesChannel);
        };
    }, [fetchUsers]);

    const handleSort = (key) => {
        setSorting(prev => ({
            key,
            order: prev.key === key && prev.order === 'asc' ? 'desc' : 'asc'
        }));
    };

    const filteredAndSortedUsers = useMemo(() => {
        return users
            .filter(user => user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()))
            .sort((a, b) => {
                const valA = a[sorting.key];
                const valB = b[sorting.key];
                if (valA < valB) return sorting.order === 'asc' ? -1 : 1;
                if (valA > valB) return sorting.order === 'asc' ? 1 : -1;
                return 0;
            });
    }, [users, searchTerm, sorting]);

    const handleFormChange = (e) => {
        setNewUserForm({ ...newUserForm, [e.target.name]: e.target.value });
    };

    const handleRoleChange = (value) => {
        setNewUserForm({ ...newUserForm, role: value });
    };

    const handleAddUser = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const { data, error } = await supabase.functions.invoke('create-user', {
                body: newUserForm,
                headers: {
                    Authorization: `Bearer ${session.access_token}`,
                },
            });
            
            if (error) {
                let errorMessage = error.message;
                try {
                    const parsedError = JSON.parse(error.message.substring(error.message.indexOf('{')));
                    if (parsedError.error) {
                        errorMessage = parsedError.error;
                    }
                } catch (e) {
                }
                throw new Error(errorMessage);
            }

            if (data.error) {
                throw new Error(data.error);
            }
    
            toast({ title: "Éxito", description: "Usuario creado correctamente." });
            setIsAddUserOpen(false);
            setNewUserForm({ email: '', password: '', first_name: '', last_name: '', role: 'user' });
        } catch (error) {
            const errorMessage = error.message.includes("already been registered")
                ? "Un usuario con este correo electrónico ya existe."
                : `Error al crear usuario: ${error.message}`;
            toast({ title: "Error", description: errorMessage, variant: "destructive" });
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const handleDeleteUser = async () => {
        if (!userToDelete) return;
        setIsSubmitting(true);
        try {
            const { error } = await supabase.functions.invoke('delete-user', {
                body: { user_id: userToDelete.id },
                headers: {
                    Authorization: `Bearer ${session.access_token}`,
                },
            });

            if (error) throw error;

            toast({ title: "Éxito", description: `Usuario ${userToDelete.email} eliminado.` });
            setUserToDelete(null);
            setIsDeleteConfirmOpen(false);
        } catch (error) {
            toast({ title: "Error al eliminar usuario", description: error.message, variant: "destructive" });
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const openDeleteDialog = (user) => {
        setUserToDelete(user);
        setIsDeleteConfirmOpen(true);
    };

    const updateUserRole = async (userId, newRole) => {
        try {
            const { error } = await supabase
                .from('user_profiles')
                .update({ role: newRole })
                .eq('id', userId);
            if (error) throw error;
            toast({ title: "Éxito", description: `El rol del usuario ha sido actualizado a ${newRole}.` });
        } catch (error) {
            toast({ title: "Error", description: "No se pudo actualizar el rol del usuario.", variant: "destructive" });
        }
    };
    
    const updateUserPlanStatus = async (userId, newStatus) => {
        try {
            const { error } = await supabase
                .from('user_profiles')
                .update({ plan_status: newStatus })
                .eq('id', userId);
            if (error) throw error;
            toast({ title: "Éxito", description: `El estado del plan del usuario ha sido actualizado.` });
        } catch (error) {
            toast({ title: "Error", description: "No se pudo actualizar el estado del plan del usuario.", variant: "destructive" });
        }
    };

    const getRoleBadge = (role) => {
        switch (role) {
            case 'admin': return <Badge className="bg-yellow-400/20 text-yellow-300 border-yellow-500/50">Admin</Badge>;
            case 'user': return <Badge variant="secondary" className="bg-blue-500/20 text-blue-300 border-blue-500/50">Usuario</Badge>;
            default: return <Badge variant="outline">Sin Rol</Badge>;
        }
    };
    
    const getPlanBadge = (plan) => {
        switch (plan) {
            case 'paid': return <Badge className="bg-green-500/20 text-green-300 border-green-500/50">Pagado</Badge>;
            case 'pending_payment': return <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/50">Pendiente</Badge>;
            default: return <Badge variant="outline">Sin Plan</Badge>;
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-4 sm:p-8 text-white"
        >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h1 className="text-3xl sm:text-4xl font-bold">Gestión de Usuarios</h1>
                <Button onClick={() => setIsAddUserOpen(true)} className="bg-yellow-400 text-slate-900 hover:bg-yellow-500">
                    <UserPlus className="mr-2 h-4 w-4" /> Agregar Usuario
                </Button>
            </div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <Input
                    placeholder="Buscar por email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full sm:max-w-sm bg-slate-800 border-slate-700"
                />
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-900 overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow className="border-b-slate-800 hover:bg-slate-800/50">
                            <TableHead className="text-white" onClick={() => handleSort('email')}><Button variant="ghost" className="px-2">Email <ArrowUpDown className="ml-2 h-4 w-4" /></Button></TableHead>
                            <TableHead className="text-white" onClick={() => handleSort('role')}><Button variant="ghost" className="px-2">Rol <ArrowUpDown className="ml-2 h-4 w-4" /></Button></TableHead>
                            <TableHead className="text-white" onClick={() => handleSort('plan_status')}><Button variant="ghost" className="px-2">Plan <ArrowUpDown className="ml-2 h-4 w-4" /></Button></TableHead>
                            <TableHead className="text-white" onClick={() => handleSort('created_at')}><Button variant="ghost" className="px-2">Registrado <ArrowUpDown className="ml-2 h-4 w-4" /></Button></TableHead>
                            <TableHead className="text-right text-white">Acciones</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow><TableCell colSpan={5} className="text-center py-10"><Loader2 className="mx-auto h-8 w-8 animate-spin" /></TableCell></TableRow>
                        ) : filteredAndSortedUsers.map(user => (
                            <TableRow key={user.id} className="border-b-slate-800 hover:bg-slate-800/50">
                                <TableCell className="font-medium">{user.email}</TableCell>
                                <TableCell>{getRoleBadge(user.role)}</TableCell>
                                <TableCell>{getPlanBadge(user.plan_status)}</TableCell>
                                <TableCell>{user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}</TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild><Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="bg-slate-800 border-slate-700 text-white">
                                            <DropdownMenuLabel>Cambiar Rol</DropdownMenuLabel>
                                            <DropdownMenuRadioGroup value={user.role} onValueChange={(newRole) => updateUserRole(user.id, newRole)}>
                                                <DropdownMenuRadioItem value="admin" className="focus:bg-yellow-400/10 focus:text-yellow-300"><Shield className="mr-2 h-4 w-4" /> Admin</DropdownMenuRadioItem>
                                                <DropdownMenuRadioItem value="user" className="focus:bg-blue-400/10 focus:text-blue-300"><UserCheck className="mr-2 h-4 w-4" /> Usuario</DropdownMenuRadioItem>
                                            </DropdownMenuRadioGroup>
                                            <DropdownMenuSeparator className="bg-slate-700" />
                                            <DropdownMenuLabel>Cambiar Plan</DropdownMenuLabel>
                                            <DropdownMenuRadioGroup value={user.plan_status} onValueChange={(newStatus) => updateUserPlanStatus(user.id, newStatus)}>
                                                <DropdownMenuRadioItem value="paid" className="focus:bg-green-400/10 focus:text-green-300"><CreditCard className="mr-2 h-4 w-4" /> Pagado</DropdownMenuRadioItem>
                                                <DropdownMenuRadioItem value="pending_payment" className="focus:bg-yellow-400/10 focus:text-yellow-300"><Loader2 className="mr-2 h-4 w-4" /> Pendiente</DropdownMenuRadioItem>
                                            </DropdownMenuRadioGroup>
                                            <DropdownMenuSeparator className="bg-slate-700" />
                                            <DropdownMenuItem onClick={() => openDeleteDialog(user)} className="text-red-400 focus:bg-red-400/10 focus:text-red-300">
                                                <Trash2 className="mr-2 h-4 w-4" /> Eliminar Usuario
                                            </DropdownMenuItem>
                                            <DropdownMenuItem disabled className="focus:bg-red-400/10 focus:text-red-300"><UserX className="mr-2 h-4 w-4" /> Suspender (Próximamente)</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            
            <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
                <DialogContent className="sm:max-w-[425px] bg-slate-900 border-slate-800 text-white">
                    <DialogHeader>
                        <DialogTitle className="text-yellow-400">Agregar Nuevo Usuario</DialogTitle>
                        <DialogDescription>
                            Completa los detalles para crear una nueva cuenta de usuario.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleAddUser}>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="first_name" className="text-right">Nombre</Label>
                                <Input id="first_name" name="first_name" value={newUserForm.first_name} onChange={handleFormChange} className="col-span-3 bg-slate-800 border-slate-700" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="last_name" className="text-right">Apellido</Label>
                                <Input id="last_name" name="last_name" value={newUserForm.last_name} onChange={handleFormChange} className="col-span-3 bg-slate-800 border-slate-700" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="email" className="text-right">Email</Label>
                                <Input id="email" name="email" type="email" value={newUserForm.email} onChange={handleFormChange} required className="col-span-3 bg-slate-800 border-slate-700" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="password" className="text-right">Contraseña</Label>
                                <Input id="password" name="password" type="password" value={newUserForm.password} onChange={handleFormChange} required className="col-span-3 bg-slate-800 border-slate-700" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="role" className="text-right">Rol</Label>
                                <Select name="role" onValueChange={handleRoleChange} defaultValue={newUserForm.role}>
                                    <SelectTrigger className="col-span-3 bg-slate-800 border-slate-700">
                                        <SelectValue placeholder="Selecciona un rol" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-slate-800 border-slate-700 text-white">
                                        <SelectItem value="user">Usuario</SelectItem>
                                        <SelectItem value="admin">Admin</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="submit" disabled={isSubmitting} className="bg-yellow-400 text-slate-900 hover:bg-yellow-500">
                                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                Crear Usuario
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
            
            <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
                <DialogContent className="sm:max-w-md bg-slate-900 border-red-500/50 text-white">
                    <DialogHeader>
                        <DialogTitle className="text-red-400">¿Estás seguro?</DialogTitle>
                        <DialogDescription>
                            Esta acción no se puede deshacer. Esto eliminará permanentemente al usuario <strong className="text-white">{userToDelete?.email}</strong> y todos sus datos asociados.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="sm:justify-end gap-2">
                        <DialogClose asChild>
                            <Button type="button" variant="secondary">Cancelar</Button>
                        </DialogClose>
                        <Button type="button" variant="destructive" onClick={handleDeleteUser} disabled={isSubmitting}>
                            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            Sí, eliminar usuario
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </motion.div>
    );
};

export default AdminUserManagementPage;