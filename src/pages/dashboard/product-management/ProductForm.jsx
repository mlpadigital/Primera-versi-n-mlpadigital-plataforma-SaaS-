import React from 'react';
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Textarea } from "../../../components/ui/textarea";
import { Label } from "../../../components/ui/label";
import { DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "../../../components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from "../../../components/ui/select";
import { Loader2, Save, CheckCircle, Image as ImageIcon } from 'lucide-react';
import { currencies } from './productConstants';

const ProductForm = ({ 
  isOpen,
  onOpenChange, 
  productData, 
  setProductData,
  editingProduct, 
  handleSubmit, 
  actionLoading, 
  resetForm,
  imagePreview,
  setImagePreview
}) => {

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductData(prev => ({ ...prev, [name]: value }));
  };

  const handleCurrencyChange = (value) => {
    setProductData(prev => ({ ...prev, currency: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validImageTypes = ['image/jpeg', 'image/png', 'image/tiff', 'image/webp', 'image/gif'];
      if (validImageTypes.includes(file.type)) {
        setProductData(prev => ({ ...prev, image_file: file, image_url: URL.createObjectURL(file) }));
        setImagePreview(URL.createObjectURL(file));
      } else {
        alert("Por favor, selecciona un archivo de imagen válido (jpg, png, tif, webp, gif).");
        e.target.value = null; 
        setProductData(prev => ({ ...prev, image_file: null, image_url: editingProduct?.image_url || null }));
        setImagePreview(editingProduct?.image_url || null);
      }
    } else {
      setProductData(prev => ({ ...prev, image_file: null, image_url: editingProduct?.image_url || null }));
      setImagePreview(editingProduct?.image_url || null);
    }
  };

  return (
      <DialogContent className="sm:max-w-[600px] bg-purple-900/80 backdrop-blur-md border-yellow-500 text-white">
        <DialogHeader>
          <DialogTitle className="text-yellow-400 text-2xl">{editingProduct ? "Editar Producto" : "Añadir Nuevo Producto"}</DialogTitle>
          <DialogDescription className="text-indigo-300">
            {editingProduct ? "Actualiza los detalles de tu producto." : "Completa la información para añadir un nuevo producto a tu tienda."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={(e) => handleSubmit(e, true)} className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
          <div>
            <Label htmlFor="name" className="text-indigo-200">Nombre del Producto</Label>
            <Input id="name" name="name" value={productData.name} onChange={handleInputChange} required className="bg-white/10 border-purple-400 text-white placeholder-indigo-300" />
          </div>
          <div>
            <Label htmlFor="description" className="text-indigo-200">Descripción</Label>
            <Textarea id="description" name="description" value={productData.description} onChange={handleInputChange} className="bg-white/10 border-purple-400 text-white placeholder-indigo-300" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price" className="text-indigo-200">Precio</Label>
              <Input id="price" name="price" type="number" step="0.01" value={productData.price} onChange={handleInputChange} required className="bg-white/10 border-purple-400 text-white placeholder-indigo-300" />
            </div>
            <div>
              <Label htmlFor="currency" className="text-indigo-200">Moneda</Label>
              <Select name="currency" value={productData.currency} onValueChange={handleCurrencyChange}>
                <SelectTrigger className="bg-white/10 border-purple-400 text-white">
                  <SelectValue placeholder="Selecciona moneda" />
                </SelectTrigger>
                <SelectContent className="bg-purple-800 border-yellow-500 text-white">
                  <SelectGroup>
                    <SelectLabel className="text-indigo-300">Monedas Disponibles</SelectLabel>
                    {currencies.map(c => <SelectItem key={c.value} value={c.value} className="hover:bg-yellow-400/20 focus:bg-yellow-400/30">{c.label}</SelectItem>)}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category" className="text-indigo-200">Categoría</Label>
              <Input id="category" name="category" value={productData.category} onChange={handleInputChange} className="bg-white/10 border-purple-400 text-white placeholder-indigo-300" />
            </div>
            <div>
              <Label htmlFor="stock_quantity" className="text-indigo-200">Cantidad en Stock</Label>
              <Input id="stock_quantity" name="stock_quantity" type="number" value={productData.stock_quantity} onChange={handleInputChange} className="bg-white/10 border-purple-400 text-white placeholder-indigo-300" />
            </div>
          </div>
          <div>
            <Label htmlFor="image_file" className="text-indigo-200">Imagen del Producto</Label>
            <Input 
              id="image_file" 
              name="image_file" 
              type="file" 
              accept="image/jpeg,image/png,image/tiff,image/webp,image/gif" 
              onChange={handleImageChange} 
              className="bg-white/10 border-purple-400 text-white file:text-indigo-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-600 hover:file:bg-purple-500" 
            />
            {imagePreview ? (
              <div className="mt-4 p-2 border border-purple-400 rounded-md inline-block bg-white/5">
                <img 
                  src={imagePreview} 
                  alt="Vista previa del producto" 
                  className="w-[150px] h-[150px] object-cover rounded" 
                />
              </div>
            ) : (
                 <div className="mt-4 p-2 border border-dashed border-purple-400 rounded-md inline-flex justify-center items-center bg-white/5 w-[150px] h-[150px]">
                    <ImageIcon className="w-12 h-12 text-indigo-300" />
                 </div>
            )}
          </div>
          <DialogFooter className="sm:justify-between">
            <Button type="button" variant="outline" onClick={() => { resetForm(false); if(onOpenChange) onOpenChange(false); }} className="text-white hover:bg-white/10 border-purple-400" disabled={actionLoading}>Cancelar</Button>
            <div className="flex flex-col sm:flex-row gap-2 mt-2 sm:mt-0">
              {!editingProduct && (
                <Button type="button" onClick={(e) => handleSubmit(e, false)} className="bg-green-500 text-white hover:bg-green-600" disabled={actionLoading}>
                  {actionLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
                  Guardar y Añadir Otro
                </Button>
              )}
               <Button type="submit" className="bg-yellow-400 text-purple-700 hover:bg-yellow-500" disabled={actionLoading}>
                {actionLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                {editingProduct ? "Guardar Cambios" : "Guardar y Cerrar"}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
  );
};

export default ProductForm;