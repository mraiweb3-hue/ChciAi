import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import ThemeToggle from '@/components/ThemeToggle';

const CHECKLIST_ITEMS = [
  { key: 'account_created', label: 'Účet vytvořen', icon: '✅' },
  { key: 'audit_scheduled', label: 'AI Audit naplánován', icon: '📅' },
  { key: 'openclaw_installed', label: 'OpenClaw nainstalován', icon: '🔧' },
  { key: 'ai_partner_created', label: 'AI partner vytvořen', icon: '🤖' },
  { key: 'vibe_coding_completed', label: 'Vibe Coding školení', icon: '🎓' },
  { key: 'first_automation', label: 'První automatizace', icon: '🚀' },
];

export default function ClientOnboardingPage() {
  const { theme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [onboarding, setOnboarding] = useState(null);
  const [loading, setLoading] = useState(true);
  const [aiPartnerForm, setAiPartnerForm] = useState({
    name: '',
    tone: 'professional',
    role: 'support'
  });

  useEffect(() => {
    fetchOnboarding();
  }, []);

  const fetchOnboarding = async () => {
    try {
      const data = await api.get('/onboarding/status');
      setOnboarding(data);
      if (data.ai_partner?.name) {
        setAiPartnerForm(data.ai_partner);
      }
    } catch (error) {
      console.error('Failed to fetch onboarding:', error);
    } finally {
      setLoading(false);
    }
  };

  const startOnboarding = async (variant) => {
    try {
      const data = await api.post('/onboarding/start', { variant });
      setOnboarding(data);
    } catch (error) {
      console.error('Failed to start onboarding:', error);
    }
  };

  const updateAiPartner = async () => {
    try {
      await api.put('/onboarding/update', { ai_partner: aiPartnerForm });
      await fetchOnboarding();
    } catch (error) {
      console.error('Failed to update AI partner:', error);
    }
  };

  const completedCount = onboarding?.checklist 
    ? Object.values(onboarding.checklist).filter(Boolean).length 
    : 0;
  const progress = (completedCount / CHECKLIST_ITEMS.length) * 100;

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-slate-950' : 'bg-slate-50'}`}>
        <div className="animate-spin w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      theme === 'dark' ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'
    }`}>
      {/* Header */}
      <header className={`border-b ${theme === 'dark' ? 'border-slate-800 bg-slate-900/80' : 'border-slate-200 bg-white/80'} backdrop-blur-xl sticky top-0 z-50`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/')} className="text-xl font-bold bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">
              Chci AI
            </button>
            <span className={`text-sm ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>/</span>
            <span className={`text-sm font-medium ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
              Client Onboarding
            </span>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <span className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
              {user?.email}
            </span>
            <button
              onClick={() => { logout(); navigate('/'); }}
              className={`text-sm px-3 py-1.5 rounded-lg ${
                theme === 'dark' ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Odhlásit
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {!onboarding || onboarding.status === 'not_started' ? (
          /* Start onboarding */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto text-center"
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-4xl">
              🎯
            </div>
            <h1 className="text-3xl font-bold mb-4">Vítejte v Chci AI!</h1>
            <p className={`text-lg mb-8 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
              Vyberte variantu a začněte svou AI transformaci.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              <motion.button
                onClick={() => startOnboarding('online')}
                className={`p-6 rounded-2xl text-left ${
                  theme === 'dark' ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-slate-200'
                } hover:border-cyan-500 transition-colors`}
                whileHover={{ y: -5 }}
              >
                <span className="text-3xl mb-4 block">💻</span>
                <h3 className="text-xl font-bold mb-2">Online varianta</h3>
                <p className={`text-sm mb-4 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                  Pro technicky zdatnější. Video školení, dokumentace, online podpora.
                </p>
                <span className="text-cyan-500 font-bold">990 Kč</span>
              </motion.button>
              
              <motion.button
                onClick={() => startOnboarding('personal')}
                className="p-6 rounded-2xl text-left bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border-2 border-cyan-500 relative"
                whileHover={{ y: -5 }}
              >
                <span className="absolute -top-3 left-6 px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-500">
                  Doporučujeme
                </span>
                <span className="text-3xl mb-4 block">🤝</span>
                <h3 className="text-xl font-bold mb-2">Osobní instalace</h3>
                <p className={`text-sm mb-4 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                  Kompletní nastavení, AI Audit, Vibe Coding školení, prioritní podpora.
                </p>
                <span className="text-cyan-500 font-bold">4.990 Kč</span>
              </motion.button>
            </div>
          </motion.div>
        ) : (
          /* Onboarding dashboard */
          <div className="space-y-8">
            {/* Progress header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-6 rounded-2xl ${
                theme === 'dark' ? 'bg-slate-800/50 border border-slate-700' : 'bg-white border border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold">Váš onboarding</h1>
                  <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                    Varianta: {onboarding.variant === 'personal' ? 'Osobní instalace' : 'Online'}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-3xl font-bold text-cyan-500">{completedCount}</span>
                  <span className={`text-lg ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>/{CHECKLIST_ITEMS.length}</span>
                </div>
              </div>
              
              {/* Progress bar */}
              <div className={`h-3 rounded-full ${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-200'}`}>
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                />
              </div>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-8">
              {/* Checklist */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`p-6 rounded-2xl ${
                  theme === 'dark' ? 'bg-slate-800/50 border border-slate-700' : 'bg-white border border-slate-200'
                }`}
              >
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <span>📋</span> Checklist
                </h2>
                
                <div className="space-y-3">
                  {CHECKLIST_ITEMS.map((item, i) => {
                    const isCompleted = onboarding.checklist?.[item.key];
                    return (
                      <motion.div
                        key={item.key}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className={`flex items-center gap-3 p-3 rounded-xl ${
                          isCompleted
                            ? theme === 'dark' ? 'bg-green-500/10 border border-green-500/30' : 'bg-green-50 border border-green-200'
                            : theme === 'dark' ? 'bg-slate-700/50' : 'bg-slate-50'
                        }`}
                      >
                        <span className="text-xl">{item.icon}</span>
                        <span className={`flex-1 ${isCompleted ? 'line-through opacity-60' : ''}`}>
                          {item.label}
                        </span>
                        {isCompleted ? (
                          <span className="text-green-500">✓</span>
                        ) : (
                          <span className={`text-xs px-2 py-1 rounded ${
                            theme === 'dark' ? 'bg-slate-600 text-slate-300' : 'bg-slate-200 text-slate-600'
                          }`}>
                            Čeká
                          </span>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>

              {/* AI Partner setup */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`p-6 rounded-2xl ${
                  theme === 'dark' ? 'bg-slate-800/50 border border-slate-700' : 'bg-white border border-slate-200'
                }`}
              >
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <span>🤖</span> Váš AI partner
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className={`block text-sm font-medium mb-1.5 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                      Jméno AI partnera
                    </label>
                    <input
                      type="text"
                      value={aiPartnerForm.name}
                      onChange={(e) => setAiPartnerForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="např. Max, Luna, Atlas..."
                      className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
                        theme === 'dark'
                          ? 'bg-slate-700 border-slate-600 text-white'
                          : 'bg-white border-slate-300 text-slate-800'
                      }`}
                    />
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-medium mb-1.5 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                      Tone of Voice
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { value: 'professional', label: 'Profesionální' },
                        { value: 'friendly', label: 'Přátelský' },
                        { value: 'casual', label: 'Neformální' },
                        { value: 'formal', label: 'Formální' }
                      ].map(opt => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => setAiPartnerForm(prev => ({ ...prev, tone: opt.value }))}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            aiPartnerForm.tone === opt.value
                              ? 'bg-cyan-500 text-white'
                              : theme === 'dark'
                                ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className={`block text-sm font-medium mb-1.5 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                      Hlavní role
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { value: 'support', label: 'Podpora' },
                        { value: 'sales', label: 'Prodej' },
                        { value: 'internal', label: 'Interní' }
                      ].map(opt => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => setAiPartnerForm(prev => ({ ...prev, role: opt.value }))}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            aiPartnerForm.role === opt.value
                              ? 'bg-cyan-500 text-white'
                              : theme === 'dark'
                                ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <motion.button
                    onClick={updateAiPartner}
                    className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-500"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Uložit nastavení
                  </motion.button>
                </div>
              </motion.div>
            </div>

            {/* Quick actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4"
            >
              {[
                { icon: '📚', label: 'Akademie', href: '/academy', color: 'from-cyan-500 to-blue-500' },
                { icon: '📊', label: 'Dashboard', href: '/dashboard', color: 'from-blue-500 to-indigo-500' },
                { icon: '💬', label: 'Chatboti', href: '/chatbots', color: 'from-indigo-500 to-purple-500' },
                { icon: '📞', label: 'Podpora', href: '#', color: 'from-purple-500 to-pink-500' },
              ].map((action, i) => (
                <motion.button
                  key={i}
                  onClick={() => navigate(action.href)}
                  className={`p-4 rounded-xl ${
                    theme === 'dark' ? 'bg-slate-800/50 border border-slate-700' : 'bg-white border border-slate-200'
                  } hover:border-cyan-500 transition-colors text-left`}
                  whileHover={{ y: -3 }}
                >
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${action.color} flex items-center justify-center text-xl mb-2`}>
                    {action.icon}
                  </div>
                  <span className="font-medium">{action.label}</span>
                </motion.button>
              ))}
            </motion.div>
          </div>
        )}
      </main>
    </div>
  );
}
