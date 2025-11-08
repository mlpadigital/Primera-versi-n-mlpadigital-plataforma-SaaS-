
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
//import { supabase } from './lib/customSupabaseClient';
import { useToast } from '../../components/ui/use-toast';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { ArrowUpDown, Loader2, Download } from 'lucide-react';
import { Badge } from '../../components/ui/badge';

const AdminPaymentsPage = () => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [sorting, setSorting] = useState({ key: 'created_at', order: 'desc' });
    const { toast } = useToast();

    const fetchPayments = useCallback(async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('pagos')
                .select(`*`);
            if (error) throw error;

            const userIds = [...new Set(data.map(p => p.user_id).filter(id => id))];
            let usersMap = {};
            if (userIds.length > 0) {
                 const { data: usersData, error: usersError } = await supabase
                    .from('users_view')
                    .select('id, email')
                    .in('id', userIds);
                if (usersError) throw usersError;
                
                usersMap = usersData.reduce((acc, user) => {
                    acc[user.id] = user.email;
                    return acc;
                }, {});
            }
            
            const formattedData = data.map(p => ({
                ...p,
                user_email: usersMap[p.user_id] || 'N/A'
            }));
            setPayments(formattedData);
        } catch (error) {
            toast({ title: "Error", description: "No se pudieron cargar los pagos. " + error.message, variant: "destructive" });
        } finally {
            setLoading(false);
        }
    }, [toast]);

    useEffect(() => {
        fetchPayments();
    }, [fetchPayments]);

    const handleSort = (key) => {
        setSorting(prev => ({
            key,
            order: prev.key === key && prev.order === 'asc' ? 'desc' : 'asc'
        }));
    };

    const filteredAndSortedPayments = useMemo(() => {
        return payments
            .filter(payment =>
                (payment.user_email && payment.user_email.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (payment.status && payment.status.toLowerCase().includes(searchTerm.toLowerCase())) ||
                (payment.method && payment.method.toLowerCase().includes(searchTerm.toLowerCase()))
            )
            .sort((a, b) => {
                if (a[sorting.key] < b[sorting.key]) return sorting.order === 'asc' ? -1 : 1;
                if (a[sorting.key] > b[sorting.key]) return sorting.order === 'asc' ? 1 : -1;
                return 0;
            });
    }, [payments, searchTerm, sorting]);

    const getStatusBadge = (status) => {
        if (!status) return <Badge variant="outline">Desconocido</Badge>;
        switch (status.toLowerCase()) {
            case 'paid':
            case 'succeeded':
            case 'approved':
                return <Badge className="bg-green-500/20 text-green-300 border-green-500/50">Pagado</Badge>;
            case 'pending':
                return <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/50">Pendiente</Badge>;
            case 'failed':
            case 'rejected':
                return <Badge variant="destructive" className="bg-red-500/20 text-red-300 border-red-500/50">Fallido</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };
    
    const exportToCSV = () => {
        const headers = ['ID', 'Email Usuario', 'Monto', 'Moneda', 'Método', 'Estado', 'Fecha'];
        const rows = filteredAndSortedPayments.map(p => [
            p.id,
            p.user_email,
            p.amount,
            p.currency,
            p.method,
            p.status,
            new Date(p.created_at).toLocaleString()
        ].join(','));

        const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows].join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "pagos_mlpadigital.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-4 sm:p-8 text-white"
        >
            <h1 className="text-3xl sm:text-4xl font-bold mb-6">Historial de Pagos</h1>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <Input
                    placeholder="Buscar por email, estado o método..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full sm:max-w-sm bg-slate-800 border-slate-700"
                />
                <Button onClick={exportToCSV} variant="outline" className="bg-slate-800 border-slate-700 hover:bg-slate-700 w-full sm:w-auto">
                    <Download className="mr-2 h-4 w-4" /> Exportar a CSV
                </Button>
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-900 overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow className="border-b-slate-800 hover:bg-slate-800/50">
                            <TableHead className="text-white" onClick={() => handleSort('user_email')}><Button variant="ghost" className="px-2">Usuario <ArrowUpDown className="ml-2 h-4 w-4" /></Button></TableHead>
                            <TableHead className="text-white" onClick={() => handleSort('amount')}><Button variant="ghost" className="px-2">Monto <ArrowUpDown className="ml-2 h-4 w-4" /></Button></TableHead>
                            <TableHead className="text-white" onClick={() => handleSort('method')}><Button variant="ghost" className="px-2">Método <ArrowUpDown className="ml-2 h-4 w-4" /></Button></TableHead>
                            <TableHead className="text-white" onClick={() => handleSort('status')}><Button variant="ghost" className="px-2">Estado <ArrowUpDown className="ml-2 h-4 w-4" /></Button></TableHead>
                            <TableHead className="text-white" onClick={() => handleSort('created_at')}><Button variant="ghost" className="px-2">Fecha <ArrowUpDown className="ml-2 h-4 w-4" /></Button></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow><TableCell colSpan={5} className="text-center py-10"><Loader2 className="mx-auto h-8 w-8 animate-spin" /></TableCell></TableRow>
                        ) : filteredAndSortedPayments.map(payment => (
                            <TableRow key={payment.id} className="border-b-slate-800 hover:bg-slate-800/50">
                                <TableCell className="font-medium">{payment.user_email}</TableCell>
                                <TableCell>${payment.amount.toLocaleString('es-AR')} {payment.currency}</TableCell>
                                <TableCell>{payment.method}</TableCell>
                                <TableCell>{getStatusBadge(payment.status)}</TableCell>
                                <TableCell>{new Date(payment.created_at).toLocaleString()}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </motion.div>
    );
};

export default AdminPaymentsPage;
