"use client";

import { useTranslations, useLocale } from "@/hooks/use-translations";
import UnifiedHero from "@/components/ui/unified-hero";
import { EnvelopeClosedIcon } from "@radix-ui/react-icons";

export default function ContactHero() {
  const t = useTranslations("contact");
  const locale = useLocale();

  return (
    <>
      <UnifiedHero
        title={locale === "es" ? "CONTACTO" : "CONTACT"}
        subtitle={
          locale === "es"
            ? "Conecta con nosotros y sé parte del cambio"
            : "Connect with us and be part of the change"
        }
        backgroundImage="/images/WhatsApp Image 2023-09-06 at 02.38.14_20250701_140828_0000.jpg"
        locale={locale}
        buttonColor="#ffb707"
        buttonHoverColor="#ffc633"
      />

      {/* Contact Methods Section - Now separate from Hero */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <EnvelopeClosedIcon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">
                  {locale === "es" ? "Correo Electrónico" : "Email"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {locale === "es"
                    ? "Respuesta en 24 horas"
                    : "24-hour response"}
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📞</span>
                </div>
                <h3 className="font-semibold text-foreground mb-2">
                  {locale === "es" ? "Teléfono" : "Phone"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {locale === "es"
                    ? "Lun - Vie, 9:00 - 17:00"
                    : "Mon - Fri, 9:00 - 17:00"}
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📍</span>
                </div>
                <h3 className="font-semibold text-foreground mb-2">
                  {locale === "es" ? "Oficina" : "Office"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {locale === "es" ? "La Paz, Bolivia" : "La Paz, Bolivia"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
