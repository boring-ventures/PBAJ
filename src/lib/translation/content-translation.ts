/**
 * Content Translation Utilities
 * Automatically translates content based on locale
 */

import type { Locale } from "../i18n/config";
import { translateText } from "./translation-service";

export interface TranslatableContent {
  title?: string;
  content?: string;
  excerpt?: string | null | undefined;
  altText?: string;
  caption?: string;
  description?: string;
  abstract?: string;
  overview?: string;
  objectives?: string;
}

/**
 * Auto-translates content based on the target locale
 * With single-language content, we translate the entire fields directly
 */
export async function translateIfNeeded<T extends TranslatableContent>(
  content: T,
  targetLocale: Locale,
  autoTranslate: boolean = true
): Promise<T> {
  if (!autoTranslate || targetLocale === "es") {
    return content;
  }

  const result = { ...content };
  const sourceLocale = "es";

  const translatableFields: (keyof TranslatableContent)[] = [
    "title",
    "content",
    "excerpt",
    "altText",
    "caption",
    "description",
    "abstract",
    "overview",
    "objectives",
  ];

  for (const field of translatableFields) {
    const fieldValue = result[field];
    if (fieldValue && typeof fieldValue === "string" && fieldValue.trim()) {
      try {
        const translatedValue = await translateText(fieldValue, {
          targetLocale,
          sourceLocale,
        });

        if (translatedValue && translatedValue !== fieldValue) {
          // just update the field safely
          result[field] = (translatedValue || fieldValue || "") as any;
        }
      } catch (error) {
        console.error(`Translation failed for field ${String(field)}:`, error);
        // Keep original value if translation fails
      }
    }
  }

  return result;
}

/**
 * Hook for React components - provides translation with locale context
 */
export function useTranslator() {
  return {
    /**
     * Translate content fields based on locale
     */
    translateContent: async <T extends TranslatableContent>(
      content: T,
      targetLocale: Locale,
      autoTranslate: boolean = true
    ): Promise<T> => {
      return translateIfNeeded(content, targetLocale, autoTranslate);
    },

    /**
     * Get the best available content for a locale
     */
    getLocalizedContent: <T extends TranslatableContent>(
      content: T,
      targetLocale: Locale
    ) => {
      const prefix = targetLocale === "en" ? "En" : "Es";
      const fallbackPrefix = targetLocale === "en" ? "Es" : "En";

      const title =
        content[`title${prefix}` as keyof T] ||
        content[`title${fallbackPrefix}` as keyof T];
      const contentText =
        content[`content${prefix}` as keyof T] ||
        content[`content${fallbackPrefix}` as keyof T];
      const excerpt =
        content[`excerpt${prefix}` as keyof T] ||
        content[`excerpt${fallbackPrefix}` as keyof T];

      return {
        title: title || "",
        content: contentText || "",
        excerpt: excerpt || "",
        hasLocalizedVersion: Boolean(content[`title${prefix}` as keyof T]),
      };
    },

    /**
     * Check if auto-translation should be enabled
     */
    shouldAutoTranslate: (): boolean => {
      return (
        process.env.NODE_ENV === "development" ||
        process.env.ENABLE_AUTO_TRANSLATION === "true"
      );
    },
  };
}

/**
 * Enhanced content utils with auto-translation
 */
export const ContentTranslationHelper = {
  async translateNewsObject(news: any, targetLocale: Locale): Promise<any> {
    return translateIfNeeded(news, targetLocale);
  },

  async translateProgramObject(
    program: any,
    targetLocale: Locale
  ): Promise<any> {
    return translateIfNeeded(program, targetLocale);
  },

  async translateLibraryObject(
    publication: any,
    targetLocale: Locale
  ): Promise<any> {
    return translateIfNeeded(publication, targetLocale);
  },
};
