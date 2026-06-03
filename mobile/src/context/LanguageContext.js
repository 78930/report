import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createT, SUPPORTED_LANGUAGES } from '../i18n/translations';

const STORAGE_KEY = '@publicreport_language';
const DEFAULT_LANGUAGE = 'en';

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(DEFAULT_LANGUAGE);
  const [t, setT] = useState(() => createT(DEFAULT_LANGUAGE));

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((saved) => {
      if (saved && SUPPORTED_LANGUAGES.find((l) => l.code === saved)) {
        setLanguage(saved);
        setT(() => createT(saved));
      }
    });
  }, []);

  const changeLanguage = useCallback(async (code) => {
    if (!SUPPORTED_LANGUAGES.find((l) => l.code === code)) return;
    setLanguage(code);
    setT(() => createT(code));
    await AsyncStorage.setItem(STORAGE_KEY, code);
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
