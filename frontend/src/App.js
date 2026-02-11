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
  Clock,
  Check,
  Zap,
  Users,
  Phone,
  Mic,
  MicOff,
  Globe,
  Star,
  PhoneCall,
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
    { href: "#pro-koho", label: "Pro koho" },
    { href: "#cenik", label: "Ceník" },
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

// Use Cases for different industries
const useCases = [
  {
    icon: "🔧",
    industry: "Autoservisy",
    problem: "Zmeškané telefonáty, zapomenuté STK, ztracené objednávky",
    solutions: [
      "AI přijímá objednávky 24/7",
      "Automatické připomenutí STK a servisu",
      "Historie oprav na jeden klik",
    ],
    savings: "5+ hodin týdně",
    highlight: "Zákazník si objedná i v neděli večer",
  },
  {
    icon: "💇",
    industry: "Kadeřnictví",
    problem: "Neustálé telefonáty, no-shows, chaos v kalendáři",
    solutions: [
      "Online rezervace bez volání",
      "SMS/WhatsApp připomenutí",
      "Zákazník vidí volné termíny",
    ],
    savings: "70% méně no-shows",
    highlight: "Vy stříháte, AI řeší telefony",
  },
  {
    icon: "💅",
    industry: "Kosmetika & Nehty",
    problem: "Přeplněné DMs, opakované dotazy na ceník",
    solutions: [
      "AI odpoví na Instagram/FB",
      "Automatický ceník a portfolio",
      "Rezervace přímo z chatu",
    ],
    savings: "3+ hodiny denně",
    highlight: "Klientky si zarezervují i o půlnoci",
  },
  {
    icon: "🍽️",
    industry: "Restaurace & Kavárny",
    problem: "Přetížená linka, chybné rezervace, negativní recenze",
    solutions: [
      "AI rezervace stolů non-stop",
      "Odpovědi na Google recenze",
      "Menu a alergeny na dotaz",
    ],
    savings: "40% více rezervací",
    highlight: "Obsluha se věnuje hostům, ne telefonu",
  },
  {
    icon: "💪",
    industry: "Fitness & Trenéři",
    problem: "Zrušené lekce, motivace klientů, administrativa",
    solutions: [
      "Automatické plánování tréninků",
      "Motivační zprávy a tipy",
      "Sledování pokroku klientů",
    ],
    savings: "10+ hodin měsíčně",
    highlight: "Klient dostane tréninkový plán ihned",
  },
  {
    icon: "🏠",
    industry: "Reality & Makléři",
    problem: "Stovky dotazů, opakované informace, prohlídky",
    solutions: [
      "AI odpoví na dotazy k nemovitostem",
      "Automatické plánování prohlídek",
      "Kvalifikace zájemců předem",
    ],
    savings: "60% méně zbytečných prohlídek",
    highlight: "Jen vážní zájemci, žádné ztráty času",
  },
  {
    icon: "🛒",
    industry: "E-shopy",
    problem: "Kde je zásilka?, vratky, dotazy k produktům",
    solutions: [
      "Sledování zásilek automaticky",
      "Odpovědi na FAQ 24/7",
      "Pomoc s výběrem produktu",
    ],
    savings: "80% méně support ticketů",
    highlight: "Zákazník dostane odpověď za 3 sekundy",
  },
  {
    icon: "📊",
    industry: "Účetní & Poradci",
    problem: "Chybějící dokumenty, zmeškané termíny, dotazy klientů",
    solutions: [
      "Připomenutí daňových termínů",
      "Automatický sběr dokladů",
      "Odpovědi na časté dotazy",
    ],
    savings: "15+ hodin měsíčně",
    highlight: "Klient pošle fakturu přes WhatsApp",
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

// Use Cases Section - Pro koho je AI asistent
const UseCasesSection = () => {
  const [activeCase, setActiveCase] = useState(0);

  return (
    <section id="pro-koho" className="py-24 md:py-32 relative bg-gradient-to-b from-transparent via-[#00D9FF]/5 to-transparent">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#00D9FF]/30 bg-[#00D9FF]/10 mb-6">
            <Clock size={16} className="text-[#00D9FF]" />
            <span className="text-sm text-[#00D9FF]">Ušetřete hodiny práce každý týden</span>
          </div>
          <h2 className="font-heading font-bold text-3xl md:text-5xl text-white mb-4">
            AI asistent pro váš obor
          </h2>
          <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
            Podívejte se, jak AI řeší konkrétní problémy v různých odvětvích. 
            <span className="text-white font-semibold"> 24 hodin denně, 7 dní v týdnu.</span>
          </p>
        </motion.div>

        {/* Industry tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {useCases.map((useCase, index) => (
            <button
              key={useCase.industry}
              onClick={() => setActiveCase(index)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeCase === index
                  ? "bg-[#00D9FF] text-black"
                  : "bg-white/5 text-neutral-400 hover:bg-white/10 hover:text-white"
              }`}
              data-testid={`usecase-tab-${index}`}
            >
              <span className="mr-2">{useCase.icon}</span>
              {useCase.industry}
            </button>
          ))}
        </div>

        {/* Active use case detail */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCase}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            {/* Problem & Solutions */}
            <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-8">
              <div className="flex items-center gap-4 mb-6">
                <span className="text-4xl">{useCases[activeCase].icon}</span>
                <div>
                  <h3 className="font-heading font-bold text-2xl text-white">
                    {useCases[activeCase].industry}
                  </h3>
                  <p className="text-neutral-500">AI asistent na míru</p>
                </div>
              </div>

              {/* Problem */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center">
                    <X size={14} className="text-red-400" />
                  </div>
                  <span className="text-red-400 font-semibold text-sm">Běžné problémy</span>
                </div>
                <p className="text-neutral-300 bg-red-500/5 border border-red-500/10 rounded-lg p-4">
                  {useCases[activeCase].problem}
                </p>
              </div>

              {/* Solutions */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                    <Check size={14} className="text-green-400" />
                  </div>
                  <span className="text-green-400 font-semibold text-sm">Co AI vyřeší</span>
                </div>
                <ul className="space-y-2">
                  {useCases[activeCase].solutions.map((solution, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-neutral-300">
                      <ArrowRight size={16} className="text-[#00D9FF] mt-1 flex-shrink-0" />
                      {solution}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Results & CTA */}
            <div className="flex flex-col gap-6">
              {/* Savings highlight */}
              <div className="bg-gradient-to-br from-[#00D9FF]/20 to-[#00D9FF]/5 border border-[#00D9FF]/30 rounded-2xl p-8 text-center">
                <Clock size={32} className="text-[#00D9FF] mx-auto mb-4" />
                <p className="text-neutral-400 mb-2">Průměrná úspora času</p>
                <p className="font-heading font-bold text-4xl text-white mb-2">
                  {useCases[activeCase].savings}
                </p>
                <p className="text-[#00D9FF] font-medium">
                  {useCases[activeCase].highlight}
                </p>
              </div>

              {/* Benefits */}
              <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-8">
                <h4 className="font-heading font-semibold text-white mb-4">
                  Co získáte navíc
                </h4>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-neutral-300">
                    <div className="w-8 h-8 rounded-lg bg-[#00D9FF]/10 flex items-center justify-center">
                      <Zap size={16} className="text-[#00D9FF]" />
                    </div>
                    <span>Odpovědi zákazníkům <strong className="text-white">do 3 sekund</strong></span>
                  </li>
                  <li className="flex items-center gap-3 text-neutral-300">
                    <div className="w-8 h-8 rounded-lg bg-[#00D9FF]/10 flex items-center justify-center">
                      <Clock size={16} className="text-[#00D9FF]" />
                    </div>
                    <span>Dostupnost <strong className="text-white">24/7/365</strong></span>
                  </li>
                  <li className="flex items-center gap-3 text-neutral-300">
                    <div className="w-8 h-8 rounded-lg bg-[#00D9FF]/10 flex items-center justify-center">
                      <Users size={16} className="text-[#00D9FF]" />
                    </div>
                    <span>Spokojení zákazníci = <strong className="text-white">více doporučení</strong></span>
                  </li>
                </ul>
              </div>

              {/* CTA */}
              <a
                href="#kontakt"
                className="bg-[#00D9FF] text-black px-8 py-4 rounded-xl font-semibold text-lg hover:bg-[#00B8D9] transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
                data-testid="usecase-cta"
              >
                Chci AI asistenta pro {useCases[activeCase].industry.toLowerCase()}
                <ArrowRight size={20} />
              </a>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {[
            { value: "24/7", label: "Dostupnost" },
            { value: "3s", label: "Průměrná odpověď" },
            { value: "70%", label: "Méně zmeškaných hovorů" },
            { value: "∞", label: "Trpělivost s klienty" },
          ].map((stat, index) => (
            <div
              key={index}
              className="bg-white/5 border border-white/10 rounded-xl p-6 text-center"
            >
              <p className="font-heading font-bold text-2xl md:text-3xl text-[#00D9FF]">
                {stat.value}
              </p>
              <p className="text-neutral-500 text-sm">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

// Pricing Section
const pricingPlans = [
  {
    name: "Start",
    price: "4 990",
    period: "měsíc",
    description: "Ideální pro začínající podnikatele",
    features: [
      "1 AI asistent (chatbot)",
      "Až 500 konverzací/měsíc",
      "Integrace na web",
      "Základní analytika",
      "Email podpora",
      "Čeština + Angličtina",
    ],
    notIncluded: [
      "Hlasový asistent",
      "Vlastní integrace",
      "Prioritní podpora",
    ],
    popular: false,
    cta: "Začít zdarma",
  },
  {
    name: "Business",
    price: "9 990",
    period: "měsíc",
    description: "Pro rostoucí firmy s většími nároky",
    features: [
      "3 AI asistenti",
      "Neomezené konverzace",
      "Web + Instagram + WhatsApp",
      "Pokročilá analytika",
      "Hlasový asistent",
      "Automatizace (n8n/Make)",
      "Prioritní podpora",
      "4 jazyky",
    ],
    notIncluded: [
      "Vlastní AI model",
    ],
    popular: true,
    cta: "Vybrat Business",
  },
  {
    name: "Enterprise",
    price: "19 990",
    period: "měsíc",
    description: "Kompletní AI transformace firmy",
    features: [
      "Neomezení asistenti",
      "Neomezené konverzace",
      "Všechny platformy",
      "Vlastní AI model na míru",
      "Plná automatizace procesů",
      "Dedikovaný account manager",
      "SLA 99.9%",
      "Všechny jazyky",
      "On-site školení",
      "API přístup",
    ],
    notIncluded: [],
    popular: false,
    cta: "Kontaktovat",
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
            <Star size={16} className="text-[#00D9FF]" />
            <span className="text-sm text-[#00D9FF]">Transparentní ceny bez skrytých poplatků</span>
          </div>
          <h2 className="font-heading font-bold text-3xl md:text-5xl text-white mb-4">
            Vyberte si svůj plán
          </h2>
          <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
            Všechny ceny jsou bez DPH. První konzultace je vždy zdarma.
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
                plan.popular
                  ? "border-[#00D9FF] shadow-lg shadow-[#00D9FF]/10"
                  : "border-white/10"
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
                <h3 className="font-heading font-bold text-2xl text-white mb-2">
                  {plan.name}
                </h3>
                <p className="text-neutral-500 text-sm mb-4">{plan.description}</p>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="font-heading font-bold text-4xl text-white">
                    {plan.price}
                  </span>
                  <span className="text-neutral-400">Kč/{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-neutral-300">
                    <Check size={18} className="text-[#00D9FF] flex-shrink-0 mt-0.5" />
                    {feature}
                  </li>
                ))}
                {plan.notIncluded.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-neutral-600">
                    <X size={18} className="flex-shrink-0 mt-0.5" />
                    {feature}
                  </li>
                ))}
              </ul>

              <a
                href="#kontakt"
                className={`block w-full text-center py-3 rounded-xl font-semibold transition-all ${
                  plan.popular
                    ? "bg-[#00D9FF] text-black hover:bg-[#00B8D9]"
                    : "bg-white/5 text-white border border-white/10 hover:bg-white/10"
                }`}
              >
                {plan.cta}
              </a>
            </motion.div>
          ))}
        </div>

        {/* Additional info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <p className="text-neutral-500 text-sm mb-4">
            💡 Potřebujete něco specifického? Vytvoříme vám řešení na míru.
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-neutral-400">
            <span className="flex items-center gap-2">
              <Check size={16} className="text-green-400" />
              14 dní na vyzkoušení
            </span>
            <span className="flex items-center gap-2">
              <Check size={16} className="text-green-400" />
              Bez závazků
            </span>
            <span className="flex items-center gap-2">
              <Check size={16} className="text-green-400" />
              Možnost měsíční platby
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// Callback Request Section
const CallbackSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    language: "cs",
  });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const languages = [
    { code: "cs", name: "Čeština", flag: "🇨🇿" },
    { code: "en", name: "English", flag: "🇬🇧" },
    { code: "de", name: "Deutsch", flag: "🇩🇪" },
    { code: "sk", name: "Slovenčina", flag: "🇸🇰" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      await axios.post(`${API}/callback`, formData);
      setSent(true);
      setFormData({ name: "", phone: "", language: "cs" });
    } catch (error) {
      console.error("Error submitting callback request:", error);
    }
    setSending(false);
  };

  return (
    <section className="py-16 relative">
      <div className="max-w-4xl mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-[#00D9FF]/10 to-transparent border border-[#00D9FF]/20 rounded-2xl p-8 md:p-12"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-[#00D9FF]/20 flex items-center justify-center mx-auto mb-4">
              <PhoneCall size={28} className="text-[#00D9FF]" />
            </div>
            <h3 className="font-heading font-bold text-2xl md:text-3xl text-white mb-2">
              Nechte nám číslo, zavoláme vám
            </h3>
            <p className="text-neutral-400">
              AI asistent vám zavolá zpět do 24 hodin v jazyce dle vašeho výběru
            </p>
          </div>

          {sent ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                <Check size={28} className="text-green-400" />
              </div>
              <h4 className="font-heading text-lg text-white mb-2">Děkujeme!</h4>
              <p className="text-neutral-400">Brzy vám zavoláme.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
              <div className="relative">
                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-600" />
                <input
                  type="text"
                  placeholder="Vaše jméno"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full bg-black/50 border border-white/10 rounded-lg h-12 pl-12 pr-4 text-white placeholder:text-neutral-600 focus:border-[#00D9FF] focus:ring-1 focus:ring-[#00D9FF] outline-none transition-colors"
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
                  className="w-full bg-black/50 border border-white/10 rounded-lg h-12 pl-12 pr-4 text-white placeholder:text-neutral-600 focus:border-[#00D9FF] focus:ring-1 focus:ring-[#00D9FF] outline-none transition-colors"
                  data-testid="callback-phone"
                />
              </div>

              <div className="relative">
                <Globe size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-600" />
                <select
                  value={formData.language}
                  onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                  className="w-full bg-black/50 border border-white/10 rounded-lg h-12 pl-12 pr-4 text-white focus:border-[#00D9FF] focus:ring-1 focus:ring-[#00D9FF] outline-none transition-colors appearance-none cursor-pointer"
                  data-testid="callback-language"
                >
                  {languages.map((lang) => (
                    <option key={lang.code} value={lang.code} className="bg-[#0A0A0A]">
                      {lang.flag} {lang.name}
                    </option>
                  ))}
                </select>
                <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-600 pointer-events-none" />
              </div>

              <button
                type="submit"
                disabled={sending}
                className="w-full bg-[#00D9FF] text-black py-3 rounded-lg font-semibold hover:bg-[#00B8D9] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                data-testid="callback-submit"
              >
                {sending ? "Odesílám..." : "Zavolejte mi zpět"}
                <PhoneCall size={18} />
              </button>
            </form>
          )}
        </motion.div>
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

// Chat Widget with Voice Input and Language Selection
const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const [language, setLanguage] = useState("cs");
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const messagesEndRef = useRef(null);

  const languages = [
    { code: "cs", name: "Čeština", flag: "🇨🇿" },
    { code: "en", name: "English", flag: "🇬🇧" },
    { code: "de", name: "Deutsch", flag: "🇩🇪" },
    { code: "sk", name: "Slovenčina", flag: "🇸🇰" },
  ];

  const welcomeMessages = {
    cs: "Ahoj! Jsem Aji, váš AI asistent. Jak vám mohu pomoci?",
    en: "Hello! I'm Aji, your AI assistant. How can I help you?",
    de: "Hallo! Ich bin Aji, Ihr KI-Assistent. Wie kann ich Ihnen helfen?",
    sk: "Ahoj! Som Aji, váš AI asistent. Ako vám môžem pomôcť?",
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (messageText) => {
    if (!messageText.trim() || loading) return;

    const userMessage = messageText.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);

    try {
      const response = await axios.post(`${API}/chat`, {
        session_id: sessionId,
        message: userMessage,
        language: language,
      });
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: response.data.response },
      ]);
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessages = {
        cs: "Omlouvám se, něco se pokazilo. Zkuste to prosím znovu.",
        en: "Sorry, something went wrong. Please try again.",
        de: "Entschuldigung, etwas ist schiefgelaufen. Bitte versuchen Sie es erneut.",
        sk: "Prepáčte, niečo sa pokazilo. Skúste to prosím znova.",
      };
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: errorMessages[language] || errorMessages.cs },
      ]);
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await sendMessage(input);
  };

  // Voice recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      const chunks = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      recorder.onstop = async () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        stream.getTracks().forEach(track => track.stop());
        
        // Send to transcription API
        const formData = new FormData();
        formData.append('audio', blob, 'recording.webm');
        formData.append('language', language);

        try {
          setLoading(true);
          const response = await axios.post(`${API}/transcribe`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
          if (response.data.text) {
            await sendMessage(response.data.text);
          }
        } catch (error) {
          console.error("Transcription error:", error);
        }
        setLoading(false);
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
    } catch (error) {
      console.error("Microphone access error:", error);
      alert("Nepodařilo se získat přístup k mikrofonu. Zkontrolujte oprávnění.");
    }
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
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="chat-window"
            data-testid="chat-window"
          >
            {/* Header with language selector */}
            <div className="p-4 border-b border-white/10 bg-[#0A0A0A]">
              <div className="flex items-center justify-between mb-3">
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
              
              {/* Language selector */}
              <div className="flex gap-1">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => setLanguage(lang.code)}
                    className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-medium transition-all ${
                      language === lang.code
                        ? "bg-[#00D9FF] text-black"
                        : "bg-white/5 text-neutral-400 hover:bg-white/10"
                    }`}
                    data-testid={`lang-${lang.code}`}
                  >
                    {lang.flag}
                  </button>
                ))}
              </div>
            </div>

            {/* Messages */}
            <div className="h-[280px] overflow-y-auto p-4 space-y-4">
              {messages.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-neutral-500 text-sm">
                    {welcomeMessages[language]}
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

            {/* Input with voice */}
            <form onSubmit={handleSubmit} className="p-4 border-t border-white/10">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={language === "cs" ? "Napište zprávu..." : language === "en" ? "Type a message..." : language === "de" ? "Nachricht eingeben..." : "Napíšte správu..."}
                  className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm text-white placeholder:text-neutral-600 focus:border-[#00D9FF] outline-none"
                  data-testid="chat-input"
                  disabled={isRecording}
                />
                
                {/* Voice button */}
                <button
                  type="button"
                  onClick={isRecording ? stopRecording : startRecording}
                  disabled={loading}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    isRecording
                      ? "bg-red-500 text-white animate-pulse"
                      : "bg-white/10 text-neutral-400 hover:bg-white/20 hover:text-white"
                  }`}
                  data-testid="chat-voice"
                  title={isRecording ? "Zastavit nahrávání" : "Hlasová zpráva"}
                >
                  {isRecording ? <MicOff size={18} /> : <Mic size={18} />}
                </button>

                {/* Send button */}
                <button
                  type="submit"
                  disabled={loading || !input.trim() || isRecording}
                  className="w-10 h-10 rounded-full bg-[#00D9FF] flex items-center justify-center text-black hover:bg-[#00B8D9] transition-colors disabled:opacity-50"
                  data-testid="chat-send"
                >
                  <Send size={18} />
                </button>
              </div>
              
              {isRecording && (
                <p className="text-xs text-red-400 mt-2 text-center animate-pulse">
                  🎙️ Nahrávám... Klikněte pro zastavení
                </p>
              )}
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
      <UseCasesSection />
      <PricingSection />
      <CallbackSection />
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
