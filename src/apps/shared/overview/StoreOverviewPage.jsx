import React, { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { useToast } from "../components/ui/use-toast";
import { Button } from "../components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../components/ui/card";
import Input from "../components/ui/input";
import {
  Loader2,
  Copy,
  ExternalLink,
  CheckCircle,
  Eye,
} from "lucide-react";
import { motion as Motion } from "framer-motion";
import StorePreview from "../components/dashboard/design/StorePreview";

// Configuración inicial de diseño
const initialDesignSettings = {
  template: "template1",
  globalStyles: {
    primaryColor: "#8B5CF6",
    secondaryColor: "#F59E0B",
    fontFamily: "Inter, sans-serif",
    backgroundColor: "#1E1B4B",
    textColor: "#E0E7FF",
  },
  blocks: [
    {
      id: "header-1",
      type: "Header",
      settings: {
        backgroundColor: "#111827",
        textColor: "#FFFFFF",
        sticky: false,
      },
      content: {
        title: "Tu Tienda",
        navLinks: ["Inicio", "Productos", "Contacto"],
      },
    },
    {
      id: "hero-1",
      type: "HeroSection",
      settings: {
        backgroundColor: "#1E1B4B",
        textColor: "#FFFFFF",
        imagePosition: "right",
        overlayOpacity: 0.3,
        fullWidth: true,
      },
      content: {
        heading: "Descubre Novedades",
        subheading: "Los mejores productos, al mejor precio.",
        ctaText: "Comprar Ahora",
        imageUrl:
          "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80",
      },
    },
    {
      id: "productlist-1",
      type: "ProductList",
      settings: {
        layout: "grid",
        itemsPerRow: 3,
        backgroundColor: "#1E1B4B",
        titleColor: "#F59E0B",
      },
      content: { title: "Nuestros Productos" },
    },
    {
      id: "footer-1",
      type: "Footer",
      settings: {
        backgroundColor: "#0F172A",
        textColor: "#94A3B8",
        style: "dark",
      },
      content: {
        copyright: `© ${new Date().getFullYear()} Tu Tienda. Todos los derechos reservados.`,
        socialLinks: [
          { platform: "Facebook", url: "#" },
          { platform: "Instagram", url: "#" },
        ],
      },
    },
  ],
};

const StoreOverviewPage = () => {
  const { storeId } = useParams();
  const { toast } = useToast();

  const [storeData, setStoreData] = useState(null);
  const [designSettings, setDesignSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  // Cargar datos de la tienda
  const fetchStoreData = useCallback(async () => {
    if (!storeId) return;
    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/stores/${storeId}/overview`
      );
      const result = await response.json();

      if (!response.ok || !result.store)
        throw new Error("No se pudo cargar la tienda");

      const { name, slug, settings } = result.store;
      setStoreData({ name, slug: slug || storeId });

      // Fusionar settings con defaults
      if (settings) {
        const mergedSettings = JSON.parse(
          JSON.stringify(initialDesignSettings)
        );
        Object.keys(settings).forEach((key) => {
          if (key === "blocks" && Array.isArray(settings.blocks)) {
            mergedSettings.blocks = settings.blocks;
          } else if (
            typeof settings[key] === "object" &&
            settings[key] !== null &&
            !Array.isArray(settings[key])
          ) {
            mergedSettings[key] = {
              ...mergedSettings[key],
              ...settings[key],
            };
          } else {
            mergedSettings[key] = settings[key];
          }
        });
        setDesignSettings(mergedSettings);
      } else {
        setDesignSettings(initialDesignSettings);
      }
    } catch (error) {
      console.error("Error al cargar datos de la tienda:", error);
      toast({
        title: "Error al cargar datos",
        description: "No se pudo obtener la información de la tienda.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [storeId, toast]);

  useEffect(() => {
    fetchStoreData();
  }, [fetchStoreData]);

  // Copiar enlace público
  const handleCopyLink = () => {
    const storeUrl = `${window.location.origin}/${storeData.slug}`;
    navigator.clipboard.writeText(storeUrl);
    setCopied(true);
    toast({
      title: "¡Enlace Copiado!",
      description: "El enlace a tu tienda ha sido copiado al portapapeles.",
      className: "bg-green-500 text-white",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-12 w-12 animate-spin text-yellow-400" />
      </div>
    );
  }

  if (!storeData) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-semibold text-red-400">
          No se encontraron datos de la tienda.
        </h2>
      </div>
    );
  }

  const storeUrl = `${window.location.origin}/${storeData.slug}`;
  const previewUrl = `/${storeData.slug}`;

  return (
    <Motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* Header */}
      <div>
        <h1 className="text-4xl md:text-5xl font-bold mb-2">
          Resumen de{" "}
          <span className="text-yellow-400">{storeData.name}</span>
        </h1>
        <p className="text-indigo-200 text-lg">
          Aquí tienes el enlace público de tu tienda y un resumen de su
          actividad.
        </p>
      </div>

      {/* Enlace público */}
      <Card className="glass-effect border-purple-500 shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl text-yellow-300">
            Enlace de tu Tienda
          </CardTitle>
          <CardDescription className="text-indigo-300">
            Este es el enlace que puedes compartir con tus clientes para
            que visiten tu tienda.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <Input
              readOnly
              value={storeUrl}
              className="text-black font-mono flex-grow bg-gray-200"
            />
            <div className="flex gap-2 w-full sm:w-auto">
              <Button
                onClick={handleCopyLink}
                variant="outline"
                className="text-white hover:bg-white/10 border-purple-400 w-full sm:w-auto"
              >
                {copied ? (
                  <CheckCircle className="h-5 w-5 text-green-400" />
                ) : (
                  <Copy className="h-5 w-5" />
                )}
                <span className="ml-2">
                  {copied ? "Copiado" : "Copiar"}
                </span>
              </Button>
              <Button
                asChild
                className="bg-yellow-400 text-purple-700 hover:bg-yellow-500 font-semibold w-full sm:w-auto"
              >
                <Link
                  to={previewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="h-5 w-5" />
                  <span className="ml-2">Visitar</span>
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vista previa */}
      <Card className="glass-effect border-purple-500 shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl text-yellow-300 flex items-center">
            <Eye className="mr-3" />
            Vista Previa de la Tienda
          </CardTitle>
                    <CardDescription className="text-indigo-300">
            Así es como los visitantes ven tu tienda en este momento. Los cambios se reflejan al instante.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="w-full h-[600px] bg-white rounded-lg shadow-inner overflow-hidden border border-purple-700">
            {designSettings ? (
              <StorePreview designSettings={designSettings} storeId={storeId} />
            ) : (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Métricas rápidas */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="glass-effect border-purple-500/50">
          <CardHeader>
            <CardTitle className="text-xl text-yellow-400">Ventas Totales</CardTitle>
            <CardDescription className="text-indigo-300">Próximamente...</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-white">--</p>
          </CardContent>
        </Card>

        <Card className="glass-effect border-purple-500/50">
          <CardHeader>
            <CardTitle className="text-xl text-yellow-400">Pedidos Recientes</CardTitle>
            <CardDescription className="text-indigo-300">Próximamente...</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-white">--</p>
          </CardContent>
        </Card>

        <Card className="glass-effect border-purple-500/50">
          <CardHeader>
            <CardTitle className="text-xl text-yellow-400">Visitantes Hoy</CardTitle>
            <CardDescription className="text-indigo-300">Próximamente...</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-white">--</p>
          </CardContent>
        </Card>
      </div>
    </Motion.div>
  );
};

export default StoreOverviewPage;