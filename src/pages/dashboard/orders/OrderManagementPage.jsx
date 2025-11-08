import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
//import { supabase } from './lib/customSupabaseClient';
import { useToast } from "../../../components/ui/use-toast";
import { Button } from "../../../components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../../components/ui/card";
import { Loader2, ShoppingCart, Truck, Mail, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const OrderManagementPage = () => {
  const { storeId } = useParams();
  const { toast } = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = useCallback(async () => {
    if (!storeId) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          id,
          created_at,
          total_amount,
          status,
          customer_email,
          order_items (
            product_name,
            quantity
          )
        `)
        .eq('store_owner_id', (await supabase.auth.getUser()).data.user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast({
        title: "Error al cargar pedidos",
        description: "No se pudieron obtener los pedidos de la tienda.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [storeId, toast]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleIntegrationClick = (serviceName) => {
    toast({
      title: `Integración con ${serviceName}`,
      description: "🚧 Esta función de integración aún no está implementada. ¡Pídela en tu próximo mensaje! 🚀",
      duration: 5000,
    });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/20 text-yellow-300';
      case 'completed': return 'bg-green-500/20 text-green-300';
      case 'shipped': return 'bg-blue-500/20 text-blue-300';
      case 'cancelled': return 'bg-red-500/20 text-red-300';
      default: return 'bg-gray-500/20 text-gray-300';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-4 md:p-8 h-full overflow-y-auto"
    >
      <h1 className="text-3xl md:text-4xl font-bold text-yellow-300 mb-8">Gestión de Pedidos</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="glass-effect border-purple-500 shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl text-yellow-300">Historial de Pedidos</CardTitle>
              <CardDescription className="text-indigo-300">Aquí se muestran todos los pedidos realizados en tu tienda.</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <Loader2 className="h-12 w-12 animate-spin text-yellow-400" />
                </div>
              ) : orders.length === 0 ? (
                <div className="text-center py-16">
                  <ShoppingCart className="mx-auto h-16 w-16 text-purple-400 mb-4" />
                  <h3 className="text-xl font-semibold text-white">Aún no hay pedidos</h3>
                  <p className="text-indigo-300 mt-2">Cuando un cliente realice una compra, aparecerá aquí.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map(order => (
                    <div key={order.id} className="p-4 bg-purple-800/30 rounded-lg border border-purple-700">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-mono text-sm text-yellow-400">ID: {order.id.substring(0, 8)}</p>
                          <p className="text-lg font-semibold text-white">${order.total_amount}</p>
                          <p className="text-sm text-indigo-300">{order.customer_email}</p>
                        </div>
                        <div className="text-right">
                           <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusBadge(order.status)}`}>
                            {order.status || 'Desconocido'}
                          </span>
                          <p className="text-xs text-indigo-400 mt-2">{new Date(order.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="glass-effect border-purple-500 shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl text-yellow-300">Integraciones</CardTitle>
              <CardDescription className="text-indigo-300">Conecta tu tienda con servicios de envío y marketing.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-semibold text-white mb-3 text-lg flex items-center">
                  <Truck className="h-6 w-6 text-cyan-400 mr-3" />
                  Envíos Nacionales (Argentina)
                </h4>
                <div className="space-y-3 pl-9">
                  <div className="flex items-center justify-between p-3 bg-purple-800/30 rounded-lg">
                    <p className="font-semibold text-white">OCA</p>
                    <Button variant="outline" className="text-white hover:bg-white/10 border-purple-400 text-xs h-8" onClick={() => handleIntegrationClick('OCA')}>
                      <Zap className="mr-2 h-4 w-4" /> Conectar
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-purple-800/30 rounded-lg">
                    <p className="font-semibold text-white">Correo Argentino</p>
                    <Button variant="outline" className="text-white hover:bg-white/10 border-purple-400 text-xs h-8" onClick={() => handleIntegrationClick('Correo Argentino')}>
                      <Zap className="mr-2 h-4 w-4" /> Conectar
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-purple-800/30 rounded-lg">
                    <p className="font-semibold text-white">Andreani</p>
                    <Button variant="outline" className="text-white hover:bg-white/10 border-purple-400 text-xs h-8" onClick={() => handleIntegrationClick('Andreani')}>
                      <Zap className="mr-2 h-4 w-4" /> Conectar
                    </Button>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-white mb-3 text-lg flex items-center">
                  <Mail className="h-6 w-6 text-rose-400 mr-3" />
                  Email Marketing
                </h4>
                <div className="space-y-3 pl-9">
                  <div className="flex items-center justify-between p-3 bg-purple-800/30 rounded-lg">
                    <p className="font-semibold text-white">Conexión Email</p>
                    <Button variant="outline" className="text-white hover:bg-white/10 border-purple-400 text-xs h-8" onClick={() => handleIntegrationClick('Email')}>
                      <Zap className="mr-2 h-4 w-4" /> Conectar
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};

export default OrderManagementPage;