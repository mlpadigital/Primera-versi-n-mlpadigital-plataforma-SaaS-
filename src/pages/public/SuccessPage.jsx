import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../../components/ui/button';
import { CheckCircle, ArrowRight } from 'lucide-react';

const SuccessPage = () => {
  return (
    <>
      <Helmet>
        <title>¡Compra Exitosa! - mlpadigital</title>
        <meta name="description" content="Tu pago ha sido procesado exitosamente." />
      </Helmet>
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
        className="flex-grow container mx-auto px-6 py-12 flex items-center justify-center"
      >
        <div className="text-center glass-effect p-10 rounded-2xl shadow-2xl max-w-2xl">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.2 }}
          >
            <CheckCircle className="mx-auto h-24 w-24 text-green-400" />
          </motion.div>
          <motion.h1 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-6 text-4xl font-extrabold tracking-tight text-white sm:text-5xl"
          >
            ¡Pago Exitoso!
          </motion.h1>
          <motion.p 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-4 text-lg text-indigo-200"
          >
            Gracias por tu compra. Hemos recibido tu pedido y lo estamos procesando. Recibirás una confirmación por correo electrónico en breve.
          </motion.p>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="mt-8"
          >
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Link to="/store">
                Seguir Comprando <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </motion.main>
    </>
  );
};

export default SuccessPage;