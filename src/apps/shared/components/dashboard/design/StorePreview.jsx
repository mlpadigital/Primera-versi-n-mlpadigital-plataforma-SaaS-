import React, { useEffect, useState } from 'react';
//import { supabase } from './lib/customSupabaseClient';
import { Loader2, Image as ImageIcon } from 'lucide-react';
import { motion } from 'framer-motion';

const StorePreview = ({ designSettings, storeId }) => {
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!storeId) {
        setLoadingProducts(false);
        setProducts([]);
        return;
      }
      setLoadingProducts(true);
      try {
        const { data, error } = await supabase
          .from('products')
          .select('id, name, description, price, currency, image_url, category')
          .eq('store_id', storeId)
          .eq('status', 'active') 
          .limit(6); 

        if (error) throw error;
        setProducts(data || []);
      } catch (error) {
        console.error("Error fetching products for preview:", error);
        setProducts([]);
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchProducts();
  }, [storeId]);

  if (!designSettings) {
    return <div className="flex items-center justify-center h-full text-gray-800"><Loader2 className="h-8 w-8 animate-spin mr-2" />Cargando vista previa...</div>;
  }

  const { template, globalStyles, blocks } = designSettings;
  
  const getFontFamily = () => {
    const font = globalStyles.fontFamily || 'Inter, sans-serif';
    return font.includes(',') ? font : `'${font}', sans-serif`;
  };
  
  const renderBlock = (block) => {
    const blockContent = block.content || {};
    const blockSettings = block.settings || {};

    switch (block.type) {
      case 'Header':
        return (
          <header 
            key={block.id} 
            className="p-4 shadow-md" 
            style={{ 
              backgroundColor: blockSettings.backgroundColor || globalStyles.primaryColor, 
              color: blockSettings.textColor || globalStyles.textColor,
            }}
          >
            <div className="container mx-auto flex justify-between items-center">
              <h1 className="text-2xl font-bold">{blockContent.title || 'Mi Tienda'}</h1>
              <nav className="space-x-4">
                {(blockContent.navLinks || []).map((link, index) => (
                  <a key={index} href="#" className="hover:underline">{typeof link === 'string' ? link : link.label || 'Enlace'}</a>
                ))}
              </nav>
            </div>
          </header>
        );
      case 'HeroSection':
        return (
          <section 
            key={block.id} 
            className="py-20 px-4 text-center bg-cover bg-center relative" 
            style={{ 
              backgroundImage: blockContent.imageUrl ? `url(${blockContent.imageUrl})` : 'none',
              backgroundColor: blockSettings.backgroundColor || 'transparent',
              color: blockSettings.textColor || globalStyles.textColor,
            }}
          >
            {blockContent.imageUrl && <div className="absolute inset-0 bg-black" style={{opacity: blockSettings.overlayOpacity || 0.3}}></div>}
            <div className="relative z-10">
              <h2 className="text-5xl font-extrabold mb-4" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.5)'}}>{blockContent.heading || 'Título Héroe'}</h2>
              <p className="text-xl mb-8" style={{textShadow: '1px 1px 2px rgba(0,0,0,0.5)'}}>{blockContent.subheading || 'Subtítulo descriptivo.'}</p>
              {blockContent.ctaText && <button className="px-8 py-3 rounded-lg font-semibold text-lg" style={{backgroundColor: globalStyles.secondaryColor, color: globalStyles.backgroundColor || '#000'}}>{blockContent.ctaText}</button>}
            </div>
          </section>
        );
      case 'ProductList':
        return (
          <section key={block.id} className="py-12 px-4" style={{backgroundColor: blockSettings.backgroundColor || globalStyles.backgroundColor}}>
            <h2 className="text-3xl font-bold text-center mb-8" style={{color: blockSettings.titleColor || globalStyles.textColor}}>{blockContent.title || 'Productos Destacados'}</h2>
            {loadingProducts ? (
              <div className="flex justify-center"><Loader2 className="h-8 w-8 animate-spin" style={{color: globalStyles.primaryColor}} /></div>
            ) : products.length > 0 ? (
              <div className={`container mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-${blockSettings.itemsPerRow || 3} gap-8`}>
                {products.map(product => (
                  <div key={product.id} className="border rounded-lg overflow-hidden shadow-lg" style={{borderColor: globalStyles.primaryColor, backgroundColor: blockSettings.cardColor || '#FFFFFF20', color: globalStyles.textColor}}>
                    {product.image_url ? (
                      <img src={product.image_url} alt={product.name} className="w-full h-56 object-cover" />
                    ) : (
                       <div className="w-full h-56 bg-gray-500/30 flex items-center justify-center">
                         <ImageIcon className="h-16 w-16 text-gray-400" />
                       </div>
                    )}
                    <div className="p-4">
                      <h3 className="text-xl font-semibold" style={{color: globalStyles.secondaryColor}}>{product.name}</h3>
                      <p className="text-sm truncate mt-1">{product.description || 'Sin descripción.'}</p>
                      <p className="text-lg font-bold mt-4" style={{color: globalStyles.primaryColor}}>{product.price} {product.currency}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center" style={{color: globalStyles.textColor}}>No hay productos para mostrar en esta tienda.</p>
            )}
          </section>
        );
      case 'Footer':
        return (
          <footer 
            key={block.id} 
            className="p-6 text-center" 
            style={{ 
              backgroundColor: blockSettings.backgroundColor || globalStyles.primaryColor, 
              color: blockSettings.textColor || globalStyles.textColor 
            }}
          >
            <p>{blockContent.copyright || `© ${new Date().getFullYear()} Tu Tienda`}</p>
            {(blockContent.socialLinks || []).length > 0 && (
              <div className="mt-2 space-x-3">
                {(blockContent.socialLinks).map((link, index) => (
                  <a key={index} href={link.url || '#'} target="_blank" rel="noopener noreferrer" className="hover:underline">{link.platform || 'Social'}</a>
                ))}
              </div>
            )}
          </footer>
        );
      default:
        return (
          <div key={block.id} className="p-4 my-2 border rounded" style={{borderColor: globalStyles.primaryColor, color: globalStyles.textColor, backgroundColor: '#00000010'}}>
            <p>Bloque: {block.type} (Vista previa no implementada)</p>
            <pre className="text-xs overflow-auto bg-black/20 p-2 rounded mt-1">{JSON.stringify(blockContent, null, 2)}</pre>
          </div>
        );
    }
  };
  
  const templateStyles = {
    template1: { pageBackground: globalStyles.backgroundColor || '#1E1B4B' },
    template2: { pageBackground: globalStyles.backgroundColor || '#F3F4F6' },
    template3: { pageBackground: globalStyles.backgroundColor || '#111827' },
  };

  const currentTemplateStyle = templateStyles[template] || templateStyles.template1;

  return (
    <motion.div 
      key={JSON.stringify(designSettings)} 
      initial={{ opacity: 0.8 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full h-full overflow-auto" 
      style={{ 
        fontFamily: getFontFamily(),
        backgroundColor: currentTemplateStyle.pageBackground,
        color: globalStyles.textColor,
      }}
    >
      {(blocks || []).map(block => renderBlock(block))}
    </motion.div>
  );
};

export default StorePreview;