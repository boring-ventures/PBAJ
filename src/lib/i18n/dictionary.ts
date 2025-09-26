import { useTranslations } from "@/hooks/use-translations";
import type { Locale } from "./config";

// Type definitions for our translation keys
export type TranslationKey =
  | "navigation"
  | "common"
  | "homepage"
  | "about"
  | "programs"
  | "news"
  | "library"
  | "gallery"
  | "contact"
  | "donate"
  | "admin";

// Hook to get translations for a specific namespace
export function useDict(namespace: TranslationKey) {
  return useTranslations(namespace);
}

// Utility function to get localized content from single database field
// Auto-translation will handle the language conversion if needed
export function getLocalizedContent(
  content: Record<string, unknown>,
  locale: Locale,
  field: string
): string {
  // With new single-language schema, just return the field value directly
  // Auto-translation service will handle the language conversion
  return String(content[field] || "");
}

// Helper function to get the opposite locale
export function getAlternateLocale(currentLocale: Locale): Locale {
  return currentLocale === "es" ? "en" : "es";
}

// Format date according to locale
export function formatLocalizedDate(
  date: Date,
  locale: Locale,
  options?: Intl.DateTimeFormatOptions
): string {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  const formatOptions = { ...defaultOptions, ...options };

  return new Intl.DateTimeFormat(
    locale === "es" ? "es-ES" : "en-US",
    formatOptions
  ).format(date);
}

// Format numbers according to locale
export function formatLocalizedNumber(number: number, locale: Locale): string {
  return new Intl.NumberFormat(locale === "es" ? "es-ES" : "en-US").format(
    number
  );
}

// Get language direction (for future RTL support if needed)
export function getTextDirection(): "ltr" | "rtl" {
  return "ltr"; // Spanish and English are both LTR
}

// Validate if a string is a valid locale
export function isValidLocale(locale: string): locale is Locale {
  return ["es", "en"].includes(locale);
}

// Get browser preferred language
export function getBrowserLocale(): Locale {
  if (typeof window !== "undefined") {
    const browserLang = navigator.language.split("-")[0];
    return isValidLocale(browserLang) ? browserLang : "es";
  }
  return "es";
}

// Translation keys for status enums from database
export const statusTranslations = {
  news: {
    DRAFT: { es: "Borrador", en: "Draft" },
    SCHEDULED: { es: "Programado", en: "Scheduled" },
    PUBLISHED: { es: "Publicado", en: "Published" },
    ARCHIVED: { es: "Archivado", en: "Archived" },
  },
  program: {
    PLANNING: { es: "Planificación", en: "Planning" },
    ACTIVE: { es: "Activo", en: "Active" },
    COMPLETED: { es: "Completado", en: "Completed" },
    PAUSED: { es: "Pausado", en: "Paused" },
    CANCELLED: { es: "Cancelado", en: "Cancelled" },
  },
  publication: {
    DRAFT: { es: "Borrador", en: "Draft" },
    REVIEW: { es: "En Revisión", en: "Under Review" },
    PUBLISHED: { es: "Publicado", en: "Published" },
    ARCHIVED: { es: "Archivado", en: "Archived" },
  },
} as const;

// Category translations
export const categoryTranslations = {
  news: {
    CAMPAIGN: { es: "Campaña", en: "Campaign" },
    UPDATE: { es: "Actualización", en: "Update" },
    EVENT: { es: "Evento", en: "Event" },
    ANNOUNCEMENT: { es: "Anuncio", en: "Announcement" },
    PRESS_RELEASE: { es: "Comunicado de Prensa", en: "Press Release" },
  },
  program: {
    ADVOCACY: { es: "Incidencia", en: "Advocacy" },
    RESEARCH: { es: "Investigación", en: "Research" },
    EDUCATION: { es: "Educación", en: "Education" },
    COMMUNITY_OUTREACH: { es: "Alcance Comunitario", en: "Community Outreach" },
    POLICY_DEVELOPMENT: {
      es: "Desarrollo de Políticas",
      en: "Policy Development",
    },
    CAPACITY_BUILDING: {
      es: "Fortalecimiento de Capacidades",
      en: "Capacity Building",
    },
  },
  publication: {
    RESEARCH_PAPER: { es: "Documento de Investigación", en: "Research Paper" },
    REPORT: { es: "Informe", en: "Report" },
    INFOGRAPHIC: { es: "Infografía", en: "Infographic" },
    POLICY_BRIEF: { es: "Resumen de Política", en: "Policy Brief" },
    GUIDE: { es: "Guía", en: "Guide" },
    PRESENTATION: { es: "Presentación", en: "Presentation" },
    VIDEO: { es: "Video", en: "Video" },
    PODCAST: { es: "Podcast", en: "Podcast" },
  },
} as const;

// Helper function to get translated status
export function getTranslatedStatus(
  type: "news" | "program" | "publication",
  status: string,
  locale: Locale
): string {
  const translations = statusTranslations[type] as Record<
    string,
    Record<string, string>
  >;
  return translations[status]?.[locale] || status;
}

// Helper function to get translated category
export function getTranslatedCategory(
  type: "news" | "program" | "publication",
  category: string,
  locale: Locale
): string {
  const translations = categoryTranslations[type] as Record<
    string,
    Record<string, string>
  >;
  return translations[category]?.[locale] || category;
}
