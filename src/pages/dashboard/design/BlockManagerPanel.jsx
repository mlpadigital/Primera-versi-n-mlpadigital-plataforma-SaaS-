import React, { useState } from 'react';
import { Button } from "../../../components/ui/button";
import { Label } from '../../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../../components/ui/accordion";
import { PlusCircle, Trash2, GripVertical } from 'lucide-react';
import { motion } from 'framer-motion';
import BlockEditor from './BlockEditor';

const availableBlockTypes = [
  { id: 'Header', name: 'Encabezado' },
  { id: 'HeroSection', name: 'Sección Héroe' },
  { id: 'ProductList', name: 'Lista de Productos' },
  { id: 'CallToAction', name: 'Llamada a la Acción' },
  { id: 'Testimonials', name: 'Testimonios' },
  { id: 'Footer', name: 'Pie de Página' },
  { id: 'ImageWithText', name: 'Imagen con Texto' },
  { id: 'Gallery', name: 'Galería de Imágenes' },
  { id: 'ContactForm', name: 'Formulario de Contacto' },
  { id: 'Map', name: 'Mapa' },
];

const getInitialContentForBlockType = (type) => {
  switch (type) {
    case 'Header':
      return { title: 'Nuevo Encabezado', navLinks: ['Inicio', 'Tienda'] };
    case 'HeroSection':
      return { heading: 'Título Impactante', subheading: 'Un subtítulo atractivo.', ctaText: 'Comprar', imageUrl: '' };
    case 'ProductList':
      return { title: 'Nuestros Productos' };
    case 'CallToAction':
      return { text: '¡Oferta Especial!', buttonText: 'Ver Más', buttonLink: '#' };
    case 'Testimonials':
      return { title: 'Lo que dicen nuestros clientes', items: [{ quote: 'Excelente producto!', author: 'Cliente Satisfecho' }] };
    case 'Footer':
      return { copyright: `© ${new Date().getFullYear()} Tu Tienda.`, socialLinks: [] };
    case 'ImageWithText':
      return { title: 'Título Descriptivo', text: 'Un párrafo sobre la imagen.', imageUrl: '', imagePosition: 'left' };
    case 'Gallery':
      return { title: 'Nuestra Galería', images: [] };
    case 'ContactForm':
      return { title: 'Contáctanos' };
    case 'Map':
      return { title: 'Encuéntranos', address: '123 Calle Falsa, Ciudad' };
    default:
      return {};
  }
};

const getInitialSettingsForBlockType = (type) => {
   switch (type) {
    case 'Header':
      return { backgroundColor: '#3730A3', textColor: '#FDE047', sticky: false };
    case 'HeroSection':
      return { backgroundColor: '#1E1B4B', textColor: '#FFFFFF', imagePosition: 'right', overlayOpacity: 0.3, fullWidth: true };
    case 'ProductList':
      return { layout: 'grid', itemsPerRow: 3, backgroundColor: '#111827', titleColor: '#FBBF24' };
    case 'CallToAction':
      return { backgroundColor: '#FBBF24', textColor: '#3730A3', buttonColor: '#6D28D9', buttonTextColor: '#FFFFFF' };
    case 'Testimonials':
      return { backgroundColor: '#1F2937', textColor: '#E5E7EB', cardColor: '#374151' };
    case 'Footer':
      return { backgroundColor: '#0F172A', textColor: '#94A3B8', style: 'dark' };
    case 'ImageWithText':
      return { backgroundColor: '#FFFFFF', textColor: '#111827', imagePosition: 'left' };
    case 'Gallery':
      return { columns: 3, spacing: 'md', backgroundColor: '#111827' };
    case 'ContactForm':
      return { backgroundColor: '#FFFFFF', textColor: '#111827', buttonColor: '#6D28D9' };
    case 'Map':
      return { zoomLevel: 15, mapStyle: 'standard' };
    default:
      return {};
  }
};

const BlockManagerPanel = ({ blocks = [], onBlocksChange, updateBlockContent, updateBlockSettings }) => {
  const [newBlockType, setNewBlockType] = useState(availableBlockTypes[0].id);

  const handleAddBlock = () => {
    const newBlock = {
      id: `${newBlockType.toLowerCase()}-${Date.now()}`,
      type: newBlockType,
      content: getInitialContentForBlockType(newBlockType),
      settings: getInitialSettingsForBlockType(newBlockType),
    };
    onBlocksChange([...blocks, newBlock]);
  };

  const handleDeleteBlock = (id) => {
    onBlocksChange(blocks.filter(block => block.id !== id));
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      <div className="flex gap-2 items-end p-3 bg-purple-900/50 rounded-md border border-purple-600">
        <div className="flex-grow">
          <Label htmlFor="newBlockType" className="text-indigo-200 block mb-1 text-sm">Añadir Nuevo Bloque</Label>
          <Select value={newBlockType} onValueChange={setNewBlockType}>
            <SelectTrigger className="w-full bg-white/10 border-purple-400 text-white">
              <SelectValue placeholder="Selecciona un tipo de bloque" />
            </SelectTrigger>
            <SelectContent className="bg-purple-800 border-yellow-500 text-white">
              {availableBlockTypes.map(type => (
                <SelectItem key={type.id} value={type.id} className="hover:bg-yellow-400/20 focus:bg-yellow-400/30">
                  {type.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button onClick={handleAddBlock} size="icon" className="bg-yellow-400 text-purple-700 hover:bg-yellow-500 flex-shrink-0">
          <PlusCircle className="h-5 w-5" />
        </Button>
      </div>

      {blocks.length === 0 && (
        <p className="text-center text-indigo-300 py-4">No hay bloques. ¡Añade el primero!</p>
      )}

      <Accordion type="multiple" className="w-full space-y-2">
        <div className="space-y-2">
          {blocks.map((block) => (
            <div key={block.id} className="bg-purple-700/40 rounded-md border border-purple-600 shadow-sm">
              <AccordionItem value={block.id} className="border-b-0">
                <AccordionTrigger className="px-3 py-2 hover:bg-purple-600/50 rounded-t-md text-yellow-300 data-[state=open]:bg-purple-600/50 data-[state=open]:rounded-b-none">
                  <div className="flex items-center w-full">
                    <div className="mr-2 text-indigo-300">
                       <GripVertical className="h-5 w-5" />
                    </div>
                    <span className="font-medium flex-grow text-left">{availableBlockTypes.find(b => b.id === block.type)?.name || block.type}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => { e.stopPropagation(); handleDeleteBlock(block.id); }}
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/20 ml-auto mr-1 flex-shrink-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="p-0">
                  <BlockEditor block={block} onContentChange={updateBlockContent} onSettingsChange={updateBlockSettings} />
                </AccordionContent>
              </AccordionItem>
            </div>
          ))}
        </div>
      </Accordion>
    </motion.div>
  );
};

export default BlockManagerPanel;