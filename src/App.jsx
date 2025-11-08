// src/App.jsx
import React, { useEffect, useMemo, useCallback, useState } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from "./components/ui/button";
import { useToast } from "./components/ui/use-toast.js";
import {
  LogIn, LogOut, LayoutDashboard, Home as HomeIcon, Loader2,
  Shield, ShoppingCart as ShoppingCartIcon, Store
} from 'lucide-react';
import { motion as Motion } from 'framer-motion';

import HomePage from './pages/HomePage.jsx';
import DashboardPage from './pages/user/DashboardPage';
import AuthPage from './pages/user/AuthPage';
import RegisterPage from './pages/user/RegisterPage';
import ForgotPasswordPage from './pages/user/ForgotPasswordPage';
import PasswordRecoveryPage from './pages/user/PasswordRecoveryPage';
import PublicStorePage from './pages/public/PublicStorePage';
import PaymentResultPage from './pages/user/PaymentResultPage';
import SubscriptionPage from './pages/user/SubscriptionPage';
import PaymentInstructionsPage from './pages/user/PaymentInstructionsPage';
import RegistrationSuccessPage from './pages/user/RegistrationSuccessPage';
import AdminLayout from './pages/admin/AdminLayout';
import StorePage from './pages/public/StorePage';
import ProductDetailPage from './pages/public/ProductDetailPage';
import SuccessPage from './pages/public/SuccessPage';

import { useCart } from './hooks/useCart';
import ShoppingCart from './components/ShoppingCart';
import { useAuth } from './hooks/useAuth'; // o tu nuevo AuthProvider si migrás

const App = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { session, loading, userProfile, signOut } = useAuth();
  const { cartItems } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);

  const totalCartItems = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems]
  );

  const isStoreView = useMemo(() => {
    const reservedPaths = [
      '/', '/auth', '/register', '/dashboard', '/payment-result', '/subscribe',
      '/admin', '/forgot-password', '/recuperar-contrasena',
      '/payment-instructions', '/registration-success', '/store', '/product', '/success'
    ];
    const currentPath = location.pathname;
    if (currentPath === '/') return false;

    const isReserved = reservedPaths.some(path =>
      currentPath === path || (path !== '/' && currentPath.startsWith(path + '/'))
    );

    return !isReserved;
  }, [location.pathname]);

  const handleSignOut = useCallback(async () => {
    await signOut();
    toast({
      title: "Has cerrado sesión",
      description: "¡Esperamos verte pronto!",
      duration: 3000,
    });
    navigate('/');
  }, [signOut, toast, navigate]);

  useEffect(() => {
    if (loading) return;

    const currentPath = location.pathname;
    let targetPath = null;

    if (session && userProfile) {
      if (userProfile.role === 'admin') {
        if (!currentPath.startsWith('/admin')) {
          targetPath = '/admin/dashboard';
        }
      } else if (userProfile.plan_status !== 'paid') {
        const allowedPaths = [
          '/subscribe', '/payment-result', '/payment-instructions', '/registration-success'
        ];
        if (
          !allowedPaths.some(path => currentPath.startsWith(path)) &&
          !currentPath.startsWith('/auth') &&
          !currentPath.startsWith('/register') &&
          !currentPath.startsWith('/recuperar-contrasena')
        ) {
          targetPath = '/subscribe';
        }
      } else {
        const authRoutes = [
          '/auth', '/subscribe', '/register',
          '/payment-instructions', '/registration-success', '/recuperar-contrasena'
        ];
        if (authRoutes.some(path => currentPath.startsWith(path))) {
          targetPath = '/dashboard';
        }
      }
    } else if (!session) {
      const protectedRoutes = [
        '/dashboard', '/admin', '/subscribe', '/payment-instructions'
      ];
      if (protectedRoutes.some(path => currentPath.startsWith(path))) {
        targetPath = '/auth';
      }
    }

    if (targetPath && targetPath !== currentPath) {
      navigate(targetPath, { replace: true });
    }
  }, [session, userProfile, loading, location.pathname, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground">
        <Loader2 className="h-16 w-16 animate-spin text-secondary" />
        <p className="mt-4 text-xl">Cargando mlpadigital...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {!isStoreView && !location.pathname.startsWith('/admin') && (
        <header className="p-4 shadow-lg glass-effect sticky top-0 z-40">
          <div className="container mx-auto flex justify-between items-center">
            <Motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="text-3xl font-bold tracking-tight"
            >
              <Link to="/">mlpa<span className="text-primary">digital</span></Link>
            </Motion.div>
            <Motion.nav
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex items-center space-x-1 sm:space-x-2"
            >
              <Button variant="ghost" className="text-foreground hover:bg-white/10 transition-colors" asChild>
                <Link to="/"><HomeIcon className="mr-0 sm:mr-2 h-5 w-5" /><span className="hidden sm:inline">Inicio</span></Link>
              </Button>
              <Button variant="ghost" className="text-foreground hover:bg-white/10 transition-colors" asChild>
                <Link to="/store"><Store className="mr-0 sm:mr-2 h-5 w-5" /><span className="hidden sm:inline">Tienda</span></Link>
              </Button>
              {session?.user ? (
                <>
                  {userProfile?.role === 'admin' && (
                    <Button variant="ghost" className="text-yellow-300 hover:bg-yellow-400/10 hover:text-yellow-300 transition-colors" asChild>
                      <Link to="/admin"><Shield className="mr-0 sm:mr-2 h-5 w-5" /><span className="hidden sm:inline">Admin</span></Link>
                    </Button>
                  )}
                  <Button variant="ghost" className="text-foreground hover:bg-white/10 transition-colors" asChild>
                    <Link to="/dashboard"><LayoutDashboard className="mr-0 sm:mr-2 h-5 w-5" /><span className="hidden sm:inline">Dashboard</span></Link>
                  </Button>
                  <Button variant="secondary" className="bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-transform" onClick={handleSignOut}>
                    <LogOut className="mr-0 sm:mr-2 h-5 w-5" /><span className="hidden sm:inline">Salir</span>
                  </Button>
                </>
              ) : (
                <Button variant="secondary" className="bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-transform" asChild>
                  <Link to="/auth"><LogIn className="mr-0 sm:mr-2 h-5 w-5" /><span className="hidden sm:inline">Acceder</span></Link>
                </Button>
              )}
              <Button onClick={() => setIsCartOpen(true)} variant="ghost" className="relative text-foreground hover:bg-white/10 transition-colors">
                <ShoppingCartIcon className="h-6 w-6" />
                {totalCartItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {totalCartItems}
                  </span>
                )}
              </Button>
            </Motion.nav>
          </div>
        </header>
      )}

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/registration-success" element={<RegistrationSuccessPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/recuperar-contrasena" element={<PasswordRecoveryPage />} />
        <Route path="/dashboard/*" element={<DashboardPage />} />
        <Route path="/payment-result" element={<PaymentResultPage />} />
        <Route path="/subscribe" element={<SubscriptionPage />} />
        <Route path="/admin/*" element={<AdminLayout />} />
        <Route path="/store" element={<StorePage />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
        <Route path="/success" element={<SuccessPage />} />
        <Route path="/:slug" element={<PublicStorePage />} />
      </Routes>
      
      <ShoppingCart isCartOpen={isCartOpen} setIsCartOpen={setIsCartOpen} />
    </div>
  );
};
/*CREADO POR MARTIN MARIANO VELTRI*/

export default App;