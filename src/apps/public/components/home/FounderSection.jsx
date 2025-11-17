// src/apps/public/components/home/FounderSection.jsx
export default function FounderSection() {
  return (
    <section className="py-20 px-6 md:px-16 lg:px-32 bg-[#0f0c29] text-white">
      <div className="max-w-4xl mx-auto text-center">
        <div className="w-24 h-24 mx-auto mb-6 rounded-full overflow-hidden border-2 border-fuchsia-500 neon-glow floating-animation">
          <img
            src="/avatars/mio.jpg"
            alt="Martín"
            className="w-full h-full object-cover"
          />
        </div>
        <h2 className="text-3xl md:text-5xl font-bold neon-glow pulse-glow mb-4">
          El Fundador
        </h2>
        <p className="text-slate-300 text-lg mb-6 floating-animation">
          Soy Martín, arquitecto de plataformas SaaS modulares con IA. mlpadigital nace de mi visión de empoderar emprendedores con tecnología potente, trazable y visualmente impactante.
        </p>
        <p className="text-slate-400 text-sm italic">
          “Cada tienda que creás con mlpadigital es una extensión de tu marca. Mi misión es que se vea, funcione y escale como vos soñás.”
        </p>
      </div>
    </section>
  );
}