import { useState, useEffect, useRef } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence, useInView } from "framer-motion";

// Lucide React icons
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
  TrendingUp,
  Shield,
  Award,
  PlayCircle,
  Calculator,
  HelpCircle,
  ChevronRight,
  Quote,
  Target,
  Rocket,
  Brain,
  HeartHandshake,
  BadgeCheck,
  Gauge,
  MessageSquare,
  Calendar,
  CreditCard,
  BarChart3,
  Smartphone,
  Headphones,
  RefreshCw,
} from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

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
    { href: "#reference", label: "Reference" },
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
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-neutral-400 hover:text-white transition-colors font-body text-sm"
              data-testid={`nav-${link.label.toLowerCase()}`}
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
            <Rocket size={16} className="text-[#00D9FF]" />
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
              href="#callback"
              className="bg-[#00D9FF] text-black px-8 py-4 rounded-full font-semibold text-lg hover:bg-[#00B8D9] transition-all hover:scale-105 inline-flex items-center justify-center gap-2"
              data-testid="hero-cta-primary"
            >
              <PhoneCall size={20} />
              Zavoláme vám do 2 minut
            </a>
            <a
              href="#demo"
              className="border border-white/20 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/5 transition-all inline-flex items-center justify-center gap-2"
              data-testid="hero-cta-secondary"
            >
              <PlayCircle size={20} />
              Sledovat demo
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// Live Stats Section
const StatsSection = () => {
  const stats = [
    { icon: Users, value: 500, suffix: "+", label: "Spokojených klientů" },
    { icon: MessageSquare, value: 50000, suffix: "+", label: "Vyřízených konverzací" },
    { icon: Clock, value: 24, suffix: "/7", label: "Dostupnost" },
    { icon: Gauge, value: 3, suffix: "s", label: "Průměrná odpověď" },
  ];

  return (
    <section className="py-16 relative">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-white/5 to-white/0 border border-white/10 rounded-2xl p-6 text-center group hover:border-[#00D9FF]/30 transition-all"
            >
              <stat.icon size={28} className="text-[#00D9FF] mx-auto mb-3 group-hover:scale-110 transition-transform" />
              <p className="font-heading font-bold text-3xl md:text-4xl text-white mb-1">
                <AnimatedCounter end={stat.value} suffix={stat.suffix} />
              </p>
              <p className="text-neutral-500 text-sm">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

// Services Section
const services = [
  {
    icon: Brain,
    title: "AI Asistenti",
    subtitle: "Clawdbot & OpenClawd",
    description: "Kompletní nasazení inteligentních AI asistentů přizpůsobených vašemu byznysu.",
  },
  {
    icon: RefreshCw,
    title: "Automatizace",
    subtitle: "n8n, Make.com, API",
    description: "Propojíme vaše systémy a automatizujeme repetitivní úlohy.",
  },
  {
    icon: GraduationCap,
    title: "Training",
    subtitle: "Pro váš tým",
    description: "Naučíme váš tým efektivně využívat AI nástroje.",
  },
  {
    icon: HeartHandshake,
    title: "Partnerství",
    subtitle: "Dlouhodobá podpora",
    description: "Nejsme jen dodavatelé - jsme vaši digitální partneři.",
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="service-card bg-[#0A0A0A] border border-white/10 rounded-2xl p-6"
              data-testid={`service-card-${index}`}
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00D9FF]/20 to-[#00D9FF]/5 flex items-center justify-center mb-4">
                <service.icon size={24} className="text-[#00D9FF]" />
              </div>
              <h3 className="font-heading font-semibold text-lg text-white mb-1">
                {service.title}
              </h3>
              <p className="text-[#00D9FF] text-xs font-mono mb-3">
                {service.subtitle}
              </p>
              <p className="text-neutral-400 text-sm">{service.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Use Cases Section
const useCases = [
  {
    icon: "🔧",
    industry: "Autoservisy",
    problem: "Zmeškané telefonáty, zapomenuté STK, ztracené objednávky",
    solutions: ["AI přijímá objednávky 24/7", "Automatické připomenutí STK", "Historie oprav na jeden klik"],
    savings: "5+ hodin týdně",
    highlight: "Zákazník si objedná i v neděli večer",
  },
  {
    icon: "💇",
    industry: "Kadeřnictví",
    problem: "Neustálé telefonáty, no-shows, chaos v kalendáři",
    solutions: ["Online rezervace bez volání", "SMS/WhatsApp připomenutí", "Zákazník vidí volné termíny"],
    savings: "70% méně no-shows",
    highlight: "Vy stříháte, AI řeší telefony",
  },
  {
    icon: "💅",
    industry: "Kosmetika & Nehty",
    problem: "Přeplněné DMs, opakované dotazy na ceník",
    solutions: ["AI odpoví na Instagram/FB", "Automatický ceník a portfolio", "Rezervace přímo z chatu"],
    savings: "3+ hodiny denně",
    highlight: "Klientky si zarezervují i o půlnoci",
  },
  {
    icon: "🍽️",
    industry: "Restaurace",
    problem: "Přetížená linka, chybné rezervace",
    solutions: ["AI rezervace stolů non-stop", "Odpovědi na Google recenze", "Menu a alergeny na dotaz"],
    savings: "40% více rezervací",
    highlight: "Obsluha se věnuje hostům",
  },
  {
    icon: "💪",
    industry: "Fitness & Trenéři",
    problem: "Zrušené lekce, motivace klientů",
    solutions: ["Automatické plánování tréninků", "Motivační zprávy a tipy", "Sledování pokroku klientů"],
    savings: "10+ hodin měsíčně",
    highlight: "Klient dostane plán ihned",
  },
  {
    icon: "🏠",
    industry: "Reality",
    problem: "Stovky dotazů, opakované informace",
    solutions: ["AI odpoví na dotazy 24/7", "Automatické plánování prohlídek", "Kvalifikace zájemců předem"],
    savings: "60% méně zbytečných prohlídek",
    highlight: "Jen vážní zájemci",
  },
  {
    icon: "🛒",
    industry: "E-shopy",
    problem: "Kde je zásilka?, vratky, dotazy",
    solutions: ["Sledování zásilek automaticky", "Odpovědi na FAQ 24/7", "Pomoc s výběrem produktu"],
    savings: "80% méně ticketů",
    highlight: "Odpověď za 3 sekundy",
  },
  {
    icon: "📊",
    industry: "Účetní",
    problem: "Chybějící dokumenty, zmeškané termíny",
    solutions: ["Připomenutí daňových termínů", "Automatický sběr dokladů", "Odpovědi na časté dotazy"],
    savings: "15+ hodin měsíčně",
    highlight: "Klient pošle fakturu přes WhatsApp",
  },
];

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
            <Target size={16} className="text-[#00D9FF]" />
            <span className="text-sm text-[#00D9FF]">Ušetřete hodiny práce každý týden</span>
          </div>
          <h2 className="font-heading font-bold text-3xl md:text-5xl text-white mb-4">
            AI asistent pro váš obor
          </h2>
          <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
            <span className="text-white font-semibold">24 hodin denně, 7 dní v týdnu.</span>
          </p>
        </motion.div>

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

        <AnimatePresence mode="wait">
          <motion.div
            key={activeCase}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
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
                      <ChevronRight size={16} className="text-[#00D9FF] mt-1 flex-shrink-0" />
                      {solution}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <div className="bg-gradient-to-br from-[#00D9FF]/20 to-[#00D9FF]/5 border border-[#00D9FF]/30 rounded-2xl p-8 text-center">
                <TrendingUp size={32} className="text-[#00D9FF] mx-auto mb-4" />
                <p className="text-neutral-400 mb-2">Průměrná úspora</p>
                <p className="font-heading font-bold text-4xl text-white mb-2">
                  {useCases[activeCase].savings}
                </p>
                <p className="text-[#00D9FF] font-medium">
                  {useCases[activeCase].highlight}
                </p>
              </div>

              <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-8">
                <h4 className="font-heading font-semibold text-white mb-4">
                  Co získáte navíc
                </h4>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3 text-neutral-300">
                    <div className="w-8 h-8 rounded-lg bg-[#00D9FF]/10 flex items-center justify-center">
                      <Zap size={16} className="text-[#00D9FF]" />
                    </div>
                    <span>Odpovědi <strong className="text-white">do 3 sekund</strong></span>
                  </li>
                  <li className="flex items-center gap-3 text-neutral-300">
                    <div className="w-8 h-8 rounded-lg bg-[#00D9FF]/10 flex items-center justify-center">
                      <Clock size={16} className="text-[#00D9FF]" />
                    </div>
                    <span>Dostupnost <strong className="text-white">24/7/365</strong></span>
                  </li>
                  <li className="flex items-center gap-3 text-neutral-300">
                    <div className="w-8 h-8 rounded-lg bg-[#00D9FF]/10 flex items-center justify-center">
                      <BadgeCheck size={16} className="text-[#00D9FF]" />
                    </div>
                    <span><strong className="text-white">Spokojení zákazníci</strong> = více doporučení</span>
                  </li>
                </ul>
              </div>

              <a
                href="#callback"
                className="bg-[#00D9FF] text-black px-8 py-4 rounded-xl font-semibold text-lg hover:bg-[#00B8D9] transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
                data-testid="usecase-cta"
              >
                Chci AI asistenta
                <ArrowRight size={20} />
              </a>
            </div>
          </motion.div>
        </AnimatePresence>
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
    notIncluded: ["Hlasový asistent", "Vlastní integrace", "Prioritní podpora"],
    popular: false,
    cta: "Začít zdarma",
    icon: Rocket,
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
    notIncluded: ["Vlastní AI model"],
    popular: true,
    cta: "Vybrat Business",
    icon: TrendingUp,
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
    icon: Award,
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
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#00D9FF]/20 to-[#00D9FF]/5 flex items-center justify-center mx-auto mb-4">
                  <plan.icon size={24} className="text-[#00D9FF]" />
                </div>
                <h3 className="font-heading font-bold text-2xl text-white mb-2">{plan.name}</h3>
                <p className="text-neutral-500 text-sm mb-4">{plan.description}</p>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="font-heading font-bold text-4xl text-white">{plan.price}</span>
                  <span className="text-neutral-400">Kč/{plan.period}</span>
                </div>
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
                {plan.cta}
              </a>
            </motion.div>
          ))}
        </div>

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
              <Shield size={16} className="text-green-400" />
              14 dní na vyzkoušení
            </span>
            <span className="flex items-center gap-2">
              <BadgeCheck size={16} className="text-green-400" />
              Bez závazků
            </span>
            <span className="flex items-center gap-2">
              <Calendar size={16} className="text-green-400" />
              Měsíční platby
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// ROI Calculator Section
const ROICalculatorSection = () => {
  const [calls, setCalls] = useState(20);
  const [minutesPerCall, setMinutesPerCall] = useState(5);
  const hourlyRate = 350; // Kč/hour

  const monthlyHours = (calls * 22 * minutesPerCall) / 60;
  const monthlySavings = monthlyHours * hourlyRate;
  const yearlySavings = monthlySavings * 12;

  return (
    <section className="py-24 md:py-32 relative">
      <div className="max-w-4xl mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-[#0A0A0A] to-[#111] border border-white/10 rounded-3xl p-8 md:p-12"
        >
          <div className="text-center mb-10">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#00D9FF]/20 to-[#00D9FF]/5 flex items-center justify-center mx-auto mb-4">
              <Calculator size={32} className="text-[#00D9FF]" />
            </div>
            <h2 className="font-heading font-bold text-3xl text-white mb-2">
              Kolik ušetříte s AI asistentem?
            </h2>
            <p className="text-neutral-400">
              Spočítejte si svou potenciální úsporu
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            <div>
              <label className="block text-neutral-300 mb-3 font-medium">
                <Phone size={16} className="inline mr-2 text-[#00D9FF]" />
                Počet hovorů denně: <span className="text-[#00D9FF] font-bold">{calls}</span>
              </label>
              <input
                type="range"
                min="5"
                max="100"
                value={calls}
                onChange={(e) => setCalls(parseInt(e.target.value))}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#00D9FF]"
              />
              <div className="flex justify-between text-xs text-neutral-600 mt-1">
                <span>5</span>
                <span>100</span>
              </div>
            </div>

            <div>
              <label className="block text-neutral-300 mb-3 font-medium">
                <Clock size={16} className="inline mr-2 text-[#00D9FF]" />
                Minut na hovor: <span className="text-[#00D9FF] font-bold">{minutesPerCall}</span>
              </label>
              <input
                type="range"
                min="2"
                max="15"
                value={minutesPerCall}
                onChange={(e) => setMinutesPerCall(parseInt(e.target.value))}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#00D9FF]"
              />
              <div className="flex justify-between text-xs text-neutral-600 mt-1">
                <span>2 min</span>
                <span>15 min</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/5 rounded-xl p-6 text-center">
              <p className="text-neutral-400 text-sm mb-1">Hodin měsíčně</p>
              <p className="font-heading font-bold text-3xl text-white">
                {monthlyHours.toFixed(0)}h
              </p>
            </div>
            <div className="bg-gradient-to-br from-[#00D9FF]/20 to-[#00D9FF]/5 border border-[#00D9FF]/30 rounded-xl p-6 text-center">
              <p className="text-[#00D9FF] text-sm mb-1">Úspora měsíčně</p>
              <p className="font-heading font-bold text-3xl text-white">
                {monthlySavings.toLocaleString()} Kč
              </p>
            </div>
            <div className="bg-white/5 rounded-xl p-6 text-center">
              <p className="text-neutral-400 text-sm mb-1">Úspora ročně</p>
              <p className="font-heading font-bold text-3xl text-[#00D9FF]">
                {yearlySavings.toLocaleString()} Kč
              </p>
            </div>
          </div>

          <p className="text-center text-neutral-500 text-sm mt-6">
            * Kalkulace na základě průměrné hodinové sazby {hourlyRate} Kč a 22 pracovních dnů
          </p>
        </motion.div>
      </div>
    </section>
  );
};

// Testimonials Section
const testimonials = [
  {
    name: "Petr Novák",
    role: "Majitel autoservisu",
    company: "AutoServis Praha",
    quote: "AI asistent nám ušetřil minimálně 5 hodin týdně. Zákazníci si teď můžou objednat i v neděli večer a my máme ráno připravený plán.",
    rating: 5,
    avatar: "PN",
  },
  {
    name: "Marie Svobodová",
    role: "Kadeřnice",
    company: "Salon Marie",
    quote: "No-shows klesly o 70%! Klienti dostávají automatické připomenutí a já se můžu soustředit na to, co mě baví - stříhání.",
    rating: 5,
    avatar: "MS",
  },
  {
    name: "Jan Dvořák",
    role: "E-shop manager",
    company: "ModníShop.cz",
    quote: "Zákaznická podpora běží 24/7 bez jediného zaměstnance navíc. AI vyřeší 80% dotazů automaticky a zbytek předá nám.",
    rating: 5,
    avatar: "JD",
  },
];

const TestimonialsSection = () => {
  return (
    <section id="reference" className="py-24 md:py-32 relative bg-gradient-to-b from-transparent via-[#00D9FF]/5 to-transparent">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#00D9FF]/30 bg-[#00D9FF]/10 mb-6">
            <Quote size={16} className="text-[#00D9FF]" />
            <span className="text-sm text-[#00D9FF]">Co říkají naši klienti</span>
          </div>
          <h2 className="font-heading font-bold text-3xl md:text-5xl text-white mb-4">
            Reference
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 hover:border-[#00D9FF]/30 transition-all"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} size={16} className="text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              
              <p className="text-neutral-300 mb-6 italic">"{testimonial.quote}"</p>
              
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#00D9FF] to-[#00B8D9] flex items-center justify-center text-black font-bold">
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="font-semibold text-white">{testimonial.name}</p>
                  <p className="text-neutral-500 text-sm">{testimonial.role}</p>
                  <p className="text-[#00D9FF] text-xs">{testimonial.company}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Video Demo Section
const VideoDemoSection = () => {
  return (
    <section id="demo" className="py-24 md:py-32 relative">
      <div className="max-w-5xl mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-heading font-bold text-3xl md:text-5xl text-white mb-4">
            Podívejte se, jak to funguje
          </h2>
          <p className="text-neutral-400 text-lg">
            2 minuty, které vám změní pohled na zákaznickou podporu
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 bg-[#0A0A0A]"
        >
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#00D9FF]/10 to-transparent">
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-[#00D9FF] flex items-center justify-center mx-auto mb-4 cursor-pointer hover:scale-110 transition-transform">
                <PlayCircle size={40} className="text-black" />
              </div>
              <p className="text-neutral-400">Demo video - připravuje se</p>
              <p className="text-neutral-600 text-sm mt-2">
                Zatím si můžete vyzkoušet AI chatbot vpravo dole 👉
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// FAQ Section
const faqs = [
  {
    question: "Jak rychle můžete nasadit AI asistenta?",
    answer: "Základní nasazení trvá 24-48 hodin. Pokročilé integrace a customizace obvykle 1-2 týdny v závislosti na složitosti.",
  },
  {
    question: "Potřebuji nějaké technické znalosti?",
    answer: "Ne! Vše nastavíme za vás a naučíme váš tým s asistentem pracovat. Máme intuitivní dashboard pro správu.",
  },
  {
    question: "V jakých jazycích AI asistent komunikuje?",
    answer: "Podporujeme češtinu, slovenštinu, angličtinu a němčinu. Na vyžádání přidáme další jazyky.",
  },
  {
    question: "Co když AI neví odpověď?",
    answer: "AI je natrénovaná předat složitější dotazy vám. Dostanete notifikaci a můžete převzít konverzaci.",
  },
  {
    question: "Jak je to s bezpečností dat?",
    answer: "Data jsou šifrovaná a uložená na serverech v EU. Splňujeme GDPR a můžeme podepsat NDA.",
  },
  {
    question: "Mohu AI asistenta kdykoliv zrušit?",
    answer: "Ano, bez sankcí. Platíte měsíčně bez dlouhodobých závazků. Data vám na požádání exportujeme.",
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

// Callback Section (AI zavolá zpět do 2 minut)
const CallbackSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    language: "cs",
  });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [countdown, setCountdown] = useState(120);

  const languages = [
    { code: "cs", name: "Čeština", flag: "🇨🇿" },
    { code: "en", name: "English", flag: "🇬🇧" },
    { code: "de", name: "Deutsch", flag: "🇩🇪" },
    { code: "sk", name: "Slovenčina", flag: "🇸🇰" },
  ];

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
                Jazyk konverzace: {languages.find(l => l.code === formData.language)?.flag} {languages.find(l => l.code === formData.language)?.name}
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
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => setFormData({ ...formData, language: lang.code })}
                      className={`py-3 px-2 rounded-xl text-center transition-all ${
                        formData.language === lang.code
                          ? "bg-[#00D9FF] text-black font-semibold"
                          : "bg-white/5 text-neutral-400 hover:bg-white/10 border border-white/10"
                      }`}
                      data-testid={`callback-lang-${lang.code}`}
                    >
                      <span className="text-xl block mb-1">{lang.flag}</span>
                      <span className="text-xs">{lang.name}</span>
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
                🔒 Vaše údaje jsou v bezpečí. Používáme je pouze pro tento hovor.
              </p>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
};

// Contact Section (without Calendly)
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
              <p className="text-neutral-400">Ozveme se vám co nejdříve.</p>
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

// Newsletter Section
const NewsletterSection = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would call your newsletter API
    setSubscribed(true);
  };

  return (
    <section className="py-16 relative">
      <div className="max-w-3xl mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-[#00D9FF]/10 to-transparent border border-[#00D9FF]/20 rounded-2xl p-8 text-center"
        >
          <Mail size={32} className="text-[#00D9FF] mx-auto mb-4" />
          <h3 className="font-heading font-bold text-2xl text-white mb-2">
            Novinky ze světa AI
          </h3>
          <p className="text-neutral-400 mb-6">
            Tipy, triky a novinky. Žádný spam, max 2x měsíčně.
          </p>

          {subscribed ? (
            <div className="flex items-center justify-center gap-2 text-green-400">
              <Check size={20} />
              <span>Děkujeme za přihlášení!</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="vas@email.cz"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 bg-black/50 border border-white/10 rounded-full px-5 py-3 text-white placeholder:text-neutral-600 focus:border-[#00D9FF] outline-none"
                data-testid="newsletter-email"
              />
              <button
                type="submit"
                className="bg-[#00D9FF] text-black px-6 py-3 rounded-full font-semibold hover:bg-[#00B8D9] transition-all"
                data-testid="newsletter-submit"
              >
                Odebírat
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
          <p className="text-neutral-500 text-sm">
            © 2025 chciai.cz. Všechna práva vyhrazena.
          </p>
          <div className="flex items-center gap-4">
            <a href="mailto:info@chciai.cz" className="text-neutral-400 hover:text-[#00D9FF] transition-colors" data-testid="footer-email">
              info@chciai.cz
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

// Chat Widget (kept from before with voice and language support)
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
    { code: "cs", name: "CZ", flag: "🇨🇿" },
    { code: "en", name: "EN", flag: "🇬🇧" },
    { code: "de", name: "DE", flag: "🇩🇪" },
    { code: "sk", name: "SK", flag: "🇸🇰" },
  ];

  const welcomeMessages = {
    cs: "Ahoj! Jsem Aji. Jak vám mohu pomoci?",
    en: "Hello! I'm Aji. How can I help you?",
    de: "Hallo! Ich bin Aji. Wie kann ich Ihnen helfen?",
    sk: "Ahoj! Som Aji. Ako vám môžem pomôcť?",
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
      const response = await axios.post(`${API}/chat`, {
        session_id: sessionId,
        message: userMessage,
        language: language,
      });
      setMessages((prev) => [...prev, { role: "assistant", content: response.data.response }]);
    } catch (error) {
      setMessages((prev) => [...prev, { role: "assistant", content: "Omlouvám se, něco se pokazilo." }]);
    }
    setLoading(false);
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
                    <p className="text-xs text-neutral-500">AI asistent</p>
                  </div>
                </div>
                <button onClick={() => setIsOpen(false)} className="text-neutral-400 hover:text-white" data-testid="chat-close">
                  <X size={20} />
                </button>
              </div>
              <div className="flex gap-1">
                {languages.map((lang) => (
                  <button key={lang.code} onClick={() => setLanguage(lang.code)} className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all ${language === lang.code ? "bg-[#00D9FF] text-black" : "bg-white/5 text-neutral-400 hover:bg-white/10"}`} data-testid={`lang-${lang.code}`}>
                    {lang.flag}
                  </button>
                ))}
              </div>
            </div>
            <div className="h-[280px] overflow-y-auto p-4 space-y-4">
              {messages.length === 0 && <div className="text-center py-8"><p className="text-neutral-500 text-sm">{welcomeMessages[language]}</p></div>}
              {messages.map((msg, index) => (
                <div key={index} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm ${msg.role === "user" ? "bg-[#00D9FF] text-black rounded-br-md" : "bg-white/5 text-white rounded-bl-md"}`}>{msg.content}</div>
                </div>
              ))}
              {loading && <div className="flex justify-start"><div className="bg-white/5 rounded-2xl rounded-bl-md"><div className="typing-indicator"><span></span><span></span><span></span></div></div></div>}
              <div ref={messagesEndRef} />
            </div>
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
      <StatsSection />
      <ServicesSection />
      <UseCasesSection />
      <ROICalculatorSection />
      <PricingSection />
      <TestimonialsSection />
      <VideoDemoSection />
      <FAQSection />
      <CallbackSection />
      <ContactSection />
      <NewsletterSection />
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
