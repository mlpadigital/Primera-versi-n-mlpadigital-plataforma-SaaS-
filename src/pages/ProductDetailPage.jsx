import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useParams, Link } from 'react-router-dom';
import { Loader2, ArrowLeft, XCircle } from 'lucide-react';

function ProductDetailPage() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simulating loading state, then setting an error because the API is disconnected.
    const timer = setTimeout(() => {
      setError('La Tienda Online está desconectada. No se puede cargar el producto.');
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader2 className="h-16 w-16 text-white animate-spin" />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Producto no disponible - Nuestra Tienda</title>
        <meta name="description" content="Este producto no está disponible actualmente." />
      </Helmet>
      <div className="max-w-5xl mx-auto p-4">
        <Link to="/store" className="inline-flex items-center gap-2 text-white hover:text-primary transition-colors mb-6">
          <ArrowLeft size={16} />
          Volver a la tienda
        </Link>
        <div className="text-center text-red-400 p-8 glass-effect rounded-2xl">
          <XCircle className="mx-auto h-16 w-16 mb-4" />
          <p className="mb-6">{error || 'Error al cargar el producto.'}</p>
        </div>
      </div>
    </>
  );
}

export default ProductDetailPage;