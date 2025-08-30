"use client";

import { useLanguage } from "@/context/language-context";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Target, Users, Globe } from "lucide-react";

export default function ProgramsSection() {
  const { locale, t } = useLanguage();

  const programHighlights = [
    {
      icon: Target,
      title: locale === "es" ? "Impacto Directo" : "Direct Impact",
      description: locale === "es" 
        ? "Programas diseñados para generar cambios tangibles en las comunidades"
        : "Programs designed to generate tangible changes in communities",
    },
    {
      icon: Users,
      title: locale === "es" ? "Enfoque Participativo" : "Participatory Approach",
      description: locale === "es"
        ? "Involucramos a las comunidades en todas las etapas del proceso"
        : "We involve communities at all stages of the process",
    },
    {
      icon: Globe,
      title: locale === "es" ? "Alcance Regional" : "Regional Reach",
      description: locale === "es"
        ? "Presencia en múltiples regiones con programas adaptados localmente"
        : "Presence in multiple regions with locally adapted programs",
    },
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {t("homepage.featuredPrograms")}
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            {locale === "es"
              ? "Implementamos programas innovadores que abordan los desafíos más apremiantes de nuestras comunidades, creando oportunidades de desarrollo sostenible y transformación social."
              : "We implement innovative programs that address the most pressing challenges in our communities, creating opportunities for sustainable development and social transformation."}
          </p>
        </div>

        {/* Program Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {programHighlights.map((highlight, index) => {
            const Icon = highlight.icon;
            return (
              <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 bg-primary/10 rounded-full">
                      <Icon className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{highlight.title}</h3>
                  <p className="text-sm text-gray-600">{highlight.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <p className="text-gray-600 mb-6">
            {locale === "es"
              ? "Explora todos nuestros programas activos y descubre cómo estamos generando impacto positivo en las comunidades."
              : "Explore all our active programs and discover how we are generating positive impact in communities."}
          </p>
          <Button asChild size="lg" className="group">
            <Link href="/programs">
              {locale === "es" ? "Ver Todos los Programas" : "View All Programs"}
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
