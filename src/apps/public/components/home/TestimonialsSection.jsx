export default function TestimonialsSection() {
  const testimonials = [
    {
      name: 'Lucía G.',
      role: 'Emprendedora digital',
      quote: 'Con mlpadigital lancé mi primera tienda en minutos. El diseño y la facilidad son increíbles.',
      image: '/avatars/T1.png',
    },
    {
      name: 'Carlos M.',
      role: 'Reseller independiente',
      quote: 'La plataforma me permitió vender tiendas a mis clientes con marca blanca. ¡Es un game changer!',
      image: '/avatars/T3.png',
    },
    {
      name: 'Sofía R.',
      role: 'Agencia creativa',
      quote: 'La integración con IA y el soporte técnico son de otro nivel. mlpadigital es parte de nuestro stack.',
      image: '/avatars/T2.png',
    },
  ];

  return (
    <section className="py-20 px-6 md:px-16 lg:px-32 bg-[#0f0c29] text-white">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-5xl font-bold neon-glow pulse-glow mb-4">
          Historias de Éxito
        </h2>
        <p className="text-slate-300 text-lg floating-animation">
          Emprendedores, resellers y agencias ya están vendiendo con estilo. Esto es lo que dicen.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {testimonials.map((t, index) => (
          <div
            key={index}
            className="glass-effect rounded-xl p-6 shadow-xl border border-slate-800 hover:scale-105 transition duration-300 neon-glow text-center"
          >
            <div className="w-20 h-20 mx-auto mb-4 rounded-full overflow-hidden border-2 border-fuchsia-500 floating-animation">
              <img src={t.image} alt={t.name} className="w-full h-full object-cover" />
            </div>
            <p className="italic text-slate-300 mb-4">“{t.quote}”</p>
            <h3 className="text-lg font-semibold">{t.name}</h3>
            <p className="text-sm text-slate-400">{t.role}</p>
          </div>
        ))}
      </div>
    </section>
  );
}