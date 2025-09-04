"use client";

import { useTranslations, useLocale } from "@/hooks/use-translations";
import UnifiedHero from "@/components/ui/unified-hero";
import { Badge } from "@/components/ui/badge";

export default function ResourcesHero() {
  const t = useTranslations("resources");
  const locale = useLocale() || "es";

  return (
    <>
      <UnifiedHero
        title={locale === "es" ? "RECURSOS" : "RESOURCES"}
        subtitle={locale === "es" 
          ? [
              "Documentos y materiales educativos accesibles",
              "Recursos multimedia para la comunidad",
              "Guías prácticas para el desarrollo social",
              "Reportes de investigación y análisis",
              "Herramientas para el empoderamiento juvenil"
            ]
          : [
              "Accessible documents and educational materials",
              "Multimedia resources for the community",
              "Practical guides for social development",
              "Research reports and analysis",
              "Tools for youth empowerment"
            ]
        }
        backgroundImage="https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=2070&auto=format&fit=crop"
        locale={locale}
        buttonColor="#30ffa8"
        buttonHoverColor="#52ffba"
      />
      
      {/* Resource Categories Section - Now separate from Hero */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                <span>
                  {locale === "es" ? "Recursos Disponibles" : "Available Resources"}
                </span>
              </div>
            </div>
            
            <div className="flex flex-wrap justify-center gap-3">
              {[
                { category: "MULTIMEDIA", es: "Multimedia", en: "Multimedia" },
                { category: "DOCUMENTS", es: "Documentos", en: "Documents" },
                { category: "EDUCATIONAL", es: "Educativo", en: "Educational" },
                { category: "REPORTS", es: "Reportes", en: "Reports" },
                { category: "GUIDES", es: "Guías", en: "Guides" },
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