import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import ThemeToggle from '@/components/ThemeToggle';

export default function AcademyPage() {
  const { theme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedModule, setSelectedModule] = useState(null);

  useEffect(() => {
    fetchModules();
  }, []);

  const fetchModules = async () => {
    try {
      const data = await api.get('/academy/modules');
      setModules(data);
    } catch (error) {
      console.error('Failed to fetch modules:', error);
    } finally {
      setLoading(false);
    }
  };

  const markComplete = async (moduleId) => {
    try {
      await api.post(`/academy/progress/${moduleId}`);
      await fetchModules();
    } catch (error) {
      console.error('Failed to mark module complete:', error);
    }
  };

  const completedCount = modules.filter(m => m.completed).length;
  const progress = modules.length > 0 ? (completedCount / modules.length) * 100 : 0;

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
              Akademie
            </span>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <button
              onClick={() => navigate('/client-onboarding')}
              className={`text-sm px-3 py-1.5 rounded-lg ${
                theme === 'dark' ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Dashboard
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-4xl">
            🎓
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Chci AI Akademie</h1>
          <p className={`text-lg max-w-2xl mx-auto ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
            Naučte se ovládat AI a automatizovat své podnikání
          </p>
        </motion.div>

        {/* Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`p-6 rounded-2xl mb-8 ${
            theme === 'dark' ? 'bg-slate-800/50 border border-slate-700' : 'bg-white border border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <span className={`text-sm font-medium ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
              Váš pokrok
            </span>
            <span className="font-bold text-cyan-500">{completedCount}/{modules.length} modulů</span>
          </div>
          <div className={`h-3 rounded-full ${theme === 'dark' ? 'bg-slate-700' : 'bg-slate-200'}`}>
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.8 }}
            />
          </div>
        </motion.div>

        {/* Modules grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module, i) => (
            <motion.div
              key={module.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`p-6 rounded-2xl ${
                theme === 'dark' ? 'bg-slate-800/50 border border-slate-700' : 'bg-white border border-slate-200'
              } ${module.completed ? 'opacity-75' : ''} hover:border-cyan-500 transition-colors cursor-pointer`}
              onClick={() => setSelectedModule(module)}
            >
              {/* Type badge */}
              <div className="flex items-center justify-between mb-4">
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  module.type === 'video'
                    ? 'bg-red-500/20 text-red-400'
                    : 'bg-blue-500/20 text-blue-400'
                }`}>
                  {module.type === 'video' ? '🎬 Video' : '📄 PDF'}
                </span>
                {module.free && (
                  <span className="px-2 py-1 rounded text-xs font-medium bg-green-500/20 text-green-400">
                    Zdarma
                  </span>
                )}
              </div>

              <h3 className={`text-lg font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
                {module.title}
              </h3>
              <p className={`text-sm mb-4 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                {module.description}
              </p>

              <div className="flex items-center justify-between">
                <span className={`text-xs ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
                  ⏱️ {module.duration}
                </span>
                {module.completed ? (
                  <span className="text-green-500 text-sm font-medium">✓ Dokončeno</span>
                ) : (
                  <motion.button
                    className="text-sm font-medium text-cyan-500 hover:text-cyan-400"
                    whileHover={{ x: 3 }}
                  >
                    Začít →
                  </motion.button>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Module modal */}
        {selectedModule && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
            onClick={() => setSelectedModule(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={`w-full max-w-2xl rounded-2xl p-6 ${
                theme === 'dark' ? 'bg-slate-800' : 'bg-white'
              }`}
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    selectedModule.type === 'video'
                      ? 'bg-red-500/20 text-red-400'
                      : 'bg-blue-500/20 text-blue-400'
                  }`}>
                    {selectedModule.type === 'video' ? '🎬 Video' : '📄 PDF'}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedModule(null)}
                  className={`p-2 rounded-lg ${theme === 'dark' ? 'hover:bg-slate-700' : 'hover:bg-slate-100'}`}
                >
                  ✕
                </button>
              </div>

              <h2 className="text-2xl font-bold mb-2">{selectedModule.title}</h2>
              <p className={`mb-6 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                {selectedModule.description}
              </p>

              {/* Video placeholder */}
              <div className={`aspect-video rounded-xl mb-6 flex items-center justify-center ${
                theme === 'dark' ? 'bg-slate-700' : 'bg-slate-100'
              }`}>
                <div className="text-center">
                  <span className="text-6xl mb-4 block">🎬</span>
                  <p className={theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}>
                    Video modul bude brzy k dispozici
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                  ⏱️ Délka: {selectedModule.duration}
                </span>
                {selectedModule.completed ? (
                  <span className="text-green-500 font-medium">✓ Dokončeno</span>
                ) : (
                  <motion.button
                    onClick={() => { markComplete(selectedModule.id); setSelectedModule(null); }}
                    className="px-6 py-2.5 rounded-xl font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-500"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Označit jako dokončené
                  </motion.button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
