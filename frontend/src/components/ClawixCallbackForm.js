import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '@/lib/api';
import { toast } from 'sonner';

const LANGUAGES = [
  { code: 'cs', name: 'Čeština', flag: '🇨🇿' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'sv', name: 'Svenska', flag: '🇸🇪' },
  { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'uk', name: 'Українська', flag: '🇺🇦' },
];

const CALL_TIMES = [
  { value: '30s', label: 'Do 30 sekund', icon: '⚡' },
  { value: '5m', label: 'Za 5 minut', icon: '🕐' },
  { value: '30m', label: 'Za 30 minut', icon: '🕑' },
  { value: 'tomorrow', label: 'Zítra dopoledne', icon: '📅' },
];

export default function ClawixCallbackForm({ theme = 'light', onClose, isModal = false }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [form, setForm] = useState({
    name: '',
    phone: '',
    language: 'cs',
    call_time: '30s',
    website: '',
    consent_sms: true,
    consent_call: true,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!form.consent_call) {
      toast.error('Pro uskutečnění hovoru je nutný souhlas');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/clawix/callback', form);
      setSuccess(response);
      setStep(3);
      toast.success('Požadavek odeslán! Clawix vám brzy zavolá.');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Něco se pokazilo. Zkuste to znovu.');
    } finally {
      setLoading(false);
    }
  };

  const updateForm = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const containerClasses = `w-full max-w-md mx-auto ${
    theme === 'dark'
      ? 'bg-slate-800/90 border-slate-700'
      : 'bg-white/90 border-slate-200'
  } ${isModal ? 'rounded-2xl border shadow-2xl' : 'rounded-2xl border shadow-xl'} backdrop-blur-xl overflow-hidden`;

  return (
    <div className={containerClasses} data-testid="clawix-callback-form">
      {/* Header */}
      <div className={`p-6 border-b ${theme === 'dark' ? 'border-slate-700 bg-gradient-to-r from-cyan-900/50 to-blue-900/50' : 'border-slate-100 bg-gradient-to-r from-cyan-50 to-blue-50'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
              <span className="text-2xl">🤖</span>
            </div>
            <div>
              <h3 className={`font-bold text-lg ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
                Clawix vám zavolá
              </h3>
              <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                Náš AI asistent
              </p>
            </div>
          </div>
          {isModal && onClose && (
            <button
              onClick={onClose}
              className={`p-2 rounded-lg transition-colors ${
                theme === 'dark' ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-100 text-slate-500'
              }`}
            >
              ✕
            </button>
          )}
        </div>
        
        {/* Progress steps */}
        <div className="flex items-center gap-2 mt-4">
          {[1, 2, 3].map(s => (
            <div
              key={s}
              className={`flex-1 h-1.5 rounded-full transition-colors ${
                s <= step
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500'
                  : theme === 'dark' ? 'bg-slate-700' : 'bg-slate-200'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Form content */}
      <form onSubmit={handleSubmit}>
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-6 space-y-4"
            >
              <p className={`text-sm ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                Vyplňte základní údaje pro hovor
              </p>

              {/* Name */}
              <div>
                <label className={`block text-sm font-medium mb-1.5 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                  Vaše jméno *
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => updateForm('name', e.target.value)}
                  placeholder="Jan Novák"
                  required
                  className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
                    theme === 'dark'
                      ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400'
                      : 'bg-white border-slate-300 text-slate-800 placeholder-slate-400'
                  }`}
                  data-testid="clawix-name-input"
                />
              </div>

              {/* Phone */}
              <div>
                <label className={`block text-sm font-medium mb-1.5 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                  Telefonní číslo *
                </label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => updateForm('phone', e.target.value)}
                  placeholder="+420 xxx xxx xxx"
                  required
                  className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
                    theme === 'dark'
                      ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400'
                      : 'bg-white border-slate-300 text-slate-800 placeholder-slate-400'
                  }`}
                  data-testid="clawix-phone-input"
                />
              </div>

              {/* Website (optional) */}
              <div>
                <label className={`block text-sm font-medium mb-1.5 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                  Webová stránka <span className={theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}>(nepovinné)</span>
                </label>
                <input
                  type="url"
                  value={form.website}
                  onChange={(e) => updateForm('website', e.target.value)}
                  placeholder="https://vase-stranka.cz"
                  className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
                    theme === 'dark'
                      ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400'
                      : 'bg-white border-slate-300 text-slate-800 placeholder-slate-400'
                  }`}
                  data-testid="clawix-website-input"
                />
              </div>

              <motion.button
                type="button"
                onClick={() => form.name && form.phone && setStep(2)}
                disabled={!form.name || !form.phone}
                className="w-full py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                data-testid="clawix-next-step1"
              >
                Pokračovat →
              </motion.button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-6 space-y-4"
            >
              {/* Language selection */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                  V jakém jazyce má Clawix komunikovat?
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {LANGUAGES.map(lang => (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => updateForm('language', lang.code)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        form.language === lang.code
                          ? 'border-cyan-500 bg-cyan-500/10'
                          : theme === 'dark'
                            ? 'border-slate-600 hover:border-slate-500'
                            : 'border-slate-200 hover:border-slate-300'
                      }`}
                      data-testid={`clawix-lang-${lang.code}`}
                    >
                      <span className="text-lg mr-2">{lang.flag}</span>
                      <span className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
                        {lang.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Call time selection */}
              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                  Kdy vám má Clawix zavolat?
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {CALL_TIMES.map(time => (
                    <button
                      key={time.value}
                      type="button"
                      onClick={() => updateForm('call_time', time.value)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        form.call_time === time.value
                          ? 'border-cyan-500 bg-cyan-500/10'
                          : theme === 'dark'
                            ? 'border-slate-600 hover:border-slate-500'
                            : 'border-slate-200 hover:border-slate-300'
                      }`}
                      data-testid={`clawix-time-${time.value}`}
                    >
                      <span className="text-lg mr-2">{time.icon}</span>
                      <span className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
                        {time.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Consents */}
              <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-slate-700/50' : 'bg-slate-50'}`}>
                <p className={`text-xs font-medium mb-3 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                  Dbáme na vaše soukromí a etiku
                </p>
                
                <label className="flex items-start gap-3 cursor-pointer mb-3">
                  <input
                    type="checkbox"
                    checked={form.consent_sms}
                    onChange={(e) => updateForm('consent_sms', e.target.checked)}
                    className="mt-1 w-4 h-4 rounded border-slate-300 text-cyan-500 focus:ring-cyan-500"
                  />
                  <span className={`text-sm ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                    Souhlasím s SMS upozorněním před hovorem s možností odmítnutí nebo změny termínu
                  </span>
                </label>

                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.consent_call}
                    onChange={(e) => updateForm('consent_call', e.target.checked)}
                    className="mt-1 w-4 h-4 rounded border-slate-300 text-cyan-500 focus:ring-cyan-500"
                    required
                  />
                  <span className={`text-sm ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                    Souhlasím s telefonickým kontaktem od AI asistenta Clawix *
                  </span>
                </label>
              </div>

              {/* Info box */}
              <div className={`p-4 rounded-xl border ${theme === 'dark' ? 'border-cyan-500/30 bg-cyan-900/20' : 'border-cyan-200 bg-cyan-50'}`}>
                <div className="flex items-start gap-3">
                  <span className="text-xl">📱</span>
                  <div>
                    <p className={`text-sm font-medium ${theme === 'dark' ? 'text-cyan-300' : 'text-cyan-700'}`}>
                      Před hovorem obdržíte SMS
                    </p>
                    <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-cyan-400/70' : 'text-cyan-600/70'}`}>
                      S informací, že volá Clawix (objednaný hovor). Můžete hovor odmítnout nebo přeložit na jiný termín.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className={`flex-1 py-3.5 rounded-xl font-medium border ${
                    theme === 'dark'
                      ? 'border-slate-600 text-slate-300 hover:bg-slate-700'
                      : 'border-slate-300 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  ← Zpět
                </button>
                <motion.button
                  type="submit"
                  disabled={loading || !form.consent_call}
                  className="flex-1 py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-500 disabled:opacity-50"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  data-testid="clawix-submit"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Odesílám...
                    </span>
                  ) : (
                    'Potvrdit hovor'
                  )}
                </motion.button>
              </div>
            </motion.div>
          )}

          {step === 3 && success && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-6 text-center"
            >
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
                <span className="text-4xl">✓</span>
              </div>
              
              <h4 className={`text-xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
                Požadavek odeslán!
              </h4>
              
              <p className={`text-sm mb-4 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                {success.message}
              </p>

              <div className={`p-4 rounded-xl mb-4 ${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-100'}`}>
                <p className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                  Váš potvrzovací kód
                </p>
                <p className={`text-2xl font-mono font-bold tracking-widest mt-1 ${theme === 'dark' ? 'text-cyan-400' : 'text-cyan-600'}`}>
                  {success.confirmation_code}
                </p>
              </div>

              <p className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                Tento kód použijete pro případnou změnu nebo zrušení hovoru.
              </p>

              {onClose && (
                <motion.button
                  type="button"
                  onClick={onClose}
                  className="mt-4 w-full py-3 rounded-xl font-medium text-white bg-gradient-to-r from-cyan-500 to-blue-500"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Zavřít
                </motion.button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </div>
  );
}
