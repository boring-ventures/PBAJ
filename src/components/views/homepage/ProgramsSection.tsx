"use client";

import { useTranslations, useLocale } from '@/hooks/use-translations';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  CalendarIcon,
  ArrowRightIcon,
  PersonIcon,
} from "@radix-ui/react-icons";
import type { LocalizedProgram } from "@/lib/content/content-utils";
import { format } from "date-fns";
import { es, enUS } from "date-fns/locale";

interface ProgramsSectionProps {
  programs: LocalizedProgram[];
}

export default function ProgramsSection({ programs }: ProgramsSectionProps) {
  const t = useTranslations("homepage");
  const locale = useLocale();

  const formatDate = (date: Date) => {
    return format(date, "MMM yyyy", {
      locale: locale === "es" ? es : enUS,
    });
  };

  const getStatusLabel = (status: string) => {
    const statusMap: Record<string, { es: string; en: string; color: string }> =
      {
        ACTIVE: { es: "Activo", en: "Active", color: "bg-green-500" },
        COMPLETED: { es: "Completado", en: "Completed", color: "bg-blue-500" },
        PLANNING: {
          es: "Planificación",
          en: "Planning",
          color: "bg-yellow-500",
        },
        PAUSED: { es: "Pausado", en: "Paused", color: "bg-gray-500" },
      };

    return (
      statusMap[status] || { es: status, en: status, color: "bg-gray-500" }
    );
  };

  return (
    <section className="py-16 bg-secondary/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {t("featuredPrograms")}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl">
              {locale === "es"
                ? "Descubre nuestros programas más impactantes que están transformando comunidades"
                : "Discover our most impactful programs that are transforming communities"}
            </p>
          </div>

          <Button asChild variant="outline" className="group">
            <Link href={`/${locale}/programs`}>
              {locale === "es" ? "Ver todos" : "View all"}
              <ArrowRightIcon className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {programs.slice(0, 3).map((program) => {
            const statusInfo = getStatusLabel(program.status);

            return (
              <Card
                key={program.id}
                className="group hover:shadow-lg transition-all duration-300 overflow-hidden"
              >
                <CardHeader className="p-0">
                  {program.featuredImageUrl ? (
                    <div className="aspect-[4/3] bg-muted relative overflow-hidden">
                      <img
                        src={program.featuredImageUrl}
                        alt={program.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                      {/* Status Badge on Image */}
                      <div className="absolute top-4 left-4">
                        <Badge
                          className={`${statusInfo.color} text-white border-none`}
                        >
                          {locale === "es" ? statusInfo.es : statusInfo.en}
                        </Badge>
                      </div>
                    </div>
                  ) : (
                    <div className="aspect-[4/3] bg-gradient-to-br from-primary/10 to-secondary/10 flex flex-col items-center justify-center">
                      <PersonIcon className="h-12 w-12 text-muted-foreground mb-2" />
                      <div className="text-muted-foreground text-sm">
                        {locale === "es" ? "Sin imagen" : "No image"}
                      </div>
                    </div>
                  )}
                </CardHeader>

                <CardContent className="p-6">
                  <div className="mb-4">
                    <h3 className="font-semibold text-lg text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                      <Link href={`/${locale}/programs/${program.id}`}>
                        {program.title}
                      </Link>
                    </h3>

                    <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                      {program.description}
                    </p>
                  </div>

                  {/* Program Details */}
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center text-muted-foreground">
                        <CalendarIcon className="h-3 w-3 mr-1" />
                        {program.startDate &&
                          formatDate(new Date(program.startDate))}
                        {program.endDate &&
                          ` - ${formatDate(new Date(program.endDate))}`}
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {program.type}
                      </Badge>
                    </div>

                    {/* Progress Bar (if available) */}
                    {program.progressPercentage !== undefined && (
                      <div>
                        <div className="flex justify-between text-xs text-muted-foreground mb-1">
                          <span>
                            {locale === "es" ? "Progreso" : "Progress"}
                          </span>
                          <span>{program.progressPercentage}%</span>
                        </div>
                        <Progress
                          value={program.progressPercentage}
                          className="h-2"
                        />
                      </div>
                    )}

                    {/* Region/Target Population */}
                    {(program.region || program.targetPopulation) && (
                      <div className="text-xs text-muted-foreground">
                        {program.region && (
                          <span className="inline-block mr-3">
                            📍 {program.region}
                          </span>
                        )}
                        {program.targetPopulation && (
                          <span>👥 {program.targetPopulation}</span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <div className="text-xs text-muted-foreground">
                      {locale === "es" ? "Coordinador:" : "Manager:"}{" "}
                      {program.manager.firstName} {program.manager.lastName}
                    </div>
                    <Link
                      href={`/${locale}/programs/${program.id}`}
                      className="text-primary hover:text-primary/80 transition-colors text-sm font-medium"
                    >
                      {locale === "es" ? "Ver detalles" : "View details"}
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {programs.length === 0 && (
          <div className="text-center py-12">
            <div className="text-muted-foreground mb-4">
              {locale === "es"
                ? "No hay programas destacados en este momento"
                : "No featured programs at this time"}
            </div>
            <Button asChild variant="outline">
              <Link href={`/${locale}/programs`}>
                {locale === "es"
                  ? "Ver todos los programas"
                  : "View all programs"}
              </Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
