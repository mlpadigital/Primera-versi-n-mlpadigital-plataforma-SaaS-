import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import ProductsList from '../../components/ProductsList';

const StorePage = () => {
  return (
    <>
      <Helmet>
        <title>Tienda - mlpadigital</title>
        <meta name="description" content="Explora nuestra colección de productos únicos." />
      </Helmet>
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-8"
      >
        <div className="text-center mb-12">
          <motion.h1 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl font-extrabold tracking-tight text-white sm:text-6xl md:text-7xl"
          >
            Nuestra <span className="text-primary">Colección</span>
          </motion.h1>
          <motion.p 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-4 max-w-2xl mx-auto text-lg text-indigo-200"
          >
            Descubre productos diseñados para inspirar y potenciar tu creatividad.
          </motion.p>
        </div>
        <ProductsList />
      </motion.main>
    </>
  );
};

export default StorePage;