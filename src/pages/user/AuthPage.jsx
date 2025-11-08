// src/pages/user/AuthPage.jsx
import React, { useState, useEffect } from 'react';
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../components/ui/card";
import { useToast } from "../../components/ui/use-toast";
import { motion as Motion} from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, Loader2, Edit } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth'; // ✅ tu nuevo hook

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
  const { user, login, loading: AuthLoading } = useAuth(); // ✅ nuevo login
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      toast({
        title: "Error de Inicio de Sesión",
        description: "Por favor, completa todos los campos.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      await login(loginEmail, loginPassword);
      toast({
        title: "Sesión iniciada",
        description: "Bienvenido de nuevo",
        duration: 3000
      });
    } catch (err) {
      toast({
        title: "Error de autenticación",
        description: err.message || "No se pudo iniciar sesión",
        variant: "destructive"
      });
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
              <Label htmlFor="login-email" className="text-indigo-100 flex items-center">
                <Mail className="mr-2 h-4 w-4 text-yellow-400" />Email
              </Label>
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
              <Label htmlFor="login-password" className="text-indigo-100 flex items-center">
                <Lock className="mr-2 h-4 w-4 text-yellow-400" />Contraseña
              </Label>
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
              <Button
                type="submit"
                className="w-full bg-yellow-400 text-purple-700 hover:bg-yellow-500 font-semibold text-lg py-3"
                disabled={loading}
              >
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
    </Motion.main>
  );
};

export default AuthPage;