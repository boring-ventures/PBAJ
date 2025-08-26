import { getRequestConfig } from "next-intl/server";
import { notFound } from "next/navigation";

// Can be imported from a shared config
export const locales = ["es", "en"] as const;
export const defaultLocale = "es" as const;

export type Locale = (typeof locales)[number];

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as Locale)) notFound();

  return {
    messages: (await import(`../../../messages/${locale}.json`)).default,
  };
});

// Configuration for next-intl
export const i18nConfig = {
  locales,
  defaultLocale,
  localePrefix: "always" as const,
  pathnames: {
    "/": "/",
    "/about": {
      es: "/acerca-de",
      en: "/about",
    },
    "/programs": {
      es: "/programas",
      en: "/programs",
    },
    "/news": {
      es: "/noticias",
      en: "/news",
    },
    "/library": {
      es: "/biblioteca",
      en: "/library",
    },
    "/gallery": {
      es: "/galeria",
      en: "/gallery",
    },
    "/opinion": {
      es: "/opinion",
      en: "/opinion",
    },
    "/contact": {
      es: "/contacto",
      en: "/contact",
    },
    "/donate": {
      es: "/donar",
      en: "/donate",
    },
  } as const,
};

export function getLocalizedUrl(pathname: string, locale: Locale): string {
  const pathnames = i18nConfig.pathnames;

  // Find the pathname key that matches the current path in any locale
  for (const [key, localizedPaths] of Object.entries(pathnames)) {
    if (typeof localizedPaths === "object" && localizedPaths !== null) {
      if (
        Object.values(localizedPaths).includes(pathname) ||
        key === pathname
      ) {
        return localizedPaths[locale] || key;
      }
    } else if (key === pathname) {
      return pathname;
    }
  }

  return pathname;
}