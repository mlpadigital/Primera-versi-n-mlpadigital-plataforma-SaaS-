import React, { useState, useEffect, useCallback, memo } from 'react';
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../../components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { useToast } from "../../components/ui/use-toast";
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, Store, Phone, MapPin, Globe, Loader2, ArrowLeft, CreditCard } from 'lucide-react';
//import { supabase } from '../../lib/customSupabaseClient';
//import { useAuth } from '../../contexts/SupabaseAuthContext';

const PasswordInput = memo(({ value, onChange, show, onToggle, id, placeholder, disabled, name }) => (
    <div className="relative">
      <Input
        type={show ? "text" : "password"}
        id={id}
        name={name}
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
        onClick={onToggle}
        tabIndex={-1}
        disabled={disabled}
      >
        {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </Button>
    </div>
));
PasswordInput.displayName = 'PasswordInput';

const RegisterPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { session, signUp } = useAuth();
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
    if (session?.user) {
      navigate('/dashboard', { replace: true });
    }
  }, [session, navigate]);

  useEffect(() => {
    const fetchCountries = async () => {
      const { data, error } = await supabase.from('countries').select('code, name').order('name', { ascending: true });
      if (error) {
        toast({ title: "Error", description: "No se pudieron cargar los países.", variant: "destructive" });
      } else {
        setCountries(data);
      }
    };
    fetchCountries();
  }, [toast]);

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

    setLoading(true);

    const { error } = await signUp(formData.email, formData.password, {
      data: {
        first_name: formData.firstName,
        last_name: formData.lastName,
        phone: formData.phone,
        country_code: formData.country,
        address: formData.address,
        store_name: formData.storeName,
      }
    });

    setLoading(false);

    if (error) {
      if (error.message.includes('rate limit')) {
        toast({ title: "Demasiados intentos", description: "Has intentado registrarte muy seguido. Por favor, espera un minuto.", variant: "destructive", duration: 5000 });
        setIsRateLimited(true);
        setTimeout(() => setIsRateLimited(false), 60000);
      } else if (error.message.includes("already been registered")) {
        toast({ title: "Error de Registro", description: "Un usuario con este correo electrónico ya existe.", variant: "destructive" });
      }
      else {
        toast({ title: "Error de Registro", description: error.message, variant: "destructive" });
      }
    } else {
      toast({
        title: "¡Registro Exitoso!",
        description: "Revisa tu email para confirmar tu cuenta y luego serás redirigido.",
        className: "bg-green-500 text-white",
        duration: 8000
      });
      navigate('/registration-success');
    }
  };

  return (
    <motion.main
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
                <Label htmlFor="firstName" className="text-indigo-100 flex items-center"><User className="mr-2 h-4 w-4 text-yellow-400"/>Nombre</Label>
                <Input id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} disabled={loading || isRateLimited} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-indigo-100 flex items-center"><User className="mr-2 h-4 w-4 text-yellow-400"/>Apellido</Label>
                <Input id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} disabled={loading || isRateLimited} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-indigo-100 flex items-center"><Mail className="mr-2 h-4 w-4 text-yellow-400"/>Email</Label>
                <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} disabled={loading || isRateLimited} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="storeName" className="text-indigo-100 flex items-center"><Store className="mr-2 h-4 w-4 text-yellow-400"/>Nombre de la Tienda</Label>
                <Input id="storeName" name="storeName" value={formData.storeName} onChange={handleChange} disabled={loading || isRateLimited} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-indigo-100 flex items-center"><Phone className="mr-2 h-4 w-4 text-yellow-400"/>Teléfono</Label>
                <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} disabled={loading || isRateLimited} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country" className="text-indigo-100 flex items-center"><Globe className="mr-2 h-4 w-4 text-yellow-400"/>País</Label>
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
                <Label htmlFor="address" className="text-indigo-100 flex items-center"><MapPin className="mr-2 h-4 w-4 text-yellow-400"/>Dirección</Label>
                <Input id="address" name="address" value={formData.address} onChange={handleChange} disabled={loading || isRateLimited} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-indigo-100 flex items-center"><Lock className="mr-2 h-4 w-4 text-yellow-400"/>Contraseña</Label>
                <PasswordInput id="password" name="password" placeholder="Mín. 6 caracteres" value={formData.password} onChange={handleChange} show={showPassword} onToggle={() => setShowPassword(p => !p)} disabled={loading || isRateLimited} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-indigo-100 flex items-center"><Lock className="mr-2 h-4 w-4 text-yellow-400"/>Confirmar Contraseña</Label>
                <PasswordInput id="confirmPassword" name="confirmPassword" placeholder="Confirma tu contraseña" value={formData.confirmPassword} onChange={handleChange} show={showConfirmPassword} onToggle={() => setShowConfirmPassword(p => !p)} disabled={loading || isRateLimited} />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row-reverse gap-4 pt-4">
              <Button type="submit" className="w-full sm:w-auto bg-yellow-400 text-purple-700 hover:bg-yellow-500 font-semibold text-lg py-3 flex-grow" disabled={loading || isRateLimited}>
                {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <CreditCard className="mr-2 h-5 w-5" />}
                {isRateLimited ? 'Espera un minuto' : 'Crear Cuenta y Continuar'}
              </Button>
              <Button asChild variant="outline" className="w-full sm:w-auto text-white hover:bg-white/10">
                <Link to="/auth"><ArrowLeft className="mr-2 h-4 w-4" /> Volver a Iniciar Sesión</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.main>
  );
};

export default RegisterPage;