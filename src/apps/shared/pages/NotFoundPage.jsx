import React from 'react';
import { Helmet } from 'react-helmet';
import { motion as Motion } from 'framer-motion';
import ErrorMessage from '../components/ErrorMessage';

const NotFoundPage = () => {
  return (
    <>
      <Helmet>
        <title>Página no encontrada - mlpadigital</title>
        <meta name="description" content="La página que buscás no existe o fue movida." />
      </Helmet>

      <Motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
        className="flex-grow container mx-auto px-6 py-12 flex items-center justify-center"
      >
        <ErrorMessage
          title="404 - Página no encontrada"
          description="La página que buscás no existe o fue movida. Verificá la URL o volvé al inicio."
          ctaText="Volver al Inicio"
          ctaLink="/"
        />
      </Motion.main>
    </>
  );
};

export default NotFoundPage;