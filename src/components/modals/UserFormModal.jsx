import axios from 'axios';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { motion as Motion } from 'framer-motion';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const schema = yup.object().shape({
  nombre: yup.string().required('Nombre obligatorio'),
  email: yup.string().email('Email inválido').required('Email obligatorio'),
  tienda: yup.string().required('Nombre de tienda obligatorio'),
  tipo: yup.string().required('Seleccioná un tipo de cliente'),
});

export default function UserFormModal({ isOpen, onClose, selectedPlan }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { tipo: selectedPlan || '' },
  });

  const onSubmit = async (data) => {
    try {
      await axios.post('http://localhost:3000/api/clientes/crear', data);
      toast.success('🎉 Cliente creado correctamente');
      reset();
      onClose();
    } catch (err) {
      console.error('Error al crear cliente:', err);
      toast.error('❌ Error al crear cliente');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <Motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0 }}
        className="bg-[#1a1a2e] text-white p-8 rounded-xl shadow-xl w-full max-w-md glass-effect neon-glow"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Crear Usuario Cliente</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <input {...register('nombre')} placeholder="Nombre completo" className="input" />
            <p className="text-red-400 text-sm mt-1">{errors.nombre?.message}</p>
          </div>

          <div>
            <input {...register('email')} placeholder="Correo electrónico" className="input" />
            <p className="text-red-400 text-sm mt-1">{errors.email?.message}</p>
          </div>

          <div>
            <input {...register('tienda')} placeholder="Nombre de la tienda" className="input" />
            <p className="text-red-400 text-sm mt-1">{errors.tienda?.message}</p>
          </div>

          <div>
            <select {...register('tipo')} className="input">
              <option value="">Seleccionar tipo de cliente</option>
              <option value="Emprendedor">Emprendedor</option>
              <option value="Escalable">Escalable</option>
              <option value="Reseller PRO">Reseller PRO</option>
            </select>
            <p className="text-red-400 text-sm mt-1">{errors.tipo?.message}</p>
          </div>

          <button type="submit" className="btn-primary w-full">
            Crear cuenta
          </button>
        </form>

        <button onClick={onClose} className="mt-4 text-sm text-indigo-400 hover:underline block mx-auto">
          Cancelar
        </button>
      </Motion.div>
    </div>
  );
}