import { notFound } from "next/navigation";
import { getRequestConfig } from "next-intl/server";
import { locales } from "./i18n";

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locale) notFound();
  if (!locales.includes(locale as any)) notFound();

  return {
    locale: locale as string,
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});
