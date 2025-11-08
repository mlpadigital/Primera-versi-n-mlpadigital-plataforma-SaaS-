
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Switch } from "../../../components/ui/switch.jsx";
import { Label } from "../../../components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../../../components/ui/card";
import { useToast } from "../../../components/ui/use-toast.js";
//import { supabase } from './lib/customSupabaseClient';
import { Loader2, Save, Trash2, Bot } from 'lucide-react';
import { motion } from 'framer-motion';
//import { useAuth } from './contexts/SupabaseAuthContext';

const StoreSettingsPage = () => {
  const { storeId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { session } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [storeName, setStoreName] = useState('');
  const [storeSlug, setStoreSlug] = useState('');
  const [aiChatbotEnabled, setAiChatbotEnabled] = useState(false);
  const [initialSlug, setInitialSlug] = useState('');
  const [domain, setDomain] = useState('');

  useEffect(() => {
    setDomain(window.location.host);
  }, []);

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    try {
      const { data: storeData, error: storeError } = await supabase
        .from('stores')
        .select('name')
        .eq('id', storeId)
        .single();
      
      if(storeError) throw storeError;
      setStoreName(storeData.name);

      const { data, error } = await supabase
        .from('store_settings')
        .select('settings, store_slug')
        .eq('id', storeId)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') { // Ignore "not found"
        throw error;
      }
      
      if (data) {
        setStoreSlug(data.store_slug || '');
        setInitialSlug(data.store_slug || '');
        setAiChatbotEnabled(data.settings?.features?.aiChatbotEnabled || false);
      } else {
        setStoreSlug('');
        setInitialSlug('');
        setAiChatbotEnabled(false);
      }
    } catch (error) {
      toast({ title: "Error al cargar ajustes", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [storeId, toast]);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      if(storeName.trim() === '') {
        throw new Error("El nombre de la tienda no puede estar vacío.");
      }
      
      const slugToSave = storeSlug.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      if(slugToSave === '') {
        throw new Error("El slug de la tienda no puede estar vacío.");
      }

      if (slugToSave !== initialSlug) {
        const { data: existing, error: slugError } = await supabase
          .from('store_settings')
          .select('id')
          .eq('store_slug', slugToSave)
          .maybeSingle();
        if (slugError) {
            throw slugError;
        }
        if (existing && existing.id !== storeId) {
          throw new Error("Esta URL de tienda ya está en uso. Por favor, elige otra.");
        }
      }

      const { error: storeUpdateError } = await supabase
        .from('stores')
        .update({ name: storeName })
        .eq('id', storeId);
      if (storeUpdateError) throw storeUpdateError;

      const { data: currentSettingsData, error: currentSettingsError } = await supabase
        .from('store_settings')
        .select('settings')
        .eq('id', storeId)
        .single();

      if (currentSettingsError && currentSettingsError.code !== 'PGRST116') throw currentSettingsError;

      const currentSettings = currentSettingsData?.settings || {};
      const newSettings = {
        ...currentSettings,
        features: {
          ...currentSettings.features,
          aiChatbotEnabled
        }
      };

      const { error: settingsError } = await supabase
        .from('store_settings')
        .update({
          store_slug: slugToSave,
          settings: newSettings
        })
        .eq('id', storeId);

      if (settingsError) throw settingsError;

      toast({ title: "¡Ajustes guardados!", description: "La configuración de tu tienda ha sido actualizada.", className: "bg-green-600 text-white" });
      setInitialSlug(slugToSave);
      if (slugToSave !== initialSlug) {
        navigate(`/dashboard/${storeId}/settings`, { replace: true });
      }


    } catch (error) {
      toast({ title: "Error al guardar", description: error.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };
  
  const handleDeleteStore = async () => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar la tienda "${storeName}"? Esta acción es irreversible y eliminará todos los productos y datos asociados.`)) {
        setSaving(true);
        try {
            const { error } = await supabase.functions.invoke('delete-store', {
                body: { store_id: storeId },
                headers: { Authorization: `Bearer ${session.access_token}` },
            });
            if (error) throw error;
            
            toast({
                title: "Tienda Eliminada",
                description: `La tienda "${storeName}" ha sido eliminada permanentemente.`,
            });
            navigate('/dashboard');

        } catch (error) {
            toast({ title: "Error al eliminar", description: error.message, variant: "destructive" });
        } finally {
            setSaving(false);
        }
    }
  };


  if (loading) {
    return <div className="flex justify-center items-center h-full"><Loader2 className="h-12 w-12 animate-spin text-yellow-400" /></div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-4 md:p-8"
    >
      <h1 className="text-3xl md:text-4xl font-bold text-yellow-300 mb-6">Ajustes de la Tienda</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          <Card className="glass-effect">
            <CardHeader>
              <CardTitle>Información General</CardTitle>
              <CardDescription>Ajustes básicos de tu tienda.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="storeName" className="text-indigo-200">Nombre de la Tienda</Label>
                <Input id="storeName" value={storeName} onChange={e => setStoreName(e.target.value)} className="bg-white/10 text-white" />
              </div>
              <div>
                <Label htmlFor="storeSlug" className="text-indigo-200">URL de la Tienda</Label>
                 <div className="flex items-center">
                    <span className="text-sm bg-white/5 px-3 py-2 rounded-l-md border border-r-0 border-purple-500 text-indigo-300">{window.location.origin}/</span>
                    <Input id="storeSlug" value={storeSlug} onChange={e => setStoreSlug(e.target.value)} placeholder="tu-tienda" className="bg-white/10 text-white rounded-l-none" />
                </div>
                <p className="text-xs text-indigo-400 mt-1">Solo letras minúsculas, números y guiones.</p>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-effect">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Bot className="text-yellow-400" /> Funcionalidades IA</CardTitle>
              <CardDescription>Activa herramientas inteligentes para potenciar tu tienda.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-between p-4 rounded-lg bg-white/5">
                    <div>
                        <Label htmlFor="ai-chatbot" className="text-lg font-medium text-indigo-100">Chatbot de Soporte al Cliente</Label>
                        <p className="text-sm text-indigo-300">Responde automáticamente las dudas de tus clientes 24/7.</p>
                    </div>
                    <Switch
                        id="ai-chatbot"
                        checked={aiChatbotEnabled}
                        onCheckedChange={setAiChatbotEnabled}
                    />
                </div>
            </CardContent>
             <CardFooter>
                 <Button onClick={handleSaveSettings} disabled={saving}>
                    {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    Guardar Cambios
                </Button>
            </CardFooter>
          </Card>

        </div>

        <div className="space-y-8">
            <Card className="border-red-500/50 glass-effect">
                <CardHeader>
                    <CardTitle className="text-red-400">Zona de Peligro</CardTitle>
                    <CardDescription className="text-red-300/80">
                        Estas acciones son irreversibles. Por favor, procede con cuidado.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                     <Button variant="destructive" onClick={handleDeleteStore} className="w-full" disabled={saving}>
                        {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
                        Eliminar Tienda Permanentemente
                    </Button>
                </CardContent>
            </Card>
        </div>
      </div>
    </motion.div>
  );
};

export default StoreSettingsPage;
