import React, { createContext, useContext, useState, useCallback } from 'react';
import { createT, SUPPORTED_LANGUAGES } from '../i18n/translations';

const STORAGE_KEY = 'publicreport_admin_language';
const DEFAULT_LANGUAGE = 'en';

function getSavedLanguage() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && SUPPORTED_LANGUAGES.find((l) => l.code === saved)) return saved;
  } catch {}
  return DEFAULT_LANGUAGE;
}

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(getSavedLanguage);
  const [t, setT] = useState(() => createT(getSavedLanguage()));

  const changeLanguage = useCallback((code) => {
    if (!SUPPORTED_LANGUAGES.find((l) => l.code === code)) return;
    setLanguage(code);
    setT(() => createT(code));
    try { localStorage.setItem(STORAGE_KEY, code); } catch {}
  }, []);

  return (
    <LanguageContext.Provider value={{ language, t, changeLanguage, languages: SUPPORTED_LANGUAGES }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
