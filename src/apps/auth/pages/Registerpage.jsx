import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion as Motion } from 'framer-motion';
import axios from 'axios';
import {
  Mail, Lock, User, Store, Phone, MapPin, Globe,
  Loader2, ArrowLeft, CreditCard
} from 'lucide-react';

import { Button } from '../../shared/components/ui/button';
import Input from '../../shared/components/ui/input';
import { Label } from '../../shared/components/ui/label';
import {
  Card, CardHeader, CardTitle, CardDescription, CardContent
} from '../../shared/components/ui/card';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '../../shared/components/ui/select';
import { useToast } from '../../shared/components/ui/use-toast';
import PasswordInput from '../components/PasswordImput';

const RegisterPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', storeName: '',
    phone: '', country: '', address: '', password: '', confirmPassword: ''
  });

  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    setCountries([
      { code: 'AR', name: 'Argentina' },
      { code: 'ES', name: 'España' },
      { code: 'MX', name: 'México' },
      { code: 'CL', name: 'Chile' },
      { code: 'CO', name: 'Colombia' },
    ]);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCountryChange = (value) => {
    setFormData(prev => ({ ...prev, country: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isRateLimited) {
      toast({ title: "Demasiados intentos", description: "Por favor, espera un minuto.", variant: "destructive" });
      return;
    }

    for (const key in formData) {
      if (!formData[key]) {
        toast({ title: "Error de Registro", description: "Por favor, completa todos los campos.", variant: "destructive" });
        return;
      }
    }

    if (formData.password !== formData.confirmPassword) {
      toast({ title: "Error de Registro", description: "Las contraseñas no coinciden.", variant: "destructive" });
      return;
    }

    const payload = {
      email: formData.email,
      password: formData.password,
      nombre: `${formData.firstName} ${formData.lastName}`,
      tienda: formData.storeName,
      tipo: 'Emprendedor' // Podés cambiar esto o hacerlo dinámico con un Select
    };

    setLoading(true);

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/register`, payload);
      toast({
        title: "¡Registro Exitoso!",
        description: "Cliente creado correctamente en MongoDB.",
        className: "bg-green-500 text-white",
        duration: 8000
      });
      navigate('/registration-success');
    } catch (error) {
      const msg = error.response?.data?.error || "No se pudo registrar el cliente.";
      toast({ title: "Error de Registro", description: msg, variant: "destructive" });

      if (msg.includes('rate limit')) {
        setIsRateLimited(true);
        setTimeout(() => setIsRateLimited(false), 60000);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Motion.main
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center"
    >
      <Card className="glass-effect border-purple-500 shadow-xl w-full max-w-2xl">
        <CardHeader className="text-center">
          <User className="mx-auto h-16 w-16 text-yellow-400 mb-4 p-3 bg-white/10 rounded-full" />
          <CardTitle className="text-3xl">Crea tu Cuenta y Tienda</CardTitle>
          <CardDescription className="text-indigo-200">Únete a mlpadigital y empieza a vender hoy.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName"><User className="mr-2 h-4 w-4 text-yellow-400" />Nombre</Label>
                <Input id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} disabled={loading || isRateLimited} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName"><User className="mr-2 h-4 w-4 text-yellow-400" />Apellido</Label>
                <Input id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} disabled={loading || isRateLimited} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email"><Mail className="mr-2 h-4 w-4 text-yellow-400" />Email</Label>
                <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} disabled={loading || isRateLimited} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="storeName"><Store className="mr-2 h-4 w-4 text-yellow-400" />Nombre de la Tienda</Label>
                <Input id="storeName" name="storeName" value={formData.storeName} onChange={handleChange} disabled={loading || isRateLimited} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone"><Phone className="mr-2 h-4 w-4 text-yellow-400" />Teléfono</Label>
                <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} disabled={loading || isRateLimited} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country"><Globe className="mr-2 h-4 w-4 text-yellow-400" />País</Label>
                <Select id="country" name="country" onValueChange={handleCountryChange} value={formData.country} disabled={loading || isRateLimited}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona tu país" />
                  </SelectTrigger>
                  <SelectContent position="popper" className="max-h-[200px] z-[9999]">
                    {countries.map(c => <SelectItem key={c.code} value={c.code}>{c.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address"><MapPin className="mr-2 h-4 w-4 text-yellow-400" />Dirección</Label>
                <Input id="address" name="address" value={formData.address} onChange={handleChange} disabled={loading || isRateLimited} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password"><Lock className="mr-2 h-4 w-4 text-yellow-400" />Contraseña</Label>
                <PasswordInput
                  id="password"
                  name="password"
                  placeholder="Mín. 6 caracteres"
                  value={formData.password}
                  onChange={handleChange}
                  showPassword={showPassword}
                  toggleShowPassword={() => setShowPassword(p => !p)}
                  disabled={loading || isRateLimited}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword"><Lock className="mr-2 h-4 w-4 text-yellow-400" />Confirmar Contraseña</Label>
                                <PasswordInput
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="Confirma tu contraseña"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  showPassword={showConfirmPassword}
                  toggleShowPassword={() => setShowConfirmPassword(p => !p)}
                  disabled={loading || isRateLimited}
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row-reverse gap-4 pt-4">
              <Button
                type="submit"
                className="w-full sm:w-auto bg-yellow-400 text-purple-700 hover:bg-yellow-500 font-semibold text-lg py-3 flex-grow"
                disabled={loading || isRateLimited}
              >
                {loading ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <CreditCard className="mr-2 h-5 w-5" />
                )}
                {isRateLimited ? 'Espera un minuto' : 'Crear Cuenta y Continuar'}
              </Button>

              <Button asChild variant="outline" className="w-full sm:w-auto text-white hover:bg-white/10">
                <Link to="/auth">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Volver a Iniciar Sesión
                </Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </Motion.main>
  );
};

export default RegisterPage;