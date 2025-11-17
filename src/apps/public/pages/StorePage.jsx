// src/apps/public/pages/StorePage.jsx
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion as Motion } from 'framer-motion';
import ProductsList from '../../shared/components/ProductsList';
import AIChatbot from '../../shared/components/AIChatbot';

const StorePage = () => {
  const [storeData, setStoreData] = useState(null);

  useEffect(() => {
    const fetchStore = async () => {
      try {
        const response = await fetch('https://api.mlpadigital.com/store/public-info');
        const data = await response.json();
        setStoreData(data);
      } catch (err) {
        console.error('Error al cargar datos de la tienda:', err);
      }
    };

    fetchStore();
  }, []);

  return (
    <>
      <Helmet>
        <title>Tienda - mlpadigital</title>
        <meta name="description" content="Explora nuestra colección de productos únicos." />
      </Helmet>

      <Motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-8"
      >
        <div className="text-center mb-12">
          <Motion.h1
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl font-extrabold tracking-tight text-white sm:text-6xl md:text-7xl"
          >
            Nuestra <span className="text-primary">Colección</span>
          </Motion.h1>
          <Motion.p
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-4 max-w-2xl mx-auto text-lg text-indigo-200"
          >
            Descubre productos diseñados para inspirar y potenciar tu creatividad.
          </Motion.p>
        </div>

        <ProductsList />
      </Motion.main>

      {storeData?.supportEnabled && (
        <AIChatbot storeId={storeData.slug} accentColor="#FDE047" primaryColor="#4338CA" />
      )}
    </>
  );
};

export default StorePage;