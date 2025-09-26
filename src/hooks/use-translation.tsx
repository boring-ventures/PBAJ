/**
 * React hook for easy auto-translation integration
 */

"use client";

import { useState, useEffect, useCallback } from "react";
import { useLanguage } from "@/context/language-context";
import { translateContent } from "@/lib/translation/translation-service";

interface UseTranslationResult {
  translateText: (text: string) => Promise<string>;
  translateFields: (
    obj: Record<string, any>,
    fields: string[]
  ) => Promise<Record<string, any>>;
  autoTranslate: boolean;
  setAutoTranslate: (enable: boolean) => void;
}

export function useTranslation(): UseTranslationResult {
  const { locale, translateText: contextTranslateText } = useLanguage();
  const [autoTranslate, setAutoTranslate] = useState(
    process.env.NODE_ENV === "development" ||
      process.env.NEXT_PUBLIC_ENABLE_AUTO_TRANSLATION === "true"
  );

  const translateContentText = useCallback(
    async (text: string): Promise<string> => {
      if (!autoTranslate || !text || text.trim().length === 0) {
        return text;
      }

      try {
        if (contextTranslateText) {
          return await contextTranslateText(text);
        }

        return await translateContent(text, locale);
      } catch (error) {
        console.error("Translation failed:", error);
        return text;
      }
    },
    [autoTranslate, locale, contextTranslateText]
  );

  const translateFields = useCallback(
    async (
      obj: Record<string, any>,
      fields: string[]
    ): Promise<Record<string, any>> => {
      if (!autoTranslate) {
        return obj;
      }

      const translated = { ...obj };

      for (const field of fields) {
        const value = obj[field];
        if (value && typeof value === "string" && value.trim().length > 0) {
          try {
            translated[field] = await translateContentText(value);
          } catch (error) {
            console.error(`Translation failed for field ${field}:`, error);
            translated[field] = value; // Fallback to original
          }
        }
      }

      return translated;
    },
    [autoTranslate, translateContentText]
  );

  return {
    translateText: translateContentText,
    translateFields,
    autoTranslate,
    setAutoTranslate,
  };
}

export default useTranslation;
