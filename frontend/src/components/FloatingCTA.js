import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';

export default function FloatingCTA() {
  const { theme } = useTheme();
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 100, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 100, scale: 0.8 }}
          className="fixed bottom-6 right-6 z-50"
          data-testid="floating-cta"
        >
          <motion.button
            onClick={() => setIsExpanded(!isExpanded)}
            className={`relative px-6 py-3 rounded-full font-semibold text-white shadow-2xl overflow-hidden ${
              theme === 'dark'
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600'
                : 'bg-gradient-to-r from-cyan-500 to-blue-500'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {/* Pulse effect */}
            <motion.div
              className="absolute inset-0 bg-white/30 rounded-full"
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="relative z-10 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Vytvořit AI zaměstnance
            </span>
          </motion.button>
          
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.9 }}
                className={`absolute bottom-full right-0 mb-3 p-4 rounded-2xl shadow-2xl w-64 ${
                  theme === 'dark'
                    ? 'bg-slate-800/95 border border-slate-700'
                    : 'bg-white/95 border border-slate-200'
                } backdrop-blur-md`}
              >
                <h4 className={`font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
                  Začněte hned!
                </h4>
                <p className={`text-sm mb-3 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                  Váš AI zaměstnanec může začít pracovat ještě dnes.
                </p>
                <a
                  href="/auth"
                  className="block w-full py-2.5 rounded-lg bg-gradient-to-r from-emerald-500 to-green-500 text-white text-sm font-medium text-center hover:opacity-90 transition-opacity"
                >
                  Vyzkoušet zdarma
                </a>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
