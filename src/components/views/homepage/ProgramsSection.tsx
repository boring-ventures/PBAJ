"use client";

import { useState, useEffect } from 'react';
import { useLanguage } from '@/context/language-context';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar, ArrowRight, User } from "lucide-react";
import { format } from "date-fns";
import { es, enUS } from "date-fns/locale";

interface ProgramItem {
  id: string;
  titleEs: string;
  titleEn: string;
  descriptionEs?: string;
  descriptionEn?: string;
  featuredImageUrl?: string;
  status: string;
  type?: string;
  startDate?: string;
  endDate?: string;
  progressPercentage?: number;
  region?: string;
  targetPopulation?: string;
  manager?: {
    firstName?: string;
    lastName?: string;
  };
}

interface ProgramsSectionProps {
  programs?: ProgramItem[];
}

export default function ProgramsSection({ programs: propPrograms }: ProgramsSectionProps) {
  const { locale, t } = useLanguage();
  const [programs, setPrograms] = useState<ProgramItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (propPrograms) {
      setPrograms(propPrograms);
      setLoading(false);
    } else {
      // Add a delay to stagger API calls and prevent rate limiting
      const timer = setTimeout(() => {
        fetchPrograms();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [propPrograms]);

  const fetchPrograms = async () => {
    try {
      const response = await fetch('/api/public/programs?featured=true&limit=3');
      if (response.ok) {
        const data = await response.json();
        setPrograms(data || []);
      }
    } catch (error) {
      console.error('Error fetching programs:', error);
      setPrograms([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: Date) => {
    return format(date, "MMM yyyy", {
      locale: locale === "es" ? es : enUS,
    });
  };

  const getStatusLabel = (status: string) => {
    const statusMap: Record<string, { es: string; en: string; color: string }> = {
      ACTIVE: { es: "Activo", en: "Active", color: "bg-green-500" },
      COMPLETED: { es: "Completado", en: "Completed", color: "bg-blue-500" },
      PLANNING: { es: "Planificación", en: "Planning", color: "bg-yellow-500" },
      PAUSED: { es: "Pausado", en: "Paused", color: "bg-gray-500" },
    };

    return statusMap[status] || { es: status, en: status, color: "bg-gray-500" };
  };

  const getTitle = (item: ProgramItem) => {
    return locale === 'es' ? item.titleEs : item.titleEn || item.titleEs;
  };

  const getDescription = (item: ProgramItem) => {
    return locale === 'es' ? item.descriptionEs : item.descriptionEn || item.descriptionEs;
  };

  if (loading) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3 mb-12"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array(3).fill(0).map((_, i) => (
                <div key={i} className="h-96 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {t("homepage.featuredPrograms")}
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl">
              {locale === "es"
                ? "Descubre nuestros programas más impactantes que están transformando comunidades"
                : "Discover our most impactful programs that are transforming communities"}
            </p>
          </div>

          <Button asChild variant="outline" className="group">
            <Link href="/programs">
              {t("homepage.programs.viewAll")}
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {(programs || []).slice(0, 3).map((program) => {
            const statusInfo = getStatusLabel(program.status);

            return (
              <Card
                key={program.id}
                className="group hover:shadow-lg transition-all duration-300 overflow-hidden bg-white"
              >
                <CardHeader className="p-0">
                  {program.featuredImageUrl ? (
                    <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden">
                      <img
                        src={program.featuredImageUrl}
                        alt={getTitle(program)}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                      {/* Status Badge on Image */}
                      <div className="absolute top-4 left-4">
                        <Badge className={`${statusInfo.color} text-white border-none`}>
                          {locale === "es" ? statusInfo.es : statusInfo.en}
                        </Badge>
                      </div>
                    </div>
                  ) : (
                    <div className="aspect-[4/3] bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col items-center justify-center">
                      <User className="h-12 w-12 text-gray-400 mb-2" />
                      <div className="text-gray-400 text-sm">
                        {locale === "es" ? "Sin imagen" : "No image"}
                      </div>
                    </div>
                  )}
                </CardHeader>

                <CardContent className="p-6">
                  <div className="mb-4">
                    <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                      <Link href={`/programs/${program.id}`}>
                        {getTitle(program)}
                      </Link>
                    </h3>

                    <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                      {getDescription(program)}
                    </p>
                  </div>

                  {/* Program Details */}
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center text-gray-500">
                        <Calendar className="h-3 w-3 mr-1" />
                        {program.startDate && formatDate(new Date(program.startDate))}
                        {program.endDate && ` - ${formatDate(new Date(program.endDate))}`}
                      </div>
                      {program.type && (
                        <Badge variant="outline" className="text-xs">
                          {program.type}
                        </Badge>
                      )}
                    </div>

                    {/* Progress Bar (if available) */}
                    {program.progressPercentage !== undefined && (
                      <div>
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                          <span>
                            {locale === "es" ? "Progreso" : "Progress"}
                          </span>
                          <span>{program.progressPercentage}%</span>
                        </div>
                        <Progress value={program.progressPercentage} className="h-2" />
                      </div>
                    )}

                    {/* Region/Target Population */}
                    {(program.region || program.targetPopulation) && (
                      <div className="text-xs text-gray-500">
                        {program.region && (
                          <span className="inline-block mr-3">📍 {program.region}</span>
                        )}
                        {program.targetPopulation && (
                          <span>👥 {program.targetPopulation}</span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="text-xs text-gray-500">
                      {locale === "es" ? "Coordinador:" : "Manager:"}{" "}
                      {program.manager?.firstName} {program.manager?.lastName}
                    </div>
                    <Link
                      href={`/programs/${program.id}`}
                      className="text-blue-600 hover:text-blue-700 transition-colors text-sm font-medium"
                    >
                      {locale === "es" ? "Ver detalles" : "View details"}
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {(!programs || programs.length === 0) && !loading && (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">
              {locale === "es"
                ? "No hay programas destacados en este momento"
                : "No featured programs at this time"}
            </div>
            <Button asChild variant="outline">
              <Link href="/programs">
                {locale === "es" ? "Ver todos los programas" : "View all programs"}
              </Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
