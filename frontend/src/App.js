import { useState, useEffect, useRef } from "react";
import "@/App.css";
import axios from "axios";
import { Send, Phone, Calendar, MessageCircle, X, ChevronDown, Check, Menu, ArrowRight, Mail, Building2, User, Loader2 } from "lucide-react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Generate unique session ID
const generateSessionId = () => {
  return 'session_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
};

// Chat Widget Component
const ChatWidget = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Ahoj! 👋 Jsem OpenClaw, váš AI asistent. Jak vám mohu pomoci?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(generateSessionId);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await axios.post(`${API}/chat`, {
        session_id: sessionId,
        message: userMessage
      });
      setMessages(prev => [...prev, { role: 'assistant', content: response.data.response }]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Omlouvám se, došlo k chybě. Zkuste to prosím znovu.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="chat-widget" data-testid="chat-widget">
      <div className="chat-header">
        <div className="chat-header-info">
          <div className="chat-avatar">🤖</div>
          <div>
            <h3>OpenClaw</h3>
            <span className="chat-status">Online</span>
          </div>
        </div>
        <button onClick={onClose} className="chat-close" data-testid="chat-close-btn">
          <X size={20} />
        </button>
      </div>
      
      <div className="chat-messages" data-testid="chat-messages">
        {messages.map((msg, idx) => (
          <div key={idx} className={`chat-message ${msg.role}`}>
            {msg.content}
          </div>
        ))}
        {isLoading && (
          <div className="chat-message assistant loading">
            <div className="typing-indicator">
              <span></span><span></span><span></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={sendMessage} className="chat-input-form">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Napište zprávu..."
          disabled={isLoading}
          data-testid="chat-input"
        />
        <button type="submit" disabled={isLoading || !input.trim()} data-testid="chat-send-btn">
          <Send size={18} />
        </button>
      </form>
    </div>
  );
};

// Contact Modal Component
const ContactModal = ({ isOpen, onClose, formType, title }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await axios.post(`${API}/contact`, {
        ...formData,
        form_type: formType
      });
      setSubmitStatus({ type: 'success', message: response.data.message });
      setFormData({ name: '', email: '', phone: '', company: '', message: '' });
      setTimeout(() => {
        onClose();
        setSubmitStatus(null);
      }, 3000);
    } catch (error) {
      console.error('Form error:', error);
      setSubmitStatus({ 
        type: 'error', 
        message: 'Nepodařilo se odeslat. Zkuste to prosím znovu.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose} data-testid="contact-modal">
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} data-testid="modal-close-btn">
          <X size={24} />
        </button>
        
        <h2>{title}</h2>
        
        {submitStatus ? (
          <div className={`submit-status ${submitStatus.type}`} data-testid="submit-status">
            {submitStatus.type === 'success' ? <Check size={48} /> : null}
            <p>{submitStatus.message}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="contact-form" data-testid="contact-form">
            <div className="form-group">
              <label><User size={16} /> Jméno *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
                placeholder="Vaše jméno"
                data-testid="form-name-input"
              />
            </div>
            
            <div className="form-group">
              <label><Mail size={16} /> Email *</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
                placeholder="vas@email.cz"
                data-testid="form-email-input"
              />
            </div>
            
            <div className="form-group">
              <label><Phone size={16} /> Telefon</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                placeholder="+420 123 456 789"
                data-testid="form-phone-input"
              />
            </div>
            
            <div className="form-group">
              <label><Building2 size={16} /> Firma</label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) => setFormData({...formData, company: e.target.value})}
                placeholder="Název firmy"
                data-testid="form-company-input"
              />
            </div>
            
            <div className="form-group">
              <label><MessageCircle size={16} /> Zpráva *</label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                required
                placeholder="Popište, s čím vám můžeme pomoci..."
                rows={4}
                data-testid="form-message-input"
              />
            </div>
            
            <button type="submit" className="submit-btn" disabled={isSubmitting} data-testid="form-submit-btn">
              {isSubmitting ? (
                <>
                  <Loader2 size={20} className="spinner" /> Odesílám...
                </>
              ) : (
                <>
                  <Send size={20} /> Odeslat
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

// Callback Modal Component
const CallbackModal = ({ isOpen, onClose }) => {
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await axios.post(`${API}/callback`, { phone, name });
      setSubmitStatus({ type: 'success', message: response.data.message });
      setPhone('');
      setName('');
      setTimeout(() => {
        onClose();
        setSubmitStatus(null);
      }, 3000);
    } catch (error) {
      console.error('Callback error:', error);
      setSubmitStatus({ 
        type: 'error', 
        message: 'Nepodařilo se odeslat. Zkuste to prosím znovu.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose} data-testid="callback-modal">
      <div className="modal-content callback-modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} data-testid="callback-close-btn">
          <X size={24} />
        </button>
        
        <div className="callback-icon">
          <Phone size={48} />
        </div>
        
        <h2>Nechte si zavolat</h2>
        <p className="callback-desc">Vyplňte telefon a budeme vás kontaktovat</p>
        
        {submitStatus ? (
          <div className={`submit-status ${submitStatus.type}`} data-testid="callback-status">
            {submitStatus.type === 'success' ? <Check size={48} /> : null}
            <p>{submitStatus.message}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="callback-form" data-testid="callback-form">
            <div className="form-group">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Vaše jméno (nepovinné)"
                data-testid="callback-name-input"
              />
            </div>
            <div className="form-group">
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                placeholder="+420 123 456 789"
                data-testid="callback-phone-input"
              />
            </div>
            <button type="submit" className="submit-btn" disabled={isSubmitting} data-testid="callback-submit-btn">
              {isSubmitting ? (
                <>
                  <Loader2 size={20} className="spinner" /> Odesílám...
                </>
              ) : (
                <>
                  <Phone size={20} /> Zavolat mi
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

// Main App Component
function App() {
  const [chatOpen, setChatOpen] = useState(false);
  const [contactModal, setContactModal] = useState({ open: false, type: 'contact', title: '' });
  const [callbackOpen, setCallbackOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const openContactModal = (type, title) => {
    setContactModal({ open: true, type, title });
  };

  const features = [
    "otevřít e-mail",
    "odpovědět zákazníkovi", 
    "upravit web",
    "přidat produkt",
    "zkontrolovat objednávky",
    "spustit reklamu",
    "vytvořit marketingový obsah",
    "zavolat klientovi",
    "zapsat data do systému"
  ];

  const integrations = [
    "webové stránky",
    "e-mail",
    "objednávkový systém",
    "CRM",
    "marketingové nástroje",
    "reklama",
    "sociální sítě"
  ];

  const capabilities = [
    "navrhnout úpravy webu",
    "pomoci se SEO",
    "navrhnout marketingovou kampaň",
    "připravit texty na reklamu",
    "vytvořit obsah",
    "připravit video scénář",
    "analyzovat slabá místa podnikání",
    "hledat nové příležitosti"
  ];

  const voiceCapabilities = [
    "volat zákazníkům",
    "potvrzovat objednávky",
    "připomínat schůzky",
    "zjišťovat informace"
  ];

  const webCapabilities = [
    "odpovídat návštěvníkům v chatu",
    "sbírat poptávky",
    "upravovat texty",
    "navrhovat zlepšení obsahu",
    "optimalizovat stránky pro vyhledávače",
    "zvyšovat viditelnost firmy"
  ];

  const targetAudience = [
    "nestíhají odpovídat",
    "ztrácí zákazníky",
    "chtějí víc objednávek",
    "chtějí méně stresu",
    "chtějí růst bez najímání dalších lidí",
    "chtějí moderní řešení, ale jednoduché ovládání"
  ];

  const steps = [
    { num: 1, text: "Poznáme vaše podnikání" },
    { num: 2, text: "Společně nastavíme přístupy" },
    { num: 3, text: "Určíme, kde má OpenClaw pracovat" },
    { num: 4, text: "Spustíme a ladíme" },
    { num: 5, text: "Dlouhodobě rozvíjíme" }
  ];

  return (
    <div className="app" data-testid="app-container">
      {/* Navigation */}
      <nav className="navbar" data-testid="navbar">
        <div className="nav-container">
          <div className="logo" data-testid="logo">OPENCLAW™</div>
          <div className={`nav-links ${mobileMenuOpen ? 'open' : ''}`}>
            <a href="#features">Funkce</a>
            <a href="#how-it-works">Jak to funguje</a>
            <a href="#pricing">Ceník</a>
            <button className="nav-cta" onClick={() => setCallbackOpen(true)} data-testid="nav-callback-btn">
              <Phone size={16} /> Zavolat
            </button>
          </div>
          <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} data-testid="mobile-menu-btn">
            <Menu size={24} />
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero" data-testid="hero-section">
        <div className="hero-content">
          <p className="hero-tagline">Open Cloud AI Assistant with Hands (Tools)</p>
          <h1>Digitální zaměstnanec, který může pracovat ve vašem digitálním světě.</h1>
          
          <div className="hero-points">
            <p>Ne jen odpovídat.</p>
            <p>Ne jen reagovat.</p>
            <p className="highlight">Ale skutečně jednat.</p>
          </div>
          
          <p className="hero-subtitle">
            Vy rozhodujete, kam ho pustíte.<br />
            <strong>On pracuje.</strong>
          </p>
          
          <div className="hero-cta">
            <button className="btn-primary" onClick={() => setChatOpen(true)} data-testid="hero-chat-btn">
              <MessageCircle size={20} /> Vyzkoušet OpenClaw
            </button>
            <button className="btn-secondary" onClick={() => setCallbackOpen(true)} data-testid="hero-callback-btn">
              <Phone size={20} /> Nechat si zavolat
            </button>
            <button className="btn-outline" onClick={() => openContactModal('meeting', 'Domluvit osobní setkání')} data-testid="hero-meeting-btn">
              <Calendar size={20} /> Domluvit setkání
            </button>
          </div>
        </div>
        
        <div className="hero-visual">
          <div className="ai-orb">
            <div className="orb-ring"></div>
            <div className="orb-ring"></div>
            <div className="orb-ring"></div>
            <div className="orb-core">🤖</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section" id="features" data-testid="features-section">
        <div className="section-content">
          <h2>Představte si zaměstnance, který má ruce.</h2>
          <p className="section-subtitle">Ne fyzické. <strong>Digitální.</strong></p>
          
          <p className="section-desc">Ruce, které mohou:</p>
          
          <div className="features-grid">
            {features.map((feature, idx) => (
              <div key={idx} className="feature-item">
                <span className="feature-dash">—</span>
                {feature}
              </div>
            ))}
          </div>
          
          <div className="control-block">
            <p><strong>A vy držíte klíče.</strong></p>
            <p>Vy rozhodujete, kam má přístup.</p>
            <p>Vy ho můžete kdykoli zastavit.</p>
            <p className="highlight">Vy máte kontrolu.</p>
          </div>
        </div>
      </section>

      {/* Integrations Section */}
      <section className="section dark" data-testid="integrations-section">
        <div className="section-content">
          <h2>Digitální svět pod vaší kontrolou</h2>
          <p className="section-subtitle">OpenClaw může pracovat kdekoliv, kam mu otevřete dveře:</p>
          
          <div className="integration-list">
            {integrations.map((item, idx) => (
              <div key={idx} className="integration-item">
                <span className="feature-dash">—</span>
                {item}
              </div>
            ))}
          </div>
          
          <div className="control-note">
            <p>Když mu přístup zavřete, přestane tam pracovat.</p>
            <p><strong>Má ruce.</strong></p>
            <p>Ale vy určujete hranice.</p>
          </div>
        </div>
      </section>

      {/* Thinking Section */}
      <section className="section" data-testid="thinking-section">
        <div className="section-content">
          <h2>Nejen reaguje. Přemýšlí.</h2>
          <p className="section-subtitle">OpenClaw může:</p>
          
          <div className="capabilities-grid">
            {capabilities.map((item, idx) => (
              <div key={idx} className="capability-item">
                <span className="feature-dash">—</span>
                {item}
              </div>
            ))}
          </div>
          
          <p className="section-note">
            Není to jen nástroj.<br />
            <strong>Je to asistent pro růst.</strong>
          </p>
        </div>
      </section>

      {/* Voice Section */}
      <section className="section accent" data-testid="voice-section">
        <div className="section-content">
          <h2>Mluví česky a může volat</h2>
          <p className="section-subtitle">OpenClaw dokáže přirozeně mluvit česky.</p>
          
          <p className="section-desc">Může:</p>
          <div className="voice-list">
            {voiceCapabilities.map((item, idx) => (
              <div key={idx} className="voice-item">
                <span className="feature-dash">—</span>
                {item}
              </div>
            ))}
          </div>
          
          <div className="callback-cta">
            <h3>Vyzkoušejte to. Nechte si zavolat.</h3>
            <p>Vyplňte telefon a budeme vás kontaktovat.</p>
            <button className="btn-primary large" onClick={() => setCallbackOpen(true)} data-testid="voice-callback-btn">
              <Phone size={24} /> Zavolat mi
            </button>
          </div>
        </div>
      </section>

      {/* Web & SEO Section */}
      <section className="section" data-testid="web-section">
        <div className="section-content">
          <h2>Pracuje i s webem a SEO</h2>
          <p className="section-subtitle">OpenClaw může:</p>
          
          <div className="web-capabilities">
            {webCapabilities.map((item, idx) => (
              <div key={idx} className="web-item">
                <span className="feature-dash">—</span>
                {item}
              </div>
            ))}
          </div>
          
          <p className="section-note">
            Pomáhá být vidět.<br />
            <strong>Pomáhá růst.</strong>
          </p>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="section dark" id="how-it-works" data-testid="how-it-works-section">
        <div className="section-content">
          <h2>Jak spolupracujeme</h2>
          
          <div className="steps-container">
            {steps.map((step) => (
              <div key={step.num} className="step-item">
                <div className="step-number">{step.num}</div>
                <p>{step.text}</p>
              </div>
            ))}
          </div>
          
          <div className="collab-note">
            <p>Vy znáte svůj byznys.</p>
            <p>My známe AI.</p>
            <p><strong>Učíme vás, jak asistenta řídit.</strong></p>
            <p>Nezůstáváte na to sami.</p>
          </div>
        </div>
      </section>

      {/* Target Audience Section */}
      <section className="section" data-testid="audience-section">
        <div className="section-content">
          <h2>Pro koho je OpenClaw</h2>
          <p className="section-subtitle">Pro podnikatele, kteří:</p>
          
          <div className="audience-list">
            {targetAudience.map((item, idx) => (
              <div key={idx} className="audience-item">
                <span className="feature-dash">—</span>
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="section pricing" id="pricing" data-testid="pricing-section">
        <div className="section-content">
          <h2>Ceník</h2>
          
          <div className="pricing-cards">
            {/* Basic Plan */}
            <div className="pricing-card">
              <h3>Základ</h3>
              <p className="pricing-desc">Digitální asistent pro každodenní práci.</p>
              
              <p className="pricing-includes">Obsahuje:</p>
              <ul>
                <li>— osobní nastavení</li>
                <li>— chatbot na web</li>
                <li>— český hlasový modul</li>
                <li>— práce s e-mailem</li>
                <li>— sběr poptávek</li>
                <li>— základní automatizace</li>
                <li>— měsíční podpora</li>
              </ul>
              
              <button 
                className="pricing-btn" 
                onClick={() => openContactModal('pricing_zaklad', 'Zájem o tarif Základ')}
                data-testid="pricing-basic-btn"
              >
                Začít se Základem <ArrowRight size={18} />
              </button>
            </div>
            
            {/* Growth Plan */}
            <div className="pricing-card featured">
              <div className="featured-badge">Doporučujeme</div>
              <h3>Růst</h3>
              <p className="pricing-desc">Digitální zaměstnanec s plnými nástroji.</p>
              
              <p className="pricing-includes">Obsahuje vše ze Základu +</p>
              <ul>
                <li>— více přístupů (web, marketing, prodej)</li>
                <li>— práce s reklamou</li>
                <li>— SEO optimalizace</li>
                <li>— tvorba obsahu</li>
                <li>— pokročilé automatizace</li>
                <li>— pravidelné strategické konzultace</li>
                <li>— rozšiřování funkcí</li>
              </ul>
              
              <button 
                className="pricing-btn primary" 
                onClick={() => openContactModal('pricing_rust', 'Zájem o tarif Růst')}
                data-testid="pricing-growth-btn"
              >
                Začít s Růstem <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="footer-cta" data-testid="footer-cta">
        <div className="section-content">
          <h2>OpenClaw™</h2>
          <p className="footer-tagline">Digitální asistent s rukama.</p>
          <p>Vy rozhodujete, kam ho pustíte.<br /><strong>On pracuje.</strong></p>
          
          <div className="footer-buttons">
            <button className="btn-primary" onClick={() => setChatOpen(true)} data-testid="footer-chat-btn">
              <MessageCircle size={20} /> Vyzkoušejte ho
            </button>
            <button className="btn-secondary" onClick={() => setCallbackOpen(true)} data-testid="footer-callback-btn">
              <Phone size={20} /> Nechte si zavolat
            </button>
            <button className="btn-outline" onClick={() => openContactModal('meeting', 'Poznejte budoucnost podnikání')} data-testid="footer-meeting-btn">
              <Calendar size={20} /> Poznejte budoucnost
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer" data-testid="footer">
        <p>© 2024 OpenClaw™ | Digitální asistent s rukama</p>
        <a href="https://app.emergent.sh/?utm_source=emergent-badge" target="_blank" rel="noopener noreferrer">
          Made with Emergent
        </a>
      </footer>

      {/* Chat Toggle Button */}
      {!chatOpen && (
        <button className="chat-toggle" onClick={() => setChatOpen(true)} data-testid="chat-toggle-btn">
          <MessageCircle size={28} />
        </button>
      )}

      {/* Modals & Widgets */}
      <ChatWidget isOpen={chatOpen} onClose={() => setChatOpen(false)} />
      <ContactModal 
        isOpen={contactModal.open} 
        onClose={() => setContactModal({ ...contactModal, open: false })}
        formType={contactModal.type}
        title={contactModal.title}
      />
      <CallbackModal isOpen={callbackOpen} onClose={() => setCallbackOpen(false)} />
    </div>
  );
}

export default App;
