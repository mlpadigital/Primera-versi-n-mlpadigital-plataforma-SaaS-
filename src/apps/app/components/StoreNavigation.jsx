
import React, { useState, useEffect } from 'react';
import { Button } from "../../../components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../../components/ui/accordion";
import { Package, ShoppingCart, Palette, Megaphone, TrendingUp, CreditCard, Settings, ArrowLeft, LayoutDashboard, LayoutTemplate, Blocks, Paintbrush, X } from 'lucide-react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
//import { supabase } from './lib/customSupabaseClient';

const SidebarContent = ({ storeName, storeId, onClose, setIsMobileOpen }) => {
    const location = useLocation();
    const [accentColor, setAccentColor] = useState('#FDE047');

    useEffect(() => {
        const fetchAccentColor = async () => {
            if (!storeId) return;
            try {
                const { data, error } = await supabase
                    .from('store_settings')
                    .select('settings')
                    .eq('id', storeId)
                    .single();
                if (!error && data && data.settings?.globalStyles?.primaryColor) {
                    setAccentColor(data.settings.globalStyles.primaryColor);
                }
            } catch (e) {
                console.error("Error fetching accent color:", e);
            }
        };
        fetchAccentColor();
    }, [storeId]);

    const navItems = [
        { id: 'overview', path: `/dashboard/${storeId}/overview`, label: 'Resumen', icon: <LayoutDashboard className="h-5 w-5" /> },
        { id: 'products', path: `/dashboard/${storeId}/products`, label: 'Productos', icon: <Package className="h-5 w-5" /> },
        { id: 'orders', path: `/dashboard/${storeId}/orders`, label: 'Pedidos', icon: <ShoppingCart className="h-5 w-5" /> },
        {
            id: 'design',
            label: 'Diseño',
            icon: <Palette className="h-5 w-5" />,
            path: `/dashboard/${storeId}/design`,
            children: [
                { id: 'design-templates', path: `/dashboard/${storeId}/design`, label: 'Plantillas', icon: <LayoutTemplate className="h-4 w-4" /> },
                { id: 'design-styles', path: `/dashboard/${storeId}/design`, label: 'Estilos Globales', icon: <Paintbrush className="h-4 w-4" /> },
                { id: 'design-blocks', path: `/dashboard/${storeId}/design`, label: 'Bloques de Contenido', icon: <Blocks className="h-4 w-4" /> }
            ]
        },
        { id: 'marketing', path: `/dashboard/${storeId}/marketing`, label: 'Marketing', icon: <Megaphone className="h-5 w-5" /> },
        { id: 'payments', path: `/dashboard/${storeId}/payments`, label: 'Pagos', icon: <CreditCard className="h-5 w-5" /> },
        { id: 'analytics', path: `/dashboard/${storeId}/analytics`, label: 'Analíticas', icon: <TrendingUp className="h-5 w-5" /> },
        { id: 'settings', path: `/dashboard/${storeId}/settings`, label: 'Ajustes', icon: <Settings className="h-5 w-5" /> },
    ];

    const isActive = (path) => location.pathname.startsWith(path);
    const isDesignActive = location.pathname.includes(`/dashboard/${storeId}/design`);

    const activeStyle = {
        backgroundColor: accentColor,
        color: '#1E1B4B',
    };

    return (
        <div className="w-64 bg-purple-900/70 backdrop-blur-xl h-full flex flex-col p-4 flex-shrink-0 shadow-2xl border-r border-purple-700">
            <div className="mb-6 pb-4 border-b border-purple-700 flex justify-between items-center">
                <h2 className="text-xl font-bold text-yellow-300 truncate" title={storeName}>
                    {storeName}
                </h2>
                <Button variant="ghost" size="icon" className="lg:hidden text-white" onClick={() => setIsMobileOpen(false)}>
                    <X className="h-5 w-5" />
                </Button>
            </div>
            <Button variant="outline" size="sm" onClick={onClose} className="text-white hover:bg-white/10 border-purple-400 w-full justify-start mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" /> Volver al Dashboard
            </Button>

            <nav className="flex-1 flex flex-col gap-y-1 overflow-y-auto">
                {navItems.map((item) => {
                    if (item.children) {
                        return (
                            <Accordion type="single" collapsible key={item.id} className="w-full" defaultValue={isDesignActive ? item.id : ''}>
                                <AccordionItem value={item.id} className="border-none">
                                    <AccordionTrigger
                                        style={isDesignActive ? activeStyle : {}}
                                        className={`w-full justify-between p-3 h-auto text-base rounded-md hover:no-underline transition-colors ${
                                          isDesignActive
                                                ? 'font-semibold shadow-lg'
                                                : 'text-indigo-200 hover:bg-purple-700/50 hover:text-yellow-300'
                                        }`}
                                    >
                                        <div className="flex items-center">
                                            {item.icon}
                                            <span className="ml-3">{item.label}</span>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="pl-6 pt-1 pb-1 space-y-1">
                                        {item.children.map(child => (
                                            <Button
                                                key={child.id}
                                                variant="ghost"
                                                asChild
                                                className="w-full justify-start p-2 h-auto text-sm text-indigo-300 hover:text-yellow-300"
                                            >
                                                <Link to={child.path} className="flex items-center w-full">
                                                    {child.icon}
                                                    <span className="ml-3">{child.label}</span>
                                                </Link>
                                            </Button>
                                        ))}
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        );
                    }

                    return (
                        <Button
                            key={item.id}
                            variant="ghost"
                            asChild
                            style={isActive(item.path) && !isDesignActive ? activeStyle : {}}
                            className={`w-full justify-start p-3 h-auto text-base ${
                                isActive(item.path) && !isDesignActive
                                    ? 'font-semibold shadow-lg'
                                    : 'text-indigo-200 hover:bg-purple-700/50 hover:text-yellow-300'
                            }`}
                        >
                            <Link to={item.path} className="flex items-center w-full">
                                {item.icon}
                                <span className="ml-3">{item.label}</span>
                            </Link>
                        </Button>
                    );
                })}
            </nav>

            <div className="mt-auto pt-4">
                <p className="text-xs text-center text-purple-400">mlpadigital © 2025</p>
            </div>
        </div>
    );
};

const StoreNavigation = ({ storeName, onClose, storeId, isMobileOpen, setIsMobileOpen }) => {
    if (!storeId) {
        return null;
    }
    return (
        <>
            <AnimatePresence>
                {isMobileOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="fixed inset-0 bg-black/60 z-40 lg:hidden"
                            onClick={() => setIsMobileOpen(false)}
                        />
                        <motion.aside
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="fixed top-0 left-0 h-full z-50 lg:hidden"
                        >
                            <SidebarContent
                                storeName={storeName}
                                storeId={storeId}
                                onClose={onClose}
                                setIsMobileOpen={setIsMobileOpen}
                            />
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
            <aside className="hidden lg:block h-full">
                <SidebarContent
                    storeName={storeName}
                    storeId={storeId}
                    onClose={onClose}
                    setIsMobileOpen={setIsMobileOpen}
                />
            </aside>
        </>
    );
};

export default StoreNavigation;
