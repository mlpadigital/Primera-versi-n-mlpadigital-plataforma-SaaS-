import React, { useState } from 'react';
import { Routes, Route, Navigate, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Settings, Store, Users, CreditCard, LogOut, Loader2, ShieldOff, Menu, X } from 'lucide-react';
import AdminDashboardPage from './AdminDashboardPage';
import AdminStoreManagementPage from './AdminStoreManagementPage';
import AdminUserManagementPage from './AdminUserManagementPage';
import AdminPaymentsPage from './AdminPaymentsPage';
import PlatformSettingsPage from './PlatformSettingsPage';
import { Button } from '../../components/ui/button';
//import { useAuth } from './contexts/SupabaseAuthContext';
import { useToast } from '../../components/ui/use-toast';

const AdminSidebar = ({ isMobileOpen, setIsMobileOpen }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { signOut } = useAuth();
    const { toast } = useToast();

    const handleSignOut = async () => {
        await signOut();
        toast({ title: "Has cerrado sesión", description: "Vuelve pronto, admin."});
        navigate('/');
    };

    const navItems = [
        { path: '/admin/dashboard', label: 'Resumen', icon: <LayoutDashboard className="h-5 w-5" /> },
        { path: '/admin/stores', label: 'Tiendas', icon: <Store className="h-5 w-5" /> },
        { path: '/admin/users', label: 'Usuarios', icon: <Users className="h-5 w-5" /> },
        { path: '/admin/payments', label: 'Pagos', icon: <CreditCard className="h-5 w-5" /> },
        { path: '/admin/settings', label: 'Ajustes', icon: <Settings className="h-5 w-5" /> },
    ];

    const isActive = (path) => {
        if (path === '/admin/dashboard') {
            return location.pathname === path;
        }
        return location.pathname.startsWith(path);
    }

    const sidebarContent = (
        <div className="w-64 bg-slate-900 text-white flex flex-col p-4 border-r border-slate-800 h-full">
            <div className="text-2xl font-bold text-yellow-400 mb-8 p-2 flex items-center justify-between gap-2">
                <Link to="/admin" className="flex items-center gap-2">
                    <span className="text-3xl">mlpa</span><span className="text-white">digital</span>
                    <span className="text-xs bg-yellow-400 text-slate-900 font-bold px-2 py-0.5 rounded-md">ADMIN</span>
                </Link>
                <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setIsMobileOpen(false)}>
                    <X className="h-5 w-5" />
                </Button>
            </div>
            <nav className="flex-1 space-y-2">
                {navItems.map(item => (
                    <Link key={item.path} to={item.path} onClick={() => setIsMobileOpen(false)}>
                        <Button
                            variant="ghost"
                            className={`w-full justify-start text-base p-3 h-auto ${isActive(item.path) ? 'bg-yellow-400/10 text-yellow-300' : 'hover:bg-slate-800'}`}
                        >
                            {item.icon}
                            <span className="ml-3">{item.label}</span>
                        </Button>
                    </Link>
                ))}
            </nav>
            <div>
                <Button variant="destructive" className="w-full justify-start" onClick={handleSignOut}>
                    <LogOut className="mr-3 h-5 w-5" />
                    Cerrar Sesión
                </Button>
            </div>
        </div>
    );

    return (
        <>
            {/* Mobile Sidebar */}
            <AnimatePresence>
                {isMobileOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="fixed inset-0 bg-black/60 z-40 lg:hidden"
                            onClick={() => setIsMobileOpen(false)}
                        />
                        <motion.aside
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="fixed top-0 left-0 h-full z-50 lg:hidden"
                        >
                            {sidebarContent}
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* Desktop Sidebar */}
            <aside className="hidden lg:block flex-shrink-0">
                {sidebarContent}
            </aside>
        </>
    );
};

const AdminLayout = () => {
    const { userProfile, loading } = useAuth();
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-background">
                <Loader2 className="h-16 w-16 animate-spin text-yellow-400" />
            </div>
        );
    }

    if (userProfile?.role !== 'admin') {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-background text-white p-4 text-center">
                <ShieldOff className="h-24 w-24 text-red-500 mb-4" />
                <h1 className="text-4xl font-bold mb-2">Acceso Denegado</h1>
                <p className="text-xl text-slate-400 mb-6">No tienes permisos para acceder a esta sección.</p>
                <Button asChild>
                    <Link to="/dashboard">Volver al Dashboard</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-slate-950">
            <AdminSidebar isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />
            <main className="flex-1 overflow-y-auto bg-background relative">
                <Button
                    variant="ghost"
                    size="icon"
                    className="lg:hidden fixed top-4 left-4 z-30 bg-slate-800/50 text-white backdrop-blur-sm"
                    onClick={() => setIsMobileOpen(true)}
                >
                    <Menu />
                </Button>
                <AnimatePresence mode="wait">
                    <Routes>
                        <Route path="dashboard" element={<AdminDashboardPage />} />
                        <Route path="stores" element={<AdminStoreManagementPage />} />
                        <Route path="users" element={<AdminUserManagementPage />} />
                        <Route path="payments" element={<AdminPaymentsPage />} />
                        <Route path="settings" element={<PlatformSettingsPage />} />
                        <Route path="/" element={<Navigate to="dashboard" replace />} />
                    </Routes>
                </AnimatePresence>
            </main>
        </div>
    );
};

export default AdminLayout;