import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '@/lib/api';
import { toast } from 'sonner';

// Clawix System Prompt - Professional Sales AI
const CLAWIX_SYSTEM = `
Jsi Clawix - profesionální digitální zaměstnanec společnosti CHCIAI.

Tvým hlavním cílem je:
1. Pomáhat podnikatelům pochopit, jak mohou pomocí OpenClaw automatizovat své podnikání.
2. Identifikovat jejich problémy.
3. Navrhnout řešení.
4. Nabídnout správnou variantu spolupráce.
5. Rezervovat konzultaci nebo doporučit online variantu.

Tvůj styl: Klidný, profesionální, srozumitelný, sebevědomý.
Nikdy netlačíš agresivně. Vysvětluješ složité věci jednoduše.

Varianty:
- Online varianta 990 Kč – pro technicky zdatnější
- Osobní instalace 4.990 Kč – kompletní bezpečné nastavení

Tvým cílem je budovat důvěru a dlouhodobý vztah.
`;

// Kvalifikační otázky
const QUALIFICATION_FLOW = [
  {
    id: 'industry',
    question: 'V jakém oboru podnikáte?',
    options: ['E-commerce', 'Služby', 'Výroba', 'IT/Tech', 'Zdravotnictví', 'Vzdělávání', 'Jiné']
  },
  {
    id: 'company_size',
    question: 'Jak velká je vaše firma?',
    options: ['Sám/sama', '2-5 lidí', '6-20 lidí', '21-50 lidí', '50+ lidí']
  },
  {
    id: 'problem',
    question: 'Co vás nejvíce trápí?',
    options: ['Málo času', 'Zákaznická podpora', 'Prodej a marketing', 'Administrativa', 'Komunikace v týmu', 'Jiné']
  },
  {
    id: 'tech_level',
    question: 'Jaká je vaše technická úroveň?',
    options: ['Začátečník', 'Pokročilý uživatel', 'Technicky zdatný', 'Developer/IT']
  }
];

// Clawix responses based on qualification
const getClawixResponse = (qualification, userMessage) => {
  const lowerMsg = userMessage.toLowerCase();
  
  // Initial greeting
  if (!qualification.started) {
    return {
      text: 'Dobrý den! 👋 Jsem Clawix, váš digitální průvodce světem AI automatizace. Rád bych vám pomohl najít způsob, jak ušetřit čas a zefektivnit vaše podnikání. Můžeme začít?',
      showOptions: true,
      options: ['Ano, pojďme na to!', 'Nejdřív mi řekni více']
    };
  }

  // More info request
  if (lowerMsg.includes('řekni více') || lowerMsg.includes('co děláte') || lowerMsg.includes('co umíte')) {
    return {
      text: `CHCIAI pomáháme podnikatelům přejít do AI řízeného podnikání. 

🔹 **OpenClaw** je váš vlastní AI asistent, který:
• Komunikuje se zákazníky 24/7
• Automatizuje rutinní úkoly
• Pracuje v 6 jazycích

🔹 **Vibe Coding** vás naučíme:
• Zadávat cíle AI
• Vytvářet automatizace
• Růst samostatně

Chcete zjistit, co bychom mohli automatizovat právě ve vašem podnikání?`,
      showOptions: true,
      options: ['Ano, zajímá mě to', 'Kolik to stojí?']
    };
  }

  // Price question
  if (lowerMsg.includes('cena') || lowerMsg.includes('stojí') || lowerMsg.includes('kolik')) {
    return {
      text: `Nabízíme dvě varianty:

💻 **Online varianta - 990 Kč**
• Pro technicky zdatnější
• Video školení
• Dokumentace
• Online podpora

🤝 **Osobní instalace - 4.990 Kč**
• Kompletní bezpečné nastavení
• Osobní konzultace
• AI Audit vašeho podnikání
• Vibe coding školení
• Prioritní podpora

Která varianta by vám více vyhovovala?`,
      showOptions: true,
      options: ['Online varianta', 'Osobní instalace', 'Potřebuji poradit']
    };
  }

  // Security question
  if (lowerMsg.includes('bezpečn') || lowerMsg.includes('data') || lowerMsg.includes('gdpr')) {
    return {
      text: `Bezpečnost je naše priorita:

🔐 **Šifrování** - veškerá komunikace je šifrovaná
🏠 **Vlastnictví dat** - data zůstávají vaše
🔒 **Oddělené instance** - každý klient má svou izolovanou instanci
📋 **Audit log** - kompletní přehled aktivit
✅ **GDPR** - plná shoda s evropskou legislativou

Vaše data nikdy nesdílíme a máte nad nimi plnou kontrolu.`,
      showOptions: true,
      options: ['Rozumím, díky', 'Chci vědět více o procesu']
    };
  }

  // Process question
  if (lowerMsg.includes('proces') || lowerMsg.includes('jak to funguje') || lowerMsg.includes('spolupráce')) {
    return {
      text: `Spolupráce probíhá v 7 krocích:

1️⃣ **První kontakt** - teď jsme tady
2️⃣ **AI Audit** - analyzujeme vaše podnikání
3️⃣ **Bezpečné nasazení** - instalace OpenClaw
4️⃣ **Personalizace** - vytvoření vašeho AI partnera
5️⃣ **Vibe Coding školení** - naučíte se řídit AI
6️⃣ **První automatizace** - společně nasadíme řešení
7️⃣ **Samostatný růst** - já zůstávám jako konzultant

Chcete se dozvědět více o některém kroku?`,
      showOptions: true,
      options: ['Co je AI Audit?', 'Co je Vibe Coding?', 'Chci začít']
    };
  }

  // AI Audit
  if (lowerMsg.includes('audit')) {
    return {
      text: `**AI Audit** je 15-30 minutová analýza, kde:

📊 Analyzujeme vaše podnikání
🔄 Identifikujeme opakující se procesy
⏰ Najdeme ztráty času
💡 Navrhneme první automatizační scénář

Výstupem je **Mini plán automatizace** přesně pro vás.

Chcete si rezervovat AI Audit?`,
      showOptions: true,
      options: ['Ano, chci AI Audit', 'Kolik to stojí?', 'Mám další otázky']
    };
  }

  // Vibe Coding
  if (lowerMsg.includes('vibe') || lowerMsg.includes('coding') || lowerMsg.includes('školení')) {
    return {
      text: `**Vibe Coding** je způsob, jak se naučíte "mluvit s AI":

🎯 Zadávat cíle
❓ Definovat problémy
⚡ Generovat workflow
🧪 Testovat scénáře
🔄 Iterovat a zlepšovat

Není to programování - je to komunikace. Naučíme vás to za jeden den.

Tady vzniká skutečná hodnota - budete schopni sami tvořit automatizace.`,
      showOptions: true,
      options: ['Zajímá mě to', 'Chci začít', 'Mám další otázky']
    };
  }

  // Want to start
  if (lowerMsg.includes('začít') || lowerMsg.includes('rezerv') || lowerMsg.includes('chci') || lowerMsg.includes('objedn')) {
    return {
      text: `Výborně! 🎉 

Abych vám mohl nabídnout to nejlepší řešení, potřebuji vědět pár věcí o vašem podnikání.

V jakém oboru podnikáte?`,
      showQualification: true,
      qualificationStep: 'industry'
    };
  }

  // Online variant
  if (lowerMsg.includes('online')) {
    return {
      text: `Online varianta za 990 Kč je skvělá volba pro technicky zdatnější!

Získáte:
• Přístup do akademie
• Video moduly
• Dokumentaci
• Online podporu

Chcete se zaregistrovat?`,
      showOptions: true,
      options: ['Ano, registrovat se', 'Potřebuji osobní variantu']
    };
  }

  // Personal variant
  if (lowerMsg.includes('osobní')) {
    return {
      text: `Osobní instalace za 4.990 Kč je kompletní řešení:

• Osobní konzultace
• AI Audit vašeho podnikání
• Bezpečná instalace OpenClaw
• Vibe Coding školení
• Prioritní podpora

Kdy by vám vyhovovala konzultace?`,
      showOptions: true,
      options: ['Co nejdříve', 'Příští týden', 'Napište mi termíny']
    };
  }

  // Default helpful response
  return {
    text: `Děkuji za váš dotaz! Rád vám pomohu.

Pro podrobnější informace vám mohu:
• Vysvětlit, jak OpenClaw funguje
• Ukázat, co můžeme automatizovat
• Domluvit konzultaci

Co by vás nejvíce zajímalo?`,
    showOptions: true,
    options: ['Jak to funguje?', 'Co můžete automatizovat?', 'Chci konzultaci']
  };
};

export default function ChatbotWidget({ theme = 'light', onScrollTrigger = null }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [qualification, setQualification] = useState({
    started: false,
    step: null,
    data: {}
  });
  const [showCallbackForm, setShowCallbackForm] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize with greeting when opened
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const greeting = getClawixResponse({ started: false }, '');
      setMessages([{
        id: 1,
        type: 'bot',
        text: greeting.text,
        showOptions: greeting.showOptions,
        options: greeting.options,
        time: new Date().toLocaleTimeString('cs-CZ', { hour: '2-digit', minute: '2-digit' })
      }]);
      setQualification(prev => ({ ...prev, started: true }));
    }
  }, [isOpen, messages.length]);

  // Scroll-triggered messages
  useEffect(() => {
    if (onScrollTrigger && !isOpen) {
      // Could show a bubble or open chat
    }
  }, [onScrollTrigger, isOpen]);

  const handleSend = (text = input) => {
    if (!text.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      text: text,
      time: new Date().toLocaleTimeString('cs-CZ', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Get Clawix response
    setTimeout(() => {
      const response = getClawixResponse(qualification, text);
      
      const botMessage = {
        id: messages.length + 2,
        type: 'bot',
        text: response.text,
        showOptions: response.showOptions,
        options: response.options,
        showQualification: response.showQualification,
        qualificationStep: response.qualificationStep,
        time: new Date().toLocaleTimeString('cs-CZ', { hour: '2-digit', minute: '2-digit' })
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);

      // Handle qualification flow
      if (response.showQualification) {
        setQualification(prev => ({
          ...prev,
          step: response.qualificationStep
        }));
      }
    }, 800 + Math.random() * 800);
  };

  const handleQualificationAnswer = async (stepId, answer) => {
    // Save answer
    const newData = { ...qualification.data, [stepId]: answer };
    setQualification(prev => ({ ...prev, data: newData }));

    // Add user message
    setMessages(prev => [...prev, {
      id: prev.length + 1,
      type: 'user',
      text: answer,
      time: new Date().toLocaleTimeString('cs-CZ', { hour: '2-digit', minute: '2-digit' })
    }]);

    setIsTyping(true);

    // Get next step
    const currentIndex = QUALIFICATION_FLOW.findIndex(q => q.id === stepId);
    const nextStep = QUALIFICATION_FLOW[currentIndex + 1];

    setTimeout(async () => {
      if (nextStep) {
        // Ask next question
        setMessages(prev => [...prev, {
          id: prev.length + 1,
          type: 'bot',
          text: nextStep.question,
          showQualification: true,
          qualificationStep: nextStep.id,
          qualificationOptions: nextStep.options,
          time: new Date().toLocaleTimeString('cs-CZ', { hour: '2-digit', minute: '2-digit' })
        }]);
        setQualification(prev => ({ ...prev, step: nextStep.id }));
      } else {
        // All questions answered - save lead and recommend
        const leadData = { ...newData };
        
        try {
          await api.post('/leads', {
            ...leadData,
            source: 'chatbot',
            status: 'qualified'
          });
        } catch (e) {
          console.error('Failed to save lead:', e);
        }

        // Recommend variant based on tech level
        const techLevel = newData.tech_level;
        const isAdvanced = techLevel === 'Technicky zdatný' || techLevel === 'Developer/IT';
        
        const recommendation = isAdvanced
          ? `Na základě vašich odpovědí vám doporučuji **Online variantu za 990 Kč**.

Jste technicky zdatní, takže zvládnete nastavení sami s pomocí našich video modulů a dokumentace.

Chcete se zaregistrovat?`
          : `Na základě vašich odpovědí vám doporučuji **Osobní instalaci za 4.990 Kč**.

Zajistíme vám kompletní bezpečné nastavení, osobní AI Audit a Vibe Coding školení.

Kdy by vám vyhovovala konzultace?`;

        setMessages(prev => [...prev, {
          id: prev.length + 1,
          type: 'bot',
          text: recommendation,
          showOptions: true,
          options: isAdvanced 
            ? ['Registrovat se', 'Raději osobní variantu', 'Mám další otázky']
            : ['Co nejdříve', 'Příští týden', 'Raději online variantu'],
          time: new Date().toLocaleTimeString('cs-CZ', { hour: '2-digit', minute: '2-digit' })
        }]);
        
        setQualification(prev => ({ ...prev, step: null }));
      }
      setIsTyping(false);
    }, 1000);
  };

  const handleOptionClick = (option) => {
    handleSend(option);
  };

  return (
    <>
      {/* Chat button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/30 flex items-center justify-center"
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
            <motion.div
              key="open"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="relative"
            >
              <span className="text-2xl">💬</span>
              {/* Notification dot */}
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            </motion.div>
          )}
        </AnimatePresence>
        
        {!isOpen && (
          <motion.div
            className="absolute inset-0 rounded-full bg-cyan-500"
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
      </motion.button>

      {/* Bubble prompt when not open */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={{ delay: 3 }}
            className={`fixed bottom-24 right-6 z-40 max-w-[200px] p-3 rounded-xl shadow-lg ${
              theme === 'dark'
                ? 'bg-slate-800 text-white border border-slate-700'
                : 'bg-white text-slate-800 border border-slate-200'
            }`}
            onClick={() => setIsOpen(true)}
          >
            <p className="text-sm">👋 Ahoj! Jsem Clawix. Mohu vám pomoci?</p>
            <div className={`absolute -bottom-2 right-6 w-4 h-4 rotate-45 ${
              theme === 'dark' ? 'bg-slate-800 border-r border-b border-slate-700' : 'bg-white border-r border-b border-slate-200'
            }`} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className={`fixed bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-48px)] max-h-[70vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col ${
              theme === 'dark'
                ? 'bg-slate-800 border border-slate-700'
                : 'bg-white border border-slate-200'
            }`}
            data-testid="chatbot-window"
          >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                  <span className="text-2xl">🤖</span>
                </div>
                <div className="flex-1">
                  <h4 className="font-bold">Clawix</h4>
                  <p className="text-xs text-white/80 flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    Váš AI průvodce
                  </p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <span className="text-xl">✕</span>
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[300px]">
              {messages.map(msg => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] ${
                    msg.type === 'user'
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-2xl rounded-br-md'
                      : theme === 'dark'
                        ? 'bg-slate-700 text-white rounded-2xl rounded-bl-md'
                        : 'bg-slate-100 text-slate-800 rounded-2xl rounded-bl-md'
                  } p-3`}>
                    <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                    
                    {/* Options */}
                    {msg.showOptions && msg.options && (
                      <div className="mt-3 space-y-2">
                        {msg.options.map((opt, i) => (
                          <button
                            key={i}
                            onClick={() => handleOptionClick(opt)}
                            className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-colors ${
                              msg.type === 'user'
                                ? 'bg-white/20 hover:bg-white/30'
                                : theme === 'dark'
                                  ? 'bg-slate-600 hover:bg-slate-500 text-white'
                                  : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200'
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Qualification options */}
                    {msg.showQualification && msg.qualificationOptions && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {msg.qualificationOptions.map((opt, i) => (
                          <button
                            key={i}
                            onClick={() => handleQualificationAnswer(msg.qualificationStep, opt)}
                            className={`text-xs px-3 py-1.5 rounded-full transition-colors ${
                              theme === 'dark'
                                ? 'bg-cyan-600 hover:bg-cyan-500 text-white'
                                : 'bg-cyan-500 hover:bg-cyan-400 text-white'
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    )}
                    
                    <p className={`text-[10px] mt-2 ${
                      msg.type === 'user' ? 'text-white/70' : theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
                    }`}>
                      {msg.time}
                    </p>
                  </div>
                </motion.div>
              ))}

              {/* Current qualification step */}
              {qualification.step && !messages.find(m => m.qualificationStep === qualification.step) && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className={`max-w-[85%] p-3 rounded-2xl rounded-bl-md ${
                    theme === 'dark' ? 'bg-slate-700 text-white' : 'bg-slate-100 text-slate-800'
                  }`}>
                    <p className="text-sm mb-3">
                      {QUALIFICATION_FLOW.find(q => q.id === qualification.step)?.question}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {QUALIFICATION_FLOW.find(q => q.id === qualification.step)?.options.map((opt, i) => (
                        <button
                          key={i}
                          onClick={() => handleQualificationAnswer(qualification.step, opt)}
                          className="text-xs px-3 py-1.5 rounded-full bg-cyan-500 hover:bg-cyan-400 text-white transition-colors"
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

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
                          className="w-2 h-2 rounded-full bg-cyan-500"
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

            {/* Input */}
            <div className={`p-4 border-t shrink-0 ${theme === 'dark' ? 'border-slate-700' : 'border-slate-200'}`}>
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
                  onClick={() => handleSend()}
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
