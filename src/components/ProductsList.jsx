import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

const ProductsList = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simulating loading state, then setting an error because the API is disconnected.
    const timer = setTimeout(() => {
      setError('La Tienda Online está desconectada.');
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-16 w-16 text-white animate-spin" />
      </div>
    );
  }

  return (
    <div className="text-center text-gray-400 p-8">
      <p>{error || 'No hay productos disponibles en este momento.'}</p>
    </div>
  );
};

export default ProductsList;