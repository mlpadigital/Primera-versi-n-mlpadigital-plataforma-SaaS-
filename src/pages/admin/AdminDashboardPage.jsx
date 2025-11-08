
import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card";
import { DollarSign, Store, Users, CreditCard, Loader2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
//import { supabase } from '../../lib/customSupabaseClient';
import { useToast } from '../../components/ui/use-toast';
//import { useAuth } from '@/contexts/SupabaseAuthContext';

const AdminDashboardPage = () => {
    const [stats, setStats] = useState({
        totalRevenue: 0,
        totalStores: 0,
        totalUsers: 0,
        totalPayments: 0,
    });
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();
    const { session } = useAuth();

    const salesData = [
        { name: 'Ene', sales: 1200 }, { name: 'Feb', sales: 2100 }, { name: 'Mar', sales: 1800 },
        { name: 'Abr', sales: 2780 }, { name: 'May', sales: 1890 }, { name: 'Jun', sales: 2390 },
        { name: 'Jul', sales: 3490 },
    ];

    const usersData = [
        { name: 'Ene', users: 20 }, { name: 'Feb', users: 25 }, { name: 'Mar', users: 40 },
        { name: 'Abr', users: 55 }, { name: 'May', users: 70 }, { name: 'Jun', users: 85 },
        { name: 'Jul', users: 100 },
    ];

    const fetchStats = useCallback(async () => {
        if (!session?.access_token) return;
        setLoading(true);
        try {
            const { data: payments, error: paymentsError } = await supabase
                .from('pagos')
                .select('amount', { count: 'exact' })
                .in('status', ['paid', 'approved']);
            if (paymentsError) throw paymentsError;

            const { count: storeCount, error: storeError } = await supabase
                .from('stores')
                .select('*', { count: 'exact', head: true });
            if (storeError) throw storeError;

            const { count: userCount, error: usersError } = await supabase
                .from('user_profiles')
                .select('*', { count: 'exact', head: true });
            if (usersError) throw usersError;

            setStats({
                totalRevenue: payments.reduce((acc, p) => acc + p.amount, 0),
                totalPayments: payments.length,
                totalStores: storeCount,
                totalUsers: userCount,
            });

        } catch (error) {
            toast({
                title: "Error al cargar estadísticas",
                description: error.message,
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    }, [toast, session]);

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-full">
                <Loader2 className="h-16 w-16 animate-spin text-yellow-400" />
            </div>
        );
    }

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="p-8 space-y-8"
        >
            <h1 className="text-4xl font-bold text-white">Resumen de la Plataforma</h1>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <motion.div variants={itemVariants}>
                    <Card className="bg-slate-900 border-green-500/50">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-slate-300">Ingresos Totales</CardTitle>
                            <DollarSign className="h-5 w-5 text-green-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-white">${stats.totalRevenue.toLocaleString('es-AR')}</div>
                        </CardContent>
                    </Card>
                </motion.div>
                <motion.div variants={itemVariants}>
                    <Card className="bg-slate-900 border-blue-500/50">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-slate-300">Tiendas Activas</CardTitle>
                            <Store className="h-5 w-5 text-blue-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-white">{stats.totalStores}</div>
                        </CardContent>
                    </Card>
                </motion.div>
                <motion.div variants={itemVariants}>
                    <Card className="bg-slate-900 border-purple-500/50">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-slate-300">Usuarios Registrados</CardTitle>
                            <Users className="h-5 w-5 text-purple-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-white">{stats.totalUsers}</div>
                        </CardContent>
                    </Card>
                </motion.div>
                <motion.div variants={itemVariants}>
                    <Card className="bg-slate-900 border-yellow-500/50">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-slate-300">Pagos Procesados</CardTitle>
                            <CreditCard className="h-5 w-5 text-yellow-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-white">{stats.totalPayments}</div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
                <motion.div variants={itemVariants}>
                    <Card className="bg-slate-900 border-slate-800 h-[400px]">
                        <CardHeader>
                            <CardTitle className="text-white">Evolución de Ventas</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={salesData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                                    <XAxis dataKey="name" stroke="#94a3b8" />
                                    <YAxis stroke="#94a3b8" />
                                    <Tooltip contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.8)', border: '1px solid #334155' }} />
                                    <Legend />
                                    <Line type="monotone" dataKey="sales" stroke="#34d399" strokeWidth={2} />
                                </LineChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </motion.div>
                <motion.div variants={itemVariants}>
                    <Card className="bg-slate-900 border-slate-800 h-[400px]">
                        <CardHeader>
                            <CardTitle className="text-white">Crecimiento de Usuarios</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={usersData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                                    <XAxis dataKey="name" stroke="#94a3b8" />
                                    <YAxis stroke="#94a3b8" />
                                    <Tooltip contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.8)', border: '1px solid #334155' }} />
                                    <Legend />
                                    <Bar dataKey="users" fill="#818cf8" />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default AdminDashboardPage;
