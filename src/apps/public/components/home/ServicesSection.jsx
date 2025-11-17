import { motion as Motion } from 'framer-motion';

export default function ServicesSection() {
  const services = [
    {
      title: 'Multi-tienda desde un solo panel',
      description: 'Gestioná múltiples tiendas online desde una única interfaz centralizada, con trazabilidad total.',
      icon: '🧭',
      accentClass: 'text-indigo-500',
    },
    {
      title: 'Carga masiva de productos',
      description: 'Subí cientos de productos con imágenes, precios y categorías en segundos.',
      icon: '📦',
      accentClass: 'text-fuchsia-500',
    },
    {
      title: 'Pagos integrados',
      description: 'Recibí pagos con tarjeta, QR o transferencias sin configurar nada adicional.',
      icon: '💳',
      accentClass: 'text-cyan-400',
    },
    {
      title: 'Soporte con IA',
      description: 'Automatizá respuestas, gestión y auditoría con inteligencia artificial integrada.',
      icon: '🤖',
      accentClass: 'text-emerald-400',
    },
  ];

  return (
    <section className="py-20 px-6 md:px-16 lg:px-32 bg-[#0f0c29] text-white">
      <div className="text-center mb-12">
        <Motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-5xl font-bold neon-glow pulse-glow mb-4"
        >
          Servicios que Impulsan tu Tienda
        </Motion.h2>
        <Motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-slate-300 text-lg floating-animation"
        >
          Todo lo que necesitás para vender, escalar y automatizar desde una sola plataforma.
        </Motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {services.map((service, index) => (
          <Motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.2 }}
            className="glass-effect rounded-xl p-6 shadow-xl border border-slate-800 hover:scale-105 transition duration-300 neon-glow"
          >
            <div className={`text-4xl mb-4 ${service.accentClass}`}>{service.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
            <p className="text-slate-400">{service.description}</p>
          </Motion.div>
        ))}
      </div>
    </section>
  );
}