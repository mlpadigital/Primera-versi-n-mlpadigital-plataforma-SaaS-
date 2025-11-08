import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Button } from "../../components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../components/ui/card";
import { useToast } from "../../components/ui/use-toast";
import { Loader2, CheckCircle, CreditCard, Landmark } from 'lucide-react';
import { motion } from 'framer-motion';
//import { supabase } from '../../lib/customSupabaseClient';
//import { useAuth } from '../../contexts/SupabaseAuthContext';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

// --- PRODUCTION KEYS (Developer must provide these) ---
const STRIPE_PUBLISHABLE_KEY = "YOUR_STRIPE_PUBLISHABLE_KEY";
const STRIPE_PRICE_ID = "YOUR_STRIPE_PRICE_ID";
const PAYPAL_CLIENT_ID = "AWSn_DoCjIMczT4UNbRi4pwXQjQsywIWj0RPGtjGVP0PRRIuvBUWe-2GFtRMCHbIQBL9dR1pTFX13PrV";
const PAYPAL_PLAN_ID = "P-77E28038HJ231561XNB6PLDQ";
const MP_PREAPPROVAL_PLAN_ID = "2c938084981e9ee50198286043c102dd";
// --- ---

const stripePromise = STRIPE_PUBLISHABLE_KEY.startsWith('pk_') ? loadStripe(STRIPE_PUBLISHABLE_KEY) : null;

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

const SubscriptionPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [paymentAmount] = useState(5000);
  const [storeName, setStoreName] = useState('');

  const handleSuccessfulPayment = useCallback(async (paymentMethod) => {
    if (loading) return;
    setLoading(true);
    toast({ title: "Procesando...", description: `Suscripción con ${paymentMethod} exitosa. Creando tu tienda...` });

    if (!storeName || !user) {
      toast({ title: "Error", description: "Falta información para crear la tienda.", variant: "destructive" });
      navigate('/register');
      setLoading(false);
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
        description: `Tu pago fue exitoso, pero hubo un error al crear la tienda. Contacta a soporte. Error: ${error.message}`,
        variant: "destructive",
        duration: 10000,
      });
      setLoading(false);
    }
  }, [user, storeName, navigate, toast, loading]);

  useEffect(() => {
    const name = localStorage.getItem('pendingStoreName');
    if (!name) {
      toast({ title: "Error", description: "No se encontró un nombre de tienda pendiente.", variant: "destructive" });
      navigate('/register');
    } else {
      setStoreName(name);
    }
    
    // Load Mercado Pago script
    if (!window.$MPC_loaded) {
        const script = document.createElement("script");
        script.type = "text/javascript";
        script.async = true;
        script.src = "https://secure.mlstatic.com/mptools/render.js";
        document.head.appendChild(script);
        window.$MPC_loaded = true;
    }

    // Add message listener for Mercado Pago
    const handleMPCMessage = (event) => {
        if (event.data?.preapproval_id) {
            console.log("Mercado Pago Subscription ID:", event.data.preapproval_id);
            handleSuccessfulPayment('Suscripción con Mercado Pago');
        }
    };
    window.addEventListener("message", handleMPCMessage);

    return () => {
        window.removeEventListener("message", handleMPCMessage);
    };

  }, [navigate, toast, handleSuccessfulPayment]);

  const handleStripeSubscribe = async () => {
    if (!stripePromise || !STRIPE_PRICE_ID.startsWith('price_')) {
        toast({ title: "Configuración Incompleta", description: "Stripe no está configurado.", variant: "destructive" });
        return;
    }
    setLoading(true);
    try {
      const stripe = await stripePromise;
      const { error } = await stripe.redirectToCheckout({
        lineItems: [{ price: STRIPE_PRICE_ID, quantity: 1 }],
        mode: 'subscription',
        successUrl: `${window.location.origin}/payment-result?status=success&session_id={CHECKOUT_SESSION_ID}`,
        cancelUrl: `${window.location.origin}/subscribe`,
        customerEmail: user.email,
      });
      if (error) throw new Error(error.message);
    } catch (error) {
      toast({ title: "Error con Stripe", description: error.message, variant: "destructive" });
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
      .mp-blue-button {
        background-color: #3483FA;
        color: white;
        padding: 10px 24px;
        text-decoration: none;
        border-radius: 5px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        transition: background-color 0.3s;
        font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
        font-weight: 600;
        text-align: center;
        width: 100%;
        line-height: 28px;
        height: 48px;
      }
      .mp-blue-button:hover {
        background-color: #2a68c8;
      }
      `}</style>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-indigo-900 to-black p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card className="glass-effect shadow-2xl shadow-yellow-500/10">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold text-yellow-300">Plan Emprendedor</CardTitle>
              <CardDescription className="text-indigo-300 text-lg">
                Activa tu tienda "{storeName}"
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-white/10 p-6 rounded-lg text-center">
                <p className="text-5xl font-bold text-white">${new Intl.NumberFormat('es-AR').format(paymentAmount)} <span className="text-2xl font-normal text-indigo-300">ARS</span></p>
                <p className="text-indigo-400 mt-1">o USD $8 | Pago mensual</p>
              </div>
              <ul className="space-y-2 text-indigo-200">
                <li className="flex items-center"><CheckCircle className="h-5 w-5 text-green-400 mr-2" /> Creación de una tienda profesional.</li>
                <li className="flex items-center"><CheckCircle className="h-5 w-5 text-green-400 mr-2" /> Productos ilimitados.</li>
                <li className="flex items-center"><CheckCircle className="h-5 w-5 text-green-400 mr-2" /> Asistente de Marketing IA.</li>
              </ul>
              
              <div className="space-y-3 pt-4">
                  <h3 className="text-center font-semibold text-white">Elige tu método de pago</h3>
                  
                  {/* Stripe Button */}
                  <Button onClick={handleStripeSubscribe} disabled={loading || !stripePromise} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-md py-6 h-auto">
                      {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <CreditCard className="mr-2 h-5 w-5" />}
                      Pagar con Tarjeta (Stripe)
                  </Button>

                  {/* Mercado Pago Subscription Button */}
                  <a href={`https://www.mercadopago.com.ar/subscriptions/checkout?preapproval_plan_id=${MP_PREAPPROVAL_PLAN_ID}`} name="MP-payButton" className='mp-blue-button'>
                    {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <><MercadoPagoIcon /> Suscribirme con Mercado Pago</>}
                  </a>
                  
                  {/* PayPal Button */}
                  {PAYPAL_CLIENT_ID.startsWith('A') && PAYPAL_PLAN_ID.startsWith('P-') ? (
                      <PayPalScriptProvider options={{ "client-id": PAYPAL_CLIENT_ID, intent: "subscription", vault: true }}>
                          <PayPalButtons
                              style={{ layout: "vertical", color: "gold", shape: "rect", label: "subscribe" }}
                              createSubscription={(data, actions) => {
                                  return actions.subscription.create({
                                      'plan_id': PAYPAL_PLAN_ID
                                  });
                              }}
                              onApprove={async (data, actions) => {
                                  console.log("PayPal Subscription Data:", data);
                                  handleSuccessfulPayment('Suscripción con PayPal');
                              }}
                              onError={(err) => {
                                  toast({ title: "Error de PayPal", description: "Ocurrió un error con la suscripción de PayPal.", variant: "destructive" });
                                  console.error("PayPal Error:", err);
                              }}
                              disabled={loading}
                          />
                      </PayPalScriptProvider>
                  ) : (
                      <Button disabled={true} className="w-full bg-[#0070BA] text-white font-bold text-md py-6 h-auto">
                          <PayPalIcon /> PayPal (No configurado)
                      </Button>
                  )}

                  {/* Manual Payment Button */}
                  <Button asChild className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold text-md py-6 h-auto">
                      <Link to="/payment-instructions">
                          <Landmark className="mr-2 h-5 w-5" />
                          Transferencia o Billetera Virtual
                      </Link>
                  </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </>
  );
};

export default SubscriptionPage;