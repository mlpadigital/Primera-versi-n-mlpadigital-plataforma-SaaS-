import {
  Package, ShoppingCart, CreditCard, Megaphone, Palette,
  TrendingUp, Users, ShieldCheck, Settings
} from 'lucide-react';

export const services = [
  { icon: <Package className="h-12 w-12 text-yellow-400 mb-4" />, title: "Gestión de Productos", description: "Añade, edita y organiza tu catálogo con variantes, stock y más." },
  { icon: <ShoppingCart className="h-12 w-12 text-pink-500 mb-4" />, title: "Procesamiento de Pedidos", description: "Controla tus ventas, envíos y facturación de forma centralizada." },
  { icon: <CreditCard className="h-12 w-12 text-green-400 mb-4" />, title: "Pasarelas de Pago", description: "Integra múltiples opciones de pago seguras para tus clientes." },
  { icon: <Megaphone className="h-12 w-12 text-blue-400 mb-4" />, title: "Herramientas de Marketing", description: "Crea cupones, promociones y conecta con redes sociales." },
  { icon: <Palette className="h-12 w-12 text-purple-400 mb-4" />, title: "Diseño Personalizable", description: "Elige plantillas y personaliza el look & feel de cada tienda." },
  { icon: <TrendingUp className="h-12 w-12 text-red-400 mb-4" />, title: "Analíticas Avanzadas", description: "Mide el rendimiento de tus tiendas con reportes detallados." },
  { icon: <Users className="h-12 w-12 text-teal-400 mb-4" />, title: "Gestión de Clientes (CRM)", description: "Organiza la información de tus clientes y mejora la comunicación." },
  { icon: <ShieldCheck className="h-12 w-12 text-orange-400 mb-4" />, title: "Seguridad y SSL", description: "Tiendas seguras con certificados SSL y protección de datos." },
  { icon: <Settings className="h-12 w-12 text-indigo-400 mb-4" />, title: "Configuraciones Flexibles", description: "Ajusta impuestos, envíos y monedas según tus necesidades." },
];