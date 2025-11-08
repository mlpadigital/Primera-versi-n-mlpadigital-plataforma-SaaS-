import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
//import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from "../../components/ui/use-toast";
import { Button } from "../../components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../components/ui/card";
import { Loader2, CheckCircle, XCircle, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
//import { useAuth } from '@/contexts/SupabaseAuthContext';

const PaymentResultPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('Procesando tu pago...');

  const processSuccessfulPayment = useCallback(async () => {
    if (!user) {
      setStatus('error');
      setMessage('No se pudo verificar tu sesión. Por favor, inicia sesión e intenta de nuevo.');
      return;
    }
    
    const storeName = localStorage.getItem('pendingStoreName');
    if (!storeName) {
      setStatus('error');
      setMessage('No se encontró una tienda pendiente de creación. Por favor, vuelve a registrarte.');
      navigate('/register');
      return;
    }

    try {
      const { data: storeData, error: storeError } = await supabase
        .from('stores')
        .insert([{ name: storeName, user_id: user.id, status: 'active' }])
        .select()
        .single();

      if (storeError) throw storeError;

      const newStoreId = storeData.id;
      const defaultSlug = storeName.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      
      await supabase.from('store_settings').insert({
        id: newStoreId,
        user_id: user.id,
        store_slug: `${defaultSlug}-${newStoreId.substring(0, 4)}`,
        settings: { features: { aiChatbotEnabled: false } }
      });

      await supabase.from('user_profiles').update({ plan_status: 'paid' }).eq('id', user.id);
      
      localStorage.removeItem('pendingStoreName');

      setStatus('success');
      setMessage('¡Pago exitoso! Tu tienda ha sido creada.');
      toast({
        title: "¡Todo Listo!",
        description: `Tu tienda "${storeName}" está activa. Serás redirigido a tu dashboard.`,
        className: "bg-green-500 text-white",
        duration: 5000,
      });
      
      setTimeout(() => navigate('/dashboard', { replace: true }), 3000);

    } catch (error) {
      setStatus('error');
      setMessage(`Hubo un error al crear tu tienda: ${error.message}`);
      toast({
        title: "Error en la creación de la tienda",
        description: "Tu pago fue exitoso, pero no pudimos crear tu tienda. Por favor, contacta a soporte.",
        variant: "destructive",
      });
    }
  }, [navigate, toast, user]);

  useEffect(() => {
    const paymentStatus = searchParams.get('status');
    const sessionId = searchParams.get('session_id');
    
    if (paymentStatus === 'success' && sessionId) {
      setMessage('Pago exitoso. Creando tu tienda...');
      processSuccessfulPayment();
    } else if (paymentStatus === 'cancel') {
      setStatus('cancelled');
      setMessage('El pago fue cancelado. Puedes intentarlo de nuevo cuando quieras.');
    } else {
      setStatus('error');
      setMessage('Ha ocurrido un error inesperado con el pago.');
    }
  }, [searchParams, processSuccessfulPayment]);

  const renderContent = () => {
    switch (status) {
      case 'loading':
        return (
          <>
            <Loader2 className="h-16 w-16 animate-spin text-yellow-400" />
            <CardTitle className="mt-4 text-2xl text-white">{message}</CardTitle>
          </>
        );
      case 'success':
        return (
          <>
            <CheckCircle className="h-16 w-16 text-green-400" />
            <CardTitle className="mt-4 text-2xl text-white">¡Todo Listo!</CardTitle>
            <CardDescription className="text-indigo-300">{message}</CardDescription>
            <CardContent className="mt-4">
              <p className="text-indigo-200">Serás redirigido a tu dashboard en unos segundos...</p>
            </CardContent>
          </>
        );
      case 'cancelled':
        return (
          <>
            <XCircle className="h-16 w-16 text-yellow-500" />
            <CardTitle className="mt-4 text-2xl text-white">Pago Cancelado</CardTitle>
            <CardDescription className="text-indigo-300">{message}</CardDescription>
            <CardContent className="mt-4">
              <Button asChild className="bg-yellow-400 text-purple-800 hover:bg-yellow-500">
                <Link to="/subscribe">Volver a intentar <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </CardContent>
          </>
        );
      case 'error':
      default:
        return (
          <>
            <XCircle className="h-16 w-16 text-red-500" />
            <CardTitle className="mt-4 text-2xl text-white">Ocurrió un Error</CardTitle>
            <CardDescription className="text-indigo-300">{message}</CardDescription>
             <CardContent className="mt-4">
              <Button asChild variant="secondary">
                <Link to="/subscribe">Volver a intentar</Link>
              </Button>
            </CardContent>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-indigo-900 to-black p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full max-w-lg glass-effect text-center p-8">
          <CardHeader>
            {renderContent()}
          </CardHeader>
        </Card>
      </motion.div>
    </div>
  );
};

export default PaymentResultPage;