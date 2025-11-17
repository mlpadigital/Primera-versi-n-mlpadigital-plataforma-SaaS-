import React, { useState, useEffect, useRef } from 'react';
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Textarea } from "../../../components/ui/textarea";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../../../components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "../../../components/ui/dialog";
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Lightbulb, Loader2, Send, Key, Bot, User, CheckCircle } from 'lucide-react';
//import { supabase } from '../../../lib/customSupabaseClient';
import { useToast } from "../../../components/ui/use-toast";

const MarketingAIAssistantPage = () => {
  const [apiKey, setApiKey] = useState('');
  const [apiKeyIsSet, setApiKeyIsSet] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isCheckingKey, setIsCheckingKey] = useState(true);
  const [prompt, setPrompt] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [loadingResponse, setLoadingResponse] = useState(false);
  const { toast } = useToast();
  const chatContainerRef = useRef(null);

  useEffect(() => {
    const checkApiKey = async () => {
      setIsCheckingKey(true);
      try {
        const { data, error } = await supabase.functions.invoke('check-openai-key');
        if (error) throw error;
        setApiKeyIsSet(data.isSet);
      } catch (error) {
        console.error("Error checking API key:", error);
      } finally {
        setIsCheckingKey(false);
      }
    };
    checkApiKey();
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const handleSaveApiKey = async () => {
    if (!apiKey.trim()) {
      toast({ title: "Clave de API requerida", description: "Por favor, introduce tu clave de API de OpenAI.", variant: "destructive" });
      return;
    }
    setIsSaving(true);
    try {
      const { error } = await supabase.functions.invoke('set-openai-key', {
        body: JSON.stringify({ apiKey }),
      });
      if (error) throw error;
      setApiKeyIsSet(true);
      setApiKey('');
      toast({
        title: "¡Éxito!",
        description: "Tu clave de API de OpenAI ha sido guardada de forma segura.",
        className: "bg-green-600 text-white",
      });
    } catch (error) {
      console.error("Error saving API key:", error);
      toast({ title: "Error al guardar", description: "No se pudo guardar la clave de API. Inténtalo de nuevo.", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSendPrompt = async () => {
    if (!prompt.trim()) return;
    const newHistory = [...chatHistory, { role: 'user', content: prompt }];
    setChatHistory(newHistory);
    setPrompt('');
    setLoadingResponse(true);

    try {
      const { data, error } = await supabase.functions.invoke('openai-chat', {
        body: JSON.stringify({ history: newHistory }),
      });
      if (error) throw error;
      setChatHistory(prev => [...prev, { role: 'assistant', content: data.reply }]);
    } catch (error) {
      console.error("Error getting AI response:", error);
      setChatHistory(prev => [...prev, { role: 'assistant', content: "Lo siento, ocurrió un error al procesar tu solicitud." }]);
      toast({ title: "Error de la IA", description: "No se pudo obtener una respuesta. Verifica tu clave de API y vuelve a intentarlo.", variant: "destructive" });
    } finally {
      setLoadingResponse(false);
    }
  };

  const promptSuggestions = [
    "Dame 5 ideas para un post de Instagram para mi tienda de...",
    "Redacta un email de bienvenida para nuevos suscriptores.",
    "¿Cuáles son las mejores horas para publicar en redes sociales?",
    "Crea un eslogan para una marca de ropa sostenible.",
  ];

  if (isCheckingKey) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="h-12 w-12 animate-spin text-yellow-400" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-4 md:p-8 h-full flex flex-col"
    >
      <div className="flex items-center gap-4 mb-6">
        <Sparkles className="h-12 w-12 text-yellow-400" />
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-yellow-300">Asistente de Marketing IA</h1>
          <p className="text-indigo-200">Tu copiloto de IA para resolver cualquier duda de marketing.</p>
        </div>
      </div>

      {!apiKeyIsSet ? (
        <Card className="glass-effect border-purple-500 shadow-xl max-w-2xl mx-auto text-center">
          <CardHeader>
            <Key className="h-16 w-16 mx-auto text-yellow-400 mb-4" />
            <CardTitle className="text-2xl text-white">Conecta tu cuenta de OpenAI</CardTitle>
            <CardDescription className="text-indigo-300">
              Para activar el asistente de IA, necesitas proporcionar tu clave de API de OpenAI. La guardaremos de forma segura.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Input
              type="password"
              placeholder="Introduce tu clave de API (sk-...)"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="text-black bg-white/90 placeholder-gray-500"
            />
          </CardContent>
          <CardFooter>
            <Button onClick={handleSaveApiKey} className="w-full bg-yellow-400 text-purple-700 hover:bg-yellow-500 font-semibold" disabled={isSaving}>
              {isSaving ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Key className="mr-2 h-5 w-5" />}
              Guardar y Activar Asistente
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <Card className="glass-effect border-purple-500 shadow-xl flex-1 flex flex-col">
          <CardHeader className="flex-row justify-between items-center">
            <div className="flex items-center gap-2 text-green-400">
              <CheckCircle className="h-5 w-5" />
              <span className="font-semibold">Asistente de IA Activado</span>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="text-white hover:bg-white/10 border-purple-400">Cambiar API Key</Button>
              </DialogTrigger>
              <DialogContent className="glass-effect text-white">
                <DialogHeader>
                  <DialogTitle>Actualizar Clave de API de OpenAI</DialogTitle>
                  <DialogDescription className="text-indigo-300">Introduce una nueva clave de API. La anterior será reemplazada.</DialogDescription>
                </DialogHeader>
                <Input
                  type="password"
                  placeholder="Nueva clave de API (sk-...)"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="text-black bg-white/90 placeholder-gray-500 mt-4"
                />
                <DialogFooter>
                  <Button onClick={handleSaveApiKey} className="bg-yellow-400 text-purple-700 hover:bg-yellow-500" disabled={isSaving}>
                    {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Guardar"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent ref={chatContainerRef} className="flex-1 overflow-y-auto space-y-6 p-6">
            <AnimatePresence>
              {chatHistory.map((msg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}
                >
                  {msg.role === 'assistant' && <div className="bg-yellow-400 p-2 rounded-full"><Bot className="h-6 w-6 text-purple-800" /></div>}
                  <div className={`max-w-xl p-4 rounded-2xl ${msg.role === 'user' ? 'bg-purple-600 text-white rounded-br-none' : 'bg-purple-800/50 text-indigo-200 rounded-bl-none'}`}>
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  </div>
                  {msg.role === 'user' && <div className="bg-indigo-500 p-2 rounded-full"><User className="h-6 w-6 text-white" /></div>}
                </motion.div>
              ))}
              {loadingResponse && (
                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-start gap-3">
                    <div className="bg-yellow-400 p-2 rounded-full"><Bot className="h-6 w-6 text-purple-800" /></div>
                    <div className="max-w-xl p-4 rounded-2xl bg-purple-800/50 text-indigo-200 rounded-bl-none flex items-center">
                      <Loader2 className="h-5 w-5 animate-spin mr-2" /> Escribiendo...
                    </div>
                 </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
          <CardFooter className="pt-4 border-t border-purple-700">
            <div className="w-full">
              <div className="flex gap-2 mb-2">
                {promptSuggestions.map(s => (
                  <Button key={s} size="sm" variant="outline" className="text-xs text-indigo-300 hover:bg-white/10 border-purple-400" onClick={() => setPrompt(s)}>
                    <Lightbulb className="mr-2 h-3 w-3" /> {s.substring(0, 20)}...
                  </Button>
                ))}
              </div>
              <div className="flex gap-2">
                <Textarea
                  placeholder="Pregúntale algo a tu asistente de marketing..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendPrompt(); }}}
                  className="text-black bg-white/90 placeholder-gray-500 flex-1"
                  rows={1}
                />
                <Button onClick={handleSendPrompt} className="bg-yellow-400 text-purple-700 hover:bg-yellow-500" disabled={loadingResponse || !prompt.trim()}>
                  <Send className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </CardFooter>
        </Card>
      )}
    </motion.div>
  );
};

export default MarketingAIAssistantPage;