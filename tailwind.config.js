/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  safelist: [
    'text-fuchsia-500',
    'text-indigo-500',
    'text-cyan-400',
    'text-emerald-400',
    'glass-effect',
    'neon-glow',
    'pulse-glow',
    'floating-animation',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#8B5CF6',
          secondary: '#F59E0B',
          background: '#0f0c29',
          accent: '#F472B6',
        },
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
      keyframes: {
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-15px)' },
        },
        'pulse-glow': {
          '0%, 100%': {
            boxShadow: '0 0 15px rgba(79, 70, 229, 0.4)',
          },
          '50%': {
            boxShadow: '0 0 30px rgba(79, 70, 229, 0.8)',
          },
        },
      },
      animation: {
        'pulse-glow': 'pulse-glow 2.5s infinite',
        'floating-animation': 'float 6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
