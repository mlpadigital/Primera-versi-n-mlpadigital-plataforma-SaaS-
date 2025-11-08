export default function PlansSection() {
  const plans = [
    {
      title: 'Emprendedor',
      price: '$8.00 USD',
      description: 'Idea básica pensada para emprendedores que recién comienzan.',
      features: [
        'Soporte de distribuidor dedicado',
        'Carga de productos con imágenes',
        'Base de pagos integrada',
      ],
      accent: 'fuchsia-500',
    },
    {
      title: 'Escalable',
      price: /*'$9.90 USD'*/"",
      description: 'Ideal para quienes quieren crecer con múltiples tiendas.',
      features: [
        'Multi-tienda desde un solo panel',
        'Estadísticas y trazabilidad',
        'Integración con IA para gestión',
      ],
      accent: 'indigo-500',
    },
    {
      title: 'Reseller PRO',
      price:"" /*'$19.90 USD'*/,
      description: 'Pensado para distribuidores y agencias que venden tiendas.',
      features: [
        'Panel reseller con control total',
        'Marca blanca y personalización',
        'Soporte prioritario y auditoría',
      ],
      accent: 'cyan-400',
    },
  ];

  return (
    <section className="py-20 px-6 md:px-16 lg:px-32 bg-[#0f0c29] text-white">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-5xl font-bold neon-glow pulse-glow mb-4">
          Planes y Precios Flexibles
        </h2>
        <p className="text-slate-300 text-lg floating-animation">
          Empieza ahora por solo $8.00. Sin tarifas ocultas, se miembro y empezar a vender.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan, index) => (
          <div
            key={index}
            className={`glass-effect rounded-xl p-6 shadow-xl border border-slate-800 hover:scale-105 transition duration-300 neon-glow`}
          >
            <h3 className={`text-2xl font-semibold text-${plan.accent} mb-2`}>
              {plan.title}
            </h3>
            <p className="text-xl font-bold mb-4">{plan.price}</p>
            <p className="text-slate-400 mb-4">{plan.description}</p>
            <ul className="text-sm text-slate-300 space-y-2 mb-6">
              {plan.features.map((feature, i) => (
                <li key={i}>✅ {feature}</li>
              ))}
            </ul>
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-full pulse-glow transition">
              Elegir este plan
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}