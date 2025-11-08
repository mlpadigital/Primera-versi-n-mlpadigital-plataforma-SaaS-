import React, { useState, useRef } from 'react';
import { Button } from "../../../components/ui/button";
import { Input } from '../../../components/ui/input';
import { Textarea } from '../../../components/ui/textarea';
import { Label } from '../../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import { Edit3, Settings2, Upload, Loader2, Trash2 } from 'lucide-react';
//import { supabase } from './lib/customSupabaseClient';
import { useToast } from "../../../components/ui/use-toast";
import { useParams } from 'react-router-dom';

const BlockEditor = ({ block, onContentChange, onSettingsChange }) => {
  const [activeTab, setActiveTab] = useState('content');
  const { toast } = useToast();
  const { storeId } = useParams();
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageUpload = async (event, path) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast({ title: "Archivo demasiado grande", description: "El tamaño máximo es 5MB.", variant: "destructive" });
      return;
    }

    setUploading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuario no autenticado.");

      const filePath = `${user.id}/${storeId}/design-assets/${Date.now()}-${file.name}`;
      
      const { error: uploadError } = await supabase.storage
        .from('store_design_images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from('store_design_images')
        .getPublicUrl(filePath);

      if (!publicUrlData) throw new Error("No se pudo obtener la URL pública.");
      
      onContentChange(block.id, path, publicUrlData.publicUrl);
      toast({ title: "Imagen subida", description: "La imagen ha sido actualizada." });

    } catch (error) {
      console.error("Error al subir imagen:", error);
      toast({ title: "Error al subir imagen", description: error.message, variant: "destructive" });
    } finally {
      setUploading(false);
      if(fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const renderContentField = (key, value, path) => {
    const fullPath = `content.${path ? path + '.' : ''}${key}`;
    const currentPath = fullPath.substring(8);

    if (Array.isArray(value)) {
      if (key === 'navLinks' || key === 'socialLinks') {
        return (
          <div key={key} className="space-y-2">
            <Label className="text-indigo-300 capitalize">{key.replace(/([A-Z])/g, ' $1')}</Label>
            {value.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <Input
                  type="text"
                  value={typeof item === 'object' ? item.url || item.platform || '' : item}
                  onChange={(e) => {
                    const newValue = [...value];
                    if (typeof item === 'object') {
                      if (item.url !== undefined) newValue[index] = { ...item, url: e.target.value };
                      else if (item.platform !== undefined) newValue[index] = { ...item, platform: e.target.value };
                      else newValue[index] = e.target.value;
                    } else {
                       newValue[index] = e.target.value;
                    }
                    onContentChange(block.id, currentPath, newValue);
                  }}
                  className="bg-white/5 border-purple-500 text-white flex-grow"
                  placeholder={typeof item === 'object' ? (item.url !== undefined ? 'URL Enlace' : 'Plataforma') : 'Texto Enlace'}
                />
                {typeof item === 'object' && item.url !== undefined && (
                   <Input
                    type="text"
                    value={item.platform || ''}
                    onChange={(e) => {
                      const newValue = [...value];
                      newValue[index] = { ...item, platform: e.target.value };
                      onContentChange(block.id, currentPath, newValue);
                    }}
                    className="bg-white/5 border-purple-500 text-white w-1/3"
                    placeholder="Nombre Plataforma"
                  />
                )}
                <Button size="icon" variant="destructive" onClick={() => {
                  const newValue = value.filter((_, i) => i !== index);
                  onContentChange(block.id, currentPath, newValue);
                }}><Trash2 className="h-4 w-4" /></Button>
              </div>
            ))}
            <Button size="sm" variant="outline" className="text-yellow-300 border-yellow-300 hover:bg-yellow-300/10" onClick={() => {
              const newItem = (key === 'socialLinks') ? { platform: '', url: '#' } : 'Nuevo Enlace';
              onContentChange(block.id, currentPath, [...value, newItem]);
            }}>Añadir</Button>
          </div>
        );
      }
      return <p key={key} className="text-sm text-indigo-400">Array: {key} (edición no implementada)</p>;
    } else if (typeof value === 'object' && value !== null) {
      return (
        <div key={key} className="pl-2 border-l border-purple-600 space-y-2">
          <Label className="text-indigo-300 capitalize">{key.replace(/([A-Z])/g, ' $1')}</Label>
          {Object.entries(value).map(([subKey, subValue]) => renderContentField(subKey, subValue, `${path ? path + '.' : ''}${key}`))}
        </div>
      );
    } else if (key.toLowerCase().includes('url') || key.toLowerCase().includes('image')) {
       const isImageUrl = key.toLowerCase().includes('image');
       return (
        <div key={key} className="space-y-2">
          <Label htmlFor={`${block.id}-${key}`} className="text-indigo-300 capitalize">{key.replace(/([A-Z])/g, ' $1')}</Label>
          <div className="flex items-center gap-2">
            <Input
              id={`${block.id}-${key}`}
              type="text"
              value={value || ''}
              onChange={(e) => onContentChange(block.id, currentPath, e.target.value)}
              className="bg-white/5 border-purple-500 text-white flex-grow"
              placeholder="URL de la imagen o enlace"
            />
            {isImageUrl && (
              <Button size="icon" variant="outline" className="text-yellow-300 border-yellow-300 hover:bg-yellow-300/10 flex-shrink-0" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
                {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
              </Button>
            )}
          </div>
          {isImageUrl && (
            <>
              <input
                type="file"
                ref={fileInputRef}
                onChange={(e) => handleImageUpload(e, currentPath)}
                className="hidden"
                accept="image/png, image/jpeg, image/gif, image/webp"
              />
              {value && (
                <div className="mt-2 border border-purple-500 rounded-md p-2 bg-black/20">
                  <img-replace src={value} alt="Vista previa" className="w-full h-auto rounded-md max-h-40 object-contain" />
                </div>
              )}
            </>
          )}
        </div>
      );
    } else if (typeof value === 'string' && value.length > 50) {
      return (
        <div key={key} className="space-y-1">
          <Label htmlFor={`${block.id}-${key}`} className="text-indigo-300 capitalize">{key.replace(/([A-Z])/g, ' $1')}</Label>
          <Textarea
            id={`${block.id}-${key}`}
            value={value}
            onChange={(e) => onContentChange(block.id, currentPath, e.target.value)}
            className="bg-white/5 border-purple-500 text-white min-h-[80px]"
          />
        </div>
      );
    }
    return (
      <div key={key} className="space-y-1">
        <Label htmlFor={`${block.id}-${key}`} className="text-indigo-300 capitalize">{key.replace(/([A-Z])/g, ' $1')}</Label>
        <Input
          id={`${block.id}-${key}`}
          type="text"
          value={value || ''}
          onChange={(e) => onContentChange(block.id, currentPath, e.target.value)}
          className="bg-white/5 border-purple-500 text-white"
        />
      </div>
    );
  };
  
  const renderSettingsField = (key, value, path) => {
    const fullPath = `settings.${path ? path + '.' : ''}${key}`;
    const currentPath = fullPath.substring(9);

    if (typeof value === 'boolean') {
      return (
        <div key={key} className="flex items-center justify-between">
          <Label htmlFor={`${block.id}-setting-${key}`} className="text-indigo-300 capitalize">{key.replace(/([A-Z])/g, ' $1')}</Label>
          <input
            type="checkbox"
            id={`${block.id}-setting-${key}`}
            checked={value}
            onChange={(e) => onSettingsChange(block.id, currentPath, e.target.checked)}
            className="form-checkbox h-5 w-5 text-yellow-400 bg-purple-600 border-purple-500 rounded focus:ring-yellow-300"
          />
        </div>
      );
    } else if (typeof value === 'number') {
       return (
        <div key={key} className="space-y-1">
          <Label htmlFor={`${block.id}-setting-${key}`} className="text-indigo-300 capitalize">{key.replace(/([A-Z])/g, ' $1')}</Label>
          <Input
            id={`${block.id}-setting-${key}`}
            type="number"
            value={value}
            onChange={(e) => onSettingsChange(block.id, currentPath, parseFloat(e.target.value))}
            className="bg-white/5 border-purple-500 text-white"
          />
        </div>
      );
    } else if (key.toLowerCase().includes('color')) {
      return (
        <div key={key} className="space-y-1">
          <Label htmlFor={`${block.id}-setting-${key}`} className="text-indigo-300 capitalize">{key.replace(/([A-Z])/g, ' $1')}</Label>
          <div className="flex items-center gap-2">
            <Input
              id={`${block.id}-setting-${key}-picker`}
              type="color"
              value={value || ''}
              onChange={(e) => onSettingsChange(block.id, currentPath, e.target.value)}
              className="w-10 h-8 p-0 border-none cursor-pointer bg-transparent"
            />
            <Input
              id={`${block.id}-setting-${key}-text`}
              type="text"
              value={value || ''}
              onChange={(e) => onSettingsChange(block.id, currentPath, e.target.value)}
              className="bg-white/5 border-purple-500 text-white flex-1"
              maxLength="7"
            />
          </div>
        </div>
      );
    } else if (key === 'layout' && block.type === 'ProductList') {
        return (
            <div key={key} className="space-y-1">
                <Label htmlFor={`${block.id}-setting-${key}`} className="text-indigo-300 capitalize">{key.replace(/([A-Z])/g, ' $1')}</Label>
                <Select value={value} onValueChange={(val) => onSettingsChange(block.id, currentPath, val)}>
                    <SelectTrigger className="bg-white/5 border-purple-500 text-white">
                        <SelectValue placeholder="Seleccionar diseño" />
                    </SelectTrigger>
                    <SelectContent className="bg-purple-700 border-yellow-400 text-white">
                        <SelectItem value="grid">Grid</SelectItem>
                        <SelectItem value="list">List</SelectItem>
                        <SelectItem value="carousel">Carousel</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        );
    }
     return (
      <div key={key} className="space-y-1">
        <Label htmlFor={`${block.id}-setting-${key}`} className="text-indigo-300 capitalize">{key.replace(/([A-Z])/g, ' $1')}</Label>
        <Input
          id={`${block.id}-setting-${key}`}
          type="text"
          value={value || ''}
          onChange={(e) => onSettingsChange(block.id, currentPath, e.target.value)}
          className="bg-white/5 border-purple-500 text-white"
        />
      </div>
    );
  };

  return (
    <div className="bg-purple-800/50 p-3 rounded-md border border-purple-600 space-y-3">
      <div className="flex items-center justify-center space-x-1 mb-2 border-b border-purple-600 pb-2">
        <Button 
            variant={activeTab === 'content' ? 'default': 'ghost'} 
            size="sm" 
            onClick={() => setActiveTab('content')}
            className={`flex-1 ${activeTab === 'content' ? 'bg-yellow-400 text-purple-700' : 'text-indigo-200 hover:bg-purple-700'}`}
        >
            <Edit3 className="h-4 w-4 mr-1.5"/> Contenido
        </Button>
        <Button 
            variant={activeTab === 'settings' ? 'default': 'ghost'} 
            size="sm" 
            onClick={() => setActiveTab('settings')}
            className={`flex-1 ${activeTab === 'settings' ? 'bg-yellow-400 text-purple-700' : 'text-indigo-200 hover:bg-purple-700'}`}
        >
            <Settings2 className="h-4 w-4 mr-1.5"/> Ajustes
        </Button>
      </div>

      {activeTab === 'content' && block.content && (
        <div className="space-y-2">
          {Object.entries(block.content).map(([key, value]) => renderContentField(key, value, ''))}
        </div>
      )}
      {activeTab === 'settings' && block.settings && (
        <div className="space-y-2">
          {Object.entries(block.settings).map(([key, value]) => renderSettingsField(key, value, ''))}
        </div>
      )}
       {activeTab === 'settings' && !block.settings && (
         <p className="text-sm text-indigo-400 text-center py-2">Este bloque no tiene ajustes específicos.</p>
       )}
    </div>
  );
};

export default BlockEditor;