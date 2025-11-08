import React from 'react';
import { Button } from "../../../components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../../../components/ui/card";
import { Edit2, Trash2, Image as ImageIcon, PackageSearch, PlusCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ProductList = ({ products, handleEdit, handleDelete, actionLoading, openFormForNewProduct }) => {
  if (products.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-16 bg-white/5 rounded-lg shadow-xl"
      >
        <PackageSearch className="h-24 w-24 text-yellow-400 mx-auto mb-6" />
        <h2 className="text-2xl font-semibold text-yellow-300 mb-3">No hay productos todavía</h2>
        <p className="text-indigo-200 mb-6">Empieza añadiendo tu primer producto para mostrarlo en tu tienda.</p>
        <Button onClick={openFormForNewProduct} className="bg-yellow-400 text-purple-700 hover:bg-yellow-500 font-semibold">
          <PlusCircle className="mr-2 h-5 w-5" /> Añadir mi Primer Producto
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <AnimatePresence>
        {products.map(product => (
          <motion.div
            key={product.id}
            layout
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="glass-effect border-purple-500/50 hover:shadow-purple-400/30 transition-all duration-300 flex flex-col h-full">
              <CardHeader>
                {product.image_url ? (
                  <img src={product.image_url} alt={product.name} className="w-full h-48 object-cover rounded-t-lg mb-4 border-b border-purple-400" />
                ) : (
                  <div className="w-full h-48 bg-purple-700/50 flex items-center justify-center rounded-t-lg mb-4 border-b border-purple-400">
                    <ImageIcon className="h-16 w-16 text-indigo-300" />
                  </div>
                )}
                <CardTitle className="text-xl text-yellow-400 truncate" title={product.name}>{product.name}</CardTitle>
                <CardDescription className="text-indigo-300 text-sm h-10 overflow-hidden text-ellipsis">
                  {product.description || "Sin descripción"}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-lg font-semibold text-yellow-200">{product.price} {product.currency}</p>
                <p className="text-sm text-indigo-300">Categoría: {product.category || "N/A"}</p>
                <p className="text-sm text-indigo-300">Stock: {product.stock_quantity ?? "N/A"}</p>
              </CardContent>
              <CardFooter className="flex justify-end gap-2 pt-4 border-t border-purple-500/30">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleEdit(product)} 
                  className="text-white hover:bg-white/10 border-purple-400 flex items-center" 
                  disabled={actionLoading}
                >
                  {actionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Edit2 className="h-4 w-4" />}
                  <span className="ml-1">Editar</span>
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={() => handleDelete(product.id, product.name)} 
                  className="flex items-center"
                  disabled={actionLoading}
                >
                   {actionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                  <span className="ml-1">Eliminar</span>
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ProductList;