import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from "../../components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../../components/ui/card";
import { useToast } from "../../components/ui/use-toast";
import { Loader2, CheckCircle, Copy, Wallet, Landmark } from 'lucide-react';
import { motion } from 'framer-motion';
//import { supabase } from '../../lib/customSupabaseClient';
//import { useAuth } from '../../contexts/SupabaseAuthContext';

const MercadoPagoIcon = () => (
  <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 fill-current">
    <title>Mercado Pago</title>
    <path d="M12.144 2.424c-1.164 0-2.232.3-3.204.888-2.028 1.224-3.444 3.552-3.444 6.156v.024c0 2.556 1.344 4.8 3.3 5.988l-3.156 6.12c-.216.432-.12.96.24 1.296.36.336.888.408 1.32.192l6.3-3.18v.012c.024 0 .036 0 .06 0 .024 0 .036 0 .06 0v-.012l6.3 3.18c.192.096.396.144.6.144.276 0 .552-.084.78-.252.36-.264.504-.732.36-1.176l-3.156-6.12c1.956-1.188 3.3-3.432 3.3-5.988v-.024c0-2.604-1.416-4.932-3.444-6.156-.972-.588-2.04-.888-3.204-.888zm-.012 2.016c.6 0 1.188.144 1.728.432 1.08.588 1.836 1.8 1.836 3.132v.024c0 1.332-.756 2.544-1.836 3.132-.54.288-1.128.432-1.728.432s-1.188-.144-1.728-.432c-1.08-.588-1.836-1.8-1.836-3.132v-.024c0-1.332.756-2.544 1.836-3.132.54-.288 1.128.432 1.728.432z"/>
  </svg>
);

const PayPalIcon = () => (
  <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 fill-current">
    <title>PayPal</title>
    <path d="M7.856 5.332c.728-1.48 2.344-2.436 4.068-2.436h5.236c2.4 0 4.104 1.692 3.936 4.068-.18 2.532-2.028 4.356-4.428 4.356h-2.928c-.564 0-.924.492-.828.984l.528 2.7c.108.528.564.876 1.092.876h.6c.528 0 .984-.384.984-.9l-.096-.528c-.036-.18.072-.36.252-.396.18-.036.36.072.396.252l.492 2.556c.108.564-.288 1.092-.864 1.092h-.6c-1.224 0-2.256-.888-2.448-2.1l-3.228-16.632zM13.8 11.74c.552-.288.936-.864.9-1.464-.06-1.116-.996-1.944-2.124-1.944H8.44c-.564 0-1.032.456-1.032 1.02l.012.06 2.46 12.684c.06.288.3.492.588.492h.6c.324 0 .588-.264.588-.588l-.504-2.592c-.048-.252.12-.492.372-.54.252-.048.492.12.54.372l.504 2.592c.048.252.288.444.54.444h.6c.288 0 .528-.216.54-.504l.18-2.184c.024-.276-.18-.516-.456-.54-.276-.024-.516.18-.54.456l-.072.864c-.012.156-.156.264-.3.264h-.6c-.18 0-.324-.144-.324-.324l.504-2.592c.108-.552-.288-1.08-.852-1.08h-.6c-.324 0-.6.228-.66.54l-.384 1.968c-.06.288-.312.492-.6.492h-.6c-.324 0-.588-.264-.588-.588l2.46-12.684h3.132c.588 0 1.068.48 1.068 1.068 0 .588-.48 1.068-1.068 1.068H9.6c-.324 0-.588.264-.588.588l-.012.06.012.06c.012.324.276.588.6.588h4.2z"/>
  </svg>
);

const PaymentInstructionsPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [paymentOptions, setPaymentOptions] = useState([]);
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [actionLoading, setActionLoading] = useState(false);
  const [storeName, setStoreName] = useState('');

  useEffect(() => {
    const name = localStorage.getItem('pendingStoreName');
    if (!name) {
      toast({ title: "Error", description: "No se encontró un nombre de tienda pendiente.", variant: "destructive" });
      navigate('/register');
    } else {
      setStoreName(name);
    }
  }, [navigate, toast]);

  useEffect(() => {
    const fetchPlatformSettings = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('platform_settings')
          .select('key, value');
        
        if (error) throw error;

        const settings = data.reduce((acc, { key, value }) => {
          acc[key] = value;
          return acc;
        }, {});

        const options = [];
        if (settings.mercadoPago?.alias && settings.mercadoPago?.cvu) {
          options.push({
            name: "Mercado Pago",
            icon: <MercadoPagoIcon />,
            details: [
              { label: "Alias", value: settings.mercadoPago.alias },
              { label: "CVU", value: settings.mercadoPago.cvu },
            ]
          });
        }
        if (settings.bankTransfer?.details) {
          options.push({
            name: "Transferencia Bancaria",
            icon: <Landmark className="h-6 w-6 mr-2" />,
            details: settings.bankTransfer.details
          });
        }
        if (settings.paypal?.email) {
          options.push({
            name: "PayPal",
            icon: <PayPalIcon />,
            details: [{ label: "Email de PayPal", value: settings.paypal.email }]
          });
        }
        if (settings.prex?.user) {
          options.push({
            name: "Prex",
            icon: <Wallet className="h-6 w-6 mr-2" />,
            details: [{ label: "Usuario Prex", value: settings.prex.user }]
          });
        }
        
        setPaymentOptions(options);
        setPaymentAmount(settings.storeCreation?.price || 15000);

      } catch (error) {
        toast({
          title: "Error al cargar métodos de pago",
          description: "No se pudieron obtener los datos de pago. Por favor, contacta a soporte.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPlatformSettings();
  }, [toast]);

  const copyToClipboard = (text, fieldName) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "¡Copiado!",
      description: `${fieldName} ha sido copiado al portapapeles.`,
      className: "bg-green-500 text-white",
    });
  };

  const handlePaymentConfirmation = async () => {
    if (!storeName || !user) {
      toast({
        title: "Error",
        description: "Falta información para crear la tienda. Vuelve a registrarte.",
        variant: "destructive",
      });
      navigate('/register');
      return;
    }

    setActionLoading(true);
    try {
      const { data: storeData, error: storeError } = await supabase
        .from('stores')
        .insert([{ name: storeName, user_id: user.id }])
        .select()
        .single();

      if (storeError) throw storeError;

      const newStoreId = storeData.id;
      const defaultSlug = storeName.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      
      const { error: settingsError } = await supabase
        .from('store_settings')
        .insert({
          id: newStoreId,
          user_id: user.id,
          store_slug: `${defaultSlug}-${newStoreId.substring(0, 4)}`,
          settings: { features: { aiChatbotEnabled: false } }
        });

      if (settingsError) throw settingsError;

      const { error: profileError } = await supabase
        .from('user_profiles')
        .update({ plan_status: 'paid' })
        .eq('id', user.id);

      if (profileError) throw profileError;
      
      localStorage.removeItem('pendingStoreName');

      toast({
        title: "¡Tienda Creada!",
        description: `Tu tienda "${storeName}" está lista. ¡Bienvenido!`,
        className: "bg-green-500 text-white",
        duration: 5000,
      });
      
      navigate(`/dashboard`, { replace: true });

    } catch (error) {
      toast({
        title: "Error al crear la tienda",
        description: `Ocurrió un error: ${error.message}. Por favor, contacta a soporte.`,
        variant: "destructive",
      });
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-indigo-900 to-black p-4">
        <Loader2 className="h-16 w-16 animate-spin text-yellow-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-indigo-900 to-black p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        <Card className="glass-effect shadow-2xl shadow-yellow-500/10">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-yellow-300">Activa tu Tienda</CardTitle>
            <CardDescription className="text-indigo-300 text-lg">
              Realiza el pago para lanzar "{storeName}"
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-white/10 p-6 rounded-lg text-center">
              <p className="text-5xl font-bold text-white">${new Intl.NumberFormat('es-AR').format(paymentAmount)} <span className="text-2xl font-normal text-indigo-300">ARS</span></p>
              <p className="text-indigo-400">Pago único</p>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-center text-white">Elige tu método de pago preferido</h3>
              {paymentOptions.length > 0 ? paymentOptions.map(option => (
                <Card key={option.name} className="bg-white/5 border-purple-500/30">
                  <CardHeader>
                    <CardTitle className="flex items-center text-indigo-200">{option.icon} {option.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {option.details.map(detail => (
                        <li key={detail.label} className="flex justify-between items-center text-indigo-300">
                          <span>{detail.label}: <strong className="text-white">{detail.value}</strong></span>
                          <Button variant="ghost" size="sm" onClick={() => copyToClipboard(detail.value, detail.label)}>
                            <Copy className="h-4 w-4" />
                          </Button>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )) : (
                <p className="text-center text-yellow-400">No hay métodos de pago configurados por el administrador. Por favor, contacta a soporte.</p>
              )}
            </div>

            <div className="text-center text-indigo-300 bg-yellow-500/10 p-4 rounded-lg">
              <p className="font-bold">¡Importante!</p>
              <p>Una vez realizado el pago, haz clic en el botón de abajo para crear tu tienda. La activación es inmediata.</p>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={handlePaymentConfirmation} 
              disabled={actionLoading || paymentOptions.length === 0} 
              className="w-full bg-yellow-400 text-purple-800 font-bold text-lg py-6 hover:bg-yellow-500 transition-all duration-300 transform hover:scale-105 disabled:bg-gray-500 disabled:cursor-not-allowed"
            >
              {actionLoading ? (
                <Loader2 className="mr-2 h-6 w-6 animate-spin" />
              ) : (
                <>
                  <CheckCircle className="mr-2 h-6 w-6" />
                  He Realizado el Pago - Crear Mi Tienda
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default PaymentInstructionsPage;