import { createContext, useContext, useState, useCallback } from 'react';
import { translations } from '@/lib/translations';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('cs');

  const t = useCallback((path) => {
    const keys = path.split('.');
    let result = translations[language];
    for (const key of keys) {
      if (result && typeof result === 'object') {
        result = result[key];
      } else {
        return path;
      }
    }
    return result || path;
  }, [language]);

  const toggleLanguage = useCallback(() => {
    setLanguage(prev => prev === 'cs' ? 'en' : 'cs');
  }, []);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
