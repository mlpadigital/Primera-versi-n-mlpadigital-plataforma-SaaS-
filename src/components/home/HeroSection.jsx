export default function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white py-20 px-6 md:px-16 lg:px-32 rounded-xl glass-effect shadow-xl overflow-hidden">
      {/* Avatar flotante del fundador */}
      <div className="absolute top-8 left-8 w-24 h-24 rounded-full overflow-hidden border-2 border-fuchsia-500 neon-glow floating-animation z-10">
        <img
          src="/avatars/MD.png"
          alt="Martín"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Contenido central */}
      <div className="text-center max-w-3xl mx-auto z-20 relative">
        <h1 className="text-4xl md:text-6xl font-extrabold neon-glow pulse-glow mb-6 leading-tight">
          Tu IMPERIO ONLINE<br />Comienza Aquí
        </h1>
        <p className="text-lg md:text-xl text-slate-300 mb-8 floating-animation">
          Crea, gestiona y haz crecer múltiples tiendas online desde una única plataforma poderosa y con estilo. ¡Tu éxito es nuestro código!
        </p>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-full neon-glow pulse-glow transition transform hover:scale-105">
          🛍️ Crear Mi Tienda Ahora
        </button>
      </div>

      {/* Decoración visual opcional */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-40 h-40 bg-pink-500 opacity-20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-500 opacity-20 rounded-full blur-2xl animate-pulse"></div>
      </div>
    </section>
  );
}