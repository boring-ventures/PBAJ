"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import messagesEs from "../../messages/es.json";
import messagesEn from "../../messages/en.json";
import {
  translateContent,
  useTranslation,
} from "@/lib/translation/translation-service";

type Locale = "es" | "en";

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
  messages: any;
  translateText?: (text: string) => Promise<string>;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

const allMessages = {
  es: messagesEs,
  en: messagesEn,
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // Default to Spanish, no localStorage check to avoid hydration issues
  const [locale, setLocaleState] = useState<Locale>("es");

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    if (typeof window !== "undefined") {
      localStorage.setItem("locale", newLocale);
    }
  };

  const t = (key: string): string => {
    const keys = key.split(".");
    let value: any = allMessages[locale];

    for (const k of keys) {
      value = value?.[k];
      if (!value) break;
    }

    return value || key;
  };

  const translateText = async (text: string): Promise<string> => {
    try {
      // Only translate if we're not already in source language and text needs translation
      if (locale !== "es" && text && text.trim().length > 0) {
        return await translateContent(text, locale);
      }
      return text;
    } catch (error) {
      console.error("Translation failed:", error);
      return text;
    }
  };

  return (
    <LanguageContext.Provider
      value={{
        locale,
        setLocale,
        t,
        messages: allMessages[locale],
        translateText:
          process.env.NODE_ENV === "development" ||
          process.env.ENABLE_AUTO_TRANSLATION === "true"
            ? translateText
            : undefined,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
