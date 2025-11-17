import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "../../../components/ui/card";
import { DollarSign, ShoppingCart, Users, Activity, BarChart, Globe } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Bar, BarChart as ReBarChart } from 'recharts';

const salesData = [
  { name: 'Ene', sales: 4000 },
  { name: 'Feb', sales: 3000 },
  { name: 'Mar', sales: 5000 },
  { name: 'Abr', sales: 4500 },
  { name: 'May', sales: 6000 },
  { name: 'Jun', sales: 5500 },
  { name: 'Jul', sales: 7000 },
];

const topProducts = [
  { name: 'Collar de Luna', sales: 120 },
  { name: 'Anillo Estelar', sales: 98 },
  { name: 'Pendientes de Sol', sales: 75 },
  { name: 'Pulsera Galaxia', sales: 60 },
  { name: 'Gargantilla Cometa', sales: 45 },
];

const trafficSources = [
    { source: 'Instagram', visitors: 4500, color: 'bg-pink-500' },
    { source: 'Google', visitors: 3200, color: 'bg-blue-500' },
    { source: 'Facebook', visitors: 2100, color: 'bg-sky-600' },
    { source: 'Directo', visitors: 1500, color: 'bg-purple-500' },
    { source: 'Otros', visitors: 800, color: 'bg-gray-500' },
]

const AnalyticsPage = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="p-4 md:p-8 space-y-8"
    >
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl md:text-4xl font-bold text-yellow-300">Analíticas de la Tienda</h1>
        <p className="text-indigo-200">Un resumen del rendimiento de tu negocio.</p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
      >
        <motion.div variants={itemVariants}>
          <Card className="glass-effect border-green-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-indigo-200">Ingresos Totales</CardTitle>
              <DollarSign className="h-5 w-5 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">$45,231.89</div>
              <p className="text-xs text-green-300">+20.1% desde el mes pasado</p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div variants={itemVariants}>
          <Card className="glass-effect border-blue-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-indigo-200">Ventas</CardTitle>
              <ShoppingCart className="h-5 w-5 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">+2350</div>
              <p className="text-xs text-blue-300">+180.1% desde el mes pasado</p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div variants={itemVariants}>
          <Card className="glass-effect border-purple-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-indigo-200">Visitantes Únicos</CardTitle>
              <Users className="h-5 w-5 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">12,832</div>
              <p className="text-xs text-purple-300">+12.4% desde el mes pasado</p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div variants={itemVariants}>
          <Card className="glass-effect border-yellow-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-indigo-200">Tasa de Conversión</CardTitle>
              <Activity className="h-5 w-5 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">3.25%</div>
              <p className="text-xs text-yellow-300">+2.2% desde el mes pasado</p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      <motion.div
        variants={containerVariants}
        className="grid gap-8 lg:grid-cols-3"
      >
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card className="glass-effect border-purple-500/50 h-[450px]">
            <CardHeader>
              <CardTitle className="text-white">Resumen de Ventas</CardTitle>
              <CardDescription className="text-indigo-300">Ventas totales en los últimos 7 meses.</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                  <XAxis dataKey="name" stroke="#a5b4fc" />
                  <YAxis stroke="#a5b4fc" />
                  <Tooltip contentStyle={{ backgroundColor: 'rgba(30, 30, 50, 0.8)', border: '1px solid #6366f1', color: '#e0e7ff' }} />
                  <Legend wrapperStyle={{ color: '#e0e7ff' }} />
                  <Line type="monotone" dataKey="sales" stroke="#facc15" strokeWidth={3} dot={{ r: 5 }} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div variants={itemVariants}>
          <Card className="glass-effect border-purple-500/50 h-[450px]">
            <CardHeader>
              <CardTitle className="text-white">Productos Más Vendidos</CardTitle>
              <CardDescription className="text-indigo-300">Tus productos estrella este mes.</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {topProducts.map((product, index) => (
                  <li key={index} className="flex justify-between items-center text-sm">
                    <span className="text-indigo-200">{product.name}</span>
                    <span className="font-bold text-white">{product.sales} ventas</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
      
      <motion.div variants={itemVariants}>
        <Card className="glass-effect border-purple-500/50">
            <CardHeader>
                <CardTitle className="text-white">Fuentes de Tráfico</CardTitle>
                <CardDescription className="text-indigo-300">De dónde vienen tus visitantes.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {trafficSources.map(source => (
                        <div key={source.source}>
                            <div className="flex justify-between mb-1 text-sm">
                                <span className="font-medium text-indigo-200">{source.source}</span>
                                <span className="text-white">{source.visitors}</span>
                            </div>
                            <div className="w-full bg-purple-900/50 rounded-full h-2.5">
                                <div className={`${source.color} h-2.5 rounded-full`} style={{width: `${(source.visitors / 8000) * 100}%`}}></div>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
      </motion.div>

    </motion.div>
  );
};

export default AnalyticsPage;