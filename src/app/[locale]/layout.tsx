import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import "../globals.css";
import { QueryProvider } from "@/lib/providers/QueryProvider";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/providers/auth-provider";
import { ThemeProvider } from "@/context/theme-context";
import { locales, type Locale } from "@/lib/i18n/config";

const APP_NAME = "Plataforma Boliviana";
const APP_DESCRIPTION = "Construyendo un futuro más justo e inclusivo";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const titles = {
    es: "Plataforma Boliviana",
    en: "Bolivian Platform",
  };

  const descriptions = {
    es: "Construyendo un futuro más justo e inclusivo",
    en: "Building a more just and inclusive future",
  };

  return {
    metadataBase: new URL(`${APP_URL}/${locale}`),
    title: {
      default: titles[locale as keyof typeof titles] || APP_NAME,
      template: `%s | ${titles[locale as keyof typeof titles] || APP_NAME}`,
    },
    description:
      descriptions[locale as keyof typeof descriptions] || APP_DESCRIPTION,
    openGraph: {
      title: titles[locale as keyof typeof titles] || APP_NAME,
      description:
        descriptions[locale as keyof typeof descriptions] || APP_DESCRIPTION,
      url: `${APP_URL}/${locale}`,
      siteName: titles[locale as keyof typeof titles] || APP_NAME,
      locale: locale === "es" ? "es_ES" : "en_US",
      type: "website",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    alternates: {
      languages: {
        es: `${APP_URL}/es`,
        en: `${APP_URL}/en`,
        "x-default": `${APP_URL}/es`,
      },
    },
    icons: {
      icon: "/icon.png",
      shortcut: "/favicon.ico",
      apple: "/apple-icon.png",
      other: {
        rel: "apple-touch-icon",
        url: "/apple-icon.png",
      },
    },
  };
}

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  // Providing all messages to the client side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider defaultTheme="system" storageKey="app-theme">
            <AuthProvider>
              <QueryProvider>
                {children}
                <Toaster />
              </QueryProvider>
            </AuthProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
