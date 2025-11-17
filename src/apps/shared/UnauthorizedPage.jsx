import React from "react";
import { Link } from "react-router-dom";
import { AlertTriangle } from "lucide-react";
import { Button } from "../shared/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../shared/components/ui/card";

const UnauthorizedPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <Card className="w-full max-w-md glass-effect border-red-500 shadow-xl">
        <CardHeader className="flex flex-col items-center">
          <AlertTriangle className="h-12 w-12 text-red-400 mb-4" />
          <CardTitle className="text-2xl text-red-400">
            Acceso no autorizado
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <p className="text-indigo-200">
            No tienes permisos para acceder a esta sección.  
            Si crees que es un error, contacta al administrador.
          </p>
          <div className="flex flex-col gap-3">
            <Button asChild className="bg-indigo-600 hover:bg-indigo-700 text-white">
              <Link to="/app/dashboard">Ir al Dashboard</Link>
            </Button>
            <Button asChild variant="outline" className="border-red-400 text-red-400 hover:bg-red-600 hover:text-white">
              <Link to="/auth/login">Volver al Login</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UnauthorizedPage;