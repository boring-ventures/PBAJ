"use client";

import { useTranslations, useLocale } from "@/hooks/use-translations";
import UnifiedHero from "@/components/ui/unified-hero";
import { Badge } from "@/components/ui/badge";

export default function NewsHero() {
  const t = useTranslations("news");
  const locale = useLocale() || "es";

  return (
    <>
      <UnifiedHero
        title={locale === "es" ? "NOTICIAS" : "NEWS"}
        subtitle={
          locale === "es"
            ? [
                "Las últimas noticias del desarrollo social boliviano",
                "Campañas que transforman realidades",
                "Logros y avances de nuestros programas",
                "Eventos que marcan la diferencia",
                "Historias de impacto en las comunidades",
              ]
            : [
                "Latest news from Bolivian social development",
                "Campaigns that transform realities",
                "Achievements and progress of our programs",
                "Events that make a difference",
                "Impact stories from communities",
              ]
        }
        backgroundImage="/images/WhatsApp Image 2023-06-28 at 16.20.51 (1)_20250701_140915_0000.jpg"
        locale={locale}
        buttonColor="#420ff4"
        buttonHoverColor="#5d2bff"
      />

      {/* News Categories Section - Now separate from Hero */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                <span>
                  {locale === "es" ? "Mantente Informado" : "Stay Informed"}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-3">
              {[
                { category: "PROGRAMS", es: "Programas", en: "Programs" },
                { category: "CAMPAIGNS", es: "Campañas", en: "Campaigns" },
                { category: "ACHIEVEMENTS", es: "Logros", en: "Achievements" },
                { category: "EVENTS", es: "Eventos", en: "Events" },
                {
                  category: "PARTNERSHIPS",
                  es: "Alianzas",
                  en: "Partnerships",
                },
              ].map((item) => (
                <Badge
                  key={item.category}
                  variant="secondary"
                  className="px-4 py-2"
                >
                  {locale === "es" ? item.es : item.en}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
