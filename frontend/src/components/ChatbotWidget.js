import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Simple chatbot widget for landing page
export default function ChatbotWidget({ theme = 'light' }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      text: 'Dobrý den! 👋 Jsem Clawix, váš AI asistent. Jak vám mohu pomoci?',
      time: new Date().toLocaleTimeString('cs-CZ', { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Quick replies
  const quickReplies = [
    { text: 'Co umí Clawix?', response: 'Clawix je AI asistent, který může: 🤖 Komunikovat s vašimi zákazníky 24/7, 📞 Volat klientům v různých jazycích, 📧 Odpovídat na e-maily, 📊 Sbírat a analyzovat data. Chcete vědět více?' },
    { text: 'Kolik to stojí?', response: 'Nabízíme flexibilní ceník podle vašich potřeb. Máme plán Základ pro malé firmy a plán Růst pro ty, kteří chtějí více funkcí. Chcete, abych vám zavolal a probrali jsme to podrobněji?' },
    { text: 'Jak začít?', response: 'Začít je jednoduché! 1️⃣ Klikněte na "Vyzkoušet" 2️⃣ Vyplňte základní údaje 3️⃣ Nastavte si chatbota 4️⃣ Integrujte na web. Nebo mi nechte vaše číslo a já vám zavolám!' },
  ];

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      text: input,
      time: new Date().toLocaleTimeString('cs-CZ', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate bot response
    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        type: 'bot',
        text: getBotResponse(input),
        time: new Date().toLocaleTimeString('cs-CZ', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const getBotResponse = (userInput) => {
    const lowerInput = userInput.toLowerCase();
    
    if (lowerInput.includes('cena') || lowerInput.includes('stojí') || lowerInput.includes('kolik')) {
      return 'Ceník závisí na vašich potřebách. Základní plán začíná od 2 990 Kč/měsíc. Chcete vědět více o tom, co je v ceně zahrnuto?';
    }
    if (lowerInput.includes('jak') && (lowerInput.includes('funguje') || lowerInput.includes('začít'))) {
      return 'Je to jednoduché! Vytvoříte si účet, nastavíte chatbota podle svých potřeb a integrujete ho na web. Celý proces trvá jen pár minut. Chcete to zkusit?';
    }
    if (lowerInput.includes('kontakt') || lowerInput.includes('zavolat') || lowerInput.includes('telefon')) {
      return 'Rád vám zavolám! Klikněte na tlačítko "Nechte si zavolat" výše, vyplňte formulář a ozvu se vám v požadovaném čase. 📞';
    }
    if (lowerInput.includes('jazyk') || lowerInput.includes('čeština') || lowerInput.includes('angličtina')) {
      return 'Clawix umí komunikovat v 6 jazycích: čeština, angličtina, němčina, švédština, vietnamština a ukrajinština. Automaticky rozpozná jazyk zákazníka! 🌍';
    }
    if (lowerInput.includes('děkuji') || lowerInput.includes('díky')) {
      return 'Rádo se stalo! 😊 Pokud budete mít další otázky, jsem tu pro vás. Přeji hezký den!';
    }
    
    return 'Děkuji za váš dotaz! Pro podrobnější informace vám rád zavolám. Nebo můžete kliknout na "Vyzkoušet" a sami si vše prohlédnout. Co preferujete?';
  };

  const handleQuickReply = (reply) => {
    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      text: reply.text,
      time: new Date().toLocaleTimeString('cs-CZ', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        type: 'bot',
        text: reply.response,
        time: new Date().toLocaleTimeString('cs-CZ', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 800);
  };

  return (
    <>
      {/* Chat button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/30 flex items-center justify-center"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        data-testid="chatbot-toggle"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.span
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              className="text-2xl"
            >
              ✕
            </motion.span>
          ) : (
            <motion.span
              key="open"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="text-2xl"
            >
              💬
            </motion.span>
          )}
        </AnimatePresence>
        
        {/* Pulse effect */}
        {!isOpen && (
          <motion.div
            className="absolute inset-0 rounded-full bg-cyan-500"
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
      </motion.button>

      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className={`fixed bottom-24 right-6 z-50 w-[360px] max-w-[calc(100vw-48px)] rounded-2xl shadow-2xl overflow-hidden ${
              theme === 'dark'
                ? 'bg-slate-800 border border-slate-700'
                : 'bg-white border border-slate-200'
            }`}
            data-testid="chatbot-window"
          >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <span className="text-xl">🤖</span>
                </div>
                <div>
                  <h4 className="font-semibold">Clawix</h4>
                  <p className="text-xs text-white/80 flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    Online
                  </p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="h-80 overflow-y-auto p-4 space-y-4">
              {messages.map(msg => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] ${
                    msg.type === 'user'
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-2xl rounded-br-md'
                      : theme === 'dark'
                        ? 'bg-slate-700 text-white rounded-2xl rounded-bl-md'
                        : 'bg-slate-100 text-slate-800 rounded-2xl rounded-bl-md'
                  } p-3`}>
                    <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                    <p className={`text-[10px] mt-1 ${
                      msg.type === 'user' ? 'text-white/70' : theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
                    }`}>
                      {msg.time}
                    </p>
                  </div>
                </motion.div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className={`px-4 py-3 rounded-2xl rounded-bl-md ${
                    theme === 'dark' ? 'bg-slate-700' : 'bg-slate-100'
                  }`}>
                    <div className="flex gap-1">
                      {[0, 1, 2].map(i => (
                        <motion.div
                          key={i}
                          className={`w-2 h-2 rounded-full ${theme === 'dark' ? 'bg-slate-400' : 'bg-slate-400'}`}
                          animate={{ y: [0, -5, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.2 }}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick replies */}
            {messages.length < 3 && (
              <div className="px-4 pb-2 flex gap-2 overflow-x-auto">
                {quickReplies.map((reply, i) => (
                  <button
                    key={i}
                    onClick={() => handleQuickReply(reply)}
                    className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                      theme === 'dark'
                        ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {reply.text}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className={`p-4 border-t ${theme === 'dark' ? 'border-slate-700' : 'border-slate-200'}`}>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Napište zprávu..."
                  className={`flex-1 px-4 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
                    theme === 'dark'
                      ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400'
                      : 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400'
                  }`}
                  data-testid="chatbot-input"
                />
                <motion.button
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white disabled:opacity-50"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  data-testid="chatbot-send"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
