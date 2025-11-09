import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion as Motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, Loader2, Edit } from 'lucide-react';

import { Button } from '../../../shared/ui/button';
import { Input } from '../../../shared/ui/input';
import { Label } from '../../../shared/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../../shared/ui/card';
import { useToast } from '../../../shared/ui/use-toast';
import { useAuth } from '../hooks/useAuth';
import PasswordInput from '../components/PasswordInput';

const AuthPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, login } = useAuth();

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) navigate('/dashboard', { replace: true });
  }, [user, navigate]);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      toast({ title: "Error de Inicio de Sesión", description: "Por favor, completa todos los campos.", variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      await login(loginEmail, loginPassword);
      toast({ title: "Sesión iniciada", description: "Bienvenido de nuevo", duration: 3000 });
    } catch (err) {
      toast({ title: "Error de autenticación", description: err.message || "No se pudo iniciar sesión", variant: "destructive" });
    }
    setLoading(false);
  };

  return (
    <Motion.main
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
              <Label htmlFor="login-email"><Mail className="mr-2 h-4 w-4 text-yellow-400" />Email</Label>
              <Input
                id="login-email"
                type="email"
                placeholder="tu@email.com"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                autoComplete="username"
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="login-password"><Lock className="mr-2 h-4 w-4 text-yellow-400" />Contraseña</Label>
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
                <Link to="/register"><Edit className="mr-2 h-4 w-4" /> ¿No tienes cuenta? Regístrate</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </Motion.main>
  );
};

export default AuthPage;