
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Button } from "../../components/ui/button";
import { Dialog, DialogTrigger } from "../../components/ui/dialog";
import { useToast } from "../../components/ui/use-toast";
//import { supabase } from './lib/customSupabaseClient';
import { PlusCircle, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import ProductForm from './product-management/ProductForm';
import ProductList from './product-management/ProductList';
import { initialProductData as defaultInitialProductData } from './product-management/productConstants';

const isValidUUID = (uuid) => {
  if (!uuid) return false;
  const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
  return uuidRegex.test(uuid);
};

const ProductManagementPage = () => {
  const params = useParams();
  const storeId = params.storeId; 
  const reactRouterLocation = useLocation();
  const { toast } = useToast();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  
  const [productData, setProductData] = useState(defaultInitialProductData);
  const [imagePreview, setImagePreview] = useState(null);

  const fetchProducts = useCallback(async () => {
    if (!isValidUUID(storeId)) {
      setLoading(false);
      toast({ title: "Error Crítico de ID", description: "El ID de la tienda no es válido o no está disponible. No se pueden cargar productos.", variant: "destructive", duration: 7000 });
      setProducts([]);
      return;
    }
    setLoading(true);
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session?.user) {
      toast({ title: "Error de autenticación", description: "No se pudo verificar el usuario.", variant: "destructive" });
      setLoading(false);
      return;
    }
    const userId = sessionData.session.user.id;

    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('store_id', storeId)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      toast({ title: "Error al cargar productos", description: error.message, variant: "destructive" });
    } else {
      setProducts(data || []);
    }
    setLoading(false);
  }, [storeId, toast]);

  useEffect(() => {
    if (isValidUUID(storeId)) {
      fetchProducts();
    } else {
      setLoading(false);
      setProducts([]);
      if (reactRouterLocation.pathname.includes('/products')) {
        toast({ title: "Advertencia de ID de Tienda", description: "El ID de la tienda en la URL no es válido. La carga de productos ha fallado.", variant: "destructive", duration: 7000 });
      }
    }
  }, [storeId, fetchProducts, toast, reactRouterLocation.pathname]);

  const resetForm = (keepOpen = false) => {
    setProductData(defaultInitialProductData);
    setImagePreview(null);
    setEditingProduct(null);
    if (!keepOpen) {
      setIsFormOpen(false);
    }
  };

  const handleSubmit = async (e, closeAfterSave = true) => {
    e.preventDefault();
    if (!isValidUUID(storeId)) {
      toast({ title: "Error Crítico de ID", description: "ID de tienda no válido. No se puede guardar el producto.", variant: "destructive", duration: 7000 });
      return;
    }
    setActionLoading(true);

    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session?.user) {
      toast({ title: "Error de autenticación", description: "No se pudo verificar el usuario.", variant: "destructive" });
      setActionLoading(false);
      return;
    }
    const userId = sessionData.session.user.id;

    let imageUrl = editingProduct?.image_url || productData.image_url;

    if (productData.image_file) {
      const file = productData.image_file;
      const fileName = `${userId}/${storeId}/${Date.now()}_${file.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('product_images')
        .upload(fileName, file);

      if (uploadError) {
        toast({ title: "Error al subir imagen", description: uploadError.message, variant: "destructive" });
        setActionLoading(false);
        return;
      }
      
      const { data: publicUrlData } = supabase.storage.from('product_images').getPublicUrl(uploadData.path);
      imageUrl = publicUrlData.publicUrl;
    }

    const productPayload = {
      name: productData.name,
      description: productData.description,
      price: parseFloat(productData.price),
      currency: productData.currency,
      category: productData.category,
      stock_quantity: parseInt(productData.stock_quantity, 10) || 0,
      image_url: imageUrl,
      store_id: storeId,
      user_id: userId,
      status: 'active', 
    };
    
    let success = false;
    if (editingProduct) {
      const { data, error } = await supabase
        .from('products')
        .update(productPayload)
        .eq('id', editingProduct.id)
        .eq('user_id', userId)
        .eq('store_id', storeId)
        .select();
      if (error) {
        toast({ title: "Error al actualizar producto", description: error.message, variant: "destructive" });
      } else if (data && data.length > 0) {
        toast({ title: "Producto Actualizado", description: `"${data[0].name}" ha sido actualizado.` });
        success = true;
      }
    } else {
      const { data, error } = await supabase
        .from('products')
        .insert(productPayload)
        .select();
      if (error) {
        toast({ title: "Error al crear producto", description: error.message, variant: "destructive" });
      } else if (data && data.length > 0) {
        toast({ title: "Producto Creado", description: `"${data[0].name}" ha sido añadido.`, className: "bg-green-500 text-white" });
        success = true;
      }
    }

    if (success) {
      await fetchProducts();
      if (closeAfterSave) {
        resetForm(false);
      } else {
        resetForm(true); 
      }
    }
    setActionLoading(false);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setProductData({
      name: product.name,
      description: product.description || '',
      price: product.price.toString(),
      currency: product.currency || 'USD',
      category: product.category || '',
      stock_quantity: product.stock_quantity?.toString() || '',
      image_file: null,
      image_url: product.image_url,
    });
    setImagePreview(product.image_url);
    setIsFormOpen(true);
  };

  const handleDelete = async (productId, productName) => {
    if (!isValidUUID(storeId)) {
      toast({ title: "Error Crítico de ID", description: "ID de tienda no válido. No se puede eliminar el producto.", variant: "destructive", duration: 7000 });
      return;
    }
    if (window.confirm(`¿Estás seguro de que quieres eliminar el producto "${productName}"?`)) {
      setActionLoading(true);
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session?.user) {
        toast({ title: "Error de autenticación", variant: "destructive" });
        setActionLoading(false);
        return;
      }
      const userId = sessionData.session.user.id;

      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId)
        .eq('user_id', userId)
        .eq('store_id', storeId); 
      
      setActionLoading(false);
      if (error) {
        toast({ title: "Error al eliminar producto", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Producto Eliminado", description: `"${productName}" ha sido eliminado.` });
        fetchProducts();
      }
    }
  };

  const openFormForNewProduct = () => {
    resetForm(true); 
    setIsFormOpen(true);
  };


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-4 md:p-8 h-full overflow-y-auto"
    >
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-yellow-300">Gestión de Productos</h1>
        <Dialog open={isFormOpen} onOpenChange={(open) => { setIsFormOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="bg-yellow-400 text-purple-700 hover:bg-yellow-500 font-semibold" onClick={openFormForNewProduct} disabled={!isValidUUID(storeId)}>
              <PlusCircle className="mr-2 h-5 w-5" /> Añadir Producto
            </Button>
          </DialogTrigger>
          <ProductForm 
            isOpen={isFormOpen}
            onOpenChange={setIsFormOpen}
            productData={productData}
            setProductData={setProductData}
            editingProduct={editingProduct}
            handleSubmit={handleSubmit}
            actionLoading={actionLoading}
            resetForm={resetForm}
            imagePreview={imagePreview}
            setImagePreview={setImagePreview}
          />
        </Dialog>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-12 w-12 animate-spin text-yellow-400" />
        </div>
      ) : !isValidUUID(storeId) ? (
         <div className="text-center py-10">
            <h2 className="text-2xl font-semibold text-red-400">ID de Tienda Inválido</h2>
            <p className="text-indigo-200">No se puede gestionar productos sin un ID de tienda válido en la URL.</p>
          </div>
      ) : (
        <ProductList 
          products={products}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          actionLoading={actionLoading}
          openFormForNewProduct={openFormForNewProduct}
        />
      )}
    </motion.div>
  );
};

export default ProductManagementPage;
