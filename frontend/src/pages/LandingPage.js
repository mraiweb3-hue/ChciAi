import { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { useTheme } from '@/contexts/ThemeContext';
import ThemeToggle from '@/components/ThemeToggle';
import ScrollProgress from '@/components/ScrollProgress';
import TypewriterText from '@/components/TypewriterText';
import AnimatedCounter from '@/components/AnimatedCounter';
import NavLogo3D from '@/components/NavLogo3D';
import ClawixCallbackForm from '@/components/ClawixCallbackForm';
import ChatbotWidget from '@/components/ChatbotWidget';
import ProcessSteps from '@/components/ProcessSteps';
import SecuritySection from '@/components/SecuritySection';

// Animated background component
function AnimatedBackground({ theme }) {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      <motion.div
        className={`absolute w-[800px] h-[800px] rounded-full ${
          theme === 'dark' ? 'bg-cyan-500/10' : 'bg-cyan-500/5'
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
          theme === 'dark' ? 'bg-purple-500/10' : 'bg-purple-500/5'
        }`}
        style={{ filter: 'blur(100px)' }}
        animate={{
          x: ['20%', '-10%', '20%'],
          y: ['20%', '-20%', '20%'],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
      />
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

// Glassmorphism card with 3D tilt effect
function GlassCard({ children, className = '', hover = true }) {
  const { theme } = useTheme();
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current || !hover) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / 20;
    const y = (e.clientY - rect.top - rect.height / 2) / 20;
    setTilt({ x: -y, y: x });
  };

  const handleMouseLeave = () => setTilt({ x: 0, y: 0 });

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`rounded-2xl backdrop-blur-xl ${
        theme === 'dark'
          ? 'bg-slate-800/50 border border-slate-700/50'
          : 'bg-white/70 border border-slate-200/50'
      } ${hover ? 'hover:border-cyan-500/50 transition-colors duration-300' : ''} ${className}`}
      style={{
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: 'transform 0.1s ease-out'
      }}
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
    { label: 'Co je Chci AI', id: 'what' },
    { label: 'Jak to funguje', id: 'how' },
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center" data-testid="nav-logo">
            <NavLogo3D theme={theme} />
          </Link>

          <div className="hidden md:flex items-center gap-6 lg:gap-8">
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

          <div className="hidden md:flex items-center gap-3">
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
              Přihlásit
            </motion.button>
            <motion.button
              onClick={() => navigate('/auth')}
              className="text-sm font-semibold text-white px-5 py-2.5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 shadow-lg shadow-cyan-500/25"
              whileHover={{ scale: 1.05, boxShadow: '0 20px 40px -10px rgba(6,182,212,0.4)' }}
              whileTap={{ scale: 0.95 }}
              data-testid="nav-get-started-btn"
            >
              Vytvořit OpenClaw
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
                Vyzkoušet
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
    <RevealSection className="py-12 md:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat, i) => (
            <GlassCard key={i} className="p-4 md:p-6 text-center">
              <div className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">
                <AnimatedCounter end={stat.value} suffix={stat.suffix} />
              </div>
              <p className={`text-xs md:text-sm mt-2 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
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
      q: 'Co je Chci AI a jak funguje?',
      a: 'Chci AI je platforma pro vytváření AI zaměstnanců. Clawix, náš AI asistent, může komunikovat s vašimi zákazníky přes chat nebo telefonní hovory v 6 jazycích.'
    },
    {
      q: 'Je služba bezpečná?',
      a: 'Ano, bezpečnost je naše priorita. Dbáme na etiku a soukromí - před každým hovorem posíláme SMS s možností odmítnutí. Vy máte plnou kontrolu.'
    },
    {
      q: 'V jakých jazycích Clawix komunikuje?',
      a: 'Clawix ovládá 6 jazyků: čeština, angličtina, němčina, švédština, vietnamština a ukrajinština. Automaticky rozpozná jazyk zákazníka.'
    },
    {
      q: 'Jak rychle mohu začít?',
      a: 'Nastavení trvá jen pár minut. Stačí vyplnit formulář a Clawix vám zavolá - můžete začít do 30 sekund!'
    },
    {
      q: 'Pro koho je Chci AI vhodný?',
      a: 'Pro podnikatele a firmy, kteří chtějí automatizovat komunikaci, zlepšit zákaznický servis a růst bez najímání dalších lidí.'
    },
  ];

  return (
    <section ref={sectionRef} className="py-16 md:py-24 px-4 sm:px-6" data-testid="faq-section">
      <div className="max-w-3xl mx-auto">
        <RevealSection>
          <h2 className={`text-2xl md:text-4xl font-bold text-center mb-8 md:mb-12 ${
            theme === 'dark' ? 'text-white' : 'text-slate-900'
          }`}>
            Často kladené otázky
          </h2>
        </RevealSection>
        
        <div className="space-y-3 md:space-y-4">
          {faqs.map((faq, i) => (
            <RevealSection key={i} delay={i * 0.1}>
              <GlassCard className="overflow-hidden" hover={false}>
                <button
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className={`w-full p-4 md:p-5 text-left flex items-center justify-between ${
                    theme === 'dark' ? 'text-white' : 'text-slate-900'
                  }`}
                  data-testid={`faq-question-${i}`}
                >
                  <span className="font-semibold pr-4 text-sm md:text-base">{faq.q}</span>
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
                      <p className={`px-4 md:px-5 pb-4 md:pb-5 text-sm md:text-base ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
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
  const [showCallbackModal, setShowCallbackModal] = useState(false);
  const sectionRefs = useRef({});

  const scrollTo = (id) => {
    sectionRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const headlineTexts = [
    'Digitální zaměstnanec s rukama',
    'Váš vlastní AI asistent OpenClaw',
    'Automatizace komunikace 24/7',
    '6 jazyků, neomezené možnosti',
  ];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      theme === 'dark' ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'
    }`} data-testid="landing-page">
      <ScrollProgress />
      <AnimatedBackground theme={theme} />
      <Nav onScrollTo={scrollTo} />
      <ChatbotWidget theme={theme} />

      {/* ===== HERO ===== */}
      <section className="pt-24 pb-12 md:pt-32 md:pb-20 px-4 sm:px-6 relative" data-testid="hero-section">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left side - Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* Headline */}
              <h1 className={`text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight mb-6 ${
                theme === 'dark' ? 'text-white' : 'text-slate-900'
              }`}>
                <span className="bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 bg-clip-text text-transparent">
                  OpenClaw
                </span>
                <br />
                <span className="text-2xl sm:text-3xl md:text-4xl font-semibold">
                  AI asistent s rukama
                </span>
              </h1>

              <h2 className={`text-xl sm:text-2xl md:text-3xl font-semibold mb-6 md:mb-8 leading-snug ${
                theme === 'dark' ? 'text-slate-200' : 'text-slate-800'
              }`}>
                <TypewriterText texts={headlineTexts} className="text-cyan-500" />
              </h2>

              <div className={`space-y-2 text-base md:text-lg mb-8 md:mb-10 ${
                theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
              }`}>
                <p>Vytvořte si vlastního AI zaměstnance.</p>
                <p>Pojmenujte ho. Nastavte. Nechte pracovat.</p>
                <p className={`font-semibold pt-2 ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
                  Clawix vám s tím pomůže.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4" data-testid="hero-ctas">
                <motion.button
                  onClick={() => navigate('/auth')}
                  className="px-8 py-4 rounded-full text-white font-semibold bg-gradient-to-r from-cyan-500 to-blue-500 shadow-lg shadow-cyan-500/25 text-center"
                  whileHover={{ scale: 1.05, boxShadow: '0 25px 50px -12px rgba(6,182,212,0.5)' }}
                  whileTap={{ scale: 0.95 }}
                  data-testid="hero-cta-try"
                >
                  <span className="flex items-center justify-center gap-2">
                    Vytvořit OpenClaw
                    <motion.span animate={{ x: [0, 5, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>→</motion.span>
                  </span>
                </motion.button>
                
                <motion.button
                  onClick={() => setShowCallbackModal(true)}
                  className={`px-8 py-4 rounded-full font-semibold border-2 text-center ${
                    theme === 'dark'
                      ? 'border-slate-600 text-white hover:border-cyan-500'
                      : 'border-slate-300 text-slate-700 hover:border-cyan-500'
                  } transition-colors`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  data-testid="hero-cta-callback"
                >
                  Clawix mi zavolá
                </motion.button>
              </div>
            </motion.div>

            {/* Right side - Callback form */}
            <RevealSection delay={0.3} className="hidden lg:block">
              <ClawixCallbackForm theme={theme} />
            </RevealSection>
          </div>
        </div>
      </section>

      {/* Stats */}
      <StatsSection />

      {/* ===== CO JE OPENCLAW ===== */}
      <section 
        ref={el => sectionRefs.current['what'] = el} 
        className={`py-16 md:py-24 px-4 sm:px-6 ${theme === 'dark' ? 'bg-slate-900/50' : 'bg-white/50'}`}
        data-testid="what-section"
      >
        <div className="max-w-5xl mx-auto">
          <RevealSection>
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6 bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">
              Co je OpenClaw?
            </h2>
            <p className={`text-base md:text-xl mb-8 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
              Váš vlastní AI zaměstnanec s digitálními "rukama". Pojmenujte ho jak chcete.
            </p>
          </RevealSection>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {[
              { icon: '🤖', title: 'Váš AI zaměstnanec', desc: 'Přejmenujte si ho, nastavte osobnost' },
              { icon: '💬', title: 'Chat 24/7', desc: 'Odpovídá zákazníkům okamžitě' },
              { icon: '📞', title: 'Volání klientům', desc: 'Aktivně kontaktuje a komunikuje' },
              { icon: '🌍', title: '6 jazyků', desc: 'CZ, EN, DE, SV, VI, UK' },
              { icon: '🔒', title: 'Etický přístup', desc: 'SMS potvrzení před každým hovorem' },
              { icon: '🎨', title: 'Plná personalizace', desc: 'Tone of voice, role, chování' },
            ].map((item, i) => (
              <RevealSection key={i} delay={i * 0.1}>
                <GlassCard className="p-5 md:p-6 h-full">
                  <span className="text-3xl md:text-4xl mb-3 block">{item.icon}</span>
                  <h3 className={`font-bold text-base md:text-lg mb-2 ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
                    {item.title}
                  </h3>
                  <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                    {item.desc}
                  </p>
                </GlassCard>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* ===== JAK SPOLUPRÁCE PROBÍHÁ - 7 KROKŮ ===== */}
      <section ref={el => sectionRefs.current['how'] = el}>
        <ProcessSteps theme={theme} />
      </section>

      {/* ===== BEZPEČNOST ===== */}
      <SecuritySection theme={theme} />

      {/* FAQ Section */}
      <FAQSection sectionRef={el => sectionRefs.current['faq'] = el} />

      {/* ===== CENÍK ===== */}
      <section 
        ref={el => sectionRefs.current['pricing'] = el} 
        className={`py-16 md:py-24 px-4 sm:px-6 ${theme === 'dark' ? 'bg-slate-900/50' : 'bg-white/50'}`}
        data-testid="pricing-section"
      >
        <div className="max-w-5xl mx-auto">
          <RevealSection>
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-8 md:mb-12 text-center bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">
              Ceník
            </h2>
          </RevealSection>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Základ */}
            <RevealSection>
              <GlassCard className="p-6 md:p-8 h-full" hover={false}>
                <h3 className={`text-xl md:text-2xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
                  Základ
                </h3>
                <p className={`text-sm md:text-base mb-6 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                  Pro začínající firmy
                </p>
                <ul className={`space-y-3 text-sm md:text-base mb-8 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                  {['Chatbot na web', '1 jazyk', '100 konverzací/měsíc', 'Email podpora'].map(f => (
                    <li key={f} className="flex items-center gap-3">
                      <span className="text-cyan-500">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <motion.button
                  onClick={() => navigate('/auth')}
                  className={`w-full py-3 rounded-xl font-medium ${
                    theme === 'dark'
                      ? 'bg-slate-700 text-white hover:bg-slate-600'
                      : 'bg-slate-200 text-slate-800 hover:bg-slate-300'
                  } transition-colors`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Začít zdarma
                </motion.button>
              </GlassCard>
            </RevealSection>

            {/* Růst */}
            <RevealSection delay={0.1}>
              <div className="relative">
                <div className="absolute -top-3 left-6 px-4 py-1 rounded-full text-xs font-semibold text-white bg-gradient-to-r from-emerald-500 to-green-500 z-10">
                  Doporučujeme
                </div>
                <GlassCard className="p-6 md:p-8 h-full border-2 border-cyan-500/50" hover={false}>
                  <h3 className={`text-xl md:text-2xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
                    Růst
                  </h3>
                  <p className={`text-sm md:text-base mb-6 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                    Pro rostoucí firmy
                  </p>
                  <ul className={`space-y-3 text-sm md:text-base mb-8 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                    {['Chatbot + hlasové volání', 'Všech 6 jazyků', 'Neomezené konverzace', 'Prioritní podpora', 'Analytika', 'SMS notifikace'].map(f => (
                      <li key={f} className="flex items-center gap-3">
                        <span className="text-emerald-500">✓</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <motion.button
                    onClick={() => setShowCallbackModal(true)}
                    className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-500 shadow-lg shadow-cyan-500/25"
                    whileHover={{ scale: 1.02, boxShadow: '0 20px 40px -10px rgba(6,182,212,0.4)' }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Nechte si zavolat
                  </motion.button>
                </GlassCard>
              </div>
            </RevealSection>
          </div>
        </div>
      </section>

      {/* ===== ZÁVĚREČNÁ SEKCE ===== */}
      <section className="py-16 md:py-24 px-4 sm:px-6 relative overflow-hidden" data-testid="final-cta-section">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-600 via-blue-600 to-purple-600" />
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <RevealSection>
            <motion.h2 
              className="text-3xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-6"
              animate={{ 
                textShadow: ['0 0 20px rgba(255,255,255,0.3)', '0 0 40px rgba(255,255,255,0.5)', '0 0 20px rgba(255,255,255,0.3)']
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              Chci AI
            </motion.h2>
            <div className="space-y-2 text-base md:text-xl text-white/80 mb-8 md:mb-10">
              <p>Váš AI zaměstnanec čeká.</p>
              <p className="font-semibold text-white">Začněte ještě dnes.</p>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.button
                onClick={() => navigate('/auth')}
                className="w-full sm:w-auto px-8 py-4 rounded-full font-semibold bg-white text-blue-600 shadow-xl"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Vyzkoušet zdarma
              </motion.button>
              <motion.button
                onClick={() => setShowCallbackModal(true)}
                className="w-full sm:w-auto px-8 py-4 rounded-full font-semibold text-white border-2 border-white/40 hover:border-white transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Clawix mi zavolá
              </motion.button>
            </div>
          </RevealSection>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className={`py-8 md:py-12 px-4 sm:px-6 border-t ${
        theme === 'dark' ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200'
      }`} data-testid="footer">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-extrabold bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">
              Chci AI
            </span>
          </div>
          <p className={`text-xs md:text-sm text-center ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
            © {new Date().getFullYear()} Chci AI s.r.o. Všechna práva vyhrazena. GDPR
          </p>
        </div>
      </footer>

      {/* ===== CALLBACK MODAL ===== */}
      <AnimatePresence>
        {showCallbackModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={() => setShowCallbackModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <ClawixCallbackForm 
                theme={theme} 
                onClose={() => setShowCallbackModal(false)} 
                isModal={true}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
