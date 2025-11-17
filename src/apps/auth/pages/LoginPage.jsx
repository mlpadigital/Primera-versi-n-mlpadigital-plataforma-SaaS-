import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../shared/hooks/useAuth";
import { useToast } from "../../shared/components/ui/use-toast";
import { Button } from "../../shared/components/ui/button";
import Input from "../../shared/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "../../shared/components/ui/card";
import { Loader2 } from "lucide-react";

const LoginPage = () => {
  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const user = await login(email, password); // 👈 devuelve directamente el objeto user

      toast({
        title: "Login exitoso",
        description: `Bienvenido ${user.nombre || "usuario"}`,
        className: "bg-green-500 text-white",
      });

      // Redirigir según rol
      if (user.tipo === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/app/dashboard");
      }
    } catch (error) {
      toast({
        title: "Error en login",
        description: error.message || "Credenciales inválidas",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <Card className="w-full max-w-md glass-effect border-purple-500 shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl text-yellow-400 text-center">
            Ingresar a tu cuenta
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-indigo-200 mb-1">
                Email
              </label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="tuemail@ejemplo.com"
                className="bg-gray-200 text-black w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-indigo-200 mb-1">
                Contraseña
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="********"
                className="bg-gray-200 text-black w-full"
              />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                "Ingresar"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;