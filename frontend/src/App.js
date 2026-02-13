import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Menu, X, Mail, Phone, MessageSquare, Zap, Bot, Rocket } from "lucide-react";
import "./App.css";
import LeadForm from "./components/LeadForm";
import CallbackForm from "./components/CallbackForm";

// Navbar Component
const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      background: 'rgba(3, 3, 3, 0.95)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid rgba(0, 217, 255, 0.2)',
      padding: '20px 40px'
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Bot size={32} color="#00D9FF" />
          <h1 style={{
            color: '#00D9FF',
            margin: 0,
            fontSize: '1.8rem',
            fontWeight: 'bold'
          }}>
            ChciAI.cz
          </h1>
        </div>

        {/* Desktop Menu */}
        <div style={{
          display: 'flex',
          gap: '30px',
          alignItems: 'center'
        }} className="desktop-menu">
          <a href="#vibe-coding" style={{color: 'white', textDecoration: 'none', transition: 'color 0.3s'}}>
            Vibe Coding
          </a>
          <a href="#openclaw" style={{color: 'white', textDecoration: 'none', transition: 'color 0.3s'}}>
            OpenClaw
          </a>
          <a href="#sluzby" style={{color: 'white', textDecoration: 'none', transition: 'color 0.3s'}}>
            Služby
          </a>
          <a href="#pricing" style={{color: 'white', textDecoration: 'none', transition: 'color 0.3s'}}>
            Ceník
          </a>
          <a href="#kontakt" style={{color: 'white', textDecoration: 'none', transition: 'color 0.3s'}}>
            Kontakt
          </a>
          <button style={{
            background: '#00D9FF',
            color: '#030303',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}>
            Vyzkoušet zdarma
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button 
          onClick={() => setMobileOpen(!mobileOpen)}
          style={{
            display: 'none',
            background: 'transparent',
            border: 'none',
            color: 'white',
            cursor: 'pointer'
          }}
          className="mobile-menu-btn"
        >
          {mobileOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          marginTop: '20px',
          padding: '20px',
          background: '#0a0a0a',
          borderRadius: '10px'
        }} className="mobile-menu">
          <a href="#vibe-coding" style={{color: 'white', textDecoration: 'none'}}>Vibe Coding</a>
          <a href="#openclaw" style={{color: 'white', textDecoration: 'none'}}>OpenClaw</a>
          <a href="#sluzby" style={{color: 'white', textDecoration: 'none'}}>Služby</a>
          <a href="#pricing" style={{color: 'white', textDecoration: 'none'}}>Ceník</a>
          <a href="#kontakt" style={{color: 'white', textDecoration: 'none'}}>Kontakt</a>
        </div>
      )}
    </nav>
  );
};

// Hero Section
const HeroSection = ({ onOpenLeadForm, onOpenCallbackForm }) => {
  return (
    <section style={{
      padding: '120px 40px',
      textAlign: 'center',
      background: 'linear-gradient(180deg, #030303 0%, #0a0a0a 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated background effect */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '800px',
        height: '800px',
        background: 'radial-gradient(circle, rgba(0, 217, 255, 0.1) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '1000px', margin: '0 auto' }}>
        <h1 style={{
          fontSize: 'clamp(2.5rem, 6vw, 5rem)',
          marginBottom: '30px',
          background: 'linear-gradient(135deg, #00D9FF 0%, #0080FF 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontWeight: 'bold',
          lineHeight: '1.2'
        }}>
          AI Asistent pro Váš Byznys
        </h1>
        
        <p style={{
          fontSize: 'clamp(1.2rem, 3vw, 1.8rem)',
          color: '#aaa',
          marginBottom: '50px',
          lineHeight: '1.6'
        }}>
          Automatizace zákaznické podpory 24/7<br />
          WhatsApp • Telefon • Email • Chat
        </p>

        <div style={{
          display: 'flex',
          gap: '20px',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <button 
            onClick={onOpenLeadForm}
            style={{
            background: '#00D9FF',
            color: '#030303',
            border: 'none',
            padding: '20px 40px',
            fontSize: '1.2rem',
            borderRadius: '12px',
            cursor: 'pointer',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            boxShadow: '0 10px 30px rgba(0, 217, 255, 0.3)',
            transition: 'transform 0.2s'
          }}>
            <Rocket size={24} />
            Začít zdarma
          </button>

          <button 
            onClick={onOpenCallbackForm}
            style={{
            background: 'transparent',
            color: 'white',
            border: '2px solid #00D9FF',
            padding: '20px 40px',
            fontSize: '1.2rem',
            borderRadius: '12px',
            cursor: 'pointer',
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            transition: 'transform 0.2s'
          }}>
            <Phone size={24} />
            Demo hovor
          </button>
        </div>

        {/* Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '30px',
          marginTop: '80px',
          maxWidth: '800px',
          margin: '80px auto 0'
        }}>
          {[
            { number: '24/7', label: 'Dostupnost' },
            { number: '< 2s', label: 'Odezva' },
            { number: '95%', label: 'Úspěšnost' }
          ].map((stat, i) => (
            <div key={i}>
              <div style={{ fontSize: '3rem', color: '#00D9FF', fontWeight: 'bold' }}>
                {stat.number}
              </div>
              <div style={{ fontSize: '1.1rem', color: '#888' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Services Section
const ServicesSection = () => {
  const services = [
    {
      icon: <MessageSquare size={48} />,
      title: 'WhatsApp Bot',
      description: 'Automatické odpovědi na WhatsApp 24/7. Rezervace, objednávky, FAQ.',
      features: ['Multi-jazyk', 'Rychlé šablony', 'CRM integrace']
    },
    {
      icon: <Phone size={48} />,
      title: 'AI Voice Call',
      description: 'Hlasové hovory s klienty. Přirozená konverzace pomocí ElevenLabs AI.',
      features: ['Český hlas', 'Konverzace', 'Call tracking']
    },
    {
      icon: <Mail size={48} />,
      title: 'Email Automatizace',
      description: 'Inteligentní odpovědi na emaily. Kategorizace, prioritizace, auto-reply.',
      features: ['Gmail/Outlook', 'Smart routing', 'Templates']
    }
  ];

  return (
    <section id="sluzby" style={{
      padding: '100px 40px',
      background: '#0a0a0a'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h2 style={{
          textAlign: 'center',
          fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
          marginBottom: '20px',
          color: '#00D9FF'
        }}>
          Naše Služby
        </h2>
        <p style={{
          textAlign: 'center',
          fontSize: '1.3rem',
          color: '#888',
          marginBottom: '60px'
        }}>
          Kompletní AI automatizace pro váš byznys
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '40px'
        }}>
          {services.map((service, i) => (
            <div key={i} style={{
              background: 'linear-gradient(145deg, #0f0f0f, #0a0a0a)',
              padding: '40px',
              borderRadius: '20px',
              border: '2px solid rgba(0, 217, 255, 0.2)',
              transition: 'all 0.3s',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-10px)';
              e.currentTarget.style.borderColor = '#00D9FF';
              e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 217, 255, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.borderColor = 'rgba(0, 217, 255, 0.2)';
              e.currentTarget.style.boxShadow = 'none';
            }}>
              <div style={{ color: '#00D9FF', marginBottom: '20px' }}>
                {service.icon}
              </div>
              <h3 style={{
                color: '#00D9FF',
                fontSize: '1.8rem',
                marginBottom: '15px'
              }}>
                {service.title}
              </h3>
              <p style={{
                color: '#aaa',
                fontSize: '1.1rem',
                lineHeight: '1.6',
                marginBottom: '20px'
              }}>
                {service.description}
              </p>
              <ul style={{
                listStyle: 'none',
                padding: 0,
                margin: 0
              }}>
                {service.features.map((feature, j) => (
                  <li key={j} style={{
                    color: '#888',
                    marginBottom: '8px',
                    paddingLeft: '20px',
                    position: 'relative'
                  }}>
                    <span style={{
                      position: 'absolute',
                      left: 0,
                      color: '#00D9FF'
                    }}>
                      <Zap size={16} />
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Contact Section
const ContactSection = () => {
  return (
    <section id="kontakt" style={{
      padding: '100px 40px',
      background: 'linear-gradient(180deg, #0a0a0a 0%, #030303 100%)'
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{
          fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
          marginBottom: '40px',
          color: '#00D9FF'
        }}>
          Kontaktujte nás
        </h2>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '30px',
          marginBottom: '60px'
        }}>
          <div style={{
            padding: '30px',
            background: '#0f0f0f',
            borderRadius: '15px',
            border: '2px solid rgba(0, 217, 255, 0.2)'
          }}>
            <Mail size={40} color="#00D9FF" style={{ marginBottom: '15px' }} />
            <h3 style={{ color: 'white', fontSize: '1.3rem', marginBottom: '10px' }}>Email</h3>
            <a href="mailto:info@chciai.cz" style={{
              color: '#00D9FF',
              textDecoration: 'none',
              fontSize: '1.1rem'
            }}>
              info@chciai.cz
            </a>
          </div>

          <div style={{
            padding: '30px',
            background: '#0f0f0f',
            borderRadius: '15px',
            border: '2px solid rgba(0, 217, 255, 0.2)'
          }}>
            <MessageSquare size={40} color="#00D9FF" style={{ marginBottom: '15px' }} />
            <h3 style={{ color: 'white', fontSize: '1.3rem', marginBottom: '10px' }}>WhatsApp</h3>
            <p style={{ color: '#aaa', fontSize: '1.1rem' }}>
              Připravujeme
            </p>
          </div>
        </div>

        <p style={{ fontSize: '1.2rem', color: '#888' }}>
          Odpovíme do 24 hodin • Česky, slovensky i anglicky
        </p>
      </div>
    </section>
  );
};

// Footer
const Footer = () => {
  return (
    <footer style={{
      padding: '60px 40px 40px',
      borderTop: '1px solid rgba(0, 217, 255, 0.2)',
      background: '#030303'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '40px',
        marginBottom: '40px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <Bot size={32} color="#00D9FF" />
            <h3 style={{ color: '#00D9FF', margin: 0 }}>ChciAI.cz</h3>
          </div>
          <p style={{ color: '#888', lineHeight: '1.6' }}>
            AI automatizace pro moderní byznys. Zákaznická podpora 24/7 bez lidské obsluhy.
          </p>
        </div>

        <div>
          <h4 style={{ color: 'white', marginBottom: '20px' }}>Služby</h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            <li style={{ marginBottom: '10px' }}>
              <a href="#sluzby" style={{ color: '#888', textDecoration: 'none' }}>WhatsApp Bot</a>
            </li>
            <li style={{ marginBottom: '10px' }}>
              <a href="#sluzby" style={{ color: '#888', textDecoration: 'none' }}>AI Voice Call</a>
            </li>
            <li style={{ marginBottom: '10px' }}>
              <a href="#sluzby" style={{ color: '#888', textDecoration: 'none' }}>Email Automatizace</a>
            </li>
          </ul>
        </div>

        <div>
          <h4 style={{ color: 'white', marginBottom: '20px' }}>Společnost</h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            <li style={{ marginBottom: '10px' }}>
              <a href="#" style={{ color: '#888', textDecoration: 'none' }}>O nás</a>
            </li>
            <li style={{ marginBottom: '10px' }}>
              <a href="#" style={{ color: '#888', textDecoration: 'none' }}>Blog</a>
            </li>
            <li style={{ marginBottom: '10px' }}>
              <a href="#kontakt" style={{ color: '#888', textDecoration: 'none' }}>Kontakt</a>
            </li>
          </ul>
        </div>
      </div>

      <div style={{
        textAlign: 'center',
        paddingTop: '40px',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        color: '#666'
      }}>
        <p>© 2026 ChciAI.cz - AI Automatizace pro Byznys</p>
        <p style={{ fontSize: '0.9rem', marginTop: '10px' }}>
          Postaveno s ❤️ pomocí Vibe Coding & OpenClaw
        </p>
      </div>
    </footer>
  );
};

// OpenClaw Section
const OpenClawSection = () => {
  return (
    <section id="openclaw" style={{
      padding: '100px 40px',
      background: 'linear-gradient(180deg, #030303 0%, #0a0a0a 100%)'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h2 style={{
            fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
            color: '#00D9FF',
            marginBottom: '20px'
          }}>
            🤖 OpenClaw - Váš Vlastní AI Asistent
          </h2>
          <p style={{ fontSize: '1.3rem', color: '#888', maxWidth: '800px', margin: '0 auto' }}>
            Bezpečný AI asistent jako Clawdbot. Vlastní instance pro vaši firmu.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '30px'
        }}>
          {[
            { title: 'Self-Hosted', desc: 'Data zůstávají u vás', icon: '🔒' },
            { title: 'Customizovatelný', desc: 'Přizpůsobte si ho na míru', icon: '⚙️' },
            { title: 'Open-Source', desc: 'Plná transparentnost kódu', icon: '📖' },
            { title: 'GDPR Ready', desc: 'Bezpečnost a compliance', icon: '✅' }
          ].map((feature, i) => (
            <div key={i} style={{
              background: '#0f0f0f',
              padding: '40px',
              borderRadius: '15px',
              border: '2px solid rgba(0, 217, 255, 0.2)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '15px' }}>{feature.icon}</div>
              <h3 style={{ color: '#00D9FF', fontSize: '1.5rem', marginBottom: '10px' }}>
                {feature.title}
              </h3>
              <p style={{ color: '#aaa', fontSize: '1.1rem' }}>{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Vibe Coding Section
const VibeCodingSection = () => {
  return (
    <section id="vibe-coding" style={{
      padding: '100px 40px',
      background: '#0a0a0a'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h2 style={{
            fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
            color: '#00D9FF',
            marginBottom: '20px'
          }}>
            📚 Vibe Coding - Ovládněte AI
          </h2>
          <p style={{ fontSize: '1.3rem', color: '#888', maxWidth: '800px', margin: '0 auto' }}>
            Naučte se efektivně používat AI. Prompt engineering, workflow optimalizace.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '40px'
        }}>
          {[
            {
              title: 'Online Kurz',
              price: '1 490 Kč',
              features: ['2 hodiny video', 'Praktická cvičení', 'Certifikát', 'Lifetime access']
            },
            {
              title: 'Workshop',
              price: '9 900 Kč',
              features: ['Půldenní (4h)', 'Osobně/online', 'Do 10 osob', 'Follow-up podpora']
            },
            {
              title: 'Enterprise',
              price: 'Na míru',
              features: ['Custom program', 'Multi-day', 'Certifikace týmu', 'Ongoing support']
            }
          ].map((course, i) => (
            <div key={i} style={{
              background: 'linear-gradient(145deg, #0f0f0f, #0a0a0a)',
              padding: '40px',
              borderRadius: '20px',
              border: '2px solid rgba(0, 217, 255, 0.2)',
              textAlign: 'center'
            }}>
              <h3 style={{ color: '#00D9FF', fontSize: '1.8rem', marginBottom: '15px' }}>
                {course.title}
              </h3>
              <div style={{ fontSize: '2.5rem', color: 'white', fontWeight: 'bold', marginBottom: '20px' }}>
                {course.price}
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 30px 0' }}>
                {course.features.map((feature, j) => (
                  <li key={j} style={{
                    color: '#aaa',
                    marginBottom: '12px',
                    fontSize: '1.1rem'
                  }}>
                    ✓ {feature}
                  </li>
                ))}
              </ul>
              <button style={{
                background: '#00D9FF',
                color: '#030303',
                border: 'none',
                padding: '15px 30px',
                borderRadius: '10px',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                width: '100%'
              }}>
                Koupit nyní
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Pricing Section
const PricingSection = () => {
  const plans = [
    {
      name: 'STARTER',
      price: '990 Kč',
      period: '/měsíc',
      description: 'Pro OSVČ a solo podnikatele',
      features: [
        '1 integrace (Email/WhatsApp/Web)',
        '1000 AI zpráv/měsíc',
        'Online kurz zdarma',
        'Email support (48h)',
        'První měsíc ZDARMA'
      ],
      highlight: false
    },
    {
      name: 'GROWTH',
      price: '1 990 Kč',
      period: '/měsíc',
      description: 'Rostoucí byznysy',
      features: [
        '3 integrace',
        '5000 AI zpráv/měsíc',
        'Znalostní báze',
        'Priority support (24h)',
        '1x měsíčně konzultace (30 min)'
      ],
      highlight: true
    },
    {
      name: 'BUSINESS',
      price: '3 990 Kč',
      period: '/měsíc',
      description: 'Malé firmy 5-20 lidí',
      features: [
        'Unlimited integrace',
        '20k AI zpráv/měsíc',
        'Voice AI',
        'CRM integrace',
        'Workshop + Dedicated support'
      ],
      highlight: false
    },
    {
      name: 'ENTERPRISE',
      price: '9 990 Kč',
      period: '/měsíc',
      description: 'Střední/velké firmy',
      features: [
        'Self-hosted OpenClaw',
        'Unlimited vše',
        'Custom development',
        'SLA 99.9%',
        'Account manager'
      ],
      highlight: false
    }
  ];

  return (
    <section id="pricing" style={{
      padding: '100px 40px',
      background: 'linear-gradient(180deg, #0a0a0a 0%, #030303 100%)'
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h2 style={{
            fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
            color: '#00D9FF',
            marginBottom: '20px'
          }}>
            💰 Cenové Balíčky
          </h2>
          <p style={{ fontSize: '1.3rem', color: '#888' }}>
            Začnete malé → budujeme důvěru → postupně přidáváme funkce
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '30px'
        }}>
          {plans.map((plan, i) => (
            <div key={i} style={{
              background: plan.highlight ? 'linear-gradient(145deg, #00D9FF, #0080FF)' : '#0f0f0f',
              padding: plan.highlight ? '42px' : '40px',
              borderRadius: '20px',
              border: plan.highlight ? 'none' : '2px solid rgba(0, 217, 255, 0.2)',
              position: 'relative',
              transform: plan.highlight ? 'scale(1.05)' : 'scale(1)',
              boxShadow: plan.highlight ? '0 20px 50px rgba(0, 217, 255, 0.3)' : 'none'
            }}>
              {plan.highlight && (
                <div style={{
                  position: 'absolute',
                  top: '-15px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: '#030303',
                  color: '#00D9FF',
                  padding: '8px 20px',
                  borderRadius: '20px',
                  fontSize: '0.9rem',
                  fontWeight: 'bold',
                  border: '2px solid #00D9FF'
                }}>
                  NEJOBLÍBENĚJŠÍ
                </div>
              )}
              
              <h3 style={{
                color: plan.highlight ? '#030303' : '#00D9FF',
                fontSize: '1.5rem',
                marginBottom: '10px',
                fontWeight: 'bold'
              }}>
                {plan.name}
              </h3>
              
              <div style={{
                fontSize: '3rem',
                color: plan.highlight ? '#030303' : 'white',
                fontWeight: 'bold',
                marginBottom: '5px'
              }}>
                {plan.price}
              </div>
              
              <div style={{
                color: plan.highlight ? 'rgba(3, 3, 3, 0.7)' : '#888',
                marginBottom: '20px',
                fontSize: '1.1rem'
              }}>
                {plan.description}
              </div>

              <ul style={{
                listStyle: 'none',
                padding: 0,
                margin: '0 0 30px 0'
              }}>
                {plan.features.map((feature, j) => (
                  <li key={j} style={{
                    color: plan.highlight ? 'rgba(3, 3, 3, 0.8)' : '#aaa',
                    marginBottom: '12px',
                    fontSize: '1rem',
                    paddingLeft: '25px',
                    position: 'relative'
                  }}>
                    <span style={{
                      position: 'absolute',
                      left: 0,
                      color: plan.highlight ? '#030303' : '#00D9FF'
                    }}>
                      ✓
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>

              <button style={{
                background: plan.highlight ? '#030303' : '#00D9FF',
                color: plan.highlight ? '#00D9FF' : '#030303',
                border: 'none',
                padding: '18px',
                borderRadius: '12px',
                fontSize: '1.2rem',
                fontWeight: 'bold',
                cursor: 'pointer',
                width: '100%',
                transition: 'transform 0.2s'
              }}>
                Vybrat balíček
              </button>
            </div>
          ))}
        </div>

        <p style={{
          textAlign: 'center',
          color: '#666',
          fontSize: '0.9rem',
          marginTop: '40px'
        }}>
          Všechny ceny jsou bez DPH • Roční předplatné -20% • 14 dní trial zdarma
        </p>
      </div>
    </section>
  );
};

// Main Homepage
const HomePage = () => {
  const [leadFormOpen, setLeadFormOpen] = useState(false);
  const [callbackFormOpen, setCallbackFormOpen] = useState(false);

  return (
    <div style={{ background: '#030303', minHeight: '100vh' }}>
      <Navbar />
      <HeroSection 
        onOpenLeadForm={() => setLeadFormOpen(true)}
        onOpenCallbackForm={() => setCallbackFormOpen(true)}
      />
      <ServicesSection />
      <OpenClawSection />
      <VibeCodingSection />
      <PricingSection />
      <ContactSection />
      <Footer />
      
      {/* Forms */}
      <LeadForm isOpen={leadFormOpen} onClose={() => setLeadFormOpen(false)} />
      <CallbackForm isOpen={callbackFormOpen} onClose={() => setCallbackFormOpen(false)} />
    </div>
  );
};

// Main App Component
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
