import React, { useEffect } from 'react';
import { motion as Motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../components/ui/use-toast';

import HeroSection from '../components/home/HeroSection';
import PlansSection from '../components/home/PlansSection';
import ServicesSection from '../components/home/ServicesSection';
import TestimonialsSection from '../components/home/TestimonialsSection';
import FounderSection from '../components/home/FounderSection';
import HomeFooter from '../components/home/HomeFooter';

const HomePage = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const ctaLink = user?.plan_status === 'paid' ? "/dashboard" : user ? "/subscribe" : "/auth";

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
      <HeroSection ctaLink={ctaLink} />
      <PlansSection ctaLink={ctaLink} />
      <ServicesSection />
      <TestimonialsSection />
      <FounderSection />
      <HomeFooter />
    </Motion.main>
  );
};

export default HomePage;