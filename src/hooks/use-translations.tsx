'use client';

import { useLanguage } from '@/context/language-context';

export function useTranslations(namespace?: string) {
  const { t, messages } = useLanguage();
  
  if (!namespace) {
    return (key: string) => t(key);
  }
  
  return (key: string) => {
    const fullKey = `${namespace}.${key}`;
    const keys = fullKey.split('.');
    let value: any = messages;
    
    for (const k of keys) {
      value = value?.[k];
      if (!value) break;
    }
    
    return value || key;
  };
}

// Hook to get current locale
export function useLocale() {
  const { locale } = useLanguage();
  return locale;
}