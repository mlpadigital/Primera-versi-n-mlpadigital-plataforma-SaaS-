import React from 'react';
import { Button } from "../../../components/ui/button";
import { Check, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { Label } from '../../../components/ui/label';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import { Sparkles, Sun, Zap } from 'lucide-react';

const templates = [
  { id: 'template1', name: 'Aurora Boreal', description: 'Oscuro, vibrante y lleno de energía. Ideal para marcas audaces.', icon: <Sparkles className="mr-2 h-5 w-5 text-purple-400" /> },
  { id: 'template2', name: 'Minimalista Zen', description: 'Claro, limpio y profesional. Perfecto para un look elegante y moderno.', icon: <Sun className="mr-2 h-5 w-5 text-orange-400" /> },
  { id: 'template3', name: 'Impacto Urbano', description: 'Contraste alto y tipografía fuerte. Para tiendas con una fuerte personalidad.', icon: <Zap className="mr-2 h-5 w-5 text-yellow-400" /> },
];

const TemplateSelector = ({ currentTemplate, onSelectTemplate }) => {
  const selectedTemplate = templates.find(t => t.id === currentTemplate) || templates[0];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      <Label className="text-indigo-200 block text-lg">Plantilla de Diseño</Label>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-full justify-between text-white hover:bg-white/10 border-purple-400 h-12 text-base">
            <div className="flex items-center">
              {selectedTemplate.icon}
              <span>{selectedTemplate.name}</span>
            </div>
            <ChevronDown className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[310px] bg-purple-900/80 backdrop-blur-md border-yellow-500 text-white">
          <DropdownMenuLabel>Elige una plantilla base</DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-purple-600" />
          {templates.map(template => (
            <DropdownMenuItem 
              key={template.id} 
              onSelect={() => onSelectTemplate(template.id)}
              className="flex justify-between items-center h-12 text-base focus:bg-yellow-400/20 focus:text-yellow-300"
            >
              <div className="flex items-center">
                {template.icon}
                <span>{template.name}</span>
              </div>
              {currentTemplate === template.id && <Check className="h-5 w-5 text-yellow-400" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="text-sm text-indigo-300 p-3 bg-black/20 rounded-md border border-purple-600">
        <p className="font-semibold text-indigo-100">{selectedTemplate.name}</p>
        <p>{selectedTemplate.description}</p>
      </div>

    </motion.div>
  );
};

export default TemplateSelector;