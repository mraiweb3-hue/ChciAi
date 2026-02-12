import { useState, useEffect, useRef } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence, useInView } from "framer-motion";
import AvatarShowcase from "./components/AvatarShowcase";
import ModernFloatingAvatars from "./components/ModernFloatingAvatars";

// Configure axios defaults
axios.defaults.timeout = 30000; // 30 seconds
axios.defaults.headers.post['Content-Type'] = 'application/json';

import {
  // Essential UI
  Send,
  X,
  Menu,
  Check,
  ChevronDown,
  
  // Communication
  MessageCircle,
  Phone,
  PhoneCall,
  Mail,
  Mic,
  
  // Business
  TrendingUp,
  TrendingDown,
  CircleDollarSign,
  Users,
  Clock,
  
  // Tech/AI
  Bot,
  Rocket,
  Shield,
  Zap,
  
  // Actions
  RefreshCw,
  User,
  Globe,
} from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || '';
const API = BACKEND_URL ? `${BACKEND_URL}/api` : '/api';

// Animated Counter Component
const AnimatedCounter = ({ end, duration = 2, suffix = "" }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      let startTime;
      const animate = (currentTime) => {
        if (!startTime) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / (duration * 1000), 1);
        setCount(Math.floor(progress * end));
        if (progress < 1) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    }
  }, [isInView, end, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
};

// All supported languages
const allGlobe = [
  { code: "cs", name: "Čeština", flag: "🇨🇿" },
  { code: "sk", name: "Slovenčina", flag: "🇸🇰" },
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "de", name: "Deutsch", flag: "🇩🇪" },
  { code: "uk", name: "Українська", flag: "🇺🇦" },
  { code: "vi", name: "Tiếng Việt", flag: "🇻🇳" },
  { code: "zh", name: "中文", flag: "🇨🇳" },
  { code: "ar", name: "العربية", flag: "🇸🇦" },
  { code: "ru", name: "Русский", flag: "🇷🇺" },
  { code: "pl", name: "Polski", flag: "🇵🇱" },
  { code: "es", name: "Español", flag: "🇪🇸" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
];

// Navbar Component
const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navZaps = [
    { href: "#vibe-coding", label: "Vibe Coding" },
    { href: "#openclaw", label: "OpenClaw" },
    { href: "#sluzby", label: "Služby" },
    { href: "#cenik", label: "Ceník" },
    { href: "#faq", label: "FAQ" },
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

        <div className="hidden lg:flex items-center gap-6">
          {navZaps.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-neutral-400 hover:text-white transition-colors font-body text-sm"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#callback"
            className="bg-[#00D9FF] text-black px-5 py-2 rounded-full font-semibold text-sm hover:bg-[#00B8D9] transition-all hover:scale-105 flex items-center gap-2"
            data-testid="nav-cta"
          >
            <PhoneCall size={16} />
            Zavoláme vám
          </a>
        </div>

        <button
          className="lg:hidden text-white p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          data-testid="mobile-menu-btn"
        >
          <Menu size={24} />
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden glass mt-2 mx-4 rounded-xl overflow-hidden"
          >
            <div className="p-4 flex flex-col gap-4">
              {navZaps.map((link) => (
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
                href="#callback"
                className="bg-[#00D9FF] text-black px-6 py-3 rounded-full font-semibold text-center flex items-center justify-center gap-2"
                onClick={() => setMobileOpen(false)}
              >
                <PhoneCall size={16} />
                Zavoláme vám
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
            <Bot size={16} className="text-[#00D9FF]" />
            <span className="text-sm text-neutral-400">Vibe Coding × OpenClaw × Emergent</span>
          </div>
          
          <h1 className="font-heading font-bold text-4xl md:text-6xl lg:text-7xl text-white mb-6 tracking-tight">
            AI tým který
            <br />
            <span className="text-[#00D9FF]">komunikuje, prodává, roste</span>
          </h1>
          
          <p className="text-lg md:text-xl text-neutral-400 mb-10 max-w-2xl mx-auto font-body">
            <strong className="text-white">Nikdy nespí.</strong> Odpovídá klientům, rezervuje termíny, 
            <strong className="text-[#00D9FF]"> prodává vaše služby 24/7</strong>. 
            Podle vašich potřeb. Ve 50+ jazycích. Začnete za 30 sekund.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#callback"
              className="bg-[#00D9FF] text-black px-8 py-4 rounded-full font-semibold text-lg hover:bg-[#00B8D9] transition-all hover:scale-105 inline-flex items-center justify-center gap-2"
              data-testid="hero-cta-primary"
            >
              <PhoneCall size={20} />
              AI mi zavolá TEĎ (za 30s)
            </a>
            <a
              href="#openclaw"
              className="border border-white/20 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/5 transition-all inline-flex items-center justify-center gap-2"
              data-testid="hero-cta-secondary"
            >
              <Bot size={20} />
              Co je OpenClaw?
            </a>
          </div>

          {/* Language badges */}
          <div className="mt-12 flex flex-wrap justify-center gap-2">
            {allGlobe.slice(0, 8).map((lang) => (
              <span key={lang.code} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-sm text-neutral-400">
                {lang.flag} {lang.name}
              </span>
            ))}
            <span className="px-3 py-1 bg-[#00D9FF]/10 border border-[#00D9FF]/30 rounded-full text-sm text-[#00D9FF]">
              +50 jazyků
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// Vibe Coding Section
const VibeCodingSection = () => {
  return (
    <section id="vibe-coding" className="py-24 md:py-32 relative">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#00D9FF]/30 bg-[#00D9FF]/10 mb-6">
              <Bot size={16} className="text-[#00D9FF]" />
              <span className="text-sm text-[#00D9FF]">Nový způsob práce</span>
            </div>
            
            <h2 className="font-heading font-bold text-3xl md:text-5xl text-white mb-6">
              Co je <span className="text-[#00D9FF]">Vibe Coding</span>?
            </h2>
            
            <p className="text-neutral-400 text-lg mb-6">
              <strong className="text-white">Vibe Coding</strong> je revoluční způsob spolupráce člověka s AI. 
              Vy určujete směr a cíle, AI asistent je realizuje. Komunikujete přirozeně - 
              hlasem, textem, v jakémkoliv jazyce.
            </p>
            
            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#00D9FF]/10 flex items-center justify-center flex-shrink-0 mt-1">
                  <Rocket size={16} className="text-[#00D9FF]" />
                </div>
                <div>
                  <strong className="text-white">Vy řídíte</strong>
                  <p className="text-neutral-500 text-sm">Definujete cíle, priority a hranice</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#00D9FF]/10 flex items-center justify-center flex-shrink-0 mt-1">
                  <Bot size={16} className="text-[#00D9FF]" />
                </div>
                <div>
                  <strong className="text-white">AI vykonává</strong>
                  <p className="text-neutral-500 text-sm">Komunikace, administrativa, marketing 24/7</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#00D9FF]/10 flex items-center justify-center flex-shrink-0 mt-1">
                  <User size={16} className="text-[#00D9FF]" />
                </div>
                <div>
                  <strong className="text-white">My vás naučíme</strong>
                  <p className="text-neutral-500 text-sm">Training je součástí každého balíčku</p>
                </div>
              </li>
            </ul>

            <a
              href="#cenik"
              className="inline-flex items-center gap-2 text-[#00D9FF] font-semibold hover:gap-3 transition-all"
            >
              Vybrat balíček s trainingem
              <ArrowRight size={18} />
            </a>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-neutral-600 text-sm ml-2">vibe-session.ai</span>
              </div>
              
              <div className="space-y-4 font-mono text-sm">
                <div className="flex gap-3">
                  <span className="text-[#00D9FF]">Vy:</span>
                  <span className="text-neutral-300">"Potřebuji odpovědět všem klientům z víkendu"</span>
                </div>
                <div className="flex gap-3">
                  <span className="text-green-400">AI:</span>
                  <span className="text-neutral-400">Mám 12 nových zpráv. 8 dotazů na ceník, 3 rezervace, 1 reklamace. Připravuji odpovědi...</span>
                </div>
                <div className="flex gap-3">
                  <span className="text-green-400">AI:</span>
                  <span className="text-neutral-400">✓ 11 odpovědí odesláno. Reklamaci jsem eskaloval vám.</span>
                </div>
                <div className="flex gap-3">
                  <span className="text-[#00D9FF]">Vy:</span>
                  <span className="text-neutral-300">"Skvělé. Zavolej panu Novákovi ohledně jeho objednávky."</span>
                </div>
                <div className="flex gap-3">
                  <span className="text-green-400">AI:</span>
                  <span className="text-neutral-400">Volám +420 xxx xxx xxx v češtině...</span>
                </div>
              </div>
            </div>
            
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-[#00D9FF]/20 rounded-full blur-3xl" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// OpenClaw Section
const OpenClawSection = () => {
  const benefits = [
    {
      icon: Unlock,
      title: "100% Open Source",
      description: "Žádné skryté poplatky, žádný vendor lock-in. Kód je váš, data jsou vaše.",
    },
    {
      icon: Shield,
      title: "Plná kontrola",
      description: "Běží na vašem zařízení. Vy rozhodujete, kam má AI přístup.",
    },
    {
      icon: CircleDollarSign,
      title: "Bez měsíčních poplatků za AI",
      description: "Platíte jen za tokeny které spotřebujete. Průhledné náklady.",
    },
    {
      icon: Globe,
      title: "50+ světových jazyků",
      description: "Čeština, angličtina, vietnamština, mandarínština, arabština, ukrajinština...",
    },
    {
      icon: Workflow,
      title: "Integrace se vším",
      description: "CRM, email, WhatsApp, Instagram, Facebook, SEO nástroje, e-shopy.",
    },
    {
      icon: Shield,
      title: "Bezpečnostní limity",
      description: "Ochrana proti zneužití - časové limity na hovory a zprávy.",
    },
  ];

  return (
    <section id="openclaw" className="py-24 md:py-32 relative bg-gradient-to-b from-transparent via-[#00D9FF]/5 to-transparent">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-green-500/30 bg-green-500/10 mb-6">
            <Bot size={16} className="text-green-400" />
            <span className="text-sm text-green-400">Open Source</span>
          </div>
          
          <h2 className="font-heading font-bold text-3xl md:text-5xl text-white mb-4">
            Proč <span className="text-[#00D9FF]">OpenClaw</span>?
          </h2>
          
          <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
            OpenClaw je open source AI asistent postavený na platformě <strong className="text-white">Emergent</strong>. 
            Žádné skryté náklady, plná transparentnost, absolutní kontrola nad vašimi daty.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 hover:border-[#00D9FF]/30 transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00D9FF]/20 to-[#00D9FF]/5 flex items-center justify-center mb-4">
                <benefit.icon size={24} className="text-[#00D9FF]" />
              </div>
              <h3 className="font-heading font-semibold text-lg text-white mb-2">
                {benefit.title}
              </h3>
              <p className="text-neutral-400 text-sm">{benefit.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Devices */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-8 text-center"
        >
          <h3 className="font-heading font-semibold text-xl text-white mb-6">
            OpenClaw běží všude
          </h3>
          <div className="flex flex-wrap justify-center gap-8">
            <div className="flex flex-col items-center gap-2">
              <Monitor size={40} className="text-[#00D9FF]" />
              <span className="text-neutral-400 text-sm">Počítač</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Laptop size={40} className="text-[#00D9FF]" />
              <span className="text-neutral-400 text-sm">Notebook</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Tablet size={40} className="text-[#00D9FF]" />
              <span className="text-neutral-400 text-sm">iPad</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Smartphone size={40} className="text-[#00D9FF]" />
              <span className="text-neutral-400 text-sm">Mobil</span>
            </div>
          </div>
          <p className="text-neutral-500 text-sm mt-6">
            Ovládejte přes WhatsApp, Telegram, email nebo webové rozhraní
          </p>
        </motion.div>
      </div>
    </section>
  );
};

// Services Section
const services = [
  {
    icon: Bot,
    title: "Nastavení OpenClaw",
    description: "Kompletní instalace a konfigurace AI asistenta na vaše zařízení.",
    includes: ["Instalace na PC/tablet/mobil", "Základní konfigurace", "Propojení s WhatsApp"],
  },
  {
    icon: Zap,
    title: "Integrace",
    description: "Propojení s vašimi stávajícími systémy a aplikacemi.",
    includes: ["CRM systémy", "Email marketing", "Sociální sítě", "E-shop platformy"],
  },
  {
    icon: User,
    title: "Vibe Coding Training",
    description: "Naučíme vás efektivně spolupracovat s AI asistentem.",
    includes: ["Osobní školení", "Video tutoriály", "Průběžná podpora"],
  },
  {
    icon: Shield,
    title: "Bezpečnost & Limity",
    description: "Ochrana proti zneužití a kontrola nákladů.",
    includes: ["Časové limity hovorů", "Denní limity zpráv", "Monitoring spotřeby"],
  },
];

const integrationsIcons = [
  { icon: MailIcon, name: "Email" },
  { icon: MessageSquare, name: "WhatsApp" },
  { icon: Instagram, name: "Instagram" },
  { icon: Facebook, name: "Facebook" },
  { icon: Zapedin, name: "ZapedIn" },
  { icon: Search, name: "SEO" },
  { icon: ShoppingCart, name: "E-shop" },
  { icon: Bot, name: "CRM" },
];

// Use Cases Section - Insert after OpenClawSection, before ServicesSection

const useCases = [
  {
    icon: "🔧",
    title: "Automechanik",
    problem: "10+ hodin týdně na telefonech s rezervacemi",
    solution: "AI rezervuje termíny, připomíná STK, odpovídá na dotazy o cenách",
    savings: "10 hodin/týdně",
    color: "orange"
  },
  {
    icon: "💅",
    title: "Kosmetička",
    problem: "Ztracené rezervace přes Instagram DM",
    solution: "AI spravuje kalendář, potvrzuje termíny, posílá připomínky",
    savings: "15+ nových klientů/měsíc",
    color: "pink"
  },
  {
    icon: "🏠",
    title: "Reality",
    problem: "První kontakt s klienty trvá příliš dlouho",
    solution: "AI odpovídá na dotazy 24/7, posílá info o nemovitostech, domlouvá prohlídky",
    savings: "50% rychlejší reakce",
    color: "blue"
  },
  {
    icon: "💪",
    title: "Posilovna",
    problem: "Správa členství a rezervací trenérů",
    solution: "AI řeší registrace, rezervace lekcí, platby, připomínky",
    savings: "8 hodin/týdně",
    color: "red"
  },
  {
    icon: "🧘",
    title: "Jóga Studio",
    problem: "Komunikace s klienty o kurzech a cenách",
    solution: "AI booking lekcí, info o kurzech, speciální nabídky",
    savings: "100% automatizace",
    color: "purple"
  },
  {
    icon: "🍽️",
    title: "Restaurace",
    problem: "Rezervace stolů přes telefon/WhatsApp",
    solution: "AI rezervace 24/7, menu info, speciální události, delivery",
    savings: "20+ rezervací navíc/den",
    color: "green"
  },
  {
    icon: "🎵",
    title: "Klub/Bar",
    problem: "VIP rezervace, akce, guest listy",
    solution: "AI VIP stoly, info o akcích, guest list management",
    savings: "30% více VIP rezervací",
    color: "cyan"
  },
  {
    icon: "🎨",
    title: "Umělec/Kreativec",
    problem: "Cenové nabídky a objednávky custom prací",
    solution: "AI posílá portfolio, cenové kalkulace, domlouvá schůzky",
    savings: "5+ nových zakázek/měsíc",
    color: "yellow"
  },
];

// Benefits Section - 6 Critical Business Problems AI Solves

const benefits = [
  {
    icon: Clock,
    title: "Ztracený čas na telefonech",
    problem: "10-15 hodin týdně trávíte odpovídáním na stále stejné otázky",
    solution: "AI odpovídá okamžitě 24/7. Vy se věnujete práci, ne telefonům.",
    impact: "Úspora 10+ hodin týdně = 2 celé pracovní dny",
    color: "blue",
    stats: "83% podnikatelů říká, že telefon je největší rušivý element"
  },
  {
    icon: MessageSquare,
    title: "Ztracené objednávky v noci/víkendy",
    problem: "Klient píše v sobotu večer. V pondělí už si objednal u konkurence.",
    solution: "AI odpovídá IHNED, přijímá objednávky, rezervuje termíny 24/7.",
    impact: "+30% více objednávek jen z nočních hodin",
    color: "purple",
    stats: "68% lidí píže mimo pracovní dobu"
  },
  {
    icon: Users,
    title: "Zapomenuté follow-upy",
    problem: "Slíbíte zavolat zpět. Zapomenete. Klient jde jinam.",
    solution: "AI automaticky sleduje, připomíná, kontaktuje. Žádný lead nezmizí.",
    impact: "+45% konverze z leadů na platící klienty",
    color: "green",
    stats: "80% leadů vyžaduje 5+ follow-upů"
  },
  {
    icon: Clock,
    title: "Chaos v rezervacích",
    problem: "Double-booking, zapomenuté termíny, no-show klienti.",
    solution: "AI spravuje kalendář, posílá připomínky, potvrzuje termíny.",
    impact: "-60% no-show, +100% organizace",
    color: "orange",
    stats: "Průměrný no-show rate je 23%"
  },
  {
    icon: TrendingDown,
    title: "Nízká návratnost klientů",
    problem: "Klient přijde jednou a zmizí. Vy nevíte proč.",
    solution: "AI posílá follow-up, speciální nabídky, připomíná služby.",
    impact: "+50% opakovaných návštěv",
    color: "red",
    stats: "Získat nového klienta je 5x dražší než udržet stávajícího"
  },
  {
    icon: CircleDollarSign,
    title: "Peníze zůstávají na stole",
    problem: "Klient by chtěl i další služby, ale vy nemáte čas nabízet.",
    solution: "AI aktivně nabízí doplňkové služby, balíčky, up-selly.",
    impact: "+35% průměrná hodnota objednávky",
    color: "yellow",
    stats: "70% klientů by utratilo více, kdyby jim to někdo nabídl"
  },
];

const BenefitsSection = () => {
  return (
    <section className="py-24 md:py-32 relative">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-heading font-bold text-3xl md:text-5xl text-white mb-4">
            6 věcí které vás stojí peníze
            <br />
            <span className="text-[#00D9FF]">a vy to možná ani nevíte</span>
          </h2>
          <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
            Každá z těchto situací vás stojí <strong className="text-white">10 000 - 50 000 Kč měsíčně</strong> v ztracených příjmech.
            AI to vyřeší za zlomek ceny.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 hover:border-[#00D9FF]/30 transition-all group"
            >
              {/* Icon */}
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-red-500/20 to-red-500/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <benefit.icon size={28} className="text-red-400" />
              </div>

              {/* Title */}
              <h3 className="font-heading font-semibold text-xl text-white mb-3">
                {benefit.title}
              </h3>

              {/* Problem */}
              <div className="mb-4">
                <div className="flex items-start gap-2 mb-2">
                  <X size={16} className="text-red-400 flex-shrink-0 mt-1" />
                  <p className="text-neutral-400 text-sm leading-relaxed">
                    {benefit.problem}
                  </p>
                </div>
              </div>

              {/* Solution */}
              <div className="mb-4 pb-4 border-b border-white/10">
                <div className="flex items-start gap-2 mb-2">
                  <Check size={16} className="text-[#00D9FF] flex-shrink-0 mt-1" />
                  <p className="text-neutral-300 text-sm leading-relaxed">
                    {benefit.solution}
                  </p>
                </div>
              </div>

              {/* Impact */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <TrendingUp size={16} className="text-green-400" />
                  <span className="text-green-400 font-semibold text-sm">
                    {benefit.impact}
                  </span>
                </div>
                <p className="text-neutral-600 text-xs italic">
                  {benefit.stats}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="bg-gradient-to-r from-red-500/10 via-[#00D9FF]/10 to-green-500/10 border border-[#00D9FF]/20 rounded-2xl p-8 max-w-3xl mx-auto">
            <h3 className="font-heading font-bold text-2xl text-white mb-4">
              Kolik z těchto 6 problémů máte VY?
            </h3>
            <p className="text-neutral-300 mb-6">
              I kdyby AI vyřešil jen 2 z nich, vrátí se vám investice během <strong className="text-[#00D9FF]">1. měsíce</strong>.
            </p>
            <a
              href="#voice-demo"
              className="inline-flex items-center gap-2 bg-[#00D9FF] text-black px-8 py-4 rounded-full font-semibold hover:bg-[#00B8D9] transition-all hover:scale-105"
            >
              <PhoneCall size={20} />
              AI mi zavolá za 30 sekund - chci slyšet jak to funguje
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const UseCasesSection = () => {
  return (
    <section className="py-24 md:py-32 relative bg-gradient-to-b from-transparent via-[#00D9FF]/5 to-transparent">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-heading font-bold text-3xl md:text-5xl text-white mb-4">
            Kdo využívá AI asistenty?
          </h2>
          <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
            Konkrétní příklady z praxe. Vyberte si svůj obor a zjistěte, jak AI ušetří váš čas.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {useCases.map((useCase, index) => (
            <motion.div
              key={useCase.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 hover:border-[#00D9FF]/50 hover:shadow-lg hover:shadow-[#00D9FF]/20 transition-all duration-300 group cursor-pointer"
            >
              <motion.div 
                className="text-4xl mb-4"
                whileHover={{ scale: 1.2, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {useCase.icon}
              </motion.div>
              <h3 className="font-heading font-semibold text-lg text-white mb-3">
                {useCase.title}
              </h3>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-red-400 font-semibold">Problém:</span>
                  <p className="text-neutral-500 mt-1">{useCase.problem}</p>
                </div>
                <div>
                  <span className="text-[#00D9FF] font-semibold">Řešení:</span>
                  <p className="text-neutral-400 mt-1">{useCase.solution}</p>
                </div>
                <div className="pt-3 border-t border-white/10">
                  <span className="text-green-400 font-semibold">Úspora:</span>
                  <p className="text-green-300 mt-1">{useCase.savings}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Growth Journey */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-[#0A0A0A] to-[#00D9FF]/10 border border-[#00D9FF]/20 rounded-2xl p-8 md:p-12"
        >
          <h3 className="font-heading font-bold text-2xl md:text-3xl text-white mb-8 text-center">
            Od komunikace k aplikacím na míru
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-[#00D9FF]/20 flex items-center justify-center mx-auto mb-4">
                <MessageSquare size={32} className="text-[#00D9FF]" />
              </div>
              <h4 className="font-semibold text-white mb-2">1. START</h4>
              <p className="text-neutral-400 text-sm">
                AI komunikuje s klienty přes WhatsApp, email, sociální sítě
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                <Shield size={32} className="text-green-400" />
              </div>
              <h4 className="font-semibold text-white mb-2">2. DŮVĚRA</h4>
              <p className="text-neutral-400 text-sm">
                Vidíte že funguje. AI zvládá rutinu bezchybně 24/7
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto mb-4">
                <Zap size={32} className="text-purple-400" />
              </div>
              <h4 className="font-semibold text-white mb-2">3. EXPANZE</h4>
              <p className="text-neutral-400 text-sm">
                Otevíráte více funkcí: rezervace, platby, CRM, marketing
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-yellow-500/20 flex items-center justify-center mx-auto mb-4">
                <Rocket size={32} className="text-yellow-400" />
              </div>
              <h4 className="font-semibold text-white mb-2">4. RŮST</h4>
              <p className="text-neutral-400 text-sm">
                Webové stránky, mobilní aplikace, komplexní digitální systémy
              </p>
            </div>
          </div>

          <div className="mt-10 text-center">
            <p className="text-neutral-300 mb-6">
              <strong className="text-white">Nabízíme kompletní digitální řešení:</strong><br/>
              AI asistenti • Webové stránky • Mobilní aplikace • E-shopy • CRM systémy
            </p>
            <a
              href="#callback"
              className="inline-flex items-center gap-2 bg-[#00D9FF] text-black px-8 py-4 rounded-full font-semibold hover:bg-[#00B8D9] transition-all"
            >
              <PhoneCall size={20} />
              Začněte s AI asistentem TEĎ
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
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
            Co pro vás uděláme
          </h2>
          <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
            Kompletní nastavení, integrace a training v jednom balíčku
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00D9FF]/20 to-[#00D9FF]/5 flex items-center justify-center mb-4">
                <service.icon size={24} className="text-[#00D9FF]" />
              </div>
              <h3 className="font-heading font-semibold text-xl text-white mb-2">
                {service.title}
              </h3>
              <p className="text-neutral-400 mb-4">{service.description}</p>
              <ul className="space-y-2">
                {service.includes.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-neutral-300 text-sm">
                    <Check size={14} className="text-[#00D9FF]" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Integrations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h3 className="font-heading font-semibold text-xl text-white mb-6">
            Propojíme vás se vším
          </h3>
          <div className="flex flex-wrap justify-center gap-4">
            {integrationsIcons.map((integration) => (
              <div
                key={integration.name}
                className="flex flex-col items-center gap-2 px-4 py-3 bg-white/5 border border-white/10 rounded-xl hover:border-[#00D9FF]/30 transition-all"
              >
                <integration.icon size={24} className="text-neutral-400" />
                <span className="text-xs text-neutral-500">{integration.name}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// Pricing Section
const pricingPlans = [
  {
    name: "Start",
    price: "9 500",
    priceType: "jednorázově",
    description: "Pro jednotlivce a malé firmy",
    icon: Rocket,
    features: [
      "Nastavení OpenClaw AI asistenta",
      "Instalace na 1 zařízení (PC/tablet/mobil)",
      "Propojení s WhatsApp",
      "2 hodiny Vibe Coding training",
      "Čeština + 2 další jazyky",
      "Email podpora 30 dní",
      "Bezpečnostní limity nastaveny",
    ],
    notIncluded: [
      "CRM integrace",
      "Sociální sítě",
      "Prioritní podpora",
    ],
    popular: false,
    color: "white",
  },
  {
    name: "Business",
    price: "19 500",
    priceType: "jednorázově",
    description: "Pro rostoucí firmy",
    icon: TrendingUp,
    features: [
      "Vše ze Start +",
      "Instalace na 3 zařízení",
      "WhatsApp + email integrace",
      "Instagram & Facebook propojení",
      "CRM integrace (základní)",
      "5 hodin Vibe Coding training",
      "Všechny světové jazyky",
      "Prioritní podpora 60 dní",
      "Pokročilé bezpečnostní limity",
    ],
    notIncluded: [
      "Vlastní AI model",
      "SEO automatizace",
    ],
    popular: true,
    color: "cyan",
  },
  {
    name: "Enterprise",
    price: "39 500",
    priceType: "jednorázově",
    description: "Kompletní AI transformace",
    icon: Rocket,
    features: [
      "Vše z Business +",
      "Neomezená zařízení",
      "Všechny integrace (CRM, e-shop, SEO...)",
      "Vlastní AI model na míru",
      "10 hodin Vibe Coding training",
      "On-site školení vašeho týmu",
      "Dedikovaný account manager",
      "Prioritní podpora 6 měsíců",
      "Telefonní linka 24/7",
      "Pokročilý monitoring a reporty",
    ],
    notIncluded: [],
    popular: false,
    color: "gold",
  },
];

const PricingSection = () => {
  return (
    <section id="cenik" className="py-24 md:py-32 relative">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#00D9FF]/30 bg-[#00D9FF]/10 mb-6">
            <CreditCard size={16} className="text-[#00D9FF]" />
            <span className="text-sm text-[#00D9FF]">Jednorázová platba + vaše tokeny</span>
          </div>
          <h2 className="font-heading font-bold text-3xl md:text-5xl text-white mb-4">
            Vyberte si balíček
          </h2>
          <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
            Platíte jednorázově za nastavení. Pak jen tokeny které spotřebujete.
            <br />
            <span className="text-[#00D9FF]">Žádné měsíční poplatky za AI.</span>
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pricingPlans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`relative bg-[#0A0A0A] border rounded-2xl p-8 ${
                plan.popular ? "border-[#00D9FF] shadow-lg shadow-[#00D9FF]/10" : "border-white/10"
              }`}
              data-testid={`pricing-${plan.name.toLowerCase()}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-[#00D9FF] text-black text-sm font-semibold px-4 py-1 rounded-full">
                    Nejoblíbenější
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4 ${
                  plan.color === "cyan" ? "bg-gradient-to-br from-[#00D9FF]/30 to-[#00D9FF]/10" :
                  plan.color === "gold" ? "bg-gradient-to-br from-yellow-500/30 to-yellow-500/10" :
                  "bg-gradient-to-br from-white/20 to-white/5"
                }`}>
                  <plan.icon size={28} className={
                    plan.color === "cyan" ? "text-[#00D9FF]" :
                    plan.color === "gold" ? "text-yellow-400" :
                    "text-white"
                  } />
                </div>
                <h3 className="font-heading font-bold text-2xl text-white mb-2">{plan.name}</h3>
                <p className="text-neutral-500 text-sm mb-4">{plan.description}</p>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="font-heading font-bold text-4xl text-white">{plan.price}</span>
                  <span className="text-neutral-400">Kč</span>
                </div>
                <p className="text-[#00D9FF] text-sm">{plan.priceType}</p>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-neutral-300 text-sm">
                    <Check size={16} className="text-[#00D9FF] flex-shrink-0 mt-0.5" />
                    {feature}
                  </li>
                ))}
                {plan.notIncluded.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-neutral-600 text-sm">
                    <X size={16} className="flex-shrink-0 mt-0.5" />
                    {feature}
                  </li>
                ))}
              </ul>

              <a
                href="#callback"
                className={`block w-full text-center py-3 rounded-xl font-semibold transition-all ${
                  plan.popular
                    ? "bg-[#00D9FF] text-black hover:bg-[#00B8D9]"
                    : "bg-white/5 text-white border border-white/10 hover:bg-white/10"
                }`}
              >
                Mám zájem
              </a>
            </motion.div>
          ))}
        </div>

        {/* Token info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 bg-[#0A0A0A] border border-white/10 rounded-2xl p-8 text-center"
        >
          <h3 className="font-heading font-semibold text-xl text-white mb-4">
            💡 Jak fungují tokeny?
          </h3>
          <p className="text-neutral-400 max-w-2xl mx-auto mb-6">
            Tokeny jsou "palivo" pro AI. Platíte jen to, co spotřebujete. 
            Průměrná firma spotřebuje <strong className="text-white">200-500 Kč měsíčně</strong> na tokenech.
            Máte plný přehled o spotřebě.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="px-4 py-2 bg-white/5 rounded-lg">
              <span className="text-neutral-500 text-sm">1 zpráva ≈</span>
              <span className="text-white font-semibold ml-1">0.10 Kč</span>
            </div>
            <div className="px-4 py-2 bg-white/5 rounded-lg">
              <span className="text-neutral-500 text-sm">1 minuta hovoru ≈</span>
              <span className="text-white font-semibold ml-1">2 Kč</span>
            </div>
          </div>
        </motion.div>

        {/* Security info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-6 flex flex-wrap justify-center gap-6 text-sm text-neutral-400"
        >
          <span className="flex items-center gap-2">
            <Timer size={16} className="text-[#00D9FF]" />
            Časové limity na hovory
          </span>
          <span className="flex items-center gap-2">
            <Shield size={16} className="text-[#00D9FF]" />
            Denní limity zpráv
          </span>
          <span className="flex items-center gap-2">
            <Lock size={16} className="text-[#00D9FF]" />
            Ochrana proti zneužití
          </span>
        </motion.div>
      </div>
    </section>
  );
};

// FAQ Section
const faqs = [
  {
    question: "Co je Vibe Coding a jak to funguje?",
    answer: "Vibe Coding je způsob spolupráce s AI, kde vy určujete cíle a AI je realizuje. Komunikujete přirozeně - hlasem nebo textem. AI asistent pak samostatně vyřizuje komunikaci, odpovídá klientům, spravuje sociální sítě atd. Vy máte plnou kontrolu a můžete kdykoliv zasáhnout.",
  },
  {
    question: "Proč je OpenClaw open source a jaké to má výhody?",
    answer: "Open source znamená, že kód je veřejný a transparentní. Výhody: 1) Žádné skryté poplatky nebo vendor lock-in, 2) Plná kontrola nad vašimi daty, 3) Možnost úprav na míru, 4) Aktivní komunita vývojářů, 5) Vyšší bezpečnost díky veřejnému auditu kódu.",
  },
  {
    question: "V jakých jazycích AI asistent komunikuje?",
    answer: "AI asistent komunikuje ve více než 50 světových jazycích včetně: čeština, slovenština, angličtina, němčina, ukrajinština, vietnamština, mandarínština (čínština), arabština, ruština, polština, španělština, francouzština a další.",
  },
  {
    question: "Jak jsou chráněny moje data a tokeny?",
    answer: "Nastavujeme bezpečnostní limity: časové limity na hovory (např. max 5 min), denní limity na zprávy, monitoring spotřeby tokenů. Můžete nastavit maximální denní/měsíční budget. AI nemá přístup kam vy nechcete - vše je pod vaší kontrolou.",
  },
  {
    question: "Co všechno mohu s AI asistentem propojit?",
    answer: "Prakticky cokoliv: CRM systémy (Salesforce, HubSpot...), email (Gmail, Outlook), sociální sítě (Instagram, Facebook, ZapedIn), WhatsApp, e-shop platformy (Shopify, WooCommerce), SEO nástroje, Google kalendář a další. Integrace jsou součástí balíčků nebo je přidáme na míru.",
  },
  {
    question: "Kolik budu platit měsíčně?",
    answer: "Za nastavení platíte jednorázově (od 9 500 Kč). Pak platíte jen tokeny které AI spotřebuje - průměrně 200-500 Kč měsíčně pro menší firmu. Žádné další měsíční poplatky. Máte plný přehled o spotřebě a můžete nastavit limity.",
  },
];

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section id="faq" className="py-24 md:py-32 relative">
      <div className="max-w-3xl mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#00D9FF]/30 bg-[#00D9FF]/10 mb-6">
            <HelpCircle size={16} className="text-[#00D9FF]" />
            <span className="text-sm text-[#00D9FF]">Často kladené dotazy</span>
          </div>
          <h2 className="font-heading font-bold text-3xl md:text-5xl text-white mb-4">
            FAQ
          </h2>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="border border-white/10 rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full p-5 flex items-center justify-between text-left bg-[#0A0A0A] hover:bg-white/5 transition-colors"
                data-testid={`faq-${index}`}
              >
                <span className="font-semibold text-white pr-4">{faq.question}</span>
                <ChevronDown
                  size={20}
                  className={`text-[#00D9FF] flex-shrink-0 transition-transform ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="p-5 pt-0 text-neutral-400">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Callback Section with all languages
const CallbackSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    language: "cs",
    voiceGender: "female",
    timeSlot: 30,
  });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [countdown, setCountdown] = useState(30);

  useEffect(() => {
    if (sent && countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [sent, countdown]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      await axios.post(`${API}/callback`, formData);
      setSent(true);
      setCountdown(formData.timeSlot);
    } catch (error) {
      console.error("Error submitting callback request:", error);
    }
    setSending(false);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <section id="callback" className="py-24 md:py-32 relative">
      <div className="max-w-4xl mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-[#00D9FF]/10 via-[#0A0A0A] to-[#0A0A0A] border border-[#00D9FF]/20 rounded-3xl p-8 md:p-12"
        >
          <div className="text-center mb-8">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#00D9FF] to-[#00B8D9] flex items-center justify-center mx-auto mb-6 animate-pulse">
              <PhoneCall size={36} className="text-black" />
            </div>
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-white mb-3">
              AI asistent vám zavolá
            </h2>
            <p className="text-neutral-400 text-lg">
              Do <span className="text-[#00D9FF] font-bold">2 minut</span> od odeslání formuláře
            </p>
          </div>

          {sent ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8"
            >
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-500/20 to-green-500/5 border border-green-500/30 flex items-center justify-center mx-auto mb-6">
                <Headphones size={40} className="text-green-400" />
              </div>
              <h3 className="font-heading text-2xl text-white mb-2">Připravujeme hovor!</h3>
              <p className="text-neutral-400 mb-6">
                AI asistent vám zavolá na číslo <span className="text-white font-mono">{formData.phone}</span>
              </p>
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-[#00D9FF]/10 border border-[#00D9FF]/30 rounded-full">
                <Clock size={20} className="text-[#00D9FF]" />
                <span className="text-[#00D9FF] font-mono text-xl font-bold">
                  {formatTime(countdown)}
                </span>
              </div>
              <p className="text-neutral-500 text-sm mt-4">
                Jazyk: {allGlobe.find(l => l.code === formData.language)?.flag} {allGlobe.find(l => l.code === formData.language)?.name}
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-5">
              <div className="relative">
                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-600" />
                <input
                  type="text"
                  placeholder="Vaše jméno"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full bg-black/50 border border-white/10 rounded-xl h-14 pl-12 pr-4 text-white placeholder:text-neutral-600 focus:border-[#00D9FF] focus:ring-2 focus:ring-[#00D9FF]/20 outline-none transition-all"
                  data-testid="callback-name"
                />
              </div>

              <div className="relative">
                <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-600" />
                <input
                  type="tel"
                  placeholder="+420 xxx xxx xxx"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                  className="w-full bg-black/50 border border-white/10 rounded-xl h-14 pl-12 pr-4 text-white placeholder:text-neutral-600 focus:border-[#00D9FF] focus:ring-2 focus:ring-[#00D9FF]/20 outline-none transition-all"
                  data-testid="callback-phone"
                />
              </div>

              <div>
                <label className="block text-neutral-400 text-sm mb-3">
                  <Globe size={14} className="inline mr-2" />
                  V jakém jazyce chcete mluvit?
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {allGlobe.slice(0, 8).map((lang) => (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => setFormData({ ...formData, language: lang.code })}
                      className={`py-2 px-1 rounded-xl text-center transition-all ${
                        formData.language === lang.code
                          ? "bg-[#00D9FF] text-black font-semibold"
                          : "bg-white/5 text-neutral-400 hover:bg-white/10 border border-white/10"
                      }`}
                      data-testid={`callback-lang-${lang.code}`}
                    >
                      <span className="text-lg block">{lang.flag}</span>
                      <span className="text-xs">{lang.name.slice(0, 6)}</span>
                    </button>
                  ))}
                </div>
                <p className="text-neutral-600 text-xs mt-2 text-center">
                  + 40 dalších jazyků k dispozici
                </p>
              </div>

              {/* Voice Gender selector */}
              <div>
                <label className="block text-neutral-400 text-sm mb-3">
                  <Mic size={14} className="inline mr-2" />
                  Hlas AI asistenta:
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, voiceGender: 'female' })}
                    className={`py-3 px-4 rounded-xl border transition-all flex items-center gap-2 ${
                      formData.voiceGender === 'female'
                        ? 'bg-[#00D9FF] border-[#00D9FF] text-black font-semibold'
                        : 'bg-white/5 border-white/10 text-neutral-400 hover:bg-white/10'
                    }`}
                  >
                    <User size={18} />
                    <div className="text-left text-sm">
                      <div>Ženský</div>
                      <div className="text-xs opacity-70">Přátelský</div>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, voiceGender: 'male' })}
                    className={`py-3 px-4 rounded-xl border transition-all flex items-center gap-2 ${
                      formData.voiceGender === 'male'
                        ? 'bg-[#00D9FF] border-[#00D9FF] text-black font-semibold'
                        : 'bg-white/5 border-white/10 text-neutral-400 hover:bg-white/10'
                    }`}
                  >
                    <User size={18} />
                    <div className="text-left text-sm">
                      <div>Mužský</div>
                      <div className="text-xs opacity-70">Profesionální</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Time Slot selector */}
              <div>
                <label className="block text-neutral-400 text-sm mb-3">
                  <Clock size={14} className="inline mr-2" />
                  Za jak dlouho zavolat:
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { value: 30, label: '30s' },
                    { value: 60, label: '1 min' },
                    { value: 120, label: '2 min' },
                    { value: 300, label: '5 min' },
                  ].map((slot) => (
                    <button
                      key={slot.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, timeSlot: slot.value })}
                      className={`py-3 px-2 rounded-xl border transition-all text-sm font-semibold ${
                        formData.timeSlot === slot.value
                          ? 'bg-[#00D9FF] border-[#00D9FF] text-black'
                          : 'bg-white/5 border-white/10 text-neutral-400 hover:bg-white/10'
                      }`}
                    >
                      {slot.label}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={sending}
                className="w-full bg-gradient-to-r from-[#00D9FF] to-[#00B8D9] text-black py-4 rounded-xl font-bold text-lg hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                data-testid="callback-submit"
              >
                {sending ? (
                  <>
                    <RefreshCw size={20} className="animate-spin" />
                    Odesílám...
                  </>
                ) : (
                  <>
                    <PhoneCall size={20} />
                    Zavolejte mi do 2 minut
                  </>
                )}
              </button>

              <p className="text-center text-neutral-500 text-xs">
                🔒 Vaše údaje ukládáme v češtině a používáme pouze pro tento hovor.
              </p>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
};

// ============================================
// AI VOICE CALL SECTION - KILLER FEATURE! 🎤
// ============================================
const VoiceCallSection = () => {
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [calling, setCalling] = useState(false);
  const [called, setCalled] = useState(false);
  const [language, setLanguage] = useState("cs");
  const [voiceGender, setVoiceGender] = useState("female");
  const [timeSlot, setTimeSlot] = useState(30);
  const [countdown, setCountdown] = useState(30);
  const [callResult, setCallResult] = useState(null);

  // Countdown timer effect
  useEffect(() => {
    if (called && countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [called, countdown]);

  // Format countdown as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleVoiceCall = async (e) => {
    e.preventDefault();
    if (!phone || phone.length < 9) {
      alert("Prosím zadejte platný telefon");
      return;
    }

    setCalling(true);
    try {
      const response = await axios.post(`${API}/contact`, {
        name: name || "Zájemce",
        phone,
        email: "",
        company: "",
        message: `Požadavek na demo hovor (jazyk: ${language}, hlas: ${voiceGender === 'female' ? 'ženský' : 'mužský'})`,
        language,
        voiceGender,
        timeSlot
      });
      
      if (response.data.success) {
        setCalled(true);
        setCallResult(response.data);
        setPhone("");
        setName("");
        setCountdown(timeSlot);
      }
    } catch (error) {
      console.error("Voice call error:", error);
      alert("Něco se pokazilo. Zkuste to prosím znovu.");
    }
    setCalling(false);
  };

  const languages = [
    { code: 'cs', name: 'Čeština', flag: '🇨🇿' },
    { code: 'sk', name: 'Slovenčina', flag: '🇸🇰' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' }
  ];

  return (
    <section id="voice-demo" className="py-24 md:py-32 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-[#00D9FF]/5 to-black" />
      
      <div className="max-w-4xl mx-auto px-6 md:px-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          {/* Icon with pulse animation */}
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-20 h-20 rounded-full bg-gradient-to-br from-[#00D9FF] to-[#00B8D9] flex items-center justify-center mx-auto mb-6"
          >
            <PhoneCall size={40} className="text-black" />
          </motion.div>

          <h2 className="font-heading font-bold text-4xl md:text-6xl text-white mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00D9FF] to-white">
              AI vám zavolá
            </span>
            <br />
            za 2 minuty!
          </h2>
          
          <p className="text-neutral-400 text-lg md:text-xl max-w-2xl mx-auto mb-2">
            Vyzkoušejte náš AI asistent zdarma. Stačí zadat telefon.
          </p>
          
          <div className="flex items-center justify-center gap-4 text-sm text-neutral-500">
            <div className="flex items-center gap-2">
              <Check size={16} className="text-green-400" />
              <span>Zdarma</span>
            </div>
            <div className="flex items-center gap-2">
              <Check size={16} className="text-green-400" />
              <span>Bez závazků</span>
            </div>
            <div className="flex items-center gap-2">
              <Check size={16} className="text-green-400" />
              <span>24/7</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-[#0A0A0A] border border-white/10 rounded-3xl p-8 md:p-12"
        >
          {called ? (
            <div className="text-center py-12">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-24 h-24 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-6"
              >
                <PhoneCall size={48} className="text-green-400 animate-pulse" />
              </motion.div>
              
              <h3 className="font-heading text-2xl md:text-3xl text-white mb-4">
                ✅ Formulář odeslán!
              </h3>
              
              {/* COUNTDOWN TIMER */}
              <div className="mb-6">
                <p className="text-neutral-400 text-lg mb-4">
                  AI vám zavolá za:
                </p>
                <motion.div
                  key={countdown}
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                  className="inline-block"
                >
                  <div className="text-6xl md:text-7xl font-heading font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#00D9FF] to-[#00B8D9] mb-2">
                    {formatTime(countdown)}
                  </div>
                </motion.div>
                <p className="text-neutral-500 text-sm">
                  {countdown > 0 ? '⏱️ Odpočítávání...' : '📞 Měli bychom volat TEĎKA!'}
                </p>
              </div>

              {/* API RESULT INFO */}
              {callResult && (
                <div className="bg-black/30 border border-white/10 rounded-xl p-4 mb-6">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-neutral-500 mb-1">Status:</p>
                      <p className="text-green-400 font-semibold flex items-center gap-2">
                        <Check size={16} />
                        {callResult.success ? 'Úspěšně odesláno' : 'Chyba'}
                      </p>
                    </div>
                    <div>
                      <p className="text-neutral-500 mb-1">Voice call:</p>
                      <p className="text-[#00D9FF] font-semibold">
                        {callResult.voiceCallInitiated ? '✅ Připraven' : '⏳ Čeká na setup'}
                      </p>
                    </div>
                  </div>
                  {callResult.message && (
                    <p className="text-neutral-400 text-xs mt-3 pt-3 border-t border-white/10">
                      {callResult.message}
                    </p>
                  )}
                </div>
              )}

              <div className="space-y-3">
                <p className="text-neutral-400 text-sm">
                  💡 <strong>Tip:</strong> Připravte si otázky! AI mluví ve vašem jazyce.
                </p>
                
                <button
                  onClick={() => {
                    setCalled(false);
                    setCountdown(120);
                    setCallResult(null);
                  }}
                  className="text-[#00D9FF] hover:text-white transition-colors text-sm"
                >
                  ← Zadat jiné číslo
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleVoiceCall} className="space-y-6">
              {/* Language selector */}
              <div>
                <label className="block text-sm text-neutral-400 mb-3">
                  Jazyk hovoru:
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => setLanguage(lang.code)}
                      className={`py-3 px-4 rounded-xl border transition-all ${
                        language === lang.code
                          ? 'bg-[#00D9FF] border-[#00D9FF] text-black font-semibold'
                          : 'bg-black/50 border-white/10 text-neutral-400 hover:border-white/30'
                      }`}
                    >
                      <span className="text-2xl mb-1 block">{lang.flag}</span>
                      <span className="text-xs">{lang.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Voice Gender selector with 3D Avatars */}
              <div>
                <label className="block text-sm text-neutral-400 mb-3">
                  <Mic size={14} className="inline mr-2" />
                  Vyberte si svého AI asistenta:
                </label>
                <AvatarShowcase 
                  selectedGender={voiceGender} 
                  onSelect={setVoiceGender}
                />
              </div>

              {/* Time Slot selector */}
              <div>
                <label className="block text-sm text-neutral-400 mb-3">
                  <Clock size={14} className="inline mr-2" />
                  Za jak dlouho zavolat:
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { value: 30, label: '30s' },
                    { value: 60, label: '1 min' },
                    { value: 120, label: '2 min' },
                    { value: 300, label: '5 min' },
                  ].map((slot) => (
                    <button
                      key={slot.value}
                      type="button"
                      onClick={() => setTimeSlot(slot.value)}
                      className={`py-3 rounded-xl border transition-all text-sm font-semibold ${
                        timeSlot === slot.value
                          ? 'bg-[#00D9FF] border-[#00D9FF] text-black'
                          : 'bg-black/50 border-white/10 text-neutral-400 hover:border-white/30'
                      }`}
                    >
                      {slot.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Phone input - MAIN CTA */}
              <div>
                <label className="block text-sm text-neutral-400 mb-2">
                  Váš telefon <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <PhoneCall size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-600" />
                  <input
                    type="tel"
                    placeholder="+420 123 456 789"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="w-full bg-black/50 border border-white/10 rounded-xl h-14 pl-12 pr-4 text-white text-lg placeholder:text-neutral-600 focus:border-[#00D9FF] focus:ring-2 focus:ring-[#00D9FF]/20 outline-none transition-all"
                    autoFocus
                  />
                </div>
              </div>

              {/* Optional name */}
              <div>
                <label className="block text-sm text-neutral-400 mb-2">
                  Jméno (nepovinné)
                </label>
                <div className="relative">
                  <User size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-600" />
                  <input
                    type="text"
                    placeholder="Jak vám máme říkat?"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-black/50 border border-white/10 rounded-xl h-12 pl-12 pr-4 text-white placeholder:text-neutral-600 focus:border-[#00D9FF] outline-none transition-all"
                  />
                </div>
              </div>

              {/* CTA Button */}
              <button
                type="submit"
                disabled={calling || !phone}
                className="w-full bg-gradient-to-r from-[#00D9FF] to-[#00B8D9] hover:from-[#00B8D9] hover:to-[#00D9FF] text-black font-heading font-bold text-lg py-4 px-8 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 group"
              >
                {calling ? (
                  <>
                    <RefreshCw size={24} className="animate-spin" />
                    Připravujeme hovor...
                  </>
                ) : (
                  <>
                    <PhoneCall size={24} className="group-hover:animate-pulse" />
                    {timeSlot === 30 ? "Zavolat TEĎ (30s)" : 
                     timeSlot === 60 ? "Zavolat za 1 minutu" :
                     timeSlot === 120 ? "Zavolat za 2 minuty" :
                     "Zavolat za 5 minut"}
                  </>
                )}
              </button>

              <p className="text-center text-neutral-500 text-xs">
                Zavoláním souhlasíte se zpracováním telefonního čísla. Žádný spam, slibujeme! 🤝
              </p>
            </form>
          )}
        </motion.div>

        {/* Social proof */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <div className="flex items-center justify-center gap-2 text-neutral-500 text-sm">
            <Star size={16} className="text-yellow-400 fill-yellow-400" />
            <Star size={16} className="text-yellow-400 fill-yellow-400" />
            <Star size={16} className="text-yellow-400 fill-yellow-400" />
            <Star size={16} className="text-yellow-400 fill-yellow-400" />
            <Star size={16} className="text-yellow-400 fill-yellow-400" />
            <span className="ml-2">98% spokojených zákazníků s demo hovorem</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// ============================================
// FLOATING VOICE BUTTON - Always visible! 🎤
// ============================================
const FloatingVoiceButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [phone, setPhone] = useState("");
  const [calling, setCalling] = useState(false);

  const handleQuickCall = async (e) => {
    e.preventDefault();
    if (!phone || phone.length < 9) return;

    setCalling(true);
    try {
      await axios.post(`${API}/contact`, {
        name: "Quick Call Request",
        phone,
        email: "",
        company: "",
        message: "Quick voice demo request",
        language: "cs"
      });
      alert("✅ Skvělé! Voláme vám během 2 minut!");
      setIsOpen(false);
      setPhone("");
    } catch (error) {
      alert("Něco se pokazilo. Zkuste to znovu.");
    }
    setCalling(false);
  };

  return (
    <>
      {/* Floating button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-24 right-6 md:bottom-8 md:right-8 z-40 bg-gradient-to-r from-[#00D9FF] to-[#00B8D9] text-black font-semibold px-6 py-4 rounded-full shadow-2xl flex items-center gap-3 hover:shadow-[#00D9FF]/50"
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <PhoneCall size={24} />
        </motion.div>
        <span className="hidden md:inline">Demo hovor</span>
      </motion.button>

      {/* Quick popup */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-44 right-6 md:bottom-24 md:right-8 z-50 bg-[#0A0A0A] border border-white/20 rounded-2xl p-6 shadow-2xl w-80"
          >
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-3 right-3 text-neutral-500 hover:text-white"
            >
              <X size={20} />
            </button>
            
            <h4 className="font-heading text-lg text-white mb-2">
              Rychlý demo hovor
            </h4>
            <p className="text-neutral-400 text-sm mb-4">
              Zadejte telefon a voláme za 2 minuty!
            </p>
            
            <form onSubmit={handleQuickCall} className="space-y-3">
              <input
                type="tel"
                placeholder="+420 123 456 789"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-lg h-11 px-4 text-white placeholder:text-neutral-600 focus:border-[#00D9FF] outline-none"
                autoFocus
              />
              <button
                type="submit"
                disabled={calling || !phone}
                className="w-full bg-[#00D9FF] hover:bg-[#00B8D9] text-black font-semibold py-2.5 rounded-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {calling ? (
                  <>
                    <RefreshCw size={18} className="animate-spin" />
                    Připravuji...
                  </>
                ) : (
                  <>
                    <PhoneCall size={18} />
                    Zavolat mi!
                  </>
                )}
              </button>
            </form>
            
            <div className="mt-3 flex items-center gap-2 text-xs text-neutral-500">
              <Clock size={14} />
              <span>Hovor do 2 minut</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// Contact Section (HIDDEN - keeping code for later)
const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
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
      setFormData({ name: "", email: "", phone: "", company: "", message: "" });
    } catch (error) {
      console.error("Error submitting contact form:", error);
    }
    setSending(false);
  };

  return (
    <section id="kontakt" className="py-24 md:py-32 relative">
      <div className="max-w-3xl mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-heading font-bold text-3xl md:text-5xl text-white mb-4">
            Napište nám
          </h2>
          <p className="text-neutral-400 text-lg">
            Pro složitější dotazy nebo partnerství
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-8"
        >
          {sent ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                <Check size={28} className="text-green-400" />
              </div>
              <h4 className="font-heading text-xl text-white mb-2">Děkujeme!</h4>
              <p className="text-neutral-400 mb-3">Formulář byl úspěšně odeslán.</p>
              <div className="flex items-center justify-center gap-2 text-[#00D9FF] text-sm">
                <PhoneCall size={16} className="animate-pulse" />
                <span>Náš AI asistent vám zavolá do 2 minut!</span>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-600" />
                  <input
                    type="text"
                    placeholder="Jméno"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full bg-black/50 border border-white/10 rounded-lg h-12 pl-12 pr-4 text-white placeholder:text-neutral-600 focus:border-[#00D9FF] outline-none"
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
                    className="w-full bg-black/50 border border-white/10 rounded-lg h-12 pl-12 pr-4 text-white placeholder:text-neutral-600 focus:border-[#00D9FF] outline-none"
                    data-testid="contact-email"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <PhoneCall size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-600" />
                  <input
                    type="tel"
                    placeholder="Telefon (pro zavolání AI)"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                    className="w-full bg-black/50 border border-white/10 rounded-lg h-12 pl-12 pr-4 text-white placeholder:text-neutral-600 focus:border-[#00D9FF] outline-none"
                    data-testid="contact-phone"
                  />
                </div>
                <div className="relative">
                  <Building2 size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-600" />
                  <input
                    type="text"
                    placeholder="Firma (volitelné)"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full bg-black/50 border border-white/10 rounded-lg h-12 pl-12 pr-4 text-white placeholder:text-neutral-600 focus:border-[#00D9FF] outline-none"
                    data-testid="contact-company"
                  />
                </div>
              </div>
              
              <textarea
                placeholder="Vaše zpráva"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                required
                rows={4}
                className="w-full bg-black/50 border border-white/10 rounded-lg p-4 text-white placeholder:text-neutral-600 focus:border-[#00D9FF] outline-none resize-none"
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
        </motion.div>
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
          <div className="flex items-center gap-6 text-sm text-neutral-500">
            <span>Vibe Coding</span>
            <span>×</span>
            <span>OpenClaw</span>
            <span>×</span>
            <span>Emergent</span>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-4 text-sm">
            <a href="mailto:kontakt@chciai.cz" className="text-neutral-400 hover:text-[#00D9FF] transition-colors flex items-center gap-2">
              <Mail size={16} />
              kontakt@chciai.cz
            </a>
            <a href="mailto:info@chciai.cz" className="text-neutral-400 hover:text-[#00D9FF] transition-colors flex items-center gap-2">
              <Mail size={16} />
              info@chciai.cz
            </a>
            <a href="tel:+420608922096" className="text-neutral-400 hover:text-[#00D9FF] transition-colors flex items-center gap-2">
              <Phone size={16} />
              +420 608 922 096
            </a>
          </div>
        </div>
        <p className="text-center text-neutral-600 text-sm mt-6">
          © 2025 chciai.cz. Všechna práva vyhrazena.
        </p>
      </div>
    </footer>
  );
};

// Chat Widget with all languages
const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const [language, setLanguage] = useState("cs");
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const messagesEndRef = useRef(null);
  const audioRef = useRef(null);

  const chatGlobe = allGlobe.slice(0, 6);

  const welcomeMessages = {
    cs: "Ahoj! Jsem Aji. Jak vám mohu pomoci?",
    sk: "Ahoj! Som Aji. Ako vám môžem pomôcť?",
    en: "Hello! I'm Aji. How can I help you?",
    de: "Hallo! Ich bin Aji. Wie kann ich Ihnen helfen?",
    uk: "Привіт! Я Aji. Як я можу вам допомогти?",
    vi: "Xin chào! Tôi là Aji. Tôi có thể giúp gì cho bạn?",
    zh: "你好！我是Aji。我能帮你什么？",
    ar: "مرحباً! أنا أجي. كيف يمكنني مساعدتك؟",
  };

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(() => scrollToBottom(), [messages]);

  const sendMessage = async (messageText) => {
    if (!messageText.trim() || loading) return;
    const userMessage = messageText.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);

    try {
      // Use fetch instead of axios for better CORS handling
      const response = await fetch(`${API}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          session_id: sessionId,
          message: userMessage,
          language: language,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      const aiResponse = data.response;
      setMessages((prev) => [...prev, { role: "assistant", content: aiResponse }]);
      
      // Auto-play AI response if audio is enabled
      if (audioEnabled && aiResponse) {
        await playTextToSpeech(aiResponse);
      }
    } catch (error) {
      console.error('Chat error:', error);
      // Extract string from error (Error objects can't be cloned in React state)
      const errorMsg = String(error?.message || error || "Omlouvám se, něco se pokazilo.");
      setMessages((prev) => [...prev, { role: "assistant", content: errorMsg }]);
    } finally {
      setLoading(false);
    }
  };

  const playTextToSpeech = async (text) => {
    try {
      setIsPlaying(true);
      const formData = new FormData();
      formData.append('text', text);
      formData.append('language', language);
      
      const response = await axios.post(`${API}/speak`, formData, {
        responseType: 'blob',
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      const audioBlob = new Blob([response.data], { type: 'audio/mpeg' });
      const audioUrl = URL.createObjectURL(audioBlob);
      
      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        audioRef.current.play();
        audioRef.current.onended = () => {
          setIsPlaying(false);
          URL.revokeObjectURL(audioUrl);
        };
      }
    } catch (error) {
      console.error('TTS error:', error);
      setIsPlaying(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await sendMessage(input);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      const chunks = [];
      recorder.ondataavailable = (e) => e.data.size > 0 && chunks.push(e.data);
      recorder.onstop = async () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        stream.getTracks().forEach(track => track.stop());
        const formData = new FormData();
        formData.append('audio', blob, 'recording.webm');
        formData.append('language', language);
        try {
          setLoading(true);
          const response = await axios.post(`${API}/transcribe`, formData, { headers: { 'Content-Type': 'multipart/form-data' }});
          if (response.data.text) await sendMessage(response.data.text);
        } catch (error) { console.error(error); }
        setLoading(false);
      };
      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
    } catch (error) { alert("Nepodařilo se získat přístup k mikrofonu."); }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  return (
    <div className="chat-widget">
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="chat-window" data-testid="chat-window">
            <div className="p-4 border-b border-white/10 bg-[#0A0A0A]">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00D9FF] to-[#00B8D9] flex items-center justify-center">
                    <Bot size={20} className="text-black" />
                  </div>
                  <div>
                    <h4 className="font-heading font-semibold text-white text-sm">Aji</h4>
                    <p className="text-xs text-neutral-500">OpenClaw AI</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setAudioEnabled(!audioEnabled)} 
                    className={`p-2 rounded-lg transition-all ${audioEnabled ? "bg-[#00D9FF] text-black" : "bg-white/10 text-neutral-400 hover:bg-white/20"}`}
                    title={audioEnabled ? "Vypnout zvuk" : "Zapnout zvuk"}
                    data-testid="audio-toggle"
                  >
                    {audioEnabled ? <Headphones size={16} /> : <Phone size={16} className="opacity-50" />}
                  </button>
                  <button onClick={() => setIsOpen(false)} className="text-neutral-400 hover:text-white" data-testid="chat-close">
                    <X size={20} />
                  </button>
                </div>
              </div>
              <div className="flex gap-1 overflow-x-auto pb-1">
                {chatGlobe.map((lang) => (
                  <button key={lang.code} onClick={() => setLanguage(lang.code)} className={`flex-shrink-0 px-2 py-1 rounded-lg text-xs font-medium transition-all ${language === lang.code ? "bg-[#00D9FF] text-black" : "bg-white/5 text-neutral-400 hover:bg-white/10"}`} data-testid={`lang-${lang.code}`}>
                    {lang.flag}
                  </button>
                ))}
              </div>
            </div>
            <div className="h-[280px] overflow-y-auto p-4 space-y-4">
              {messages.length === 0 && <div className="text-center py-8"><p className="text-neutral-500 text-sm">{welcomeMessages[language] || welcomeMessages.cs}</p></div>}
              {messages.map((msg, index) => (
                <div key={index} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm ${msg.role === "user" ? "bg-[#00D9FF] text-black rounded-br-md" : "bg-white/5 text-white rounded-bl-md"}`}>{msg.content}</div>
                </div>
              ))}
              {loading && <div className="flex justify-start"><div className="bg-white/5 rounded-2xl rounded-bl-md"><div className="typing-indicator"><span></span><span></span><span></span></div></div></div>}
              {isPlaying && <div className="flex justify-center"><div className="text-xs text-[#00D9FF] flex items-center gap-2 animate-pulse"><Headphones size={14} /> Přehrávám odpověď...</div></div>}
              <div ref={messagesEndRef} />
            </div>
            <audio ref={audioRef} style={{ display: 'none' }} />
            <form onSubmit={handleSubmit} className="p-4 border-t border-white/10">
              <div className="flex gap-2">
                <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Napište zprávu..." className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm text-white placeholder:text-neutral-600 focus:border-[#00D9FF] outline-none" data-testid="chat-input" disabled={isRecording} />
                <button type="button" onClick={isRecording ? stopRecording : startRecording} disabled={loading} className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${isRecording ? "bg-red-500 text-white animate-pulse" : "bg-white/10 text-neutral-400 hover:bg-white/20"}`} data-testid="chat-voice">
                  {isRecording ? <MicOff size={18} /> : <Mic size={18} />}
                </button>
                <button type="submit" disabled={loading || !input.trim() || isRecording} className="w-10 h-10 rounded-full bg-[#00D9FF] flex items-center justify-center text-black hover:bg-[#00B8D9] disabled:opacity-50" data-testid="chat-send">
                  <Send size={18} />
                </button>
              </div>
              {isRecording && <p className="text-xs text-red-400 mt-2 text-center animate-pulse">🎙️ Nahrávám...</p>}
            </form>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} onClick={() => setIsOpen(!isOpen)} className="chat-bubble" data-testid="chat-bubble">
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
      <VibeCodingSection />
      <OpenClawSection />
      <BenefitsSection />
      <UseCasesSection />
      <ServicesSection />
      <PricingSection />
      <FAQSection />
      <VoiceCallSection />
      <Footer />
      <ModernFloatingAvatars />
      <ChatWidget />
      <FloatingVoiceButton />
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
