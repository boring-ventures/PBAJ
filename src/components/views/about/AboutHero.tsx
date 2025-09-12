"use client";

import { useLanguage } from "@/context/language-context";
import UnifiedHero from "@/components/ui/unified-hero";

export default function AboutHero() {
  const { locale } = useLanguage();

  return (
    <UnifiedHero
      title={locale === "es" ? "Quiénes Somos" : "Who We Are"}
      subtitle={
        locale === "es"
          ? [
              "Construyendo un futuro más justo para Bolivia",
              "Empoderando a jóvenes y adolescentes",
              "Defendiendo derechos sexuales y reproductivos",
              "Transformando comunidades con educación",
              "Creando oportunidades para todos",
            ]
          : [
              "Building a more just future for Bolivia",
              "Empowering youth and adolescents",
              "Defending sexual and reproductive rights",
              "Transforming communities through education",
              "Creating opportunities for everyone",
            ]
      }
      backgroundImage="/images/WhatsApp Image 2024-02-17 at 14.29.53_20250630_183520_0000.jpg"
      locale={locale}
      buttonColor="#30ffa8"
      buttonHoverColor="#52ffba"
    />
  );
}
