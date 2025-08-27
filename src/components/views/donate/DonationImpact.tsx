"use client";

import { useParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  PersonIcon,
  HomeIcon,
  FileTextIcon,
  HeartIcon,
  TargetIcon,
  TriangleUpIcon,
} from "@radix-ui/react-icons";

export default function DonationImpact() {
  const params = useParams();
  const locale = params.locale as string;

  const impactAreas = [
    {
      icon: FileTextIcon,
      title: locale === "es" ? "Educación Rural" : "Rural Education",
      description:
        locale === "es"
          ? "Construimos aulas y capacitamos maestros en comunidades rurales"
          : "We build classrooms and train teachers in rural communities",
      beneficiaries: "8,500",
      goal: "10,000",
      progress: 85,
      color: "bg-blue-100 text-blue-600 border-blue-200",
    },
    {
      icon: HomeIcon,
      title: locale === "es" ? "Vivienda Digna" : "Decent Housing",
      description:
        locale === "es"
          ? "Mejoramos las condiciones de vivienda con materiales y técnicas sostenibles"
          : "We improve housing conditions with sustainable materials and techniques",
      beneficiaries: "3,200",
      goal: "5,000",
      progress: 64,
      color: "bg-green-100 text-green-600 border-green-200",
    },
    {
      icon: HeartIcon,
      title: locale === "es" ? "Salud Comunitaria" : "Community Health",
      description:
        locale === "es"
          ? "Brindamos atención médica básica y educación sanitaria preventiva"
          : "We provide basic medical care and preventive health education",
      beneficiaries: "12,300",
      goal: "15,000",
      progress: 82,
      color: "bg-red-100 text-red-600 border-red-200",
    },
    {
      icon: PersonIcon,
      title: locale === "es" ? "Empoderamiento Femenino" : "Women Empowerment",
      description:
        locale === "es"
          ? "Capacitamos mujeres en oficios y emprendimiento para independencia económica"
          : "We train women in trades and entrepreneurship for economic independence",
      beneficiaries: "1,800",
      goal: "3,000",
      progress: 60,
      color: "bg-purple-100 text-purple-600 border-purple-200",
    },
  ];

  const donationTiers = [
    {
      amount: locale === "es" ? "50 Bs" : "$7 USD",
      impact:
        locale === "es"
          ? "Proporciona material escolar para un niño por un mes"
          : "Provides school supplies for one child for a month",
      icon: "📚",
    },
    {
      amount: locale === "es" ? "200 Bs" : "$29 USD",
      impact:
        locale === "es"
          ? "Cubre una consulta médica básica con medicamentos"
          : "Covers a basic medical consultation with medicines",
      icon: "🏥",
    },
    {
      amount: locale === "es" ? "500 Bs" : "$72 USD",
      impact:
        locale === "es"
          ? "Financia un taller de capacitación para una familia"
          : "Funds a training workshop for one family",
      icon: "👨‍👩‍👧‍👦",
    },
    {
      amount: locale === "es" ? "1,000 Bs" : "$144 USD",
      impact:
        locale === "es"
          ? "Apoya la construcción de una letrina ecológica"
          : "Supports the construction of an ecological latrine",
      icon: "🏗️",
    },
    {
      amount: locale === "es" ? "3,500 Bs" : "$504 USD",
      impact:
        locale === "es"
          ? "Equipa completamente un aula rural con pupitres y pizarra"
          : "Fully equips a rural classroom with desks and blackboard",
      icon: "🎓",
    },
    {
      amount: locale === "es" ? "7,000 Bs" : "$1,008 USD",
      impact:
        locale === "es"
          ? "Financia un microproyecto productivo para una comunidad"
          : "Funds a productive micro-project for a community",
      icon: "🌱",
    },
  ];

  const achievements2024 = [
    {
      metric: "142",
      label: locale === "es" ? "Proyectos Completados" : "Completed Projects",
      change: "+18%",
    },
    {
      metric: "25,340",
      label: locale === "es" ? "Personas Beneficiadas" : "People Benefited",
      change: "+22%",
    },
    {
      metric: "45",
      label: locale === "es" ? "Comunidades Atendidas" : "Communities Served",
      change: "+15%",
    },
    {
      metric: "98.5%",
      label:
        locale === "es"
          ? "Satisfacción Beneficiarios"
          : "Beneficiary Satisfaction",
      change: "+2.5%",
    },
  ];

  return (
    <div id="donation-impact" className="max-w-6xl mx-auto space-y-16">
      {/* Section Header */}
      <div className="text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          {locale === "es"
            ? "El Impacto de tu Donación"
            : "The Impact of Your Donation"}
        </h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          {locale === "es"
            ? "Cada boliviano que donas se traduce en cambios reales y medibles en las comunidades que servimos."
            : "Every boliviano you donate translates into real and measurable changes in the communities we serve."}
        </p>
      </div>

      {/* Impact Areas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {impactAreas.map((area, index) => {
          const IconComponent = area.icon;
          return (
            <Card key={index} className="shadow-lg">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className={`p-3 rounded-full ${area.color}`}>
                    <IconComponent className="h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">{area.title}</CardTitle>
                    <CardDescription>{area.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {locale === "es" ? "Progreso actual:" : "Current progress:"}
                  </span>
                  <span className="font-medium">
                    {area.beneficiaries} / {area.goal}{" "}
                    {locale === "es" ? "personas" : "people"}
                  </span>
                </div>
                <Progress value={area.progress} className="h-2" />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {area.progress}%{" "}
                    {locale === "es" ? "completado" : "completed"}
                  </span>
                  <Badge variant="outline" className="text-xs">
                    <TriangleUpIcon className="h-3 w-3 mr-1" />
                    {locale === "es" ? "En progreso" : "In progress"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Donation Tier Impact */}
      <div className="space-y-8">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-foreground mb-4">
            {locale === "es"
              ? "¿Qué puede lograr tu donación?"
              : "What can your donation achieve?"}
          </h3>
          <p className="text-muted-foreground">
            {locale === "es"
              ? "Cada monto tiene un impacto específico y tangible"
              : "Each amount has a specific and tangible impact"}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {donationTiers.map((tier, index) => (
            <Card
              key={index}
              className="border-2 border-dashed border-muted hover:border-primary/50 transition-colors"
            >
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <div className="text-4xl">{tier.icon}</div>
                  <div className="text-2xl font-bold text-primary">
                    {tier.amount}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {tier.impact}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* 2024 Achievements */}
      <Card className="bg-gradient-to-r from-primary/5 to-secondary/5">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-foreground">
            {locale === "es"
              ? "Nuestros Logros en 2024"
              : "Our 2024 Achievements"}
          </CardTitle>
          <CardDescription>
            {locale === "es"
              ? "Gracias a nuestros donantes, hemos logrado impactos significativos"
              : "Thanks to our donors, we have achieved significant impacts"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {achievements2024.map((achievement, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                  {achievement.metric}
                </div>
                <div className="text-sm font-medium text-foreground mb-1">
                  {achievement.label}
                </div>
                <Badge variant="outline" className="text-xs text-green-600">
                  <TrendingUpIcon className="h-3 w-3 mr-1" />
                  {achievement.change}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Transparency Statement */}
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TargetIcon className="h-5 w-5 text-primary" />
            {locale === "es" ? "Transparencia Total" : "Full Transparency"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-primary mb-2">95%</div>
              <p className="text-sm text-muted-foreground">
                {locale === "es"
                  ? "Se destina directamente a programas"
                  : "Goes directly to programs"}
              </p>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary mb-2">5%</div>
              <p className="text-sm text-muted-foreground">
                {locale === "es"
                  ? "Gastos administrativos mínimos"
                  : "Minimal administrative expenses"}
              </p>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary mb-2">100%</div>
              <p className="text-sm text-muted-foreground">
                {locale === "es"
                  ? "Transparencia en reportes"
                  : "Transparency in reports"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
