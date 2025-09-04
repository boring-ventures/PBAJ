"use client";

import { useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { GlowCard } from "@/components/spotlight-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  PersonIcon,
  GlobeIcon,
  FileTextIcon,
  HeartIcon,
  ArrowRightIcon,
  StarFilledIcon,
  CheckCircledIcon
} from "@radix-ui/react-icons";

export default function DonationImpact() {
  const params = useParams();
  const locale = params.locale as string;


  const roi = [
    {
      icon: PersonIcon,
      metric: "$180",
      label: locale === "es" ? "por joven líder formado" : "per young leader trained",
      description: locale === "es" ? "Formación integral completa" : "Complete comprehensive training"
    },
    {
      icon: GlobeIcon,
      metric: "$8,000",
      label: locale === "es" ? "por municipio impactado" : "per municipality impacted",
      description: locale === "es" ? "Red juvenil sostenible" : "Sustainable youth network"
    },
    {
      icon: FileTextIcon,
      metric: "$50,000",
      label: locale === "es" ? "incidencia en política pública" : "public policy advocacy",
      description: locale === "es" ? "Cambio sistémico regional" : "Regional systemic change"
    }
  ];

  const recognitions = [
    {
      title: locale === "es" ? "Plan International" : "Plan International",
      description: locale === "es" ? "Socio estratégico desde 2018" : "Strategic partner since 2018"
    },
    {
      title: locale === "es" ? "Embajada de Suecia" : "Embassy of Sweden", 
      description: locale === "es" ? "Cooperación bilateral" : "Bilateral cooperation"
    },
    {
      title: locale === "es" ? "UNFPA Bolivia" : "UNFPA Bolivia",
      description: locale === "es" ? "Colaboración regional DSDR" : "Regional SRHR collaboration"
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
              {locale === "es" ? 'El Impacto de tu Donación' : 'The Impact of Your Donation'}
            </Badge>
            <h2 
              className="text-4xl md:text-6xl font-bold mb-6"
              style={{ color: '#744C7A' }}
            >
              {locale === "es" ? "Transforma Vidas" : "Transform Lives"}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {locale === "es" 
                ? "Cada boliviano que donas se traduce en cambios reales y medibles en las comunidades"
                : "Every boliviano you donate translates into real and measurable changes in communities"
              }
            </p>
          </div>

          {/* ROI Section */}
          <div>
            <div className="text-center mb-12">
              <h3 
                className="text-3xl md:text-4xl font-bold mb-4"
                style={{ color: '#744C7A' }}
              >
                {locale === "es" ? "Retorno de Inversión Social" : "Social Return on Investment"}
              </h3>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {locale === "es" 
                  ? "Métricas de impacto transparentes por cada dólar invertido"
                  : "Transparent impact metrics per dollar invested"
                }
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {roi.map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <GlowCard 
                    key={index}
                    glowColor="purple"
                    customSize={true}
                    className="text-center p-8 bg-white/80 backdrop-blur-sm hover:bg-white/90 transition-all duration-300"
                  >
                    <div className="flex flex-col items-center justify-center h-full">
                      <div 
                        className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
                        style={{ backgroundColor: 'rgba(116, 76, 122, 0.1)' }}
                      >
                        <IconComponent 
                          className="h-8 w-8"
                          style={{ color: '#744C7A' }}
                        />
                      </div>
                      <div 
                        className="text-3xl font-bold mb-2"
                        style={{ color: '#744C7A' }}
                      >
                        {item.metric}
                      </div>
                      <h4 className="font-semibold text-gray-800 mb-2">
                        {item.label}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {item.description}
                      </p>
                    </div>
                  </GlowCard>
                );
              })}
            </div>
          </div>

          {/* Transparency Statement */}
          <Card 
            className="p-12 rounded-3xl border-none shadow-lg"
            style={{ backgroundColor: '#262626' }}
          >
            <CardContent className="p-0 text-center">
              <h3 
                className="text-3xl font-bold mb-8"
                style={{ color: '#744C7A' }}
              >
                {locale === "es" ? "Transparencia Total" : "Full Transparency"}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div 
                    className="text-4xl font-bold mb-2 text-white"
                  >
                    95%
                  </div>
                  <p className="text-white">
                    {locale === "es" ? "Se destina directamente a programas" : "Goes directly to programs"}
                  </p>
                </div>
                <div className="text-center">
                  <div 
                    className="text-4xl font-bold mb-2 text-white"
                  >
                    5%
                  </div>
                  <p className="text-white">
                    {locale === "es" ? "Gastos administrativos mínimos" : "Minimal administrative expenses"}
                  </p>
                </div>
                <div className="text-center">
                  <div 
                    className="text-4xl font-bold mb-2 text-white"
                  >
                    100%
                  </div>
                  <p className="text-white">
                    {locale === "es" ? "Transparencia en reportes" : "Transparency in reports"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}