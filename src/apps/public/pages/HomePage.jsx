// src/apps/public/pages/HomePage.jsx
import React, { useEffect } from 'react';
import { motion as Motion } from 'framer-motion';
import useAuth from '../../shared/hooks/useAuth';
import { useToast } from '../../shared/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

// Secciones modulares
import HeroSection from '../components/home/HeroSection';
import PlansSection from '../components/home/PlansSection';
import ServicesSection from '../components/home/ServicesSection';
import TestimonialsSection from '../components/home/TestimonialsSection';
import FounderSection from '../components/home/FounderSection';
import HomeFooter from '../components/home/HomeFooter';

const HomePage = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  const ctaLink = user?.plan_status === 'paid'
    ? "/dashboard"
    : user
    ? "/subscribe"
    : "/auth";

  useEffect(() => {
    toast({
      title: "¡Bienvenido/a a mlpadigital!",
      description: "Tu plataforma multiservicios potenciada, lista para el éxito.",
      duration: 5000,
    });
  }, [toast]);

  return (
    <Motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="flex-grow bg-[#0f0c29] text-white overflow-x-hidden"
    >
      {/* Botón fijo arriba a la derecha */}
      {!user && (
        <div className="absolute top-6 right-6 z-50">
          <button
            onClick={() => navigate('/login')}
            className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 transition-all text-white font-semibold shadow-lg hover:scale-105 active:scale-95"
          >
            Ingresar como usuario
          </button>
        </div>
      )}


      <HeroSection ctaLink={ctaLink} />
      <PlansSection ctaLink={ctaLink} />
      <ServicesSection />
      <TestimonialsSection />
      <FounderSection />

      {/* Botón de ingreso si no hay sesión */}
      {!user && (
        <div className="flex justify-center my-10">
          <button
            onClick={() => navigate('/login')}
            className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 transition-all text-white font-semibold shadow-lg hover:scale-105 active:scale-95"
          >
            Ingresar como usuario
          </button>
        </div>
      )}

      <HomeFooter />
    </Motion.main>
  );
};

export default HomePage;