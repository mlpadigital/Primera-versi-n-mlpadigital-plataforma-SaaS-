import React, { useState, useEffect } from 'react';
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../components/ui/card";
import { useToast } from "../../components/ui/use-toast";
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, Loader2, KeyRound, CheckCircle, AlertTriangle } from 'lucide-react';
//import { supabase } from '../../lib/customSupabaseClient';

const PasswordInput = React.memo(({ value, onChange, showPassword, toggleShowPassword, id, placeholder, disabled }) => (
  <div className="relative">
    <Input 
      type={showPassword ? "text" : "password"} 
      id={id} 
      placeholder={placeholder}
      value={value} 
      onChange={onChange} 
      className="pr-10"
      autoComplete="new-password"
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

const PasswordRecoveryPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const [checkingToken, setCheckingToken] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        setError(null);
      } else {
        setError("Enlace inválido o expirado. Por favor, solicita uno nuevo.");
      }
      setCheckingToken(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    if (!password || !confirmPassword) {
      toast({ title: "Error", description: "Por favor, completa todos los campos.", variant: "destructive" });
      return;
    }
    if (password.length < 6) {
      toast({ title: "Contraseña Débil", description: "La contraseña debe tener al menos 6 caracteres.", variant: "destructive" });
      return;
    }
    if (password !== confirmPassword) {
      toast({ title: "Error", description: "Las contraseñas no coinciden.", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (error) {
      toast({ title: "Error al Restablecer", description: "No se pudo cambiar la contraseña. El enlace puede haber expirado. Por favor, solicita uno nuevo.", variant: "destructive" });
    } else {
      setSubmitted(true);
      toast({
        title: "¡Contraseña Cambiada!",
        description: "Serás redirigido para iniciar sesión.",
        className: "bg-green-500 text-white",
      });
      await supabase.auth.signOut();
      setTimeout(() => navigate('/auth'), 3000);
    }
  };

  if (checkingToken) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground">
        <Loader2 className="h-16 w-16 animate-spin text-secondary" />
        <p className="mt-4 text-xl">Verificando enlace...</p>
      </div>
    );
  }

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
          <CardTitle className="text-3xl">Restablecer Contraseña</CardTitle>
          {!submitted && !error && (
            <CardDescription className="text-indigo-200">Crea una nueva contraseña para tu cuenta.</CardDescription>
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
              <h3 className="text-2xl font-bold text-white">¡Contraseña Cambiada!</h3>
              <p className="text-indigo-200">
                Tu contraseña ha sido actualizada con éxito. Serás redirigido para iniciar sesión.
              </p>
              <Loader2 className="mx-auto h-8 w-8 animate-spin text-yellow-400" />
            </motion.div>
          ) : !error ? (
            <form onSubmit={handleResetSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="new-password" className="text-indigo-100 flex items-center"><Lock className="mr-2 h-4 w-4 text-yellow-400"/>Nueva Contraseña</Label>
                <PasswordInput
                  id="new-password"
                  placeholder="Mínimo 6 caracteres"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  showPassword={showPassword}
                  toggleShowPassword={() => setShowPassword(!showPassword)}
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-new-password" className="text-indigo-100 flex items-center"><Lock className="mr-2 h-4 w-4 text-yellow-400"/>Confirmar Nueva Contraseña</Label>
                <PasswordInput
                  id="confirm-new-password"
                  placeholder="Confirma tu nueva contraseña"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  showPassword={showConfirmPassword}
                  toggleShowPassword={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={loading}
                />
              </div>
              <Button type="submit" className="w-full bg-yellow-400 text-purple-700 hover:bg-yellow-500 font-semibold text-lg py-3" disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : 'Cambiar Contraseña'}
              </Button>
            </form>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-6"
            >
              <AlertTriangle className="mx-auto h-20 w-20 text-red-500" />
              <h3 className="text-2xl font-bold text-white">Enlace Inválido o Expirado</h3>
              <p className="text-indigo-200">
                {error}
              </p>
              <Button asChild onClick={() => navigate('/forgot-password')} className="w-full bg-yellow-400 text-purple-700 hover:bg-yellow-500 font-semibold text-lg py-3">
                 <span>Solicitar un Nuevo Enlace</span>
              </Button>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.main>
  );
};

export default PasswordRecoveryPage;