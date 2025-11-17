// src/apps/public/components/home/PlansSection.jsx
import { useState } from 'react';
import { motion as Motion } from 'framer-motion';
import GlowButton from '../../../shared/components/ui/GlowButton';
import UserFormModal from '../../../shared/modals/UserFormModal';

const plans = [
  {
    title: 'Emprendedor',
    price: '$8.00 USD',
    description: 'Ideal para quienes recién comienzan a vender.',
    features: [
      'Soporte de distribuidor dedicado',
      'Carga de productos con imágenes',
      'Base de pagos integrada',
    ],
    accentClass: 'text-fuchsia-500',
  },
  {
    title: 'Escalable',
    price: 'Próximamente',
    description: 'Pensado para quienes quieren crecer con múltiples tiendas.',
    features: [
      'Multi-tienda desde un solo panel',
      'Estadísticas y trazabilidad',
      'Integración con IA para gestión',
    ],
    accentClass: 'text-indigo-500',
  },
  {
    title: 'Reseller PRO',
    price: 'Próximamente',
    description: 'Para distribuidores y agencias que venden tiendas.',
    features: [
      'Panel reseller con control total',
      'Marca blanca y personalización',
      'Soporte prioritario y auditoría',
    ],
    accentClass: 'text-cyan-400',
  },
];

export default function PlansSection() {
  const [selectedPlan, setSelectedPlan] = useState('');
  const [showModal, setShowModal] = useState(false);

  const openModal = (planTitle) => {
    setSelectedPlan(planTitle);
    setShowModal(true);
  };

  return (
    <section className="py-20 px-6 md:px-16 lg:px-32 bg-[#0f0c29] text-white">
      <div className="text-center mb-12">
        <Motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-5xl font-bold neon-glow pulse-glow mb-4"
        >
          Planes y Precios Flexibles
        </Motion.h2>
        <Motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-slate-300 text-lg floating-animation"
        >
          Empieza ahora por solo $8.00. Sin tarifas ocultas, sé miembro y empezá a vender.
        </Motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan, index) => (
          <Motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.2 }}
            className="glass-effect rounded-xl p-6 shadow-xl border border-slate-800 hover:scale-105 transition duration-300 neon-glow"
          >
            <h3 className={`text-2xl font-semibold mb-2 ${plan.accentClass}`}>
              {plan.title}
            </h3>
            <p className="text-xl font-bold mb-4">{plan.price}</p>
            <p className="text-slate-400 mb-4">{plan.description}</p>
            <ul className="text-sm text-slate-300 space-y-2 mb-6">
              {plan.features.map((feature, i) => (
                <li key={i}>✅ {feature}</li>
              ))}
            </ul>
            <GlowButton onClick={() => openModal(plan.title)}>
              Elegir este plan
            </GlowButton>
          </Motion.div>
        ))}
      </div>

      <UserFormModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        selectedPlan={selectedPlan}
      />
    </section>
  );
}