import { useState, useRef, useEffect, Suspense, lazy } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { useTheme } from '@/contexts/ThemeContext';
import ThemeToggle from '@/components/ThemeToggle';
import ScrollProgress from '@/components/ScrollProgress';
import TypewriterText from '@/components/TypewriterText';
import AnimatedCounter from '@/components/AnimatedCounter';
import FloatingCTA from '@/components/FloatingCTA';
// import SEOHead from '@/components/SEOHead'; // Temporarily disabled

// Lazy load Robot3D for performance
const Robot3D = lazy(() => import('@/components/Robot3D'));

// Robot messages for different sections
const ROBOT_MESSAGES = {
  top: 'Ahoj! Jsem váš AI pomocník 👋',
  middle: 'Mohu pracovat 24/7 bez přestávky!',
  bottom: 'Pojďme spolupracovat! 🚀'
};

// Animated background component
function AnimatedBackground({ theme }) {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {/* Gradient orbs */}
      <motion.div
        className={`absolute w-[800px] h-[800px] rounded-full ${
          theme === 'dark'
            ? 'bg-cyan-500/10'
            : 'bg-cyan-500/5'
        }`}
        style={{ filter: 'blur(100px)' }}
        animate={{
          x: ['-20%', '10%', '-20%'],
          y: ['-20%', '20%', '-20%'],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className={`absolute right-0 bottom-0 w-[600px] h-[600px] rounded-full ${
          theme === 'dark'
            ? 'bg-purple-500/10'
            : 'bg-purple-500/5'
        }`}
        style={{ filter: 'blur(100px)' }}
        animate={{
          x: ['20%', '-10%', '20%'],
          y: ['20%', '-20%', '20%'],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
      />
      {/* Grid pattern */}
      <div className={`absolute inset-0 ${
        theme === 'dark'
          ? 'bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)]'
          : 'bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)]'
      }`} style={{ backgroundSize: '60px 60px' }} />
    </div>
  );
}

// Section reveal animation wrapper
function RevealSection({ children, className = '', delay = 0 }) {
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Glassmorphism card
function GlassCard({ children, className = '', hover = true }) {
  const { theme } = useTheme();
  
  return (
    <motion.div
      className={`rounded-2xl backdrop-blur-xl ${
        theme === 'dark'
          ? 'bg-slate-800/50 border border-slate-700/50'
          : 'bg-white/70 border border-slate-200/50'
      } ${hover ? 'hover:border-cyan-500/50 transition-colors duration-300' : ''} ${className}`}
      whileHover={hover ? { y: -5, scale: 1.02 } : {}}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
}

// Navigation
function Nav({ onScrollTo }) {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const links = [
    { label: 'Co je OpenClaw', id: 'what' },
    { label: 'Možnosti', id: 'capabilities' },
    { label: 'FAQ', id: 'faq' },
    { label: 'Ceník', id: 'pricing' },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? theme === 'dark'
            ? 'bg-slate-900/80 backdrop-blur-xl border-b border-slate-800'
            : 'bg-white/80 backdrop-blur-xl border-b border-slate-200'
          : 'bg-transparent'
      }`}
      data-testid="main-navbar"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-baseline gap-1 group" data-testid="nav-logo">
            <motion.span
              className={`text-xl font-extrabold tracking-tight ${
                theme === 'dark' ? 'text-white' : 'text-slate-900'
              }`}
              whileHover={{ scale: 1.05 }}
            >
              <span className="bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">
                OPENCLAW
              </span>
            </motion.span>
            <span className={`text-[10px] font-medium ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>™</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {links.map(l => (
              <motion.button
                key={l.id}
                onClick={() => onScrollTo(l.id)}
                className={`text-sm font-medium transition-colors ${
                  theme === 'dark'
                    ? 'text-slate-400 hover:text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                whileHover={{ y: -2 }}
                data-testid={`nav-${l.id}`}
              >
                {l.label}
              </motion.button>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
            <ThemeToggle />
            <motion.button
              onClick={() => navigate('/auth')}
              className={`text-sm font-medium px-4 py-2 rounded-full transition-colors ${
                theme === 'dark'
                  ? 'text-slate-300 hover:text-white'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
              whileHover={{ scale: 1.05 }}
              data-testid="nav-login-btn"
            >
              Přihlásit se
            </motion.button>
            <motion.button
              onClick={() => navigate('/auth')}
              className="text-sm font-semibold text-white px-5 py-2.5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 shadow-lg shadow-cyan-500/25"
              whileHover={{ scale: 1.05, boxShadow: '0 20px 40px -10px rgba(6,182,212,0.4)' }}
              whileTap={{ scale: 0.95 }}
              data-testid="nav-get-started-btn"
            >
              Vyzkoušet
            </motion.button>
          </div>

          <div className="md:hidden flex items-center gap-3">
            <ThemeToggle />
            <button className="p-2" onClick={() => setMobileOpen(!mobileOpen)} data-testid="mobile-menu-toggle">
              {mobileOpen ? (
                <span className={`text-xl font-light ${theme === 'dark' ? 'text-white' : 'text-slate-700'}`}>✕</span>
              ) : (
                <div className="w-5 space-y-1.5">
                  <div className={`h-[2px] rounded ${theme === 'dark' ? 'bg-white' : 'bg-slate-700'}`} />
                  <div className={`h-[2px] rounded ${theme === 'dark' ? 'bg-white' : 'bg-slate-700'}`} />
                  <div className={`h-[2px] rounded ${theme === 'dark' ? 'bg-white' : 'bg-slate-700'}`} />
                </div>
              )}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`md:hidden border-t ${
              theme === 'dark'
                ? 'bg-slate-900/95 border-slate-800'
                : 'bg-white/95 border-slate-200'
            } backdrop-blur-xl`}
          >
            <div className="px-6 py-4 space-y-3">
              {links.map(l => (
                <button
                  key={l.id}
                  onClick={() => { onScrollTo(l.id); setMobileOpen(false); }}
                  className={`block text-sm py-2 w-full text-left ${
                    theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
                  }`}
                >
                  {l.label}
                </button>
              ))}
              <button
                onClick={() => navigate('/auth')}
                className="w-full text-sm font-medium text-white px-5 py-2.5 rounded-full mt-2 bg-gradient-to-r from-cyan-500 to-blue-500"
                data-testid="mobile-get-started-btn"
              >
                Vyzkoušet OpenClaw
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

// Stats Section
function StatsSection() {
  const { theme } = useTheme();
  const stats = [
    { value: 500, suffix: '+', label: 'Spokojených klientů' },
    { value: 1200, suffix: '+', label: 'AI zaměstnanců' },
    { value: 24, suffix: '/7', label: 'Dostupnost' },
    { value: 98, suffix: '%', label: 'Úspěšnost' },
  ];

  return (
    <RevealSection className="py-16">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <GlassCard key={i} className="p-6 text-center">
              <div className={`text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent`}>
                <AnimatedCounter end={stat.value} suffix={stat.suffix} />
              </div>
              <p className={`text-sm mt-2 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                {stat.label}
              </p>
            </GlassCard>
          ))}
        </div>
      </div>
    </RevealSection>
  );
}

// FAQ Section
function FAQSection({ sectionRef }) {
  const { theme } = useTheme();
  const [openIndex, setOpenIndex] = useState(null);
  
  const faqs = [
    {
      q: 'Co je OpenClaw a jak funguje?',
      a: 'OpenClaw je digitální AI zaměstnanec, který může pracovat ve vašem digitálním světě. Připojí se k vašim nástrojům (e-mail, web, CRM) a autonomně vykonává úkoly podle vašich instrukcí.'
    },
    {
      q: 'Je OpenClaw bezpečný?',
      a: 'Ano, bezpečnost je naše priorita. Vy rozhodujete, kam má OpenClaw přístup. Můžete ho kdykoli zastavit a máte plnou kontrolu nad jeho činností.'
    },
    {
      q: 'Jak rychle mohu začít?',
      a: 'Nastavení trvá obvykle 1-2 dny. Společně nastavíme přístupy, určíme úkoly a spustíme vašeho AI zaměstnance.'
    },
    {
      q: 'Mluví OpenClaw česky?',
      a: 'Ano! OpenClaw plně ovládá češtinu - dokáže komunikovat se zákazníky, psát texty i volat v českém jazyce.'
    },
    {
      q: 'Pro koho je OpenClaw vhodný?',
      a: 'Pro podnikatele, kteří chtějí automatizovat rutinní úkoly, zlepšit zákaznický servis, nebo růst bez najímání dalších lidí.'
    },
  ];

  return (
    <section ref={sectionRef} className="py-20 md:py-28 px-6" data-testid="faq-section">
      <div className="max-w-3xl mx-auto">
        <RevealSection>
          <h2 className={`text-3xl md:text-4xl font-bold text-center mb-12 ${
            theme === 'dark' ? 'text-white' : 'text-slate-900'
          }`}>
            Často kladené otázky
          </h2>
        </RevealSection>
        
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <RevealSection key={i} delay={i * 0.1}>
              <GlassCard className="overflow-hidden" hover={false}>
                <button
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className={`w-full p-5 text-left flex items-center justify-between ${
                    theme === 'dark' ? 'text-white' : 'text-slate-900'
                  }`}
                  data-testid={`faq-question-${i}`}
                >
                  <span className="font-semibold pr-4">{faq.q}</span>
                  <motion.span
                    animate={{ rotate: openIndex === i ? 180 : 0 }}
                    className="text-cyan-500 shrink-0"
                  >
                    ▼
                  </motion.span>
                </button>
                <AnimatePresence>
                  {openIndex === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <p className={`px-5 pb-5 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </GlassCard>
            </RevealSection>
          ))}
        </div>
      </div>
    </section>
  );
}

// Main Landing Page
export default function LandingPage() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [phoneSending, setPhoneSending] = useState(false);
  const [meetingForm, setMeetingForm] = useState({ name: '', email: '', phone: '' });
  const [meetingOpen, setMeetingOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const sectionRefs = useRef({});

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id) => {
    sectionRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleCallback = async (e) => {
    e.preventDefault();
    if (!phone.trim()) return;
    setPhoneSending(true);
    try {
      await api.post('/contact/callback', { phone, type: 'callback' });
      toast.success('Děkujeme! Brzy vám zavoláme.');
      setPhone('');
    } catch {
      toast.error('Chyba. Zkuste to prosím znovu.');
    } finally {
      setPhoneSending(false);
    }
  };

  const handleMeeting = async (e) => {
    e.preventDefault();
    try {
      await api.post('/contact/callback', { ...meetingForm, type: 'meeting' });
      toast.success('Děkujeme! Ozveme se vám ohledně schůzky.');
      setMeetingForm({ name: '', email: '', phone: '' });
      setMeetingOpen(false);
    } catch {
      toast.error('Chyba. Zkuste to prosím znovu.');
    }
  };

  const headlineTexts = [
    'Digitální zaměstnanec s rukama.',
    'Pracuje 24/7 bez přestávky.',
    'Odpovídá zákazníkům okamžitě.',
    'Pomáhá vašemu byznysu růst.',
  ];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      theme === 'dark' ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'
    }`} data-testid="landing-page">
      <SEOHead />
      <ScrollProgress />
      <AnimatedBackground theme={theme} />
      <Nav onScrollTo={scrollTo} />
      <FloatingCTA />

      {/* Robot positions - right side */}
      <div className="fixed right-4 md:right-8 top-32 z-40 hidden lg:block" data-testid="robot-container-top">
        <Suspense fallback={<div className="w-40 h-40 animate-pulse bg-slate-500/20 rounded-full" />}>
          <Robot3D position="top" message={ROBOT_MESSAGES.top} theme={theme} scrollY={scrollY} />
        </Suspense>
      </div>
      <div className="fixed right-4 md:right-8 top-1/2 -translate-y-1/2 z-40 hidden lg:block" data-testid="robot-container-middle">
        <Suspense fallback={<div className="w-40 h-40 animate-pulse bg-slate-500/20 rounded-full" />}>
          <Robot3D position="middle" message={ROBOT_MESSAGES.middle} theme={theme} scrollY={scrollY} />
        </Suspense>
      </div>
      <div className="fixed right-4 md:right-8 bottom-32 z-40 hidden lg:block" data-testid="robot-container-bottom">
        <Suspense fallback={<div className="w-40 h-40 animate-pulse bg-slate-500/20 rounded-full" />}>
          <Robot3D position="bottom" message={ROBOT_MESSAGES.bottom} theme={theme} scrollY={scrollY} />
        </Suspense>
      </div>

      {/* ===== HERO ===== */}
      <section className="pt-28 pb-16 md:pt-40 md:pb-24 px-6 relative" data-testid="hero-section">
        <div className="max-w-5xl mx-auto lg:pr-48">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* 3D Title effect */}
            <h1 className="text-5xl sm:text-6xl lg:text-8xl font-extrabold tracking-tight leading-[1.05] mb-4">
              <motion.span
                className="inline-block bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent"
                style={{
                  textShadow: theme === 'dark' 
                    ? '0 0 80px rgba(6,182,212,0.5)' 
                    : '0 0 80px rgba(6,182,212,0.3)'
                }}
                animate={{ 
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                transition={{ duration: 5, repeat: Infinity }}
              >
                OPENCLAW
              </motion.span>
              <span className={`text-2xl md:text-3xl align-top ml-1 ${theme === 'dark' ? 'text-slate-600' : 'text-slate-300'}`}>™</span>
            </h1>
            
            <p className={`text-base md:text-lg tracking-wide mb-8 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
              Open Cloud AI Assistant with Hands (Tools)
            </p>

            <h2 className={`text-2xl sm:text-3xl md:text-4xl font-semibold mb-8 leading-snug max-w-2xl ${
              theme === 'dark' ? 'text-slate-200' : 'text-slate-800'
            }`}>
              <TypewriterText texts={headlineTexts} className="text-cyan-500" />
            </h2>

            <div className={`space-y-1 text-lg md:text-xl mb-10 leading-relaxed ${
              theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
            }`}>
              <p>Ne jen odpovídat.</p>
              <p>Ne jen reagovat.</p>
              <p className={`font-semibold pt-3 text-xl md:text-2xl ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
                Ale skutečně jednat.
              </p>
            </div>

            <div className="flex flex-wrap gap-4" data-testid="hero-ctas">
              <motion.button
                onClick={() => navigate('/auth')}
                className="px-8 py-4 rounded-full text-white font-semibold bg-gradient-to-r from-cyan-500 to-blue-500 shadow-lg shadow-cyan-500/25"
                whileHover={{ scale: 1.05, boxShadow: '0 25px 50px -12px rgba(6,182,212,0.5)' }}
                whileTap={{ scale: 0.95 }}
                data-testid="hero-cta-try"
              >
                <span className="flex items-center gap-2">
                  Vyzkoušet OpenClaw
                  <motion.span animate={{ x: [0, 5, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>→</motion.span>
                </span>
              </motion.button>
              
              <motion.button
                onClick={() => scrollTo('voice')}
                className="px-8 py-4 rounded-full font-semibold bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-lg shadow-emerald-500/25"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                data-testid="hero-cta-call"
              >
                Nechat si zavolat
              </motion.button>
              
              <motion.button
                onClick={() => setMeetingOpen(true)}
                className={`px-8 py-4 rounded-full font-semibold border-2 ${
                  theme === 'dark'
                    ? 'border-slate-600 text-white hover:border-cyan-500'
                    : 'border-slate-300 text-slate-700 hover:border-cyan-500'
                } transition-colors`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                data-testid="hero-cta-meeting"
              >
                Domluvit setkání
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <StatsSection />

      {/* ===== CO JE OPENCLAW ===== */}
      <section 
        ref={el => sectionRefs.current['what'] = el} 
        className={`py-20 md:py-28 px-6 ${theme === 'dark' ? 'bg-slate-900/50' : 'bg-white/50'}`}
        data-testid="what-section"
      >
        <div className="max-w-5xl mx-auto lg:pr-48">
          <RevealSection>
            <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-6 bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent`}>
              Představte si zaměstnance, který má ruce.
            </h2>
            <div className={`space-y-1 text-lg md:text-xl mb-8 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
              <p>Ne fyzické.</p>
              <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-slate-700'}`}>Digitální.</p>
            </div>
          </RevealSection>
          
          <RevealSection delay={0.2}>
            <p className={`text-lg mb-6 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>Ruce, které mohou:</p>
            <div className="grid md:grid-cols-2 gap-3">
              {[
                'otevřít e-mail',
                'odpovědět zákazníkovi',
                'upravit web',
                'přidat produkt',
                'zkontrolovat objednávky',
                'spustit reklamu',
                'vytvořit marketingový obsah',
                'zavolat klientovi',
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`flex items-center gap-3 p-3 rounded-lg ${
                    theme === 'dark' ? 'bg-slate-800/50' : 'bg-slate-100/50'
                  }`}
                >
                  <span className="text-cyan-500">→</span>
                  <span className={theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}>{item}</span>
                </motion.div>
              ))}
            </div>
          </RevealSection>

          <RevealSection delay={0.4} className={`mt-10 pt-8 border-t ${theme === 'dark' ? 'border-slate-700' : 'border-slate-200'}`}>
            <p className={`text-xl md:text-2xl font-semibold mb-3 ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
              A vy držíte klíče.
            </p>
            <div className={`space-y-1 text-lg ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
              <p>Vy rozhodujete, kam má přístup.</p>
              <p>Vy ho můžete kdykoli zastavit.</p>
              <p className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>Vy máte kontrolu.</p>
            </div>
          </RevealSection>
        </div>
      </section>

      {/* ===== MOŽNOSTI ===== */}
      <section 
        ref={el => sectionRefs.current['capabilities'] = el} 
        className="py-20 md:py-28 px-6"
        data-testid="capabilities-section"
      >
        <div className="max-w-5xl mx-auto lg:pr-48">
          <RevealSection>
            <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-12 bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent`}>
              Nejen reaguje. Přemýšlí.
            </h2>
          </RevealSection>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'Web & SEO', items: ['Návrh úprav webu', 'SEO optimalizace', 'Analýza návštěvnosti'] },
              { title: 'Marketing', items: ['Marketingové kampaně', 'Texty na reklamu', 'Obsah pro sociální sítě'] },
              { title: 'Komunikace', items: ['Odpovědi zákazníkům', 'Volání klientům', 'E-mailová komunikace'] },
              { title: 'Prodej', items: ['Sběr poptávek', 'Follow-up kontakty', 'Cenové nabídky'] },
              { title: 'Analýza', items: ['Slabá místa byznysu', 'Nové příležitosti', 'Konkurenční analýza'] },
              { title: 'Automatizace', items: ['Rutinní úkoly', 'Reporty', 'Integrace systémů'] },
            ].map((cat, i) => (
              <RevealSection key={i} delay={i * 0.1}>
                <GlassCard className="p-6 h-full">
                  <h3 className={`text-lg font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
                    {cat.title}
                  </h3>
                  <ul className="space-y-2">
                    {cat.items.map((item, j) => (
                      <li key={j} className={`text-sm flex items-center gap-2 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                        <span className="text-cyan-500 text-xs">●</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </GlassCard>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* ===== HLASOVÉ VOLÁNÍ ===== */}
      <section 
        ref={el => sectionRefs.current['voice'] = el} 
        className={`py-20 md:py-28 px-6 ${theme === 'dark' ? 'bg-slate-900/50' : 'bg-white/50'}`}
        data-testid="voice-section"
      >
        <div className="max-w-4xl mx-auto">
          <RevealSection>
            <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-6 bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent`}>
              Mluví česky a může volat
            </h2>
            <p className={`text-lg mb-8 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
              OpenClaw dokáže přirozeně mluvit česky. Může volat zákazníkům, potvrzovat objednávky a zjišťovat informace.
            </p>
          </RevealSection>

          <RevealSection delay={0.2}>
            <GlassCard className="p-8 md:p-10" hover={false}>
              <h3 className={`text-xl md:text-2xl font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
                Vyzkoušejte to. Nechte si zavolat.
              </h3>
              <p className={`text-base mb-6 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                Vyplňte telefon a OpenClaw vám zavolá zpět.
              </p>
              <form onSubmit={handleCallback} className="flex flex-col sm:flex-row gap-3 max-w-lg">
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+420 xxx xxx xxx"
                  className={`flex-1 px-5 py-3.5 rounded-full border text-base placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
                    theme === 'dark'
                      ? 'bg-slate-800 border-slate-700 text-white'
                      : 'bg-white border-slate-300 text-slate-800'
                  }`}
                  required
                  data-testid="callback-phone-input"
                />
                <motion.button
                  type="submit"
                  disabled={phoneSending}
                  className="px-8 py-3.5 rounded-full text-white font-medium bg-gradient-to-r from-emerald-500 to-green-500 disabled:opacity-50"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  data-testid="callback-submit-btn"
                >
                  {phoneSending ? 'Odesílám...' : 'Zavolat mi'}
                </motion.button>
              </form>
            </GlassCard>
          </RevealSection>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQSection sectionRef={el => sectionRefs.current['faq'] = el} />

      {/* ===== CENÍK ===== */}
      <section 
        ref={el => sectionRefs.current['pricing'] = el} 
        className={`py-20 md:py-28 px-6 ${theme === 'dark' ? 'bg-slate-900/50' : 'bg-white/50'}`}
        data-testid="pricing-section"
      >
        <div className="max-w-5xl mx-auto">
          <RevealSection>
            <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-12 text-center bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent`}>
              Ceník
            </h2>
          </RevealSection>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Základ */}
            <RevealSection>
              <GlassCard className="p-8 md:p-10 h-full" hover={false}>
                <h3 className={`text-2xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
                  Základ
                </h3>
                <p className={`text-base mb-8 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                  Digitální asistent pro každodenní práci.
                </p>
                <p className={`text-sm font-semibold uppercase tracking-wider mb-4 ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
                  Obsahuje:
                </p>
                <ul className={`space-y-3 text-base mb-10 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                  {['osobní nastavení', 'chatbot na web', 'český hlasový modul', 'práce s e-mailem', 'sběr poptávek', 'základní automatizace', 'měsíční podpora'].map(f => (
                    <li key={f} className="flex items-center gap-3">
                      <span className="text-cyan-500">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <motion.button
                  onClick={() => navigate('/auth')}
                  className={`w-full py-3.5 rounded-full font-medium ${
                    theme === 'dark'
                      ? 'bg-slate-700 text-white hover:bg-slate-600'
                      : 'bg-slate-200 text-slate-800 hover:bg-slate-300'
                  } transition-colors`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  data-testid="pricing-cta-zaklad"
                >
                  Začít se Základem
                </motion.button>
              </GlassCard>
            </RevealSection>

            {/* Růst */}
            <RevealSection delay={0.1}>
              <div className="relative">
                <div className="absolute -top-3 left-8 px-4 py-1 rounded-full text-xs font-semibold text-white bg-gradient-to-r from-emerald-500 to-green-500 z-10">
                  Doporučujeme
                </div>
                <GlassCard className="p-8 md:p-10 h-full border-2 border-cyan-500/50" hover={false}>
                  <h3 className={`text-2xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
                    Růst
                  </h3>
                  <p className={`text-base mb-8 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                    Digitální zaměstnanec s plnými nástroji.
                  </p>
                  <p className={`text-sm font-semibold uppercase tracking-wider mb-4 ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
                    Obsahuje vše ze Základu +
                  </p>
                  <ul className={`space-y-3 text-base mb-10 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                    {['více přístupů (web, marketing, prodej)', 'práce s reklamou', 'SEO optimalizace', 'tvorba obsahu', 'pokročilé automatizace', 'strategické konzultace', 'rozšiřování funkcí'].map(f => (
                      <li key={f} className="flex items-center gap-3">
                        <span className="text-emerald-500">✓</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <motion.button
                    onClick={() => navigate('/auth')}
                    className="w-full py-3.5 rounded-full font-medium text-white bg-gradient-to-r from-cyan-500 to-blue-500 shadow-lg shadow-cyan-500/25"
                    whileHover={{ scale: 1.02, boxShadow: '0 20px 40px -10px rgba(6,182,212,0.4)' }}
                    whileTap={{ scale: 0.98 }}
                    data-testid="pricing-cta-rust"
                  >
                    Začít s Růstem
                  </motion.button>
                </GlassCard>
              </div>
            </RevealSection>
          </div>
        </div>
      </section>

      {/* ===== ZÁVĚREČNÁ SEKCE ===== */}
      <section className="py-20 md:py-28 px-6 relative overflow-hidden" data-testid="final-cta-section">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-600 via-blue-600 to-purple-600" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,...')] opacity-10" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <RevealSection>
            <motion.h2 
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-6"
              animate={{ 
                textShadow: ['0 0 20px rgba(255,255,255,0.3)', '0 0 40px rgba(255,255,255,0.5)', '0 0 20px rgba(255,255,255,0.3)']
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              OpenClaw™
            </motion.h2>
            <div className="space-y-2 text-lg md:text-xl text-white/80 mb-10">
              <p>Digitální asistent s rukama.</p>
              <p>Vy rozhodujete, kam ho pustíte.</p>
              <p className="font-semibold text-white">On pracuje.</p>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.button
                onClick={() => navigate('/auth')}
                className="px-8 py-4 rounded-full font-semibold bg-white text-blue-600 shadow-xl"
                whileHover={{ scale: 1.05, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.3)' }}
                whileTap={{ scale: 0.95 }}
                data-testid="final-cta-try"
              >
                Vyzkoušejte ho
              </motion.button>
              <motion.button
                onClick={() => scrollTo('voice')}
                className="px-8 py-4 rounded-full font-semibold text-white border-2 border-white/40 hover:border-white transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                data-testid="final-cta-call"
              >
                Nechte si zavolat
              </motion.button>
            </div>
          </RevealSection>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className={`py-12 px-6 border-t ${
        theme === 'dark' ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200'
      }`} data-testid="footer">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-extrabold bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">
              OPENCLAW
            </span>
            <span className={`text-[9px] ${theme === 'dark' ? 'text-slate-600' : 'text-slate-400'}`}>™</span>
          </div>
          <p className={`text-sm ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
            © {new Date().getFullYear()} OpenClaw s.r.o. Všechna práva vyhrazena. GDPR
          </p>
        </div>
      </footer>

      {/* ===== MEETING MODAL ===== */}
      <AnimatePresence>
        {meetingOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm px-6"
            onClick={() => setMeetingOpen(false)}
            data-testid="meeting-modal"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`rounded-2xl p-8 w-full max-w-md shadow-2xl relative ${
                theme === 'dark'
                  ? 'bg-slate-800 border border-slate-700'
                  : 'bg-white'
              }`}
              onClick={e => e.stopPropagation()}
            >
              <button
                onClick={() => setMeetingOpen(false)}
                className={`absolute top-4 right-4 text-xl ${
                  theme === 'dark' ? 'text-slate-400 hover:text-white' : 'text-slate-400 hover:text-slate-700'
                }`}
                data-testid="meeting-close-btn"
              >
                ✕
              </button>
              <h3 className={`text-xl font-bold mb-1 ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
                Domluvit osobní setkání
              </h3>
              <p className={`text-sm mb-6 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                Vyplňte údaje a ozveme se vám.
              </p>
              <form onSubmit={handleMeeting} className="space-y-4">
                <input
                  type="text"
                  value={meetingForm.name}
                  onChange={e => setMeetingForm(p => ({ ...p, name: e.target.value }))}
                  placeholder="Jméno"
                  className={`w-full px-4 py-3 rounded-lg border text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
                    theme === 'dark'
                      ? 'bg-slate-700 border-slate-600 text-white'
                      : 'bg-white border-slate-300 text-slate-800'
                  }`}
                  required
                  data-testid="meeting-name-input"
                />
                <input
                  type="email"
                  value={meetingForm.email}
                  onChange={e => setMeetingForm(p => ({ ...p, email: e.target.value }))}
                  placeholder="E-mail"
                  className={`w-full px-4 py-3 rounded-lg border text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
                    theme === 'dark'
                      ? 'bg-slate-700 border-slate-600 text-white'
                      : 'bg-white border-slate-300 text-slate-800'
                  }`}
                  required
                  data-testid="meeting-email-input"
                />
                <input
                  type="tel"
                  value={meetingForm.phone}
                  onChange={e => setMeetingForm(p => ({ ...p, phone: e.target.value }))}
                  placeholder="Telefon"
                  className={`w-full px-4 py-3 rounded-lg border text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
                    theme === 'dark'
                      ? 'bg-slate-700 border-slate-600 text-white'
                      : 'bg-white border-slate-300 text-slate-800'
                  }`}
                  required
                  data-testid="meeting-phone-input"
                />
                <motion.button
                  type="submit"
                  className="w-full py-3.5 rounded-full text-white font-medium bg-gradient-to-r from-cyan-500 to-blue-500"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  data-testid="meeting-submit-btn"
                >
                  Odeslat
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
