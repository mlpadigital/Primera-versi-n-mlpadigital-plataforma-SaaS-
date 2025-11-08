import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { MailCheck } from 'lucide-react';

const RegistrationSuccessPage = () => {
  return (
    <motion.main
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center"
    >
      <Card className="glass-effect border-green-500 shadow-xl w-full max-w-lg text-center">
        <CardHeader>
          <MailCheck className="mx-auto h-20 w-20 text-green-400 mb-4 p-3 bg-white/10 rounded-full" />
          <CardTitle className="text-3xl text-green-300">¡Registro Exitoso!</CardTitle>
          <CardDescription className="text-indigo-200 text-lg">
            Solo falta un paso más para activar tu tienda.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-white">
            Hemos enviado un correo electrónico de confirmación a tu dirección. Por favor, haz clic en el enlace del correo para verificar tu cuenta y activar tu tienda.
          </p>
          <p className="text-indigo-300">
            Si no ves el correo, revisa tu carpeta de spam.
          </p>
          <Button asChild className="w-full bg-yellow-400 text-purple-700 hover:bg-yellow-500 font-semibold text-lg py-3">
            <Link to="/auth">Ir a Iniciar Sesión</Link>
          </Button>
        </CardContent>
      </Card>
    </motion.main>
  );
};

export default RegistrationSuccessPage;