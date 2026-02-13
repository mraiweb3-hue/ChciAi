import React, { useState } from 'react';
import { X, Rocket, Mail, Phone, User, MessageSquare } from 'lucide-react';

const LeadForm = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: 'whatsapp',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          type: 'lead',
          timestamp: new Date().toISOString()
        })
      });

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          onClose();
          setSuccess(false);
          setFormData({ name: '', email: '', phone: '', service: 'whatsapp', message: '' });
        }, 3000);
      } else {
        setError('Něco se pokazilo. Zkuste to prosím znovu.');
      }
    } catch (err) {
      setError('Chyba připojení. Zkontrolujte internet a zkuste znovu.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 9999,
      padding: '20px'
    }} onClick={onClose}>
      <div style={{
        background: 'linear-gradient(145deg, #0f0f0f, #0a0a0a)',
        borderRadius: '20px',
        border: '2px solid #00D9FF',
        padding: '40px',
        maxWidth: '600px',
        width: '100%',
        position: 'relative',
        maxHeight: '90vh',
        overflowY: 'auto'
      }} onClick={(e) => e.stopPropagation()}>
        
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'transparent',
            border: 'none',
            color: '#888',
            cursor: 'pointer',
            transition: 'color 0.3s'
          }}
        >
          <X size={28} />
        </button>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <Rocket size={48} color="#00D9FF" style={{ marginBottom: '15px' }} />
          <h2 style={{
            color: '#00D9FF',
            fontSize: '2rem',
            marginBottom: '10px'
          }}>
            Začněte zdarma
          </h2>
          <p style={{ color: '#888', fontSize: '1rem' }}>
            Vyplňte formulář a my se vám ozveme do 24 hodin
          </p>
        </div>

        {/* Success Message */}
        {success && (
          <div style={{
            background: 'rgba(0, 217, 255, 0.1)',
            border: '2px solid #00D9FF',
            borderRadius: '10px',
            padding: '20px',
            marginBottom: '20px',
            textAlign: 'center'
          }}>
            <p style={{ color: '#00D9FF', fontSize: '1.2rem', fontWeight: 'bold' }}>
              ✅ Děkujeme! Brzy se ozveme.
            </p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div style={{
            background: 'rgba(255, 50, 50, 0.1)',
            border: '2px solid #ff3232',
            borderRadius: '10px',
            padding: '15px',
            marginBottom: '20px',
            textAlign: 'center',
            color: '#ff3232'
          }}>
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Name */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              color: '#aaa',
              marginBottom: '8px',
              fontSize: '1rem'
            }}>
              <User size={20} />
              Jméno a příjmení *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Jan Novák"
              style={{
                width: '100%',
                padding: '15px',
                background: '#0a0a0a',
                border: '2px solid rgba(0, 217, 255, 0.3)',
                borderRadius: '10px',
                color: 'white',
                fontSize: '1rem',
                outline: 'none',
                transition: 'border 0.3s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#00D9FF'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(0, 217, 255, 0.3)'}
            />
          </div>

          {/* Email */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              color: '#aaa',
              marginBottom: '8px',
              fontSize: '1rem'
            }}>
              <Mail size={20} />
              Email *
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="jan@example.com"
              style={{
                width: '100%',
                padding: '15px',
                background: '#0a0a0a',
                border: '2px solid rgba(0, 217, 255, 0.3)',
                borderRadius: '10px',
                color: 'white',
                fontSize: '1rem',
                outline: 'none',
                transition: 'border 0.3s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#00D9FF'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(0, 217, 255, 0.3)'}
            />
          </div>

          {/* Phone */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              color: '#aaa',
              marginBottom: '8px',
              fontSize: '1rem'
            }}>
              <Phone size={20} />
              Telefon *
            </label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+420 XXX XXX XXX"
              style={{
                width: '100%',
                padding: '15px',
                background: '#0a0a0a',
                border: '2px solid rgba(0, 217, 255, 0.3)',
                borderRadius: '10px',
                color: 'white',
                fontSize: '1rem',
                outline: 'none',
                transition: 'border 0.3s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#00D9FF'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(0, 217, 255, 0.3)'}
            />
          </div>

          {/* Service Type */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              color: '#aaa',
              marginBottom: '8px',
              fontSize: '1rem'
            }}>
              <MessageSquare size={20} />
              Jakou službu máte zájem? *
            </label>
            <select
              value={formData.service}
              onChange={(e) => setFormData({ ...formData, service: e.target.value })}
              style={{
                width: '100%',
                padding: '15px',
                background: '#0a0a0a',
                border: '2px solid rgba(0, 217, 255, 0.3)',
                borderRadius: '10px',
                color: 'white',
                fontSize: '1rem',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="whatsapp">WhatsApp Bot</option>
              <option value="voice">AI Voice Call</option>
              <option value="email">Email Automatizace</option>
              <option value="custom">Vlastní řešení</option>
            </select>
          </div>

          {/* Message */}
          <div style={{ marginBottom: '30px' }}>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              color: '#aaa',
              marginBottom: '8px',
              fontSize: '1rem'
            }}>
              Zpráva (volitelné)
            </label>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Řekněte nám více o vašem byznysu..."
              rows={4}
              style={{
                width: '100%',
                padding: '15px',
                background: '#0a0a0a',
                border: '2px solid rgba(0, 217, 255, 0.3)',
                borderRadius: '10px',
                color: 'white',
                fontSize: '1rem',
                outline: 'none',
                resize: 'vertical',
                transition: 'border 0.3s',
                fontFamily: 'inherit'
              }}
              onFocus={(e) => e.target.style.borderColor = '#00D9FF'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(0, 217, 255, 0.3)'}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || success}
            style={{
              width: '100%',
              padding: '18px',
              background: loading || success ? '#666' : '#00D9FF',
              color: '#030303',
              border: 'none',
              borderRadius: '12px',
              fontSize: '1.2rem',
              fontWeight: 'bold',
              cursor: loading || success ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px'
            }}
          >
            <Rocket size={24} />
            {loading ? 'Odesílám...' : success ? 'Odesláno!' : 'Odeslat'}
          </button>
        </form>

        {/* Privacy Note */}
        <p style={{
          textAlign: 'center',
          color: '#666',
          fontSize: '0.85rem',
          marginTop: '20px',
          lineHeight: '1.4'
        }}>
          Vaše údaje jsou v bezpečí. Nebudeme vás spamovat.
        </p>
      </div>
    </div>
  );
};

export default LeadForm;
