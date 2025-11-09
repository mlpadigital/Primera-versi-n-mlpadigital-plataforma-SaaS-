import { useState } from 'react';
import GlowButton from '../ui/GlowButton';
import UserFormModal from '../modals/UserFormModal';

export default function HeroSection() {
  const [showModal, setShowModal] = useState(false);

  return (
    <section className="min-h-screen flex flex-col justify-center items-center text-center px-6 md:px-16 lg:px-32 bg-[#0f0c29] text-white">
      <h1 className="text-4xl md:text-6xl font-bold mb-6 neon-glow pulse-glow">
        Crea tu tienda online en minutos
      </h1>
      <p className="text-lg md:text-xl text-slate-300 mb-8 floating-animation max-w-2xl">
        mlpadigital es la plataforma SaaS que te permite lanzar, escalar y revender tiendas con estilo futurista, trazabilidad y sin complicaciones.
      </p>

      <GlowButton onClick={() => setShowModal(true)}>
        🛍️ Crear Mi Tienda Ahora
      </GlowButton>

      <UserFormModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        selectedPlan=""
      />
    </section>
  );
}