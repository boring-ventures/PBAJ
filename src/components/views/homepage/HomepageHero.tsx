"use client";

import { useLanguage } from "@/context/language-context";
import { Button } from "@/components/ui/button";
import { ChevronRight, Play } from "lucide-react";
import Link from "next/link";

export default function HomepageHero() {
  const { locale, t } = useLanguage();

  return (
    <section className="relative bg-gradient-to-br from-blue-50 via-white to-blue-50 pt-24 pb-20 lg:pt-32 lg:pb-32">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-slate-200/20 -z-10" />
      <div className="absolute inset-0 bg-gradient-to-t from-white/50 to-transparent -z-10" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center px-6 py-3 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold mb-8 border border-blue-200">
            <span className="relative">
              <span className="absolute -left-2 -top-1 w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
              {t("homepage.subtitle")}
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-8 leading-tight">
            {t("PBAJ")}
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
            {t("Plataforma Juvenil de Acción Juvenil")}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <Button
              asChild
              size="lg"
              className="group bg-blue-600 hover:bg-blue-700 text-lg px-8 py-4 h-auto"
            >
              <Link href="/programs">
                {t("homepage.hero.cta")}
                <ChevronRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="group text-lg px-8 py-4 h-auto border-gray-300"
            >
              <Play className="mr-2 h-5 w-5" />
              {locale === "es"
                ? "Ver video institucional"
                : "Watch institutional video"}
            </Button>
          </div>

          {/* Stats Preview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 pt-16 border-t border-gray-200">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-blue-600 mb-3">
                50+
              </div>
              <div className="text-base text-gray-600 font-medium">
                {locale === "es" ? "Programas Activos" : "Active Programs"}
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-blue-600 mb-3">
                10K+
              </div>
              <div className="text-base text-gray-600 font-medium">
                {locale === "es" ? "Personas Beneficiadas" : "People Benefited"}
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-blue-600 mb-3">
                25+
              </div>
              <div className="text-base text-gray-600 font-medium">
                {locale === "es" ? "Publicaciones" : "Publications"}
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-blue-600 mb-3">
                15+
              </div>
              <div className="text-base text-gray-600 font-medium">
                {locale === "es"
                  ? "Años de Experiencia"
                  : "Years of Experience"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
