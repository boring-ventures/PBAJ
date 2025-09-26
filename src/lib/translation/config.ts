/**
 * Translation Configuration
 * Controls auto-translation behavior
 */

export const TRANSLATION_CONFIG = {
  // Enable/disable auto-translation
  enabled:
    process.env.NODE_ENV === "development" ||
    process.env.ENABLE_AUTO_TRANSLATION === "true",

  // Translation providers
  providers: {
    // LibreTranslate (free, open source, privacy-focused)
    libreTranslate: {
      url: process.env.LIBRETRANSLATE_URL || "https://libretranslate.org",
      enabled: true,
      rateLimit: 1000, // Max requests per minute
    },

    // Google Translate (paid but more accurate)
    googleTranslate: {
      apiKey: process.env.GOOGLE_TRANSLATE_API_KEY,
      enabled: !!process.env.GOOGLE_TRANSLATE_API_KEY,
      rateLimit: 10000, // Max requests per minute
    },
  },

  // Default source language (assumes content is uploaded in Spanish)
  defaultSourceLanguage: "es" as const,

  // Supported target languages
  supportedLanguages: ["es", "en"] as const,

  // Translation cache settings
  cache: {
    enabled: true,
    ttl: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
    maxSize: 1000, // Maximum cached translations
  },

  // Fields to auto-translate in content objects
  translatableFields: [
    "titleEs",
    "titleEn",
    "contentEs",
    "contentEn",
    "excerptEs",
    "excerptEn",
    "altTextEs",
    "altTextEn",
    "captionEs",
    "captionEn",
    "descriptionEs",
    "descriptionEn",
    "overviewEs",
    "overviewEn",
    "objectivesEs",
    "objectivesEn",
  ],

  // Content types that should be auto-translated
  enabledContentTypes: [
    "news",
    "programs",
    "profiles",
    "publications",
    "media_assets",
  ],

  // Excluded from translation
  skipPatterns: [
    /^https?:\/\//, // URLs
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Emails
    /^<[^>]+>$/, // HTML tags
    /^\d+$/, // Pure numbers
    /^[A-Z]{2,4}$/, // Short acronyms
  ],

  // Rate limiting and error handling
  errorHandling: {
    retryAttempts: 3,
    retryDelay: 1000, // milliseconds
    fallbackToOriginal: true, // Fallback to original text on translation failure
  },
} as const;

export type TranslationProvider = "google" | "libretranslate";
export type SupportedLanguage =
  (typeof TRANSLATION_CONFIG.supportedLanguages)[number];
