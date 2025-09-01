'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import messagesEs from '../../messages/es.json';
import messagesEn from '../../messages/en.json';

type Locale = 'es' | 'en';

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
  messages: any;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const allMessages = {
  es: messagesEs,
  en: messagesEn,
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // Default to Spanish, no localStorage check to avoid hydration issues
  const [locale, setLocaleState] = useState<Locale>('es');

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    if (typeof window !== 'undefined') {
      localStorage.setItem('locale', newLocale);
    }
  };

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = allMessages[locale];
    
    for (const k of keys) {
      value = value?.[k];
      if (!value) break;
    }
    
    return value || key;
  };

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t, messages: allMessages[locale] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}