import React from 'react';
import { Label } from '../../../components/ui/label';
import { Input } from '../../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import { motion } from 'framer-motion';

const availableFonts = [
  { value: 'Inter, sans-serif', label: 'Inter (Sans Serif)' },
  { value: 'Roboto, sans-serif', label: 'Roboto (Sans Serif)' },
  { value: 'Open Sans, sans-serif', label: 'Open Sans (Sans Serif)' },
  { value: 'Lato, sans-serif', label: 'Lato (Sans Serif)' },
  { value: 'Montserrat, sans-serif', label: 'Montserrat (Sans Serif)' },
  { value: 'Playfair Display, serif', label: 'Playfair Display (Serif)' },
  { value: 'Merriweather, serif', label: 'Merriweather (Serif)' },
  { value: 'Lora, serif', label: 'Lora (Serif)' },
  { value: 'Source Code Pro, monospace', label: 'Source Code Pro (Monospace)' },
];

const GlobalStylesPanel = ({ globalStyles, onStyleChange }) => {
  const handleColorChange = (styleKey, value) => {
    onStyleChange(`globalStyles.${styleKey}`, value);
  };

  const handleFontChange = (value) => {
    onStyleChange('globalStyles.fontFamily', value);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div>
        <Label htmlFor="primaryColor" className="text-indigo-200 block mb-1">Color Primario</Label>
        <div className="flex items-center gap-2">
          <Input
            id="primaryColor"
            type="color"
            value={globalStyles.primaryColor || '#6D28D9'}
            onChange={(e) => handleColorChange('primaryColor', e.target.value)}
            className="w-12 h-10 p-0 border-none cursor-pointer bg-transparent"
          />
          <Input
            type="text"
            value={globalStyles.primaryColor || '#6D28D9'}
            onChange={(e) => handleColorChange('primaryColor', e.target.value)}
            className="bg-white/10 border-purple-400 text-white placeholder-indigo-300 flex-1"
            maxLength="7"
          />
        </div>
      </div>
      <div>
        <Label htmlFor="secondaryColor" className="text-indigo-200 block mb-1">Color Secundario</Label>
         <div className="flex items-center gap-2">
          <Input
            id="secondaryColor"
            type="color"
            value={globalStyles.secondaryColor || '#FBBF24'}
            onChange={(e) => handleColorChange('secondaryColor', e.target.value)}
            className="w-12 h-10 p-0 border-none cursor-pointer bg-transparent"
          />
          <Input
            type="text"
            value={globalStyles.secondaryColor || '#FBBF24'}
            onChange={(e) => handleColorChange('secondaryColor', e.target.value)}
            className="bg-white/10 border-purple-400 text-white placeholder-indigo-300 flex-1"
            maxLength="7"
          />
        </div>
      </div>
       <div>
        <Label htmlFor="backgroundColor" className="text-indigo-200 block mb-1">Color de Fondo Principal</Label>
         <div className="flex items-center gap-2">
          <Input
            id="backgroundColor"
            type="color"
            value={globalStyles.backgroundColor || '#1E1B4B'}
            onChange={(e) => handleColorChange('backgroundColor', e.target.value)}
            className="w-12 h-10 p-0 border-none cursor-pointer bg-transparent"
          />
          <Input
            type="text"
            value={globalStyles.backgroundColor || '#1E1B4B'}
            onChange={(e) => handleColorChange('backgroundColor', e.target.value)}
            className="bg-white/10 border-purple-400 text-white placeholder-indigo-300 flex-1"
            maxLength="7"
          />
        </div>
      </div>
       <div>
        <Label htmlFor="textColor" className="text-indigo-200 block mb-1">Color de Texto Principal</Label>
         <div className="flex items-center gap-2">
          <Input
            id="textColor"
            type="color"
            value={globalStyles.textColor || '#E0E7FF'}
            onChange={(e) => handleColorChange('textColor', e.target.value)}
            className="w-12 h-10 p-0 border-none cursor-pointer bg-transparent"
          />
          <Input
            type="text"
            value={globalStyles.textColor || '#E0E7FF'}
            onChange={(e) => handleColorChange('textColor', e.target.value)}
            className="bg-white/10 border-purple-400 text-white placeholder-indigo-300 flex-1"
            maxLength="7"
          />
        </div>
      </div>
      <div>
        <Label htmlFor="fontFamily" className="text-indigo-200 block mb-1">Fuente Principal</Label>
        <Select value={globalStyles.fontFamily || 'Inter, sans-serif'} onValueChange={handleFontChange}>
          <SelectTrigger className="w-full bg-white/10 border-purple-400 text-white">
            <SelectValue placeholder="Selecciona una fuente" />
          </SelectTrigger>
          <SelectContent className="bg-purple-800 border-yellow-500 text-white">
            {availableFonts.map(font => (
              <SelectItem key={font.value} value={font.value} style={{ fontFamily: font.value }} className="hover:bg-yellow-400/20 focus:bg-yellow-400/30">
                {font.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </motion.div>
  );
};

export default GlobalStylesPanel;