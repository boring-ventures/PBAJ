import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/lib/providers/QueryProvider";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/providers/auth-provider";
import { ThemeProvider } from "@/context/theme-context";
import { LanguageProvider } from "@/context/language-context";

const APP_NAME = "PBAJDSDR - Plataforma Boliviana de Adolescentes y Jóvenes";
const APP_DESCRIPTION =
  "Nuestro Compromiso es Ahora - Plataforma Boliviana de Adolescentes y Jóvenes por los Derechos Sexuales y Derechos Reproductivos. Construyendo un futuro más justo e inclusivo para Bolivia.";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: APP_NAME,
    template: `%s | ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
  keywords: [
    "Bolivia",
    "adolescentes",
    "jóvenes",
    "derechos sexuales",
    "derechos reproductivos",
    "desarrollo social",
    "educación",
    "liderazgo juvenil",
    "PBAJDSDR",
    "organización sin fines de lucro",
    "impacto social",
    "transformación comunitaria",
  ],
  authors: [{ name: "PBAJDSDR" }],
  creator:
    "Plataforma Boliviana de Adolescentes y Jóvenes por los Derechos Sexuales y Derechos Reproductivos",
  publisher: "PBAJDSDR",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: APP_NAME,
    description: APP_DESCRIPTION,
    url: APP_URL,
    siteName: APP_NAME,
    locale: "es_ES",
    type: "website",
    images: [
      {
        url: "/images/Screenshot 2025-09-12 145128.png",
        width: 1200,
        height: 630,
        alt: "PBAJDSDR - Plataforma Boliviana de Adolescentes y Jóvenes",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: APP_NAME,
    description: APP_DESCRIPTION,
    images: ["/images/Screenshot 2025-09-12 145128.png"],
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
  icons: {
    icon: [
      { url: "/images/Screenshot 2025-09-12 145128.png", sizes: "32x32", type: "image/png" },
      { url: "/images/Screenshot 2025-09-12 145128.png", sizes: "192x192", type: "image/png" },
    ],
    shortcut: "/images/Screenshot 2025-09-12 145128.png",
    apple: "/images/Screenshot 2025-09-12 145128.png",
    other: [
      {
        rel: "apple-touch-icon",
        url: "/images/Screenshot 2025-09-12 145128.png",
      },
    ],
  },
  manifest: "/manifest.json",
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Root layout with language support
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="light">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <LanguageProvider>
          <ThemeProvider defaultTheme="light" storageKey="app-theme">
            <AuthProvider>
              <QueryProvider>
                {children}
                <Toaster />
              </QueryProvider>
            </AuthProvider>
          </ThemeProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
