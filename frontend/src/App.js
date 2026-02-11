import { useState, useEffect, useRef } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { InlineWidget } from "react-calendly";
import {
  Bot,
  Sparkles,
  Cog,
  GraduationCap,
  Handshake,
  Send,
  X,
  MessageCircle,
  Menu,
  ArrowRight,
  Mail,
  Building2,
  User,
  ChevronDown,
} from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Navbar Component
const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "#sluzby", label: "Služby" },
    { href: "#o-nas", label: "O nás" },
    { href: "#kontakt", label: "Kontakt" },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "glass py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2" data-testid="logo">
          <span className="text-[#00D9FF] font-heading font-bold text-2xl">chci</span>
          <span className="font-heading font-bold text-2xl text-white">AI</span>
        </a>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-neutral-400 hover:text-white transition-colors font-body"
              data-testid={`nav-${link.label.toLowerCase()}`}
            >
              {link.label}
            </a>
          ))}
          <a
            href="#kontakt"
            className="bg-[#00D9FF] text-black px-6 py-2.5 rounded-full font-semibold hover:bg-[#00B8D9] transition-all hover:scale-105"
            data-testid="nav-cta"
          >
            Konzultace zdarma
          </a>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-white p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          data-testid="mobile-menu-btn"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass mt-2 mx-4 rounded-xl overflow-hidden"
          >
            <div className="p-4 flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-neutral-300 hover:text-white transition-colors py-2"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <a
                href="#kontakt"
                className="bg-[#00D9FF] text-black px-6 py-3 rounded-full font-semibold text-center"
                onClick={() => setMobileOpen(false)}
              >
                Konzultace zdarma
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

// Hero Section
const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      <div className="hero-glow" />
      
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-20 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 mb-8">
            <Sparkles size={16} className="text-[#00D9FF]" />
            <span className="text-sm text-neutral-400">AI transformace pro české firmy</span>
          </div>
          
          <h1 className="font-heading font-bold text-4xl md:text-6xl lg:text-7xl text-white mb-6 tracking-tight">
            Váš digitální partner
            <br />
            <span className="text-[#00D9FF]">pro AI budoucnost</span>
          </h1>
          
          <p className="text-lg md:text-xl text-neutral-400 mb-10 max-w-2xl mx-auto font-body">
            Pomáháme českým firmám implementovat AI asistenty, automatizovat procesy 
            a transformovat byznys pomocí nejmodernějších technologií.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#kontakt"
              className="bg-[#00D9FF] text-black px-8 py-4 rounded-full font-semibold text-lg hover:bg-[#00B8D9] transition-all hover:scale-105 inline-flex items-center justify-center gap-2"
              data-testid="hero-cta-primary"
            >
              Začít konzultaci
              <ArrowRight size={20} />
            </a>
            <a
              href="#sluzby"
              className="border border-white/20 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/5 transition-all inline-flex items-center justify-center gap-2"
              data-testid="hero-cta-secondary"
            >
              Prohlédnout služby
              <ChevronDown size={20} />
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// Services Section
const services = [
  {
    icon: Bot,
    title: "AI Asistenti",
    subtitle: "Clawdbot & OpenClawd",
    description:
      "Kompletní nasazení inteligentních AI asistentů přizpůsobených vašemu byznysu. Zákaznická podpora, interní helpdesk nebo prodejní bot.",
  },
  {
    icon: Cog,
    title: "Automatizace",
    subtitle: "n8n, Make.com, API",
    description:
      "Propojíme vaše systémy a automatizujeme repetitivní úlohy. Opensource řešení bez vendor lock-in.",
  },
  {
    icon: GraduationCap,
    title: "Training",
    subtitle: "Pro váš tým",
    description:
      "Naučíme váš tým efektivně využívat AI nástroje. Praktické workshopy a kontinuální vzdělávání.",
  },
  {
    icon: Handshake,
    title: "Partnerství",
    subtitle: "Dlouhodobá podpora",
    description:
      "Nejsme jen dodavatelé - jsme vaši digitální partneři. Průběžná optimalizace, rozšíření funkcí a podpora.",
  },
];

const ServicesSection = () => {
  return (
    <section id="sluzby" className="py-24 md:py-32 relative">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-heading font-bold text-3xl md:text-5xl text-white mb-4">
            Naše služby
          </h2>
          <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
            Komplexní řešení pro vaši AI transformaci
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="service-card bg-[#0A0A0A] border border-white/10 rounded-2xl p-8"
              data-testid={`service-card-${index}`}
            >
              <div className="w-12 h-12 rounded-xl bg-[#00D9FF]/10 flex items-center justify-center mb-6">
                <service.icon size={24} className="text-[#00D9FF]" />
              </div>
              <h3 className="font-heading font-semibold text-xl text-white mb-1">
                {service.title}
              </h3>
              <p className="text-[#00D9FF] text-sm mb-4 font-mono">
                {service.subtitle}
              </p>
              <p className="text-neutral-400">{service.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// About Section
const AboutSection = () => {
  return (
    <section id="o-nas" className="py-24 md:py-32 relative">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-heading font-bold text-3xl md:text-5xl text-white mb-6">
              Kdo jsme
            </h2>
            <p className="text-neutral-400 text-lg mb-6">
              Jsme duo, které spojuje svět lidí a technologií. Martin zajišťuje 
              komunikaci s klienty a konzultace, Aji (AI) řeší veškerý technický vývoj.
            </p>
            <p className="text-neutral-400 text-lg mb-8">
              Věříme, že AI má pomáhat lidem, ne je nahrazovat. Proto stavíme řešení, 
              která váš tým posílí a zefektivní jeho práci.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6">
              <div className="flex-1 p-6 bg-[#0A0A0A] border border-white/10 rounded-xl">
                <div className="w-12 h-12 rounded-full bg-[#00D9FF]/20 flex items-center justify-center mb-4">
                  <User size={20} className="text-[#00D9FF]" />
                </div>
                <h4 className="font-heading font-semibold text-white mb-1">Martin</h4>
                <p className="text-[#00D9FF] text-sm font-mono mb-2">Konzultant & Sales</p>
                <p className="text-neutral-500 text-sm">Komunikace s klienty, byznys strategie</p>
              </div>
              
              <div className="flex-1 p-6 bg-[#0A0A0A] border border-white/10 rounded-xl">
                <div className="w-12 h-12 rounded-full bg-[#00D9FF]/20 flex items-center justify-center mb-4">
                  <Bot size={20} className="text-[#00D9FF]" />
                </div>
                <h4 className="font-heading font-semibold text-white mb-1">Aji</h4>
                <p className="text-[#00D9FF] text-sm font-mono mb-2">AI Tech Partner</p>
                <p className="text-neutral-500 text-sm">Vývoj, deployment, automatizace</p>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="aspect-square rounded-2xl overflow-hidden border border-white/10">
              <img
                src="https://images.unsplash.com/photo-1737505599159-5ffc1dcbc08f?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1OTV8MHwxfHNlYXJjaHwxfHxhcnRpZmljaWFsJTIwaW50ZWxsaWdlbmNlJTIwYnJhaW4lMjBjaXJjdWl0fGVufDB8fHx8MTc3MDgzMjAzOHww&ixlib=rb-4.1.0&q=85"
                alt="AI Brain Circuit"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-[#00D9FF]/20 rounded-full blur-3xl" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// Contact Section with Calendly
const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
  });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      await axios.post(`${API}/contact`, formData);
      setSent(true);
      setFormData({ name: "", email: "", company: "", message: "" });
    } catch (error) {
      console.error("Error submitting contact form:", error);
    }
    setSending(false);
  };

  return (
    <section id="kontakt" className="py-24 md:py-32 relative">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-heading font-bold text-3xl md:text-5xl text-white mb-4">
            Pojďme spolupracovat
          </h2>
          <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
            Rezervujte si bezplatnou konzultaci nebo nám napište
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-8">
              <h3 className="font-heading font-semibold text-xl text-white mb-6">
                Napište nám
              </h3>
              
              {sent ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-full bg-[#00D9FF]/20 flex items-center justify-center mx-auto mb-4">
                    <Sparkles size={24} className="text-[#00D9FF]" />
                  </div>
                  <h4 className="font-heading text-lg text-white mb-2">Děkujeme!</h4>
                  <p className="text-neutral-400">Ozveme se vám co nejdříve.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="relative">
                    <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-600" />
                    <input
                      type="text"
                      placeholder="Vaše jméno"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="w-full bg-black/50 border border-white/10 rounded-lg h-12 pl-12 pr-4 text-white placeholder:text-neutral-600 focus:border-[#00D9FF] focus:ring-1 focus:ring-[#00D9FF] outline-none transition-colors"
                      data-testid="contact-name"
                    />
                  </div>
                  
                  <div className="relative">
                    <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-600" />
                    <input
                      type="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="w-full bg-black/50 border border-white/10 rounded-lg h-12 pl-12 pr-4 text-white placeholder:text-neutral-600 focus:border-[#00D9FF] focus:ring-1 focus:ring-[#00D9FF] outline-none transition-colors"
                      data-testid="contact-email"
                    />
                  </div>
                  
                  <div className="relative">
                    <Building2 size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-600" />
                    <input
                      type="text"
                      placeholder="Firma (volitelné)"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="w-full bg-black/50 border border-white/10 rounded-lg h-12 pl-12 pr-4 text-white placeholder:text-neutral-600 focus:border-[#00D9FF] focus:ring-1 focus:ring-[#00D9FF] outline-none transition-colors"
                      data-testid="contact-company"
                    />
                  </div>
                  
                  <textarea
                    placeholder="Vaše zpráva"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    rows={4}
                    className="w-full bg-black/50 border border-white/10 rounded-lg p-4 text-white placeholder:text-neutral-600 focus:border-[#00D9FF] focus:ring-1 focus:ring-[#00D9FF] outline-none transition-colors resize-none"
                    data-testid="contact-message"
                  />
                  
                  <button
                    type="submit"
                    disabled={sending}
                    className="w-full bg-[#00D9FF] text-black py-3 rounded-lg font-semibold hover:bg-[#00B8D9] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    data-testid="contact-submit"
                  >
                    {sending ? "Odesílám..." : "Odeslat zprávu"}
                    <Send size={18} />
                  </button>
                </form>
              )}
            </div>
          </motion.div>

          {/* Calendly */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-8 overflow-hidden">
              <h3 className="font-heading font-semibold text-xl text-white mb-6">
                Rezervujte konzultaci
              </h3>
              <div className="rounded-xl overflow-hidden -mx-4 -mb-4" data-testid="calendly-widget">
                <InlineWidget
                  url="https://calendly.com/chciai/konzultace"
                  styles={{ height: "400px", minWidth: "280px" }}
                  pageSettings={{
                    backgroundColor: "0a0a0a",
                    primaryColor: "00D9FF",
                    textColor: "ffffff",
                  }}
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// Footer
const Footer = () => {
  return (
    <footer className="py-12 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-[#00D9FF] font-heading font-bold text-xl">chci</span>
            <span className="font-heading font-bold text-xl text-white">AI</span>
          </div>
          <p className="text-neutral-500 text-sm">
            © 2025 chciai.cz. Všechna práva vyhrazena.
          </p>
          <div className="flex items-center gap-4">
            <a
              href="mailto:info@chciai.cz"
              className="text-neutral-400 hover:text-[#00D9FF] transition-colors"
              data-testid="footer-email"
            >
              info@chciai.cz
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

// Chat Widget
const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);

    try {
      const response = await axios.post(`${API}/chat`, {
        session_id: sessionId,
        message: userMessage,
      });
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: response.data.response },
      ]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Omlouvám se, něco se pokazilo. Zkuste to prosím znovu." },
      ]);
    }
    setLoading(false);
  };

  return (
    <div className="chat-widget">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="chat-window"
            data-testid="chat-window"
          >
            {/* Header */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-[#0A0A0A]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#00D9FF]/20 flex items-center justify-center">
                  <Bot size={20} className="text-[#00D9FF]" />
                </div>
                <div>
                  <h4 className="font-heading font-semibold text-white text-sm">Aji</h4>
                  <p className="text-xs text-neutral-500">AI asistent</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-neutral-400 hover:text-white transition-colors"
                data-testid="chat-close"
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div className="h-[320px] overflow-y-auto p-4 space-y-4">
              {messages.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-neutral-500 text-sm">
                    Ahoj! Jsem Aji, váš AI asistent. Jak vám mohu pomoci?
                  </p>
                </div>
              )}
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm ${
                      msg.role === "user"
                        ? "bg-[#00D9FF] text-black rounded-br-md"
                        : "bg-white/5 text-white rounded-bl-md"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white/5 rounded-2xl rounded-bl-md">
                    <div className="typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={sendMessage} className="p-4 border-t border-white/10">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Napište zprávu..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm text-white placeholder:text-neutral-600 focus:border-[#00D9FF] outline-none"
                  data-testid="chat-input"
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="w-10 h-10 rounded-full bg-[#00D9FF] flex items-center justify-center text-black hover:bg-[#00B8D9] transition-colors disabled:opacity-50"
                  data-testid="chat-send"
                >
                  <Send size={18} />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Bubble */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="chat-bubble"
        data-testid="chat-bubble"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </motion.button>
    </div>
  );
};

// Home Page
const Home = () => {
  return (
    <div className="min-h-screen bg-[#030303]">
      <Navbar />
      <HeroSection />
      <ServicesSection />
      <AboutSection />
      <ContactSection />
      <Footer />
      <ChatWidget />
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
