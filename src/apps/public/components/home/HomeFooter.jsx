import React from 'react';

const HomeFooter = () => {
  return (
    <footer className="relative z-10 py-10 px-4 sm:px-6 lg:px-8 text-center backdrop-blur-md bg-white/5 border-t border-white/10 shadow-inner">
      <p className="text-indigo-200 text-sm">
        &copy; {new Date().getFullYear()} <span className="font-semibold text-white">mlpadigital</span>. Todos los derechos reservados.
      </p>
      <p className="text-sm text-indigo-300 mt-2">
        Un producto de mentes creativas para emprendedores audaces. Hecho con 💜, mucho café y código de primera.
      </p>
    </footer>
  );
};

export default HomeFooter;