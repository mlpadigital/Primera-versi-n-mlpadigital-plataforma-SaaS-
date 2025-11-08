import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Textarea } from "../../../components/ui/textarea";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../../../components/ui/card";
import { useToast } from "../../../components/ui/use-toast";
//import { supabase } from '../../../lib/customSupabaseClient';
import { motion } from 'framer-motion';
import { Stamp as StripeIcon, Key, Save, Loader2, AlertTriangle, CheckCircle, Wallet, Landmark } from 'lucide-react';

const MercadoPagoIcon = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-sky-400">
    <path d="M24 4C12.9543 4 4 12.9543 4 24C4 35.0457 12.9543 44 24 44C35.0457 44 44 35.0457 44 24C44 12.9543 35.0457 4 24 4Z" fill="#009EE3"/>
    <path d="M33.5858 24.6667C33.5858 23.75 33.1667 22.9167 32.5 22.3333L26.9167 17.5C26.0833 16.75 24.9167 16.5833 23.9167 16.9167C23.5 17.0833 23.0833 17.4167 22.8333 17.8333L19.5 23.5833H25.4167C26.25 23.5833 26.9167 24.25 26.9167 25.0833C26.9167 25.9167 26.25 26.5833 25.4167 26.5833H18.5C18.1667 26.5833 17.9167 26.4167 17.6667 26.1667L14.4167 22.4167C14.0833 22.0833 14.1667 21.5 14.5833 21.25C15 21 15.5833 21.0833 15.8333 21.5L18.4167 24.5833H18.75L24.6667 14.5C25.25 13.5 26.5 13.1667 27.5 13.75C27.9167 14 28.25 14.4167 28.4167 14.9167L34.0833 24.25C34.1667 24.5 34.1667 24.75 34.1667 25C34.1667 25.5833 33.9167 26.1667 33.5 26.5833C32.8333 27.25 31.8333 27.3333 31.0833 26.75L29.5833 25.5833L29.0833 26.4167C28.5833 27.25 27.5833 27.5833 26.75 27.0833C26.5 26.9167 26.25 26.6667 26.1667 26.4167L27.5833 24.0833L28.5833 22.5L24.5833 29.5C24.0833 30.3333 24.3333 31.4167 25.1667 31.9167C25.5 32.1667 25.9167 32.25 26.3333 32.25C26.8333 32.25 27.3333 32.0833 27.75 31.6667L33.5 26.8333C33.5833 26.75 33.5833 26.75 33.5858 26.6667V24.6667Z" fill="white"/>
  </svg>
);

const PayPalIcon = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-12 w-12">
    <path d="M38.3168 18.3756H25.5C25.074 18.3756 24.722 18.7276 24.722 19.1536V19.9316L24.718 19.9546C24.499 21.8476 23.639 25.4326 21.144 29.4276C20.932 29.7916 20.669 30.0936 20.373 30.3156C20.076 30.5376 19.721 30.6626 19.348 30.6626H13.682C13.256 30.6626 12.904 30.3106 12.904 29.8846V29.1316L12.909 29.1066C13.109 27.4236 13.916 22.0296 17.693 18.9186C18.384 18.3126 19.261 17.9406 20.198 17.8926C20.252 17.8896 20.306 17.8896 20.36 17.8896H32.887C33.313 17.8896 33.665 17.5376 33.665 17.1116V16.3336L33.661 16.3106C33.442 14.4176 32.582 10.8326 30.087 6.8376C29.875 6.4736 29.612 6.17161 29.316 5.94961C29.019 5.72761 28.664 5.60261 28.291 5.60261H18.257C17.831 5.60261 17.479 5.95461 17.479 6.38061V7.12861L17.484 7.15361C17.684 8.83661 18.491 14.2306 22.268 17.3416C21.462 17.7556 20.767 18.0076 20.016 18.0076H9.684C9.258 18.0076 8.906 18.3596 8.906 18.7856V29.5036C8.906 29.9296 9.258 30.2816 9.684 30.2816H11.527C11.953 30.2816 12.305 29.9296 12.305 29.5036V28.7256L12.309 28.7026C12.528 26.8096 13.388 23.2246 15.883 19.2296C16.095 18.8656 16.358 18.5636 16.654 18.3416C16.951 18.1196 17.306 17.9946 17.679 17.9946H18.42C18.846 17.9946 19.198 18.3466 19.198 18.7726V19.5496L19.194 19.5736C18.975 21.4666 18.115 25.0516 15.62 29.0466C15.408 29.4106 15.145 29.7126 14.849 29.9346C14.552 30.1566 14.197 30.2816 13.824 30.2816H13.082C12.656 30.2816 12.304 30.6336 12.304 31.0596V39.6196C12.304 40.0456 12.656 40.3976 13.082 40.3976H20.893C21.319 40.3976 21.671 40.0456 21.671 39.6196V38.8416L21.667 38.8186C21.448 36.9256 22.308 33.3406 24.803 29.3456C25.015 28.9816 25.278 28.6796 25.574 28.4576C25.871 28.2356 26.226 28.1106 26.599 28.1106H32.11C32.536 28.1106 32.888 27.7586 32.888 27.3326V26.5556L32.884 26.5316C32.665 24.6386 31.805 21.0536 29.31 17.0586C29.589 17.4726 29.934 17.8896 30.413 18.0076C30.505 18.0306 30.597 18.0416 30.69 18.0416H38.317C38.743 18.0416 39.095 17.6896 39.095 17.2636V10.1536C39.095 9.72761 38.743 9.37561 38.317 9.37561H27.058C26.632 9.37561 26.28 9.72761 26.28 10.1536V10.9316L26.285 10.9566C26.485 12.6396 27.292 18.0336 21.033 17.3416C21.84 16.9276 22.535 16.6756 23.286 16.6756H33.619C34.045 16.6756 34.397 16.3236 34.397 15.8976V7.33761C34.397 6.91161 34.045 6.55961 33.619 6.55961H22.017C21.591 6.55961 21.239 6.91161 21.239 7.33761V8.11561L21.243 8.13861C21.462 10.0316 22.322 13.6166 24.817 17.6116C25.029 17.9756 25.292 18.2776 25.588 18.4996C25.885 18.7216 26.24 18.8466 26.613 18.8466H31.125C31.551 18.8466 31.903 18.4946 31.903 18.0686V17.2906L31.907 17.2676C32.126 15.3746 32.986 11.7896 35.481 7.79461C35.693 7.43061 35.956 7.12861 36.252 6.90661C36.549 6.68461 36.904 6.55961 37.277 6.55961H38.317C38.743 6.55961 39.095 6.91161 39.095 7.33761V17.6446C39.095 18.0586 38.75 18.3756 38.3168 18.3756Z" fill="#253B80"/>
    <path d="M38.317 5.6026H27.058C26.632 5.6026 26.28 5.9546 26.28 6.3806V7.1586L26.285 7.1836C26.485 8.8666 27.292 14.2606 21.033 13.5686C21.84 13.1546 22.535 12.9026 23.286 12.9026H33.619C34.045 12.9026 34.397 12.5506 34.397 12.1246V3.5646C34.397 3.1386 34.045 2.7866 33.619 2.7866H22.017C21.591 2.7866 21.239 3.1386 21.239 3.5646V4.3426L21.243 4.3656C21.462 6.2586 22.322 9.8436 24.817 13.8386C25.029 14.2026 25.292 14.5046 25.588 14.7266C25.885 14.9486 26.24 15.0736 26.613 15.0736H31.125C31.551 15.0736 31.903 14.7216 31.903 14.2956V13.5176L31.907 13.4946C32.126 11.6016 32.986 8.0166 35.481 4.0216C35.693 3.6576 35.956 3.3556 36.252 3.1336C36.549 2.9116 36.904 2.7866 37.277 2.7866H38.317C38.743 2.7866 39.095 3.1386 39.095 3.5646V13.8716C39.095 14.2856 38.75 14.6026 38.317 14.6026H30.69C30.597 14.2676 30.505 14.2556 30.413 14.2326C29.934 14.1146 29.589 13.6976 29.31 13.2836C31.805 17.2786 32.665 20.8636 32.884 22.7566L32.888 22.7806V23.5576C32.888 23.9836 32.536 24.3356 32.11 24.3356H26.599C26.226 24.3356 25.871 24.4606 25.574 24.6826C25.278 24.9046 25.015 25.2066 24.803 25.5706C22.308 29.5656 21.448 33.1506 21.667 35.0436L21.671 35.0666V35.8446C21.671 36.2706 21.319 36.6226 20.893 36.6226H13.082C12.656 36.6226 12.304 36.2706 12.304 35.8446V27.2846C12.304 26.8586 12.656 26.5066 13.082 26.5066H13.824C14.197 26.5066 14.552 26.3816 14.849 26.1596C15.145 25.9376 15.408 25.6356 15.62 25.2716C18.115 21.2766 18.975 17.6916 19.194 15.7986L19.198 15.7756V15.00C19.198 14.5736 18.846 14.2216 18.42 14.2216H17.679C17.306 14.2216 16.951 14.3466 16.654 14.5686C16.358 14.7906 16.095 15.0926 15.883 15.4566C13.388 19.4516 12.528 23.0366 12.309 24.9296L12.305 24.9526V25.7306C12.305 26.1566 11.953 26.5086 11.527 26.5086H9.684C9.258 26.5086 8.906 26.1566 8.906 25.7306V15.0126C8.906 14.5866 9.258 14.2346 9.684 14.2346H20.016C20.767 14.2346 21.462 14.4866 22.268 14.9006C18.491 10.4576 17.684 8.4556 17.484 7.5346L17.479 7.5096V6.7616C17.479 6.3356 17.831 5.9836 18.257 5.9836H28.291C28.664 5.9836 29.019 6.1086 29.316 6.3306C29.612 6.5526 29.875 6.8546 30.087 7.2186C32.582 11.2136 33.442 14.7986 33.661 16.6916L33.665 16.7146V17.4926C33.665 17.9186 33.313 18.2706 32.887 18.2706H20.36C20.306 18.2706 20.252 18.2706 20.198 18.2676C19.261 18.2196 18.384 17.8476 17.693 17.2416C13.916 14.1306 13.109 8.7366 12.909 7.0536L12.904 7.0286V6.2756C12.904 5.8496 13.256 5.50C13.682 5.50H19.348C19.721 5.50 20.076 5.625 20.373 5.847C20.669 6.069 20.932 6.371 21.144 6.735C23.639 10.73 24.499 14.315 24.718 16.208L24.722 16.231V17.009C24.722 17.435 25.074 17.787 25.5 17.787H38.317C38.743 17.787 39.095 17.435 39.095 17.009V6.0286C39.095 5.7926 38.743 5.6026 38.317 5.6026Z" fill="#169BD7"/>
  </svg>
);


const PaymentSettingsPage = () => {
  const { storeId } = useParams();
  const { toast } = useToast();
  const [stripeSettings, setStripeSettings] = useState({ publishableKey: '', secretKey: '' });
  const [mercadoPagoSettings, setMercadoPagoSettings] = useState({ accessToken: '' });
  const [paypalSettings, setPaypalSettings] = useState({ clientId: '' });
  const [bankTransferSettings, setBankTransferSettings] = useState({ instructions: '' });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [isStripeConnected, setIsStripeConnected] = useState(false);
  const [isMercadoPagoConnected, setIsMercadoPagoConnected] = useState(false);
  const [isPayPalConnected, setIsPayPalConnected] = useState(false);
  const [isBankTransferConfigured, setIsBankTransferConfigured] = useState(false);

  const fetchPaymentSettings = useCallback(async () => {
    if (!storeId) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('store_settings')
        .select('settings')
        .eq('id', storeId)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }
      
      const payments = data?.settings?.payments;
      if (payments?.stripe) {
        const { publishableKey, secretKey } = payments.stripe;
        setStripeSettings({
          publishableKey: publishableKey || '',
          secretKey: secretKey || ''
        });
        if (publishableKey && secretKey) setIsStripeConnected(true);
      }
      if (payments?.mercadoPago) {
        const { accessToken } = payments.mercadoPago;
        setMercadoPagoSettings({ accessToken: accessToken || '' });
        if (accessToken) setIsMercadoPagoConnected(true);
      }
      if (payments?.paypal) {
        const { clientId } = payments.paypal;
        setPaypalSettings({ clientId: clientId || '' });
        if (clientId) setIsPayPalConnected(true);
      }
      if (payments?.bankTransfer) {
        const { instructions } = payments.bankTransfer;
        setBankTransferSettings({ instructions: instructions || '' });
        if (instructions) setIsBankTransferConfigured(true);
      }

    } catch (error) {
      toast({
        title: "Error al cargar configuración",
        description: "No se pudo obtener la configuración de pagos.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [storeId, toast]);

  useEffect(() => {
    fetchPaymentSettings();
  }, [fetchPaymentSettings]);

  const handleSaveSettings = async (provider) => {
    setSaving(provider);
    try {
      const { data: currentSettingsData, error: fetchError } = await supabase
        .from('store_settings')
        .select('settings')
        .eq('id', storeId)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') throw fetchError;
      
      let providerSettings;
      let successMessage;

      if (provider === 'stripe') {
        if (!stripeSettings.publishableKey || !stripeSettings.secretKey) {
          toast({ title: "Campos requeridos", description: "Por favor, introduce ambas claves de Stripe.", variant: "destructive" });
          setSaving(false); return;
        }
        providerSettings = { stripe: stripeSettings };
        successMessage = "Tus claves de Stripe han sido guardadas.";
      } else if (provider === 'mercadoPago') {
        if (!mercadoPagoSettings.accessToken) {
          toast({ title: "Campo requerido", description: "Por favor, introduce tu Access Token de Mercado Pago.", variant: "destructive" });
          setSaving(false); return;
        }
        providerSettings = { mercadoPago: mercadoPagoSettings };
        successMessage = "Tu Access Token de Mercado Pago ha sido guardado.";
      } else if (provider === 'paypal') {
        if (!paypalSettings.clientId) {
          toast({ title: "Campo requerido", description: "Por favor, introduce tu Client ID de PayPal.", variant: "destructive" });
          setSaving(false); return;
        }
        providerSettings = { paypal: paypalSettings };
        successMessage = "Tu Client ID de PayPal ha sido guardado.";
      } else if (provider === 'bankTransfer') {
        if (!bankTransferSettings.instructions) {
          toast({ title: "Campo requerido", description: "Por favor, introduce las instrucciones para la transferencia.", variant: "destructive" });
          setSaving(false); return;
        }
        providerSettings = { bankTransfer: bankTransferSettings };
        successMessage = "Tus instrucciones de transferencia han sido guardadas.";
      }


      const newSettings = {
        ...currentSettingsData?.settings,
        payments: {
          ...currentSettingsData?.settings?.payments,
          ...providerSettings
        }
      };

      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData.session?.user.id;
      if (!userId) throw new Error("Usuario no autenticado.");

      const { error: upsertError } = await supabase
        .from('store_settings')
        .upsert({ id: storeId, user_id: userId, settings: newSettings }, { onConflict: 'id' });

      if (upsertError) throw upsertError;
      
      toast({
        title: "¡Configuración Guardada!",
        description: successMessage,
        className: "bg-green-500 text-white",
      });

      if (provider === 'stripe') setIsStripeConnected(true);
      if (provider === 'mercadoPago') setIsMercadoPagoConnected(true);
      if (provider === 'paypal') setIsPayPalConnected(true);
      if (provider === 'bankTransfer') setIsBankTransferConfigured(true);

    } catch (error) {
      toast({
        title: "Error al guardar",
        description: error.message || "No se pudo guardar la configuración de pagos.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="h-12 w-12 animate-spin text-yellow-400" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-4 md:p-8 h-full overflow-y-auto"
    >
      <h1 className="text-3xl md:text-4xl font-bold text-yellow-300 mb-8">Configuración de Pagos</h1>
      
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Stripe Card */}
        <Card className="glass-effect border-purple-500 shadow-xl">
          <CardHeader className="flex flex-row items-center gap-4">
            <StripeIcon className="h-12 w-12 text-indigo-400"/>
            <div>
              <CardTitle className="text-2xl text-white">Integración con Stripe</CardTitle>
              <CardDescription className="text-indigo-300">Conecta tu cuenta de Stripe para aceptar pagos con tarjeta.</CardDescription>
            </div>
          </CardHeader>
          <form onSubmit={(e) => { e.preventDefault(); handleSaveSettings('stripe'); }}>
            <CardContent className="space-y-6">
              {isStripeConnected && (
                <div className="bg-green-500/20 border border-green-500 text-green-300 px-4 py-3 rounded-md flex items-center gap-3">
                  <CheckCircle className="h-5 w-5"/>
                  <p className="font-semibold">¡Conectado a Stripe!</p>
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="publishableKey" className="text-indigo-100 flex items-center"><Key className="mr-2 h-4 w-4 text-yellow-400"/>Clave Publicable</Label>
                <Input id="publishableKey" type="text" placeholder="pk_test_..." value={stripeSettings.publishableKey} onChange={(e) => setStripeSettings(prev => ({...prev, publishableKey: e.target.value}))} className="text-black"/>
              </div>
              <div className="space-y-2">
                <Label htmlFor="secretKey" className="text-indigo-100 flex items-center"><Key className="mr-2 h-4 w-4 text-yellow-400"/>Clave Secreta</Label>
                <Input id="secretKey" type="password" placeholder="sk_test_..." value={stripeSettings.secretKey} onChange={(e) => setStripeSettings(prev => ({...prev, secretKey: e.target.value}))} className="text-black" autoComplete="new-password"/>
              </div>
            </CardContent>
            <CardFooter className="border-t border-purple-600 pt-6">
              <Button type="submit" className="w-full sm:w-auto bg-yellow-400 text-purple-700 hover:bg-yellow-500 font-semibold" disabled={saving === 'stripe'}>
                {saving === 'stripe' ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Save className="mr-2 h-5 w-5" />}
                {isStripeConnected ? 'Actualizar' : 'Guardar y Conectar'}
              </Button>
            </CardFooter>
          </form>
        </Card>

        {/* Mercado Pago Card */}
        <Card className="glass-effect border-purple-500 shadow-xl">
          <CardHeader className="flex flex-row items-center gap-4">
            <MercadoPagoIcon />
            <div>
              <CardTitle className="text-2xl text-white">Integración con Mercado Pago</CardTitle>
              <CardDescription className="text-indigo-300">Conecta tu cuenta de Mercado Pago para más opciones.</CardDescription>
            </div>
          </CardHeader>
          <form onSubmit={(e) => { e.preventDefault(); handleSaveSettings('mercadoPago'); }}>
            <CardContent className="space-y-6">
              {isMercadoPagoConnected && (
                <div className="bg-green-500/20 border border-green-500 text-green-300 px-4 py-3 rounded-md flex items-center gap-3">
                  <CheckCircle className="h-5 w-5"/>
                  <p className="font-semibold">¡Conectado a Mercado Pago!</p>
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="mpAccessToken" className="text-indigo-100 flex items-center"><Key className="mr-2 h-4 w-4 text-yellow-400"/>Access Token</Label>
                <Input id="mpAccessToken" type="password" placeholder="APP_USR-..." value={mercadoPagoSettings.accessToken} onChange={(e) => setMercadoPagoSettings({ accessToken: e.target.value })} className="text-black" autoComplete="new-password"/>
              </div>
            </CardContent>
            <CardFooter className="border-t border-purple-600 pt-6">
              <Button type="submit" className="w-full sm:w-auto bg-yellow-400 text-purple-700 hover:bg-yellow-500 font-semibold" disabled={saving === 'mercadoPago'}>
                {saving === 'mercadoPago' ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Save className="mr-2 h-5 w-5" />}
                {isMercadoPagoConnected ? 'Actualizar' : 'Guardar y Conectar'}
              </Button>
            </CardFooter>
          </form>
        </Card>

        {/* PayPal Card */}
        <Card className="glass-effect border-purple-500 shadow-xl">
          <CardHeader className="flex flex-row items-center gap-4">
            <PayPalIcon />
            <div>
              <CardTitle className="text-2xl text-white">Integración con PayPal</CardTitle>
              <CardDescription className="text-indigo-300">Conecta tu cuenta de PayPal para pagos internacionales.</CardDescription>
            </div>
          </CardHeader>
          <form onSubmit={(e) => { e.preventDefault(); handleSaveSettings('paypal'); }}>
            <CardContent className="space-y-6">
              {isPayPalConnected && (
                <div className="bg-green-500/20 border border-green-500 text-green-300 px-4 py-3 rounded-md flex items-center gap-3">
                  <CheckCircle className="h-5 w-5"/>
                  <p className="font-semibold">¡Conectado a PayPal!</p>
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="paypalClientId" className="text-indigo-100 flex items-center"><Key className="mr-2 h-4 w-4 text-yellow-400"/>Client ID</Label>
                <Input id="paypalClientId" type="password" placeholder="AWp_..." value={paypalSettings.clientId} onChange={(e) => setPaypalSettings({ clientId: e.target.value })} className="text-black" autoComplete="new-password"/>
              </div>
            </CardContent>
            <CardFooter className="border-t border-purple-600 pt-6">
              <Button type="submit" className="w-full sm:w-auto bg-yellow-400 text-purple-700 hover:bg-yellow-500 font-semibold" disabled={saving === 'paypal'}>
                {saving === 'paypal' ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Save className="mr-2 h-5 w-5" />}
                {isPayPalConnected ? 'Actualizar' : 'Guardar y Conectar'}
              </Button>
            </CardFooter>
          </form>
        </Card>

        {/* Bank Transfer Card */}
        <Card className="glass-effect border-purple-500 shadow-xl">
          <CardHeader className="flex flex-row items-center gap-4">
            <Landmark className="h-12 w-12 text-teal-400"/>
            <div>
              <CardTitle className="text-2xl text-white">Transferencia Bancaria</CardTitle>
              <CardDescription className="text-indigo-300">Configura la opción de pago por transferencia directa.</CardDescription>
            </div>
          </CardHeader>
          <form onSubmit={(e) => { e.preventDefault(); handleSaveSettings('bankTransfer'); }}>
            <CardContent className="space-y-6">
              {isBankTransferConfigured && (
                <div className="bg-green-500/20 border border-green-500 text-green-300 px-4 py-3 rounded-md flex items-center gap-3">
                  <CheckCircle className="h-5 w-5"/>
                  <p className="font-semibold">¡Instrucciones de transferencia configuradas!</p>
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="bankInstructions" className="text-indigo-100 flex items-center">Instrucciones para el cliente</Label>
                <Textarea id="bankInstructions" placeholder="Ej: Transfiere el total a la cuenta CBU: 000... Alias: mi.tienda.mp. Luego, envía el comprobante a nuestro email..." value={bankTransferSettings.instructions} onChange={(e) => setBankTransferSettings({ instructions: e.target.value })} className="text-black" rows={5}/>
              </div>
            </CardContent>
            <CardFooter className="border-t border-purple-600 pt-6">
              <Button type="submit" className="w-full sm:w-auto bg-yellow-400 text-purple-700 hover:bg-yellow-500 font-semibold" disabled={saving === 'bankTransfer'}>
                {saving === 'bankTransfer' ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Save className="mr-2 h-5 w-5" />}
                {isBankTransferConfigured ? 'Actualizar' : 'Guardar Instrucciones'}
              </Button>
            </CardFooter>
          </form>
        </Card>

      </div>
    </motion.div>
  );
};

export default PaymentSettingsPage;