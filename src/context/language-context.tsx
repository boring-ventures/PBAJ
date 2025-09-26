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
  isInitialized: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

const allMessages = {
  es: messagesEs,
  en: messagesEn,
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // Initialize with Spanish as default, but check localStorage on client side
  const [locale, setLocaleState] = useState<Locale>("es");
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize from localStorage on client side
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedLocale = localStorage.getItem("locale") as Locale;
      console.log("🌐 Language context initializing...");
      console.log("📦 Saved locale from localStorage:", savedLocale);

      if (savedLocale && (savedLocale === "es" || savedLocale === "en")) {
        console.log("✅ Setting locale from localStorage:", savedLocale);
        setLocaleState(savedLocale);
      } else {
        console.log("⚠️ No valid saved locale, using default: es");
      }
      setIsInitialized(true);
      console.log("🎯 Language context initialized");
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    console.log("🔄 Language change requested:", newLocale);
    setLocaleState(newLocale);
    if (typeof window !== "undefined") {
      localStorage.setItem("locale", newLocale);
      console.log("💾 Saved to localStorage:", newLocale);
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
        isInitialized,
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
