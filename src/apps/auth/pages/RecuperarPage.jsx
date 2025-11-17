import { useState } from 'react';

export default function RecuperarPage() {
  const [email, setEmail] = useState('');
  const [enviado, setEnviado] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Aquí iría tu lógica de envío al backend
    // await axios.post('/api/auth/recuperar', { email });
    setEnviado(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white">
      <form
        onSubmit={handleSubmit}
        className="bg-black/30 backdrop-blur-md p-8 rounded-xl shadow-xl w-full max-w-md space-y-6"
      >
        <h1 className="text-2xl font-bold text-center">Recuperar contraseña</h1>

        {enviado ? (
          <p className="text-center text-green-400">
            Si el email está registrado, recibirás instrucciones para restablecer tu contraseña.
          </p>
        ) : (
          <>
            <label className="block mb-1">Email asociado a tu cuenta</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-lg bg-gray-900 text-white border border-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              className="w-full px-6 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 transition-all text-white font-semibold shadow-md"
            >
              Enviar instrucciones
            </button>
          </>
        )}
      </form>
    </div>
  );
}