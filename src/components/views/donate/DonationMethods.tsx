"use client";

import { useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowRightIcon,
  StarFilledIcon,
  PersonIcon,
  HeartIcon,
  GlobeIcon
} from "@radix-ui/react-icons";
import { Features } from "@/components/features-8";

export default function DonationMethods() {
  const params = useParams();
  const locale = params.locale as string;

  const donationTiers = [
    {
      amount: locale === "es" ? "50 Bs" : "$7 USD",
      impact: locale === "es" 
        ? "Proporciona material escolar para un niño por un mes"
        : "Provides school supplies for one child for a month",
      icon: "📚",
      color: "#744C7A"
    },
    {
      amount: locale === "es" ? "200 Bs" : "$29 USD",
      impact: locale === "es" 
        ? "Cubre una consulta médica básica con medicamentos"
        : "Covers a basic medical consultation with medicines",
      icon: "🏥",
      color: "#D93069"
    },
    {
      amount: locale === "es" ? "500 Bs" : "$72 USD",
      impact: locale === "es" 
        ? "Financia un taller de capacitación para una familia"
        : "Funds a training workshop for one family",
      icon: "👨‍👩‍👧‍👦",
      color: "#1BB5A0"
    },
    {
      amount: locale === "es" ? "1,000 Bs" : "$144 USD",
      impact: locale === "es" 
        ? "Apoya la construcción de una letrina ecológica"
        : "Supports the construction of an ecological latrine",
      icon: "🏗️",
      color: "#F4B942"
    },
    {
      amount: locale === "es" ? "3,500 Bs" : "$504 USD",
      impact: locale === "es" 
        ? "Equipa completamente un aula rural con pupitres y pizarra"
        : "Fully equips a rural classroom with desks and blackboard",
      icon: "🎓",
      color: "#5A3B85"
    },
    {
      amount: locale === "es" ? "7,000 Bs" : "$1,008 USD",
      impact: locale === "es" 
        ? "Financia un microproyecto productivo para una comunidad"
        : "Funds a productive micro-project for a community",
      icon: "🌱",
      color: "#744C7A"
    }
  ];

  return (
    <div className="py-20" style={{ backgroundColor: '#F8F9FA' }}>
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto space-y-20">

          {/* Features Section */}
          <Features locale={locale} />


          {/* Contact Banner with Background Image */}
          <div 
            className="relative rounded-3xl overflow-hidden shadow-2xl"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1559027615-cd4628902d4a?q=80&w=2070&auto=format&fit=crop')",
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <div 
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(135deg, rgba(116, 76, 122, 0.9) 0%, rgba(90, 59, 133, 0.8) 100%)'
              }}
            />
            
            <div className="relative z-10 p-12 text-center text-white">
              <h3 className="text-3xl md:text-4xl font-bold mb-6">
                {locale === "es" ? "¿Listo para Hacer la Diferencia?" : "Ready to Make a Difference?"}
              </h3>
              <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
                {locale === "es" 
                  ? "Contáctanos para conocer más formas de apoyar y ser parte del cambio en Bolivia"
                  : "Contact us to learn more ways to support and be part of the change in Bolivia"
                }
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 max-w-2xl mx-auto">
                <div className="text-center">
                  <div className="text-3xl mb-3">📧</div>
                  <h4 className="font-bold text-lg mb-2">
                    {locale === "es" ? "Email" : "Email"}
                  </h4>
                  <p className="opacity-90">
                    plataformaboliviana@gmail.com
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-3xl mb-3">📍</div>
                  <h4 className="font-bold text-lg mb-2">
                    {locale === "es" ? "Ubicación" : "Location"}
                  </h4>
                  <p className="opacity-90">
                    Santa Cruz, Bolivia
                  </p>
                </div>
              </div>
              
              <Button 
                size="lg"
                className="px-8 py-4 text-lg font-semibold rounded-full bg-white text-purple-900 hover:bg-gray-100 transition-all duration-300 hover:scale-105 hover:shadow-xl"
              >
                {locale === "es" ? 'Contactar Ahora' : 'Contact Now'}
                <ArrowRightIcon className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}