import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, X, Send, User, Loader2, MessageSquare } from 'lucide-react';
import { supabase } from './lib/customSupabaseClient';

const AIChatbot = ({ storeId, accentColor = '#FDE047', primaryColor = '#4338CA' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: '¡Hola! Soy tu asistente virtual. ¿Cómo puedo ayudarte con nuestros productos hoy?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('customer-support-chat', {
        body: JSON.stringify({
          history: [...messages, userMessage],
          storeId: storeId
        }),
      });

      if (error) throw error;
      
      const assistantMessage = { role: 'assistant', content: data.reply };
      setMessages(prev => [...prev, assistantMessage]);

    } catch (err) {
      console.error("Error calling chat function:", err);
      const errorMessage = { role: 'assistant', content: 'Lo siento, no puedo responder en este momento. Por favor, intenta de nuevo más tarde.' };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const chatbotVariants = {
    closed: { opacity: 0, y: 20, scale: 0.95 },
    open: { opacity: 1, y: 0, scale: 1 },
  };

  return (
    <>
      <div className="fixed bottom-5 right-5 z-50">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(!isOpen)}
          style={{ backgroundColor: accentColor, color: primaryColor }}
          className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg"
        >
          {isOpen ? <X size={32} /> : <MessageSquare size={32} />}
        </motion.button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={chatbotVariants}
            initial="closed"
            animate="open"
            exit="closed"
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="fixed bottom-24 right-5 w-80 h-[28rem] bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden z-50 border-2"
            style={{ borderColor: primaryColor }}
          >
            <header className="p-4 text-white flex items-center" style={{ backgroundColor: primaryColor }}>
              <Bot className="mr-3" size={24} style={{ color: accentColor }}/>
              <h3 className="font-bold text-lg">Asistente Virtual</h3>
            </header>
            
            <div ref={chatContainerRef} className="flex-1 p-4 overflow-y-auto bg-gray-50">
              <AnimatePresence>
                {messages.map((msg, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex items-start gap-3 my-3 ${msg.role === 'user' ? 'justify-end' : ''}`}
                  >
                    {msg.role === 'assistant' && <div className="p-2 rounded-full" style={{ backgroundColor: accentColor, color: primaryColor }}><Bot size={20}/></div>}
                    <div className={`max-w-[80%] py-2 px-3 rounded-xl ${msg.role === 'user' ? 'bg-gray-200 text-gray-800 rounded-br-none' : 'text-white rounded-bl-none'}`} style={{ backgroundColor: msg.role === 'user' ? '#e5e7eb' : primaryColor}}>
                      <p className="text-sm">{msg.content}</p>
                    </div>
                     {msg.role === 'user' && <div className="bg-gray-300 p-2 rounded-full"><User size={20} className="text-gray-600"/></div>}
                  </motion.div>
                ))}
                 {isLoading && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-start gap-3 my-3">
                        <div className="p-2 rounded-full" style={{ backgroundColor: accentColor, color: primaryColor }}><Bot size={20}/></div>
                        <div className="py-2 px-3 rounded-xl flex items-center" style={{ backgroundColor: primaryColor, color: 'white'}}>
                            <Loader2 className="h-4 w-4 animate-spin mr-2"/>
                            <span className="text-sm">...</span>
                        </div>
                    </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <div className="p-3 border-t bg-white flex items-center">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Escribe tu duda..."
                className="flex-1 px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2"
                style={{ borderColor: primaryColor, '--tw-ring-color': accentColor }}
              />
              <button onClick={handleSend} disabled={isLoading} className="ml-2 p-2 rounded-full text-white" style={{ backgroundColor: primaryColor }}>
                <Send size={20}/>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIChatbot;