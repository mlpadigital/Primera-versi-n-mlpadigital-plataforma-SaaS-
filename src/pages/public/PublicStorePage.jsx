import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
//import { supabase } from './lib/customSupabaseClient';
import { Loader2 } from 'lucide-react';
import StorePreview from './../dashboard/design/StorePreview';

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


const PublicStorePage = () => {
  const { slug } = useParams();
  const [loading, setLoading] = useState(true);
  const [designSettings, setDesignSettings] = useState(null);
  const [storeId, setStoreId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStoreData = async () => {
      if (!slug) {
        setError("URL de tienda no válida.");
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const { data: settingsData, error: settingsError } = await supabase
          .from('store_settings')
          .select('id, settings, store_slug')
          .eq('store_slug', slug)
          .maybeSingle();

        if (settingsError) {
          throw new Error("Error al buscar la tienda.");
        }
        
        if (!settingsData) {
          setError("Tienda no encontrada. Verifica que la URL sea correcta.");
          setLoading(false);
          return;
        }

        setStoreId(settingsData.id);
        
        if (settingsData.settings) {
            const mergedSettings = JSON.parse(JSON.stringify(initialDesignSettings));
            Object.keys(settingsData.settings).forEach(key => {
                if (key === 'blocks' && Array.isArray(settingsData.settings.blocks)) {
                    mergedSettings.blocks = settingsData.settings.blocks;
                } else if (typeof settingsData.settings[key] === 'object' && settingsData.settings[key] !== null && !Array.isArray(settingsData.settings[key])) {
                    mergedSettings[key] = { ...mergedSettings[key], ...settingsData.settings[key] };
                } else {
                    mergedSettings[key] = settingsData.settings[key];
                }
            });
            setDesignSettings(mergedSettings);
        } else {
            setDesignSettings(initialDesignSettings);
        }

      } catch (err) {
        setError(err.message);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStoreData();
  }, [slug]);


  if (loading) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gray-900 text-white">
        <Loader2 className="h-16 w-16 animate-spin text-purple-400" />
        <p className="mt-4 text-xl font-semibold">Cargando tu tienda...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-900/20 text-red-300 p-4">
        <div className="text-center bg-red-900/50 p-8 rounded-lg shadow-2xl">
          <h1 className="text-4xl font-bold text-red-200">¡Ups! Algo salió mal</h1>
          <p className="mt-4 text-lg">{error}</p>
        </div>
      </div>
    );
  }

  if (!designSettings) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gray-900 text-white">
        <p className="mt-4 text-xl font-semibold">No se encontró la configuración de diseño para esta tienda.</p>
      </div>
    );
  }

  return <StorePreview designSettings={designSettings} storeId={storeId} />;
};

export default PublicStorePage;