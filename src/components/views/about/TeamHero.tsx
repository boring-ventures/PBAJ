"use client";

import { useLanguage } from "@/context/language-context";
import UnifiedHero from "@/components/ui/unified-hero";

export default function TeamHero() {
  const { locale } = useLanguage();

  return (
    <UnifiedHero
      title={locale === "es" ? "NUESTRO EQUIPO" : "OUR TEAM"}
      subtitle={
        locale === "es"
          ? [
              "Líderes comprometidos con el desarrollo social",
              "Expertos en gestión y transformación comunitaria",
              "Profesionales especializados en impacto social",
              "Equipo multidisciplinario de alto rendimiento",
              "Unidos por la excelencia y los resultados",
            ]
          : [
              "Leaders committed to social development",
              "Experts in management and community transformation",
              "Professionals specialized in social impact",
              "High-performance multidisciplinary team",
              "United by excellence and results",
            ]
      }
      backgroundImage="/images/WhatsApp Image 2025-08-10 at 21.17.33.jpg"
      locale={locale}
      buttonColor="#744C7A"
      buttonHoverColor="#5A3B85"
    />
  );
}
