import React from 'react';
import { Helmet } from 'react-helmet';
import { motion as Motion } from 'framer-motion';
import SuccessMessage from '../../../shared/components/SuccessMessage';

const RegistrationSuccessPage = () => {
  return (
    <>
      <Helmet>
        <title>¡Registro Exitoso! - mlpadigital</title>
        <meta name="description" content="Tu cuenta ha sido creada correctamente." />
      </Helmet>

      <Motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
        className="flex-grow container mx-auto px-6 py-12 flex items-center justify-center"
      >
        <SuccessMessage
          title="¡Registro Exitoso!"
          description="Tu cuenta ha sido creada correctamente. Ya podés iniciar sesión y comenzar a configurar tu tienda."
          ctaText="Iniciar Sesión"
          ctaLink="/auth"
        />
      </Motion.main>
    </>
  );
};

export default RegistrationSuccessPage;