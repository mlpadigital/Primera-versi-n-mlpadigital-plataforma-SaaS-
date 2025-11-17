import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Loader2, Edit, Trash2, PlusCircle } from "lucide-react";
import { useToast } from "../components/ui/use-toast";
import { Button } from "../components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../components/ui/card";

const ProductsList = () => {
  const { storeId } = useParams();
  const { toast } = useToast();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Simulación de fetch (luego reemplazás con tu API real)
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/stores/${storeId}/products`
      );
      const result = await response.json();

      if (!response.ok) throw new Error("No se pudieron cargar los productos");

      setProducts(result.products || []);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error al cargar productos",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (storeId) fetchProducts();
  }, [storeId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-12 w-12 animate-spin text-indigo-400" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-yellow-400">Productos</h1>
        <Button
          className="bg-indigo-600 hover:bg-indigo-700 text-white"
          onClick={() => toast({ title: "Acción", description: "Crear producto" })}
        >
          <PlusCircle className="mr-2 h-5 w-5" />
          Nuevo Producto
        </Button>
      </div>

      {products.length === 0 ? (
        <p className="text-gray-400 text-lg">
          No hay productos en esta tienda todavía.
        </p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <Card
              key={product._id}
              className="glass-effect border-purple-500/50 shadow-lg"
            >
              <CardHeader>
                <CardTitle className="text-xl text-yellow-300">
                  {product.name}
                </CardTitle>
                <CardDescription className="text-indigo-300">
                  {product.category || "Sin categoría"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <img
                  src={product.imageUrl || "https://via.placeholder.com/300"}
                  alt={product.name}
                  className="w-full h-40 object-cover rounded-lg mb-4"
                />
                <p className="text-white font-semibold mb-2">
                  Precio: ${product.price}
                </p>
                <p className="text-gray-400 text-sm mb-4">
                  {product.description || "Sin descripción"}
                </p>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="text-white border-indigo-400 hover:bg-indigo-600 hover:text-white"
                    onClick={() =>
                      toast({
                        title: "Editar producto",
                        description: product.name,
                      })
                    }
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                  <Button
                    variant="outline"
                    className="text-red-400 border-red-400 hover:bg-red-600 hover:text-white"
                    onClick={() =>
                      toast({
                        title: "Eliminar producto",
                        description: product.name,
                      })
                    }
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Eliminar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductsList;