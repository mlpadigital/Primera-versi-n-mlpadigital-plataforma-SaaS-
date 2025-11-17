import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
//import { supabase } from './lib/customSupabaseClient';
import { useToast } from "../../../components/ui/use-toast";
import { Button } from "../../../components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../../components/ui/accordion";
import { Palette, LayoutTemplate, Save, Loader2, Eye, Blocks, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import TemplateSelector from './TemplateSelector';
import GlobalStylesPanel from './GlobalStylesPanel';
import BlockManagerPanel from './BlockManagerPanel';
import StorePreview from './StorePreview';

const initialDesignSettings = {
  template: 'template1',
  globalStyles: {
    primaryColor: '#8B5CF6',
    secondaryColor: '#F59E0B',
    fontFamily: 'Inter, sans-serif',
    backgroundColor: '#1E1B4B',
    textColor: '#E0E7FF',
  },
  blocks: [
    { id: 'header-1', type: 'Header', settings: { backgroundColor: '#111827', textColor: '#FFFFFF', sticky: false }, content: { title: 'Tu Tienda', navLinks: ['Inicio', 'Productos', 'Contacto'] } },
    { id: 'hero-1', type: 'HeroSection', settings: { backgroundColor: '#1E1B4B', textColor: '#FFFFFF', imagePosition: 'right', overlayOpacity: 0.3, fullWidth: true }, content: { heading: 'Descubre Novedades', subheading: 'Los mejores productos, al mejor precio.', ctaText: 'Comprar Ahora', imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80' } },
    { id: 'productlist-1', type: 'ProductList', settings: { layout: 'grid', itemsPerRow: 3, backgroundColor: '#1E1B4B', titleColor: '#F59E0B' }, content: { title: 'Nuestros Productos' } },
    { id: 'footer-1', type: 'Footer', settings: { backgroundColor: '#0F172A', textColor: '#94A3B8', style: 'dark' }, content: { copyright: `© ${new Date().getFullYear()} Tu Tienda. Todos los derechos reservados.`, socialLinks: [{platform: 'Facebook', url: '#'}, {platform: 'Instagram', url: '#'}] } },
  ],
};

// A more robust function to update nested values in an object.
const updateNestedValue = (obj, path, value) => {
  const newObj = JSON.parse(JSON.stringify(obj));
  const keys = path.split('.');
  
  let current = newObj;
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    const nextKey = keys[i + 1];
    
    // If the path doesn't exist, create it.
    if (typeof current[key] !== 'object' || current[key] === null) {
      // If the next part of the path is a number, create an array. Otherwise, an object.
      if (!isNaN(parseInt(nextKey, 10))) {
        current[key] = [];
      } else {
        current[key] = {};
      }
    }
    current = current[key];
  }
  
  // Set the value at the final key.
  current[keys[keys.length - 1]] = value;

  return newObj;
};

const StoreDesignPage = () => {
  const { storeId } = useParams();
  const { toast } = useToast();
  const [designSettings, setDesignSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savingStatus, setSavingStatus] = useState('idle'); // idle, saving, saved
  const [storeSlug, setStoreSlug] = useState('');
  const debounceTimeout = useRef(null);
  const latestSettings = useRef(null);

  useEffect(() => {
    latestSettings.current = designSettings;
  }, [designSettings]);

  const fetchDesignSettings = useCallback(async () => {
    if (!storeId) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('store_settings')
        .select('settings, store_slug')
        .eq('id', storeId)
        .single();

      if (error && error.code !== 'PGRST116') { 
        throw error;
      }

      setStoreSlug(data?.store_slug || '');
      
      if (data && data.settings) {
        const mergedSettings = JSON.parse(JSON.stringify(initialDesignSettings));
        Object.keys(data.settings).forEach(key => {
            if (key === 'blocks' && Array.isArray(data.settings.blocks)) {
                mergedSettings.blocks = data.settings.blocks;
            } else if (typeof data.settings[key] === 'object' && data.settings[key] !== null && !Array.isArray(data.settings[key])) {
                mergedSettings[key] = { ...mergedSettings[key], ...data.settings[key] };
            } else {
                mergedSettings[key] = data.settings[key];
            }
        });
        setDesignSettings(mergedSettings);
      } else {
        setDesignSettings(initialDesignSettings);
      }
    } catch (error) {
      console.error("Error fetching design settings:", error);
      toast({
        title: "Error al cargar diseño",
        description: error.message || "No se pudo obtener la configuración de diseño.",
        variant: "destructive",
      });
      setDesignSettings(initialDesignSettings); 
    } finally {
      setLoading(false);
    }
  }, [storeId, toast]);

  useEffect(() => {
    fetchDesignSettings();
  }, [fetchDesignSettings]);

  const handleSaveDesign = useCallback(async (settingsToSave) => {
    if (!storeId || !settingsToSave) return;
    setSavingStatus('saving');
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session?.user) {
        toast({ title: "Error de autenticación", variant: "destructive" });
        setSavingStatus('idle');
        return;
      }
      const userId = sessionData.session.user.id;

      const { error } = await supabase
        .from('store_settings')
        .upsert({ id: storeId, user_id: userId, settings: settingsToSave, store_slug: storeSlug || null }, { onConflict: 'id' });

      if (error) throw error;

      setSavingStatus('saved');
      setTimeout(() => setSavingStatus('idle'), 2000);

    } catch (error) {
      console.error("Error saving design settings:", error);
      toast({
        title: "Error al guardar diseño",
        description: error.message || "No se pudo guardar la configuración de diseño.",
        variant: "destructive",
      });
      setSavingStatus('idle');
    }
  }, [storeId, storeSlug, toast]);
  
  const updateDesignSettings = (path, value) => {
    setDesignSettings(prevSettings => {
      const newSettings = updateNestedValue(prevSettings || initialDesignSettings, path, value);
      
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
      setSavingStatus('saving');
      debounceTimeout.current = setTimeout(() => {
        // Use the ref to ensure we're saving the most up-to-date settings
        if (latestSettings.current) {
          handleSaveDesign(latestSettings.current);
        }
      }, 1500);

      return newSettings;
    });
  };

  useEffect(() => {
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full bg-background text-foreground">
        <Loader2 className="h-16 w-16 animate-spin text-secondary" />
        <p className="ml-4 text-xl">Cargando diseñador de tienda...</p>
      </div>
    );
  }
  
  if (!designSettings) {
     return (
      <div className="flex items-center justify-center h-full bg-background text-foreground">
        <p className="text-xl text-red-400">Error: No se pudieron cargar las configuraciones de diseño.</p>
      </div>
    );
  }

  const triggerClassName = "text-base font-semibold hover:no-underline hover:bg-purple-700/50 px-3 rounded-md text-yellow-300 data-[state=open]:bg-purple-700/80 data-[state=open]:text-yellow-400 w-full";

  const renderSavingStatus = () => {
    switch (savingStatus) {
      case 'saving':
        return <div className="flex items-center text-yellow-300"><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Guardando...</div>;
      case 'saved':
        return <div className="flex items-center text-green-400"><CheckCircle className="mr-2 h-4 w-4" /> Guardado</div>;
      default:
        return <div className="flex items-center text-indigo-300">Todos los cambios guardados</div>;
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-full overflow-hidden bg-purple-900/10 text-white">
      <motion.aside 
        initial={{ x: -300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="w-full lg:w-[350px] bg-purple-900/80 backdrop-blur-md text-white p-4 space-y-4 overflow-y-auto flex-shrink-0 shadow-2xl lg:border-r border-purple-700"
      >
        <div className="flex justify-between items-center pb-3 border-b border-purple-700">
          <h2 className="text-2xl font-bold text-yellow-400">Diseñar Tienda</h2>
          <div className="text-sm font-medium">
            {renderSavingStatus()}
          </div>
        </div>

        <Accordion type="multiple" className="w-full space-y-2" defaultValue={['templates', 'styles', 'blocks']}>
          <AccordionItem value="templates" className="border-none bg-black/20 rounded-lg">
            <AccordionTrigger className={triggerClassName}>
              <div className="flex items-center"><LayoutTemplate className="mr-3 h-5 w-5" /> Plantillas</div>
            </AccordionTrigger>
            <AccordionContent className="pt-2">
              <div className="p-3">
                <TemplateSelector
                  currentTemplate={designSettings.template}
                  onSelectTemplate={(templateId) => updateDesignSettings('template', templateId)}
                />
              </div>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="styles" className="border-none bg-black/20 rounded-lg">
            <AccordionTrigger className={triggerClassName}>
              <div className="flex items-center"><Palette className="mr-3 h-5 w-5" /> Estilos Globales</div>
            </AccordionTrigger>
            <AccordionContent className="pt-2">
              <div className="p-3">
                <GlobalStylesPanel
                  globalStyles={designSettings.globalStyles}
                  onStyleChange={updateDesignSettings}
                />
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="blocks" className="border-none bg-black/20 rounded-lg">
            <AccordionTrigger className={triggerClassName}>
               <div className="flex items-center"><Blocks className="mr-3 h-5 w-5" /> Bloques de Contenido</div>
            </AccordionTrigger>
            <AccordionContent className="pt-2">
              <div className="p-1">
                <BlockManagerPanel
                  blocks={designSettings.blocks || []}
                  onBlocksChange={(newBlocks) => updateDesignSettings('blocks', newBlocks)}
                  updateBlockContent={(blockId, contentPath, value) => {
                    const blockIndex = designSettings.blocks.findIndex(b => b.id === blockId);
                    if (blockIndex > -1) {
                      updateDesignSettings(`blocks.${blockIndex}.content.${contentPath}`, value);
                    }
                  }}
                  updateBlockSettings={(blockId, settingPath, value) => {
                    const blockIndex = designSettings.blocks.findIndex(b => b.id === blockId);
                    if (blockIndex > -1) {
                      updateDesignSettings(`blocks.${blockIndex}.settings.${settingPath}`, value);
                    }
                  }}
                />
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <Button asChild variant="outline" className="w-full text-white hover:bg-white/10 border-purple-600 mt-auto">
             <Link to={`/${storeSlug || storeId}`} target="_blank" rel="noopener noreferrer">
                <Eye className="mr-2 h-4 w-4" /> Ver tienda en vivo
            </Link>
        </Button>
      </motion.aside>

      <main className="flex-1 bg-gradient-to-br from-purple-900/20 via-black/30 to-purple-900/20 overflow-y-auto p-4 hidden lg:block">
          <div className="w-full h-full bg-white rounded-lg shadow-2xl transform scale-[0.98] origin-top">
             <StorePreview designSettings={designSettings} storeId={storeId} />
          </div>
      </main>
    </div>
  );
};

export default StoreDesignPage;