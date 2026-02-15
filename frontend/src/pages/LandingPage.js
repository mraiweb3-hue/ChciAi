import { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '@/lib/api';
import { toast } from 'sonner';

const VARIANTS = [
  { name: 'Modrá + Zelená', primary: '#2563EB', accent: '#16A34A', primaryBg: '#EFF6FF', accentBg: '#F0FDF4' },
  { name: 'Fialová + Tyrkysová', primary: '#7C3AED', accent: '#0891B2', primaryBg: '#F5F3FF', accentBg: '#ECFEFF' },
  { name: 'Černá + Oranžová', primary: '#0F172A', accent: '#EA580C', primaryBg: '#F1F5F9', accentBg: '#FFF7ED' },
];

function Nav({ v, onScrollTo }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const links = [
    { label: 'Co je OpenClaw', id: 'what' },
    { label: 'Možnosti', id: 'capabilities' },
    { label: 'Spolupráce', id: 'process' },
    { label: 'Ceník', id: 'pricing' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b border-slate-100" data-testid="main-navbar">
      <div className="max-w-6xl mx-auto px-6 md:px-10">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-baseline gap-1" data-testid="nav-logo">
            <span className="text-xl font-extrabold tracking-tight" style={{ fontFamily: 'Plus Jakarta Sans', color: v.primary }}>
              OPENCLAW
            </span>
            <span className="text-[10px] text-slate-400 font-medium">™</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {links.map(l => (
              <button key={l.id} onClick={() => onScrollTo(l.id)} className="text-sm text-slate-500 hover:text-slate-900 transition-colors font-medium" data-testid={`nav-${l.id}`}>
                {l.label}
              </button>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <button onClick={() => navigate('/auth')} className="text-sm font-medium text-slate-600 hover:text-slate-900 px-4 py-2 transition-colors" data-testid="nav-login-btn">
              Přihlásit se
            </button>
            <button onClick={() => navigate('/auth')} className="text-sm font-medium text-white px-5 py-2.5 rounded-full transition-all hover:opacity-90 shadow-sm" style={{ backgroundColor: v.primary }} data-testid="nav-get-started-btn">
              Vyzkoušet
            </button>
          </div>

          <button className="md:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)} data-testid="mobile-menu-toggle">
            {mobileOpen ? (
              <span className="text-xl text-slate-700 font-light">&#10005;</span>
            ) : (
              <div className="w-5 space-y-1.5">
                <div className="h-[2px] bg-slate-700 rounded" />
                <div className="h-[2px] bg-slate-700 rounded" />
                <div className="h-[2px] bg-slate-700 rounded" />
              </div>
            )}
          </button>
        </div>
      </div>
      {mobileOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-6 py-4 space-y-3">
          {links.map(l => (
            <button key={l.id} onClick={() => { onScrollTo(l.id); setMobileOpen(false); }} className="block text-sm text-slate-600 py-2 w-full text-left">
              {l.label}
            </button>
          ))}
          <button onClick={() => navigate('/auth')} className="w-full text-sm font-medium text-white px-5 py-2.5 rounded-full mt-2" style={{ backgroundColor: v.primary }} data-testid="mobile-get-started-btn">
            Vyzkoušet OpenClaw
          </button>
        </div>
      )}
    </nav>
  );
}

export default function LandingPage() {
  const [vi, setVi] = useState(0);
  const [phone, setPhone] = useState('');
  const [phoneSending, setPhoneSending] = useState(false);
  const [meetingForm, setMeetingForm] = useState({ name: '', email: '', phone: '' });
  const [meetingOpen, setMeetingOpen] = useState(false);
  const navigate = useNavigate();
  const v = VARIANTS[vi];
  const sectionRefs = useRef({});

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

  const Btn = ({ children, color, outline, onClick, className = '', ...props }) => (
    <button
      onClick={onClick}
      className={`px-7 py-3.5 rounded-full text-base font-medium transition-all duration-200 ${outline ? 'bg-transparent border-2' : 'text-white shadow-sm hover:shadow-md'} ${className}`}
      style={outline ? { borderColor: color, color } : { backgroundColor: color }}
      {...props}
    >
      {children}
    </button>
  );

  const SectionTitle = ({ children }) => (
    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-6" style={{ fontFamily: 'Plus Jakarta Sans', color: v.primary }}>
      {children}
    </h2>
  );

  const List = ({ items }) => (
    <ul className="space-y-2.5">
      {items.map((item, i) => (
        <li key={i} className="text-base md:text-lg text-slate-600 leading-relaxed pl-6 relative">
          <span className="absolute left-0 top-0" style={{ color: v.accent }}>—</span>
          {item}
        </li>
      ))}
    </ul>
  );

  return (
    <div className="bg-white min-h-screen selection:bg-indigo-100" data-testid="landing-page" style={{ fontFamily: 'Outfit, sans-serif' }}>
      <Nav v={v} onScrollTo={scrollTo} />

      {/* ===== HERO ===== */}
      <section className="pt-28 pb-16 md:pt-40 md:pb-24 px-6 md:px-10" data-testid="hero-section">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-5xl sm:text-6xl lg:text-8xl font-extrabold tracking-tight leading-[1.05]" style={{ fontFamily: 'Plus Jakarta Sans' }}>
              <span style={{ color: v.primary }}>OPENCLAW</span>
              <span className="text-slate-300 text-2xl md:text-3xl align-top ml-1">™</span>
            </h1>
            <p className="text-base md:text-lg text-slate-400 mt-3 tracking-wide">
              Open Cloud AI Assistant with Hands (Tools)
            </p>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-slate-800 mb-8 leading-snug max-w-2xl" style={{ fontFamily: 'Plus Jakarta Sans' }}>
            Digitální zaměstnanec, který může pracovat ve vašem digitálním světě.
          </h2>

          <div className="space-y-1 text-lg md:text-xl text-slate-500 mb-10 leading-relaxed">
            <p>Ne jen odpovídat.</p>
            <p>Ne jen reagovat.</p>
            <p className="font-semibold text-slate-800 pt-3 text-xl md:text-2xl">Ale skutečně jednat.</p>
            <p className="pt-4">Vy rozhodujete, kam ho pustíte.</p>
            <p className="font-medium text-slate-700">On pracuje.</p>
          </div>

          <div className="flex flex-wrap gap-4" data-testid="hero-ctas">
            <Btn color={v.primary} onClick={() => navigate('/auth')} data-testid="hero-cta-try">
              Vyzkoušet OpenClaw
            </Btn>
            <Btn color={v.accent} onClick={() => scrollTo('voice')} data-testid="hero-cta-call">
              Nechat si zavolat
            </Btn>
            <Btn color={v.primary} outline onClick={() => setMeetingOpen(true)} data-testid="hero-cta-meeting">
              Domluvit osobní setkání
            </Btn>
          </div>
        </div>
      </section>

      {/* ===== CO JE OPENCLAW ===== */}
      <section ref={el => sectionRefs.current['what'] = el} className="py-20 md:py-28 px-6 md:px-10" style={{ backgroundColor: '#F8FAFC' }} data-testid="what-section">
        <div className="max-w-4xl mx-auto">
          <SectionTitle>Představte si zaměstnance, který má ruce.</SectionTitle>
          <div className="space-y-1 text-lg md:text-xl text-slate-500 mb-8">
            <p>Ne fyzické.</p>
            <p className="font-medium text-slate-700">Digitální.</p>
          </div>
          <p className="text-lg text-slate-600 mb-6">Ruce, které mohou:</p>
          <List items={[
            'otevřít e-mail',
            'odpovědět zákazníkovi',
            'upravit web',
            'přidat produkt',
            'zkontrolovat objednávky',
            'spustit reklamu',
            'vytvořit marketingový obsah',
            'zavolat klientovi',
            'zapsat data do systému',
          ]} />
          <div className="mt-10 pt-8 border-t border-slate-200">
            <p className="text-xl md:text-2xl font-semibold text-slate-800 mb-3" style={{ fontFamily: 'Plus Jakarta Sans' }}>
              A vy držíte klíče.
            </p>
            <div className="space-y-1 text-lg text-slate-600">
              <p>Vy rozhodujete, kam má přístup.</p>
              <p>Vy ho můžete kdykoli zastavit.</p>
              <p className="font-semibold text-slate-800">Vy máte kontrolu.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== DIGITÁLNÍ SVĚT ===== */}
      <section className="py-20 md:py-28 px-6 md:px-10" data-testid="tools-section">
        <div className="max-w-4xl mx-auto">
          <SectionTitle>Digitální svět pod vaší kontrolou</SectionTitle>
          <p className="text-lg text-slate-600 mb-6">OpenClaw může pracovat kdekoliv, kam mu otevřete dveře:</p>
          <List items={[
            'webové stránky',
            'e-mail',
            'objednávkový systém',
            'CRM',
            'marketingové nástroje',
            'reklama',
            'sociální sítě',
          ]} />
          <div className="mt-10 space-y-1 text-lg text-slate-600">
            <p>Když mu přístup zavřete, přestane tam pracovat.</p>
            <p className="pt-3 font-medium text-slate-700">Má ruce.</p>
            <p className="font-semibold text-slate-800">Ale vy určujete hranice.</p>
          </div>
        </div>
      </section>

      {/* ===== NEJEN REAGUJE ===== */}
      <section ref={el => sectionRefs.current['capabilities'] = el} className="py-20 md:py-28 px-6 md:px-10" style={{ backgroundColor: '#F8FAFC' }} data-testid="thinking-section">
        <div className="max-w-4xl mx-auto">
          <SectionTitle>Nejen reaguje. Přemýšlí.</SectionTitle>
          <p className="text-lg text-slate-600 mb-6">OpenClaw může:</p>
          <List items={[
            'navrhnout úpravy webu',
            'pomoci se SEO',
            'navrhnout marketingovou kampaň',
            'připravit texty na reklamu',
            'vytvořit obsah',
            'připravit video scénář',
            'analyzovat slabá místa podnikání',
            'hledat nové příležitosti',
          ]} />
          <div className="mt-10 space-y-1 text-lg text-slate-600">
            <p>Není to jen nástroj.</p>
            <p className="font-semibold text-slate-800 text-xl">Je to asistent pro růst.</p>
          </div>
        </div>
      </section>

      {/* ===== HLASOVÉ VOLÁNÍ ===== */}
      <section ref={el => sectionRefs.current['voice'] = el} className="py-20 md:py-28 px-6 md:px-10" data-testid="voice-section">
        <div className="max-w-4xl mx-auto">
          <SectionTitle>Mluví česky a může volat</SectionTitle>
          <p className="text-lg text-slate-600 mb-6">OpenClaw dokáže přirozeně mluvit česky.</p>
          <p className="text-lg text-slate-600 mb-6">Může:</p>
          <List items={[
            'volat zákazníkům',
            'potvrzovat objednávky',
            'připomínat schůzky',
            'zjišťovat informace',
          ]} />

          <div className="mt-12 p-8 md:p-10 rounded-2xl border border-slate-200" style={{ backgroundColor: v.accentBg }} data-testid="callback-form-section">
            <h3 className="text-xl md:text-2xl font-semibold mb-2" style={{ fontFamily: 'Plus Jakarta Sans', color: v.primary }}>
              Vyzkoušejte to. Nechte si zavolat.
            </h3>
            <p className="text-base text-slate-500 mb-6">Vyplňte telefon a OpenClaw vám zavolá zpět.</p>
            <form onSubmit={handleCallback} className="flex flex-col sm:flex-row gap-3 max-w-lg">
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+420 xxx xxx xxx"
                className="flex-1 px-5 py-3.5 rounded-full border border-slate-300 text-base text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2"
                style={{ focusRingColor: v.primary }}
                required
                data-testid="callback-phone-input"
              />
              <button
                type="submit"
                disabled={phoneSending}
                className="px-8 py-3.5 rounded-full text-white text-base font-medium transition-all hover:opacity-90 disabled:opacity-50"
                style={{ backgroundColor: v.accent }}
                data-testid="callback-submit-btn"
              >
                {phoneSending ? 'Odesílám...' : 'Zavolat mi'}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* ===== WEB A SEO ===== */}
      <section className="py-20 md:py-28 px-6 md:px-10" style={{ backgroundColor: '#F8FAFC' }} data-testid="seo-section">
        <div className="max-w-4xl mx-auto">
          <SectionTitle>Pracuje i s webem a SEO</SectionTitle>
          <p className="text-lg text-slate-600 mb-6">OpenClaw může:</p>
          <List items={[
            'odpovídat návštěvníkům v chatu',
            'sbírat poptávky',
            'upravovat texty',
            'navrhovat zlepšení obsahu',
            'optimalizovat stránky pro vyhledávače',
            'zvyšovat viditelnost firmy',
          ]} />
          <div className="mt-10 space-y-1 text-lg text-slate-600">
            <p>Pomáhá být vidět.</p>
            <p className="font-semibold text-slate-800">Pomáhá růst.</p>
          </div>
        </div>
      </section>

      {/* ===== JAK SPOLUPRACUJEME ===== */}
      <section ref={el => sectionRefs.current['process'] = el} className="py-20 md:py-28 px-6 md:px-10" data-testid="process-section">
        <div className="max-w-4xl mx-auto">
          <SectionTitle>Jak spolupracujeme</SectionTitle>
          <div className="space-y-8 mt-10">
            {[
              { num: '1', title: 'Poznáme vaše podnikání' },
              { num: '2', title: 'Společně nastavíme přístupy' },
              { num: '3', title: 'Určíme, kde má OpenClaw pracovat' },
              { num: '4', title: 'Spustíme a ladíme' },
              { num: '5', title: 'Dlouhodobě rozvíjíme' },
            ].map(step => (
              <div key={step.num} className="flex items-start gap-5" data-testid={`process-step-${step.num}`}>
                <div className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold text-white shrink-0" style={{ backgroundColor: v.primary }}>
                  {step.num}
                </div>
                <p className="text-lg md:text-xl text-slate-700 font-medium pt-2.5">{step.title}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 pt-8 border-t border-slate-200 space-y-1 text-lg text-slate-600">
            <p>Vy znáte svůj byznys.</p>
            <p>My známe AI.</p>
            <p className="pt-3">Učíme vás, jak asistenta řídit.</p>
            <p className="font-semibold text-slate-800">Nezůstáváte na to sami.</p>
          </div>
        </div>
      </section>

      {/* ===== PRO KOHO ===== */}
      <section className="py-20 md:py-28 px-6 md:px-10" style={{ backgroundColor: '#F8FAFC' }} data-testid="for-who-section">
        <div className="max-w-4xl mx-auto">
          <SectionTitle>Pro koho je OpenClaw</SectionTitle>
          <p className="text-lg text-slate-600 mb-6">Pro podnikatele, kteří:</p>
          <List items={[
            'nestíhají odpovídat',
            'ztrácí zákazníky',
            'chtějí víc objednávek',
            'chtějí méně stresu',
            'chtějí růst bez najímání dalších lidí',
            'chtějí moderní řešení, ale jednoduché ovládání',
          ]} />
        </div>
      </section>

      {/* ===== CENÍK ===== */}
      <section ref={el => sectionRefs.current['pricing'] = el} className="py-20 md:py-28 px-6 md:px-10" data-testid="pricing-section">
        <div className="max-w-5xl mx-auto">
          <SectionTitle>Ceník</SectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
            {/* Základ */}
            <div className="p-8 md:p-10 rounded-2xl border border-slate-200 hover:border-slate-300 transition-colors" data-testid="pricing-card-zaklad">
              <h3 className="text-2xl font-bold mb-2" style={{ fontFamily: 'Plus Jakarta Sans', color: v.primary }}>Základ</h3>
              <p className="text-base text-slate-500 mb-8">Digitální asistent pro každodenní práci.</p>
              <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Obsahuje:</p>
              <ul className="space-y-3 text-base text-slate-600 mb-10">
                {['osobní nastavení', 'chatbot na web', 'český hlasový modul', 'práce s e-mailem', 'sběr poptávek', 'základní automatizace', 'měsíční podpora'].map(f => (
                  <li key={f} className="pl-5 relative">
                    <span className="absolute left-0" style={{ color: v.accent }}>—</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Btn color={v.primary} onClick={() => navigate('/auth')} className="w-full text-center" data-testid="pricing-cta-zaklad">
                Začít se Základem
              </Btn>
            </div>

            {/* Růst */}
            <div className="p-8 md:p-10 rounded-2xl border-2 relative" style={{ borderColor: v.accent }} data-testid="pricing-card-rust">
              <div className="absolute -top-3 left-8 px-4 py-1 rounded-full text-xs font-semibold text-white" style={{ backgroundColor: v.accent }}>
                Doporučujeme
              </div>
              <h3 className="text-2xl font-bold mb-2" style={{ fontFamily: 'Plus Jakarta Sans', color: v.primary }}>Růst</h3>
              <p className="text-base text-slate-500 mb-8">Digitální zaměstnanec s plnými nástroji.</p>
              <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Obsahuje vše ze Základu +</p>
              <ul className="space-y-3 text-base text-slate-600 mb-10">
                {['více přístupů (web, marketing, prodej)', 'práce s reklamou', 'SEO optimalizace', 'tvorba obsahu', 'pokročilé automatizace', 'pravidelné strategické konzultace', 'rozšiřování funkcí'].map(f => (
                  <li key={f} className="pl-5 relative">
                    <span className="absolute left-0" style={{ color: v.accent }}>—</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Btn color={v.accent} onClick={() => navigate('/auth')} className="w-full text-center" data-testid="pricing-cta-rust">
                Začít s Růstem
              </Btn>
            </div>
          </div>
        </div>
      </section>

      {/* ===== ZÁVĚREČNÁ SEKCE ===== */}
      <section className="py-20 md:py-28 px-6 md:px-10" style={{ backgroundColor: v.primary }} data-testid="final-cta-section">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-6" style={{ fontFamily: 'Plus Jakarta Sans' }}>
            OpenClaw™
          </h2>
          <div className="space-y-2 text-lg md:text-xl text-white/80 mb-10">
            <p>Digitální asistent s rukama.</p>
            <p>Vy rozhodujete, kam ho pustíte.</p>
            <p className="font-semibold text-white">On pracuje.</p>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button onClick={() => navigate('/auth')} className="px-8 py-4 rounded-full text-base font-semibold transition-all hover:opacity-90 shadow-lg" style={{ backgroundColor: 'white', color: v.primary }} data-testid="final-cta-try">
              Vyzkoušejte ho
            </button>
            <button onClick={() => scrollTo('voice')} className="px-8 py-4 rounded-full text-base font-semibold text-white border-2 border-white/40 hover:border-white transition-all" data-testid="final-cta-call">
              Nechte si zavolat
            </button>
            <button onClick={() => setMeetingOpen(true)} className="px-8 py-4 rounded-full text-base font-semibold transition-all hover:opacity-90" style={{ backgroundColor: v.accent, color: 'white' }} data-testid="final-cta-meeting">
              Poznejte budoucnost podnikání
            </button>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="py-12 px-6 md:px-10 border-t border-slate-100" data-testid="footer">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-extrabold" style={{ fontFamily: 'Plus Jakarta Sans', color: v.primary }}>OPENCLAW</span>
            <span className="text-[9px] text-slate-400">™</span>
          </div>
          <p className="text-sm text-slate-400">&copy; {new Date().getFullYear()} OpenClaw s.r.o. Všechna práva vyhrazena. GDPR</p>
        </div>
      </footer>

      {/* ===== MEETING MODAL ===== */}
      {meetingOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/30 backdrop-blur-sm px-6" data-testid="meeting-modal">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl relative">
            <button onClick={() => setMeetingOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 text-xl" data-testid="meeting-close-btn">
              &#10005;
            </button>
            <h3 className="text-xl font-bold mb-1" style={{ fontFamily: 'Plus Jakarta Sans', color: v.primary }}>
              Domluvit osobní setkání
            </h3>
            <p className="text-sm text-slate-500 mb-6">Vyplňte údaje a ozveme se vám.</p>
            <form onSubmit={handleMeeting} className="space-y-4">
              <input
                type="text"
                value={meetingForm.name}
                onChange={e => setMeetingForm(p => ({ ...p, name: e.target.value }))}
                placeholder="Jméno"
                className="w-full px-4 py-3 rounded-lg border border-slate-300 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2"
                required
                data-testid="meeting-name-input"
              />
              <input
                type="email"
                value={meetingForm.email}
                onChange={e => setMeetingForm(p => ({ ...p, email: e.target.value }))}
                placeholder="E-mail"
                className="w-full px-4 py-3 rounded-lg border border-slate-300 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2"
                required
                data-testid="meeting-email-input"
              />
              <input
                type="tel"
                value={meetingForm.phone}
                onChange={e => setMeetingForm(p => ({ ...p, phone: e.target.value }))}
                placeholder="Telefon"
                className="w-full px-4 py-3 rounded-lg border border-slate-300 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2"
                required
                data-testid="meeting-phone-input"
              />
              <button type="submit" className="w-full py-3.5 rounded-full text-white text-base font-medium transition-all hover:opacity-90" style={{ backgroundColor: v.primary }} data-testid="meeting-submit-btn">
                Odeslat
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ===== VARIANT SELECTOR ===== */}
      <div className="fixed bottom-6 left-6 z-50 flex items-center gap-2.5 bg-white shadow-xl rounded-full px-4 py-2.5 border border-slate-200" data-testid="variant-selector">
        <span className="text-xs text-slate-400 font-medium">Design</span>
        {VARIANTS.map((variant, i) => (
          <button
            key={i}
            onClick={() => setVi(i)}
            className={`w-7 h-7 rounded-full transition-all duration-200 ${i === vi ? 'ring-2 ring-offset-2 ring-slate-400 scale-110' : 'opacity-50 hover:opacity-80'}`}
            style={{ background: `linear-gradient(135deg, ${variant.primary} 50%, ${variant.accent} 50%)` }}
            title={variant.name}
            data-testid={`variant-btn-${i}`}
          />
        ))}
      </div>
    </div>
  );
}
