import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Minimal working homepage
const HomePage = () => {
  return (
    <div style={{
      background: 'linear-gradient(to bottom, #030303, #0a0a0a)',
      color: 'white',
      minHeight: '100vh',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* Navbar */}
      <nav style={{
        padding: '20px 40px',
        borderBottom: '1px solid #00D9FF',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <h1 style={{color: '#00D9FF', margin: 0}}>ChciAI.cz</h1>
        <div style={{display: 'flex', gap: '20px'}}>
          <a href="#sluzby" style={{color: 'white', textDecoration: 'none'}}>Služby</a>
          <a href="#kontakt" style={{color: 'white', textDecoration: 'none'}}>Kontakt</a>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{
        padding: '100px 40px',
        textAlign: 'center'
      }}>
        <h1 style={{
          fontSize: '4rem',
          marginBottom: '20px',
          background: 'linear-gradient(to right, #00D9FF, #0080FF)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          AI Asistent pro Váš Byznys
        </h1>
        <p style={{fontSize: '1.5rem', color: '#aaa', marginBottom: '40px'}}>
          Automatizace 24/7 • WhatsApp • Telefon • Email
        </p>
        <button style={{
          background: '#00D9FF',
          color: '#030303',
          border: 'none',
          padding: '20px 40px',
          fontSize: '1.2rem',
          borderRadius: '10px',
          cursor: 'pointer',
          fontWeight: 'bold'
        }}>
          Vyzkoušet zdarma
        </button>
      </section>

      {/* Services Section */}
      <section id="sluzby" style={{
        padding: '80px 40px',
        background: '#0a0a0a'
      }}>
        <h2 style={{
          textAlign: 'center',
          fontSize: '3rem',
          marginBottom: '60px',
          color: '#00D9FF'
        }}>Naše Služby</h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '30px',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          {[
            {title: 'WhatsApp Bot', desc: 'Automatické odpovědi 24/7'},
            {title: 'AI Voice Call', desc: 'Hlasové hovory s klienty'},
            {title: 'Email Automatizace', desc: 'Inteligentní email odpovědi'}
          ].map((service, i) => (
            <div key={i} style={{
              background: '#0f0f0f',
              padding: '40px',
              borderRadius: '15px',
              border: '2px solid #00D9FF'
            }}>
              <h3 style={{color: '#00D9FF', fontSize: '1.8rem', marginBottom: '15px'}}>
                {service.title}
              </h3>
              <p style={{color: '#aaa', fontSize: '1.1rem'}}>
                {service.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section id="kontakt" style={{
        padding: '80px 40px',
        textAlign: 'center'
      }}>
        <h2 style={{fontSize: '3rem', marginBottom: '40px', color: '#00D9FF'}}>
          Kontakt
        </h2>
        <p style={{fontSize: '1.3rem', color: '#aaa', marginBottom: '20px'}}>
          Email: info@chciai.cz
        </p>
        <p style={{fontSize: '1.3rem', color: '#aaa'}}>
          Tel: +420 XXX XXX XXX
        </p>
      </section>

      {/* Footer */}
      <footer style={{
        padding: '40px',
        borderTop: '1px solid #00D9FF',
        textAlign: 'center',
        color: '#666'
      }}>
        <p>© 2026 ChciAI.cz - AI Automatizace pro Byznys</p>
      </footer>
    </div>
  );
};

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
