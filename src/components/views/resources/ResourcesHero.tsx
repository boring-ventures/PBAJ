"use client";

import { useTranslations, useLocale } from "@/hooks/use-translations";
import { Badge } from "@/components/ui/badge";

export default function ResourcesHero() {
  const t = useTranslations("resources");
  const locale = useLocale() || "es";

  return (
    <section className="relative bg-gradient-to-br from-primary/5 via-background to-secondary/10 py-16 lg:py-24">
      <div className="absolute inset-0 bg-grid-black/[0.02] -z-10" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <span>
              {locale === "es" ? "Recursos Disponibles" : "Available Resources"}
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
            {locale === "es" ? "Recursos" : "Resources"}
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            {locale === "es"
              ? "Explora nuestra colección de recursos multimedia, documentos y materiales educativos disponibles para la comunidad."
              : "Explore our collection of multimedia resources, documents and educational materials available to the community."}
          </p>

          {/* Resource Categories Overview */}
          <div className="flex flex-wrap justify-center gap-3 mt-12">
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
  );
}