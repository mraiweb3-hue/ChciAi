import React, { useState } from 'react';
import { X, Phone, User, Clock } from 'lucide-react';

const CallbackForm = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    time: 'asap'
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/callback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          timestamp: new Date().toISOString()
        })
      });

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => {
          onClose();
          setSuccess(false);
          setFormData({ name: '', phone: '', time: 'asap' });
        }, 3000);
      }
    } catch (err) {
      console.error(err);
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
        maxWidth: '500px',
        width: '100%',
        position: 'relative'
      }} onClick={(e) => e.stopPropagation()}>
        
        <button onClick={onClose} style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          background: 'transparent',
          border: 'none',
          color: '#888',
          cursor: 'pointer'
        }}>
          <X size={28} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <Phone size={48} color="#00D9FF" style={{ marginBottom: '15px' }} />
          <h2 style={{ color: '#00D9FF', fontSize: '2rem', marginBottom: '10px' }}>
            Demo hovor
          </h2>
          <p style={{ color: '#888' }}>
            Zavoláme vám a ukážeme jak AI funguje
          </p>
        </div>

        {success && (
          <div style={{
            background: 'rgba(0, 217, 255, 0.1)',
            border: '2px solid #00D9FF',
            borderRadius: '10px',
            padding: '20px',
            marginBottom: '20px',
            textAlign: 'center',
            color: '#00D9FF'
          }}>
            ✅ Zavoláme vám co nejdříve!
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              color: '#aaa',
              marginBottom: '8px'
            }}>
              <User size={20} />
              Jméno *
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
                outline: 'none'
              }}
              onFocus={(e) => e.target.style.borderColor = '#00D9FF'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(0, 217, 255, 0.3)'}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              color: '#aaa',
              marginBottom: '8px'
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
                outline: 'none'
              }}
              onFocus={(e) => e.target.style.borderColor = '#00D9FF'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(0, 217, 255, 0.3)'}
            />
          </div>

          <div style={{ marginBottom: '30px' }}>
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              color: '#aaa',
              marginBottom: '8px'
            }}>
              <Clock size={20} />
              Kdy vám vyhovuje hovor? *
            </label>
            <select
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
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
              <option value="asap">Co nejdříve</option>
              <option value="morning">Dopoledne (9-12)</option>
              <option value="afternoon">Odpoledne (12-17)</option>
              <option value="evening">Večer (17-20)</option>
            </select>
          </div>

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
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px'
            }}
          >
            <Phone size={24} />
            {loading ? 'Odesílám...' : success ? 'Odesláno!' : 'Zavolejte mi'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CallbackForm;
