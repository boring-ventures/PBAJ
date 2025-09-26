"use client";

import { useLanguage } from "@/context/language-context";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StarFilledIcon, QuoteIcon, ArrowRightIcon } from "@radix-ui/react-icons";

export default function DonationTestimonials() {
  const { locale } = useLanguage();

  const caseStudies = [
    {
      title: locale === "es" ? "Red de La Paz" : "La Paz Network",
      location: locale === "es" ? "5 municipios rurales" : "5 rural municipalities",
      initialSituation: locale === "es" 
        ? "Municipios rurales sin acceso a educación sexual integral"
        : "Rural municipalities without access to comprehensive sexual education",
      intervention: locale === "es" 
        ? "Formación de 180+ jóvenes líderes especializados"
        : "Training of 180+ specialized young leaders",
      result: locale === "es" 
        ? "50% reducción en embarazos adolescentes reportados en centros de salud locales"
        : "50% reduction in adolescent pregnancies reported in local health centers",
      impact: "180+",
      color: "#744C7A",
      testimonial: locale === "es"
        ? "El programa transformó completamente nuestra comunidad. Los jóvenes ahora son agentes de cambio real."
        : "The program completely transformed our community. Young people are now real agents of change.",
      author: locale === "es" ? "María Condori, Directora Centro de Salud Pucarani" : "María Condori, Director Pucarani Health Center"
    },
    {
      title: locale === "es" ? "Red de Santa Cruz" : "Santa Cruz Network", 
      location: locale === "es" ? "4 municipios periurbanos" : "4 peri-urban municipalities",
      initialSituation: locale === "es"
        ? "Alta incidencia de violencia de género en comunidades periurbanas"
        : "High incidence of gender violence in peri-urban communities",
      intervention: locale === "es"
        ? "200+ talleres sobre prevención de violencia ejecutados"
        : "200+ violence prevention workshops executed",
      result: locale === "es"
        ? "Creación de 4 casas refugio comunitarias gestionadas por jóvenes"
        : "Creation of 4 community shelter houses managed by youth",
      impact: "200+",
      color: "#D93069",
      testimonial: locale === "es"
        ? "Los jóvenes se convirtieron en defensores de los derechos. La violencia disminuyó significativamente."
        : "Young people became rights defenders. Violence decreased significantly.",
      author: locale === "es" ? "Dr. Carlos Mendoza, Representante UNFPA" : "Dr. Carlos Mendoza, UNFPA Representative"
    },
    {
      title: locale === "es" ? "Material 'Hablemos Claro'" : "'Let's Talk Clearly' Material",
      location: locale === "es" ? "17 municipios a nivel nacional" : "17 municipalities nationwide",
      initialSituation: locale === "es"
        ? "Falta de materiales educativos culturalmente apropiados"
        : "Lack of culturally appropriate educational materials",
      intervention: locale === "es"
        ? "Desarrollo participativo de guía metodológica especializada"
        : "Participatory development of specialized methodological guide",
      result: locale === "es"
        ? "Adoptado como referente nacional por 15+ organizaciones"
        : "Adopted as national reference by 15+ organizations",
      impact: "15+",
      color: "#1BB5A0",
      testimonial: locale === "es"
        ? "Es la herramienta más completa y adaptada a nuestra realidad que existe en Bolivia."
        : "It's the most comprehensive tool adapted to our reality that exists in Bolivia.",
      author: locale === "es" ? "Ana Torrez, Plan International Bolivia" : "Ana Torrez, Plan International Bolivia"
    }
  ];

  const partnerTestimonials = [
    {
      quote: locale === "es"
        ? "Plataforma Boliviana ha demostrado ser un socio estratégico confiable. Su metodología innovadora y resultados medibles los convierten en referentes regionales."
        : "Plataforma Boliviana has proven to be a reliable strategic partner. Their innovative methodology and measurable results make them regional leaders.",
      author: locale === "es" ? "Embajada de Suecia en Bolivia" : "Embassy of Sweden in Bolivia",
      role: locale === "es" ? "Cooperación Internacional" : "International Cooperation",
      logo: "🇸🇪"
    },
    {
      quote: locale === "es"
        ? "Su enfoque par-a-par es único en la región. Los jóvenes formados se convierten en verdaderos multiplicadores de cambio en sus comunidades."
        : "Their peer-to-peer approach is unique in the region. Trained youth become true multipliers of change in their communities.",
      author: "Plan International Bolivia",
      role: locale === "es" ? "Desarrollo Infantil" : "Child Development",
      logo: "🌟"
    },
    {
      quote: locale === "es"
        ? "La calidad técnica de sus materiales educativos y la rigurosidad de su trabajo los posiciona como líderes en educación sexual integral."
        : "The technical quality of their educational materials and the rigor of their work positions them as leaders in comprehensive sexual education.",
      author: "UNFPA Bolivia",
      role: locale === "es" ? "Salud Reproductiva" : "Reproductive Health",
      logo: "🏥"
    }
  ];

  const impactNumbers = [
    {
      number: "809+",
      label: locale === "es" ? "Líderes Transformados" : "Leaders Transformed",
      description: locale === "es" ? "desde 2012" : "since 2012"
    },
    {
      number: "17",
      label: locale === "es" ? "Municipios Impactados" : "Municipalities Impacted", 
      description: locale === "es" ? "en 6 departamentos" : "in 6 departments"
    },
    {
      number: "12",
      label: locale === "es" ? "Años Transformando" : "Years Transforming",
      description: locale === "es" ? "vidas y comunidades" : "lives and communities"
    }
  ];

  return (
    <div className="py-20" style={{ backgroundColor: 'white' }}>
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto space-y-20">

          {/* Section Header */}
          <div className="text-center">
            <Badge 
              className="mb-6 px-6 py-2 text-sm font-semibold border-none"
              style={{ backgroundColor: '#F4B942', color: '#000000' }}
            >
              <StarFilledIcon className="h-4 w-4 mr-2" />
              {locale === "es" ? 'Casos de Éxito' : 'Success Stories'}
            </Badge>
            <h2 
              className="text-4xl md:text-6xl font-bold mb-6"
              style={{ color: '#744C7A' }}
            >
              {locale === "es" ? "Impacto Real y Verificable" : "Real and Verifiable Impact"}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {locale === "es" 
                ? "Historias de transformación que demuestran el poder de la inversión estratégica en desarrollo juvenil"
                : "Transformation stories that demonstrate the power of strategic investment in youth development"
              }
            </p>
          </div>

          {/* Impact Numbers */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {impactNumbers.map((stat, index) => (
              <Card 
                key={index}
                className="text-center p-8 rounded-3xl border-none shadow-lg hover:shadow-xl transition-all duration-300"
                style={{ backgroundColor: '#F8F9FA' }}
              >
                <CardContent className="p-0">
                  <div 
                    className="text-5xl font-bold mb-3"
                    style={{ color: '#744C7A' }}
                  >
                    {stat.number}
                  </div>
                  <h3 className="font-bold text-lg mb-2 text-gray-800">
                    {stat.label}
                  </h3>
                  <p className="text-gray-600">
                    {stat.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Success Stories Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {caseStudies.map((caseStudy, index) => (
              <Card 
                key={index}
                className="rounded-3xl border-none shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
                style={{ backgroundColor: 'white' }}
              >
                <CardContent className="p-8">
                  <div 
                    className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
                    style={{ backgroundColor: `${caseStudy.color}20` }}
                  >
                    <div 
                      className="text-2xl font-bold"
                      style={{ color: caseStudy.color }}
                    >
                      {caseStudy.impact}
                    </div>
                  </div>
                  
                  <h3 
                    className="text-xl font-bold text-center mb-4"
                    style={{ color: caseStudy.color }}
                  >
                    {caseStudy.title}
                  </h3>
                  
                  <p className="text-sm text-gray-600 text-center mb-6">
                    {caseStudy.location}
                  </p>
                  
                  <div 
                    className="p-4 rounded-2xl relative"
                    style={{ backgroundColor: `${caseStudy.color}10` }}
                  >
                    <QuoteIcon 
                      className="h-6 w-6 mb-3 opacity-30"
                      style={{ color: caseStudy.color }}
                    />
                    <blockquote className="text-sm italic mb-3 text-gray-700">
                      "{caseStudy.testimonial}"
                    </blockquote>
                    <cite 
                      className="text-xs font-semibold"
                      style={{ color: caseStudy.color }}
                    >
                      — {caseStudy.author}
                    </cite>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}