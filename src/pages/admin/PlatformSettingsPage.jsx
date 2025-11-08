
import React, { useState, useEffect, useCallback } from 'react';
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card";
import { useToast } from "../../components/ui/use-toast";
//import { supabase } from '@/lib/customSupabaseClient';
import { motion } from 'framer-motion';
import { Save, Loader2, Settings, DollarSign, Wallet, Trash2 } from 'lucide-react';

const MercadoPagoIcon = () => (
  <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 fill-current text-sky-400">
    <title>Mercado Pago</title>
    <path d="M12.144 2.424c-1.164 0-2.232.3-3.204.888-2.028 1.224-3.444 3.552-3.444 6.156v.024c0 2.556 1.344 4.8 3.3 5.988l-3.156 6.12c-.216.432-.12.96.24 1.296.36.336.888.408 1.32.192l6.3-3.18v.012c.024 0 .036 0 .06 0 .024 0 .036 0 .06 0v-.012l6.3 3.18c.192.096.396.144.6.144.276 0 .552-.084.78-.252.36-.264.504-.732.36-1.176l-3.156-6.12c1.956-1.188 3.3-3.432 3.3-5.988v-.024c0-2.604-1.416-4.932-3.444-6.156-.972-.588-2.04-.888-3.204-.888zm-.012 2.016c.6 0 1.188.144 1.728.432 1.08.588 1.836 1.8 1.836 3.132v.024c0 1.332-.756 2.544-1.836 3.132-.54.288-1.128.432-1.728.432s-1.188-.144-1.728-.432c-1.08-.588-1.836-1.8-1.836-3.132v-.024c0-1.332.756-2.544 1.836-3.132.54-.288 1.128.432 1.728.432z"/>
  </svg>
);

const PayPalIcon = () => (
  <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 fill-current text-blue-600">
    <title>PayPal</title>
    <path d="M7.856 5.332c.728-1.48 2.344-2.436 4.068-2.436h5.236c2.4 0 4.104 1.692 3.936 4.068-.18 2.532-2.028 4.356-4.428 4.356h-2.928c-.564 0-.924.492-.828.984l.528 2.7c.108.528.564.876 1.092.876h.6c.528 0 .984-.384.984-.9l-.096-.528c-.036-.18.072-.36.252-.396.18-.036.36.072.396.252l.492 2.556c.108.564-.288 1.092-.864 1.092h-.6c-1.224 0-2.256-.888-2.448-2.1l-3.228-16.632zM13.8 11.74c.552-.288.936-.864.9-1.464-.06-1.116-.996-1.944-2.124-1.944H8.44c-.564 0-1.032.456-1.032 1.02l.012.06 2.46 12.684c.06.288.3.492.588.492h.6c.324 0 .588-.264.588-.588l-.504-2.592c-.048-.252.12-.492.372-.54.252-.048.492.12.54.372l.504 2.592c.048.252.288.444.54.444h.6c.288 0 .528-.216.54-.504l.18-2.184c.024-.276-.18-.516-.456-.54-.276-.024-.516.18-.54.456l-.072.864c-.012.156-.156.264-.3.264h-.6c-.18 0-.324-.144-.324-.324l.504-2.592c.108-.552-.288-1.08-.852-1.08h-.6c-.324 0-.6.228-.66.54l-.384 1.968c-.06.288-.312.492-.6.492h-.6c-.324 0-.588-.264-.588-.588l2.46-12.684h3.132c.588 0 1.068.48 1.068 1.068 0 .588-.48 1.068-1.068 1.068H9.6c-.324 0-.588.264-.588.588l-.012.06.012.06c.012.324.276.588.6.588h4.2z"/>
  </svg>
);

const PlatformSettingsPage = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [storeCreationPrice, setStoreCreationPrice] = useState('');
  const [mercadoPago, setMercadoPago] = useState({ alias: '', cvu: '', public_key: '', access_token: '' });
  const [paypal, setPaypal] = useState({ email: '' });
  const [bankTransfer, setBankTransfer] = useState([{ label: '', value: '' }]);
  const [prex, setPrex] = useState({ user: '' });

  const fetchSettings = useCallback(async () => {
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

      setStoreCreationPrice(settings.storeCreation?.price || '15000');
      setMercadoPago(settings.mercadoPago || { alias: '', cvu: '', public_key: '', access_token: '' });
      setPaypal(settings.paypal || { email: '' });
      setBankTransfer(settings.bankTransfer?.details?.length > 0 ? settings.bankTransfer.details : [{ label: '', value: '' }]);
      setPrex(settings.prex || { user: '' });

    } catch (error) {
      toast({
        title: "Error al cargar ajustes",
        description: "No se pudieron obtener los ajustes de la plataforma.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      const settingsToSave = [
        { key: 'storeCreation', value: { price: parseFloat(storeCreationPrice) || 0 } },
        { key: 'mercadoPago', value: mercadoPago },
        { key: 'paypal', value: paypal },
        { key: 'bankTransfer', value: { details: bankTransfer.filter(d => d.label && d.value) } },
        { key: 'prex', value: prex },
      ];

      const { error } = await supabase
        .from('platform_settings')
        .upsert(settingsToSave, { onConflict: 'key' });

      if (error) throw error;

      toast({
        title: "¡Ajustes Guardados!",
        description: "Los ajustes de la plataforma se han actualizado correctamente.",
        className: "bg-green-500 text-white",
      });
    } catch (error) {
      toast({
        title: "Error al guardar",
        description: error.message || "No se pudieron guardar los ajustes.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };
  
  const handleBankTransferChange = (index, field, value) => {
    const newBankTransfer = [...bankTransfer];
    newBankTransfer[index][field] = value;
    setBankTransfer(newBankTransfer);
  };

  const addBankTransferField = () => {
    setBankTransfer([...bankTransfer, { label: '', value: '' }]);
  };

  const removeBankTransferField = (index) => {
    const newBankTransfer = bankTransfer.filter((_, i) => i !== index);
    setBankTransfer(newBankTransfer);
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-4 md:p-8 h-full overflow-y-auto text-white"
    >
      <div className="max-w-4xl mx-auto">
        <header className="mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-yellow-300 flex items-center gap-4">
            <Settings className="h-10 w-10" />
            Ajustes de la Plataforma
          </h1>
          <p className="text-slate-400 mt-2">
            Configura aquí los datos de pago y precios para la creación de nuevas tiendas en tu plataforma.
          </p>
        </header>

        <div className="space-y-8">
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-2xl text-white flex items-center gap-3"><DollarSign className="text-green-400"/>Precio de Creación de Tienda</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="storePrice" className="text-slate-300">Precio (ARS)</Label>
                <Input id="storePrice" type="number" placeholder="15000" value={storeCreationPrice} onChange={(e) => setStoreCreationPrice(e.target.value)} className="bg-slate-800 border-slate-700 max-w-xs"/>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-2xl text-white flex items-center gap-3"><MercadoPagoIcon />Mercado Pago</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="mpPublicKey" className="text-slate-300">Public Key</Label>
                <Input id="mpPublicKey" type="text" placeholder="APP_USR-..." value={mercadoPago.public_key} onChange={(e) => setMercadoPago(p => ({...p, public_key: e.target.value}))} className="bg-slate-800 border-slate-700"/>
              </div>
              <div className="space-y-2">
                <Label htmlFor="mpAccessToken" className="text-slate-300">Access Token</Label>
                <Input id="mpAccessToken" type="password" placeholder="APP_USR-..." value={mercadoPago.access_token} onChange={(e) => setMercadoPago(p => ({...p, access_token: e.target.value}))} className="bg-slate-800 border-slate-700"/>
              </div>
              <div className="space-y-2">
                <Label htmlFor="mpAlias" className="text-slate-300">Alias (para Transferencias)</Label>
                <Input id="mpAlias" type="text" placeholder="tu.alias.mp" value={mercadoPago.alias} onChange={(e) => setMercadoPago(p => ({...p, alias: e.target.value}))} className="bg-slate-800 border-slate-700"/>
              </div>
              <div className="space-y-2">
                <Label htmlFor="mpCvu" className="text-slate-300">CVU (para Transferencias)</Label>
                <Input id="mpCvu" type="text" placeholder="00000031000..." value={mercadoPago.cvu} onChange={(e) => setMercadoPago(p => ({...p, cvu: e.target.value}))} className="bg-slate-800 border-slate-700"/>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-2xl text-white flex items-center gap-3"><Wallet className="text-teal-400"/>Transferencia Bancaria</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {bankTransfer.map((field, index) => (
                <div key={index} className="flex items-end gap-2">
                  <div className="flex-1 space-y-2">
                    <Label htmlFor={`btLabel-${index}`} className="text-slate-300">Campo</Label>
                    <Input id={`btLabel-${index}`} type="text" placeholder="Ej: CBU, Alias, Titular" value={field.label} onChange={(e) => handleBankTransferChange(index, 'label', e.target.value)} className="bg-slate-800 border-slate-700"/>
                  </div>
                  <div className="flex-1 space-y-2">
                    <Label htmlFor={`btValue-${index}`} className="text-slate-300">Valor</Label>
                    <Input id={`btValue-${index}`} type="text" placeholder="El valor correspondiente" value={field.value} onChange={(e) => handleBankTransferChange(index, 'value', e.target.value)} className="bg-slate-800 border-slate-700"/>
                  </div>
                  <Button variant="destructive" size="icon" onClick={() => removeBankTransferField(index)}><Trash2 className="h-4 w-4"/></Button>
                </div>
              ))}
              <Button variant="outline" className="bg-slate-800 border-slate-700 hover:bg-slate-700" onClick={addBankTransferField}>Añadir Campo</Button>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-2xl text-white flex items-center gap-3"><PayPalIcon />PayPal</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="paypalEmail" className="text-slate-300">Email de PayPal</Label>
                <Input id="paypalEmail" type="email" placeholder="tu-email@paypal.com" value={paypal.email} onChange={(e) => setPaypal({ email: e.target.value })} className="bg-slate-800 border-slate-700"/>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-2xl text-white flex items-center gap-3"><Wallet className="text-green-500"/>Prex</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="prexUser" className="text-slate-300">Usuario Prex</Label>
                <Input id="prexUser" type="text" placeholder="@tu.usuario.prex" value={prex.user} onChange={(e) => setPrex({ user: e.target.value })} className="bg-slate-800 border-slate-700"/>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end pt-6">
            <Button onClick={handleSaveSettings} className="w-full sm:w-auto bg-yellow-400 text-slate-900 hover:bg-yellow-500 font-semibold text-lg px-8 py-6" disabled={saving}>
              {saving ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Save className="mr-2 h-5 w-5" />}
              Guardar Todos los Ajustes
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PlatformSettingsPage;
