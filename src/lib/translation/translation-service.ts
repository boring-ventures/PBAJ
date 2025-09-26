/**
 * Auto-translation service
 * Supports both Google Translate API and LibreTranslate
 */

import type { Locale } from "../i18n/config";

export interface TranslationOptions {
  sourceLang?: Locale;
  targetLocale: Locale;
  preserveFormatting?: boolean;
}

export interface TranslationService {
  translateText(text: string, options: TranslationOptions): Promise<string>;
  isTextTranslatable(text: string): boolean;
}

class TranslationAPI implements TranslationService {
  private apiKey?: string;
  private baseUrl?: string;

  constructor(
    private provider: "google" | "libretranslate" = "libretranslate",
    options?: {
      googleApiKey?: string;
      libreTranslateUrl?: string;
    }
  ) {
    this.apiKey = options?.googleApiKey;
    this.baseUrl = options?.libreTranslateUrl;
  }

  async translateText(
    text: string,
    options: TranslationOptions
  ): Promise<string> {
    if (!this.isTextTranslatable(text)) {
      return text;
    }

    const { sourceLang = "es", targetLocale } = options;

    if (sourceLang === targetLocale) {
      return text;
    }

    try {
      if (this.provider === "google" && this.apiKey) {
        return await this.translateWithGoogle(text, sourceLang, targetLocale);
      } else if (this.provider === "libretranslate" && this.baseUrl) {
        return await this.translateWithLibre(text, sourceLang, targetLocale);
      } else {
        console.warn("No translation provider configured properly");
        return text;
      }
    } catch (error) {
      console.error("Translation error:", error);
      return text;
    }
  }

  private async translateWithGoogle(
    text: string,
    sourceLang: string,
    targetLocale: string
  ): Promise<string> {
    try {
      // Use Google Translate API directly
      const response = await fetch(
        `https://translation.googleapis.com/language/translate/v2?key=${this.apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            q: text,
            source: sourceLang,
            target: targetLocale,
            format: "html",
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Google Translate API error: ${response.status}`);
      }

      const data = await response.json();
      return data.data.translations[0].translatedText;
    } catch (error) {
      console.error("Google Translate error:", error);
      return text;
    }
  }

  private async translateWithLibre(
    text: string,
    sourceLang: string,
    targetLocale: string
  ): Promise<string> {
    const formData = new FormData();
    formData.append("q", text);
    formData.append("source", sourceLang);
    formData.append("target", targetLocale);
    formData.append("format", "html");

    const response = await fetch(`${this.baseUrl}/translate`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`LibreTranslate API error: ${response.status}`);
    }

    const data = await response.json();
    return data.translatedText;
  }

  isTextTranslatable(text: string): boolean {
    if (!text || typeof text !== "string") return false;

    // Skip translation for URLs, emails, tags, etc.
    const skipPatterns = [
      /^https?:\/\//, // URLs
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Emails
      /^<[^>]+>$/, // HTML tags
      /^\d+$/, // Pure numbers
    ];

    return !skipPatterns.some((pattern) => pattern.test(text.trim()));
  }
}

// Create translation service instances
export const createTranslationService = (
  provider: "google" | "libretranslate" = "libretranslate"
) => {
  const options = {
    // Google API Key - add to .env file
    googleApiKey: process.env.GOOGLE_TRANSLATE_API_KEY,
    // LibreTranslate instance - you can use public service or host your own
    libreTranslateUrl:
      process.env.LIBRETRANSLATE_URL || "https://libretranslate.org",
  };

  return new TranslationAPI(provider, options);
};

// Utility functions for easy translation
export const translateContent = async (
  content: string,
  targetLocale: Locale,
  provider: "google" | "libretranslate" = "libretranslate"
): Promise<string> => {
  const service = createTranslationService(provider);
  return await service.translateText(content, { targetLocale });
};

export const translateObjectFields = async <T extends Record<string, any>>(
  obj: T,
  fields: (keyof T)[],
  targetLocale: Locale,
  provider: "google" | "libretranslate" = "libretranslate"
): Promise<T> => {
  const service = createTranslationService(provider);
  const result = { ...obj };

  for (const field of fields) {
    if (obj[field] && typeof obj[field] === "string") {
      try {
        result[field] = (await service.translateText(obj[field] as string, {
          targetLocale,
        })) as T[typeof field];
      } catch (error) {
        console.error(`Translation failed for field ${String(field)}:`, error);
        result[field] = obj[field]; // Fallback to original
      }
    }
  }

  return result;
};

// Main translateText function for use by the content-translation helpers
export const translateText = async (
  text: string,
  options: { targetLocale: Locale; sourceLocale?: Locale }
): Promise<string> => {
  const service = createTranslationService();
  return service.translateText(text, { ...options });
};

// Hook for React components
export const useTranslation = () => {
  const translate = async (
    text: string,
    targetLocale: Locale
  ): Promise<string> => {
    return translateContent(text, targetLocale);
  };

  const translateObject = async <T extends Record<string, any>>(
    obj: T,
    fields: (keyof T)[],
    targetLocale: Locale
  ): Promise<T> => {
    return translateObjectFields(obj, fields, targetLocale);
  };

  return { translate, translateObject };
};
