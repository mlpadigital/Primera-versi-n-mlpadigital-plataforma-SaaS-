
import React, { useState, useEffect } from 'react';
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "./components/ui/card";
import { useToast } from "./components/ui/use-toast";
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, Loader2, Edit, AlertTriangle, Send } from 'lucide-react';
import { supabase } from './lib/customSupabaseClient';
import { useAuth } from './contexts/SupabaseAuthContext';

const PasswordInput = React.memo(({ value, onChange, showPassword, toggleShowPassword, id, placeholder, disabled }) => (
  <div className="relative">
    <Input 
      type={showPassword ? "text" : "password"} 
      id={id} 
      placeholder={placeholder}
      value={value} 
      onChange={onChange} 
      className="pr-10"
      autoComplete="current-password"
      disabled={disabled}
    />
    <Button 
      type="button" 
      variant="ghost" 
      size="sm" 
      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-gray-600"
      onClick={toggleShowPassword}
      tabIndex={-1}
      disabled={disabled}
    >
      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
    </Button>
  </div>
));
PasswordInput.displayName = 'PasswordInput';

const AuthPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { session, signIn } = useAuth();
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session?.user) {
      navigate('/dashboard', { replace: true });
    }
  }, [session, navigate]);

  const handleResendConfirmation = async () => {
    if (!loginEmail) {
      toast({ title: "Email requerido", description: "Por favor, ingresa tu email para reenviar la confirmación.", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: loginEmail,
    });
    setLoading(false);
    if (error) {
      toast({ title: "Error al reenviar", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Correo Reenviado", description: "Hemos reenviado el correo de confirmación. Revisa tu bandeja de entrada y spam.", duration: 5000 });
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      toast({ title: "Error de Inicio de Sesión", description: "Por favor, completa todos los campos.", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await signIn(loginEmail, loginPassword);
    
    if (error && error.message.includes('Email not confirmed')) {
      toast({
        title: "Confirma tu Email",
        description: (
          <div className="flex flex-col gap-4">
            <span>Revisa tu bandeja de entrada (y spam) para confirmar tu cuenta.</span>
            <Button size="sm" onClick={handleResendConfirmation}>
              <Send className="mr-2 h-4 w-4" />
              Reenviar correo de confirmación
            </Button>
          </div>
        ),
        variant: "destructive",
        duration: 10000,
      });
    }

    setLoading(false);
  };

  return (
    <motion.main
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="flex-grow container mx-auto px-6 py-12 flex items-center justify-center"
    >
      <Card className="glass-effect border-purple-500 shadow-xl w-full max-w-md">
        <CardHeader className="text-center">
          <User className="mx-auto h-16 w-16 text-yellow-400 mb-4 p-3 bg-white/10 rounded-full" />
          <CardTitle className="text-3xl">¡Hola de Nuevo!</CardTitle>
          <CardDescription className="text-indigo-200">Ingresa a tu cuenta para gestionar tus tiendas.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLoginSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="login-email" className="text-indigo-100 flex items-center"><Mail className="mr-2 h-4 w-4 text-yellow-400"/>Email</Label>
              <Input id="login-email" type="email" placeholder="tu@email.com" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} autoComplete="username" disabled={loading}/>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="login-password" className="text-indigo-100 flex items-center"><Lock className="mr-2 h-4 w-4 text-yellow-400"/>Contraseña</Label>
              </div>
              <PasswordInput
                id="login-password"
                placeholder="Tu contraseña"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                showPassword={showLoginPassword}
                toggleShowPassword={() => setShowLoginPassword(!showLoginPassword)}
                disabled={loading}
              />
                <div className="text-right">
                  <Link to="/forgot-password" className="text-sm text-indigo-300 hover:text-yellow-400 transition-colors">
                    ¿Olvidaste tu contraseña?
                  </Link>
                </div>
            </div>
            <div className="space-y-4">
              <Button type="submit" className="w-full bg-yellow-400 text-purple-700 hover:bg-yellow-500 font-semibold text-lg py-3" disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : 'Acceder'}
              </Button>
               <Button asChild variant="outline" className="w-full text-white hover:bg-white/10">
                <Link to="/register">
                  <Edit className="mr-2 h-4 w-4" /> ¿No tienes cuenta? Regístrate
                </Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.main>
  );
};

export default AuthPage;
