"use client";

import { useLanguage } from "@/context/language-context";
import UnifiedHero from "@/components/ui/unified-hero";

export default function TransparencyHero() {
  const { locale } = useLanguage();

  return (
    <UnifiedHero
      title={locale === "es" ? "TRANSPARENCIA" : "TRANSPARENCY"}
      subtitle={
        locale === "es"
          ? [
              "Compromiso absoluto con la rendición de cuentas",
              "Información abierta y accesible para todos",
              "Gestión responsable de recursos públicos",
              "Transparencia como base de la confianza",
              "Construyendo credibilidad con hechos",
            ]
          : [
              "Absolute commitment to accountability",
              "Open and accessible information for all",
              "Responsible management of public resources",
              "Transparency as the foundation of trust",
              "Building credibility with facts",
            ]
      }
      backgroundImage="/images/WhatsApp Image 2023-04-02 at 14.22.38 (1)_20250701_141247_0000.jpg"
      locale={locale}
      buttonColor="#ffb707"
      buttonHoverColor="#ffc633"
    />
  );
}
