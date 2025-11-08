import React, { useState } from 'react';
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../components/ui/card";
import { useToast } from "../../components/ui/use-toast";
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Mail, Loader2, KeyRound, ArrowLeft, CheckCircle } from 'lucide-react';
//import { supabase } from '../../lib/customSupabaseClient';

const ForgotPasswordPage = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    if (!email) {
      toast({ title: "Error", description: "Por favor, ingresa tu correo electrónico.", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/recuperar-contrasena`,
    });
    setLoading(false);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      setSubmitted(true);
    }
  };

  return (
    <motion.main
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="flex-grow container mx-auto px-6 py-12 flex items-center justify-center"
    >
      <Card className="w-full max-w-md glass-effect border-purple-500 shadow-xl">
        <CardHeader className="text-center">
          <KeyRound className="mx-auto h-16 w-16 text-yellow-400 mb-4 p-3 bg-white/10 rounded-full" />
          <CardTitle className="text-3xl">¿Olvidaste tu Contraseña?</CardTitle>
          {!submitted && (
            <CardDescription className="text-indigo-200">No te preocupes. Ingresa tu email y te enviaremos un enlace para recuperarla.</CardDescription>
          )}
        </CardHeader>
        <CardContent>
          {submitted ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-6"
            >
              <CheckCircle className="mx-auto h-20 w-20 text-green-400" />
              <h3 className="text-2xl font-bold text-white">¡Revisa tu correo!</h3>
              <p className="text-indigo-200">
                Hemos enviado un enlace de recuperación a <strong className="text-yellow-400">{email}</strong>. 
                Por favor, revisa tu bandeja de entrada (y la carpeta de spam) para continuar.
              </p>
              <Button asChild className="w-full bg-yellow-400 text-purple-700 hover:bg-yellow-500 font-semibold text-lg py-3">
                <Link to="/auth">
                  <ArrowLeft className="mr-2 h-5 w-5" /> Volver a Iniciar Sesión
                </Link>
              </Button>
            </motion.div>
          ) : (
            <form onSubmit={handlePasswordReset} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="reset-email" className="text-indigo-100 flex items-center"><Mail className="mr-2 h-4 w-4 text-yellow-400"/>Email</Label>
                <Input id="reset-email" type="email" placeholder="tu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" disabled={loading}/>
              </div>
              <Button type="submit" className="w-full bg-yellow-400 text-purple-700 hover:bg-yellow-500 font-semibold text-lg py-3" disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : 'Enviar Enlace de Recuperación'}
              </Button>
              <div className="text-center">
                <Link to="/auth" className="text-sm text-indigo-300 hover:text-yellow-400 transition-colors">
                  Recordé mi contraseña
                </Link>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </motion.main>
  );
};

export default ForgotPasswordPage;