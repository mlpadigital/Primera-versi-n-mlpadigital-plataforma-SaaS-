import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion as Motion } from 'framer-motion';
import { Button } from '../../shared/components/ui/button';
import { CheckCircle, ArrowRight } from 'lucide-react';
import SuccessMessage from '../../shared/components/SuccessMessage';
import axios from 'axios';

const SuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const frecuencia = params.get('frecuencia');
    const dias = frecuencia === 'mensual' ? 30
                : frecuencia === 'trimestral' ? 90
                : frecuencia === 'anual' ? 365
                : 30;

    const fecha_inicio = new Date();
    const proximo_pago = new Date(fecha_inicio);
    proximo_pago.setDate(proximo_pago.getDate() + dias);

    const cliente = {
      nombre: params.get('nombre'),
      email: params.get('email'),
      tienda: params.get('tienda'),
      tipo: params.get('tipo'),
      frecuencia,
      moneda: params.get('moneda'),
      pais: params.get('pais') || 'Argentina',
      telefono: params.get('telefono') || '',
      estado_pago: 'pagado',
      plan_status: 'activo',
      fecha_inicio,
      proximo_pago,
    };

    axios.post(`${import.meta.env.VITE_API_URL}/api/clientes/crear`, cliente)
      .then(() => {
        navigate(`/usuario/${cliente.tienda}`);
      })
      .catch((err) => {
        console.error('Error al guardar cliente:', err);
      });
  }, []);

  return (
    <>
      <Helmet>
        <title>¡Compra Exitosa! - mlpadigital</title>
        <meta name="description" content="Tu pago ha sido procesado exitosamente." />
      </Helmet>
      <Motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
        className="flex-grow container mx-auto px-6 py-12 flex items-center justify-center"
      >
        <SuccessMessage
          title="¡Pago Exitoso!"
          description="Gracias por tu compra. Hemos recibido tu pedido y lo estamos procesando."
          ctaText="Seguir Comprando"
          ctaLink="/store"
        />
        <div className="text-center glass-effect p-10 rounded-2xl shadow-2xl max-w-2xl">
          <Motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.2 }}
          >
            <CheckCircle className="mx-auto h-24 w-24 text-green-400" />
          </Motion.div>
          <Motion.h1
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-6 text-4xl font-extrabold tracking-tight text-white sm:text-5xl"
          >
            ¡Pago Exitoso!
          </Motion.h1>
          <Motion.p
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-4 text-lg text-indigo-200"
          >
            Gracias por tu compra. Hemos recibido tu pedido y lo estamos procesando. Recibirás una confirmación por correo electrónico en breve.
          </Motion.p>
          <Motion.div
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
          </Motion.div>
        </div>
      </Motion.main>
    </>
  );
};

export default SuccessPage;