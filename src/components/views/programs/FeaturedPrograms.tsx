"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  CalendarIcon,
  PersonIcon,
  StarIcon,
  DotFilledIcon,
} from "@radix-ui/react-icons";
import type { LocalizedProgram } from "@/lib/content/content-utils";
import { format } from "date-fns";
import { es, enUS } from "date-fns/locale";
import { BRAND_COLORS } from "@/lib/brand-colors";

interface FeaturedProgramsProps {
  programs: LocalizedProgram[];
}

export default function FeaturedPrograms({ programs }: FeaturedProgramsProps) {
  const params = useParams();
  const locale = (params.locale as string) || "es";

  const formatDate = (date: Date) => {
    return format(date, "MMM yyyy", {
      locale: locale === "es" ? es : enUS,
    });
  };

  const getStatusInfo = (status: string) => {
    const statusMap: Record<
      string,
      { label: { es: string; en: string }; color: string }
    > = {
      ACTIVE: {
        label: { es: "Activo", en: "Active" },
        color: "bg-green-500 text-white",
      },
      COMPLETED: {
        label: { es: "Completado", en: "Completed" },
        color: "bg-blue-500 text-white",
      },
      PLANNING: {
        label: { es: "En Planificación", en: "Planning" },
        color: "bg-yellow-500 text-white",
      },
      PAUSED: {
        label: { es: "Pausado", en: "Paused" },
        color: "bg-gray-500 text-white",
      },
    };

    return (
      statusMap[status] || {
        label: { es: status, en: status },
        color: "bg-gray-500 text-white",
      }
    );
  };

  if (!programs || programs.length === 0) {
    return null;
  }

  return (
    <div className="mb-16">
      <div className="flex items-center mb-8">
        <StarIcon
          className="h-6 w-6 mr-3"
          style={{ color: BRAND_COLORS.quaternary }}
        />
        <h2
          className="text-2xl font-bold"
          style={{ color: BRAND_COLORS.grayDark }}
        >
          {locale === "es" ? "Programas Destacados" : "Featured Programs"}
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {programs.map((program) => {
          const statusInfo = getStatusInfo(program.status);

          return (
            <Card
              key={program.id}
              className="group hover:shadow-lg transition-all duration-300 overflow-hidden h-full flex flex-col bg-white border border-gray-200 rounded-xl"
            >
              <CardHeader className="p-0">
                {program.featuredImageUrl ? (
                  <div className="aspect-[4/3] bg-muted relative overflow-hidden">
                    <img
                      src={program.featuredImageUrl}
                      alt={program.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Status Badge - Top Left */}
                    <div className="absolute top-4 left-4">
                      <Badge
                        className={`${statusInfo.color} border-none rounded-full px-3 py-1 text-xs font-semibold`}
                      >
                        {locale === "es"
                          ? statusInfo.label.es
                          : statusInfo.label.en}
                      </Badge>
                    </div>

                    {/* Featured Badge - Top Right */}
                    <div className="absolute top-4 right-4 bg-yellow-500 text-white px-3 py-1 rounded-full flex items-center">
                      <StarIcon className="h-4 w-4 mr-1" />
                      <span className="text-xs font-semibold">
                        {locale === "es" ? "Destacado" : "Featured"}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col items-center justify-center relative">
                    {/* Status Badge - Top Left */}
                    <div className="absolute top-4 left-4">
                      <Badge
                        className={`${statusInfo.color} border-none rounded-full px-3 py-1 text-xs font-semibold`}
                      >
                        {locale === "es"
                          ? statusInfo.label.es
                          : statusInfo.label.en}
                      </Badge>
                    </div>

                    {/* Featured Badge - Top Right */}
                    <div className="absolute top-4 right-4 bg-yellow-500 text-white px-3 py-1 rounded-full flex items-center">
                      <StarIcon className="h-4 w-4 mr-1" />
                      <span className="text-xs font-semibold">
                        {locale === "es" ? "Destacado" : "Featured"}
                      </span>
                    </div>

                    <div className="text-4xl mb-4">📋</div>
                    <div className="text-gray-600 text-sm text-center px-4">
                      {locale === "es" ? "Programa" : "Program"}
                    </div>
                  </div>
                )}
              </CardHeader>

              <CardContent className="p-6 flex-1 flex flex-col">
                <div className="flex-1">
                  <h3
                    className="text-lg font-semibold mb-3 line-clamp-2 group-hover:text-primary transition-colors"
                    style={{ color: BRAND_COLORS.grayDark }}
                  >
                    <Link href={`/${locale}/programs/${program.id}`}>
                      {program.title}
                    </Link>
                  </h3>

                  <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                    {program.description}
                  </p>

                  {/* Progress Bar */}
                  {program.progressPercentage !== undefined && (
                    <div className="mb-4">
                      <div
                        className="flex justify-between text-xs mb-1"
                        style={{ color: BRAND_COLORS.grayDark }}
                      >
                        <span>{locale === "es" ? "Progreso" : "Progress"}</span>
                        <span>{program.progressPercentage}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${program.progressPercentage}%`,
                            backgroundColor: BRAND_COLORS.primary,
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Location and Target Details */}
                  <div className="space-y-2 mb-4">
                    {program.region && (
                      <div className="flex items-center text-xs text-gray-600">
                        <DotFilledIcon
                          className="h-3 w-3 mr-2"
                          style={{ color: BRAND_COLORS.secondary }}
                        />
                        <span>{program.region}</span>
                      </div>
                    )}
                    {program.targetPopulation && (
                      <div className="flex items-center text-xs text-gray-600">
                        <PersonIcon
                          className="h-3 w-3 mr-2"
                          style={{ color: BRAND_COLORS.tertiary }}
                        />
                        <span>{program.targetPopulation}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200 mt-auto">
                  <div className="flex items-center text-xs text-gray-600">
                    <PersonIcon className="h-3 w-3 mr-1" />
                    <span>
                      {program.manager.firstName} {program.manager.lastName}
                    </span>
                  </div>
                  <Link
                    href={`/${locale}/programs/${program.id}`}
                    className="text-sm font-medium transition-colors"
                    style={{ color: BRAND_COLORS.secondary }}
                  >
                    {locale === "es" ? "Ver más" : "Learn more"}
                  </Link>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
