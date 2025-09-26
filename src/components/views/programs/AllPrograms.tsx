"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  CalendarIcon,
  PersonIcon,
  StarIcon,
  DotFilledIcon,
  ArrowRightIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@radix-ui/react-icons";
import type { LocalizedProgram } from "@/lib/content/content-utils";
import { format } from "date-fns";
import { es, enUS } from "date-fns/locale";
import { BRAND_COLORS } from "@/lib/brand-colors";
import ProgramModal from "./ProgramModal";
import { useLanguage } from "@/context/language-context";

interface AllProgramsProps {
  programs: LocalizedProgram[];
}

export default function AllPrograms({ programs }: AllProgramsProps) {
  const { locale } = useLanguage();
  const [showAllPrograms, setShowAllPrograms] = useState(false);
  const [selectedProgram, setSelectedProgram] =
    useState<LocalizedProgram | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const handleProgramClick = (program: LocalizedProgram) => {
    setSelectedProgram(program);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProgram(null);
  };

  const toggleShowAllPrograms = () => {
    setShowAllPrograms(!showAllPrograms);
  };

  // Show only first 6 programs initially
  const initialPrograms = programs.slice(0, 6);
  const remainingPrograms = programs.slice(6);

  return (
    <>
      <div className="mb-16">
        <div className="flex justify-end mb-8">
          <Button
            onClick={toggleShowAllPrograms}
            className="flex items-center gap-2 rounded-full px-6 py-3 font-semibold transition-all duration-300"
            style={{ 
              backgroundColor: "#000000",
              color: "white"
            }}
          >
            {showAllPrograms ? (
              <>
                {locale === "es" ? "Mostrar menos" : "Show less"}
                <ChevronUpIcon className="h-4 w-4" />
              </>
            ) : (
              <>
                {locale === "es" ? "Ver más" : "View more"}
                <ChevronDownIcon className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>

        {/* Initial Programs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {initialPrograms.map((program) => {
            const statusInfo = getStatusInfo(program.status);

            return (
              <div
                key={program.id}
                className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out overflow-hidden w-full h-[520px] flex flex-col hover:-translate-y-2"
                style={{
                  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
                }}
              >
                {/* Image Section - Fixed Height */}
                <div className="relative h-48 overflow-hidden flex-shrink-0">
                  {program.featuredImageUrl ? (
                    <img
                      src={program.featuredImageUrl}
                      alt={program.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col items-center justify-center">
                      <div className="text-5xl mb-2">📋</div>
                      <div className="text-gray-600 text-sm">
                        {locale === "es" ? "Programa" : "Program"}
                      </div>
                    </div>
                  )}

                  {/* Status Badge - Top Left */}
                  <div className="absolute top-4 left-4">
                    <Badge
                      className={`${statusInfo.color} border-none rounded-xl px-3 py-1 text-xs font-semibold shadow-sm`}
                    >
                      {locale === "es"
                        ? statusInfo.label.es
                        : statusInfo.label.en}
                    </Badge>
                  </div>

                  {/* Featured Badge - Top Right (if featured) */}
                  {program.featured && (
                    <div className="absolute top-4 right-4 bg-yellow-400 text-gray-900 px-3 py-1 rounded-xl flex items-center shadow-sm">
                      <StarIcon className="h-4 w-4 mr-1" />
                      <span className="text-xs font-semibold">
                        {locale === "es" ? "Destacado" : "Featured"}
                      </span>
                    </div>
                  )}
                </div>

                {/* Content Section - Flexible Height */}
                <div className="p-6 flex-1 flex flex-col">
                  {/* Title */}
                  <h3
                    className="text-lg font-bold mb-3 line-clamp-2 group-hover:text-primary transition-colors cursor-pointer"
                    style={{ color: "#1a1a1a", lineHeight: "1.3" }}
                    onClick={() => handleProgramClick(program)}
                  >
                    {program.title}
                  </h3>

                  {/* Description */}
                  <p
                    className="text-sm mb-4 line-clamp-3 flex-shrink-0"
                    style={{ color: "#666666", lineHeight: "1.5" }}
                  >
                    {program.description}
                  </p>

                  {/* Progress Bar */}
                  {program.progressPercentage !== undefined && (
                    <div className="mb-4 flex-shrink-0">
                      <div
                        className="flex justify-between text-xs mb-2"
                        style={{ color: "#666666" }}
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

                  {/* Additional Details */}
                  <div className="space-y-2 mb-4 flex-shrink-0">
                    {program.region && (
                      <div
                        className="flex items-center text-xs"
                        style={{ color: "#666666" }}
                      >
                        <DotFilledIcon
                          className="h-3 w-3 mr-2"
                          style={{ color: BRAND_COLORS.secondary }}
                        />
                        <span>{program.region}</span>
                      </div>
                    )}
                    {program.targetPopulation && (
                      <div
                        className="flex items-center text-xs"
                        style={{ color: "#666666" }}
                      >
                        <PersonIcon
                          className="h-3 w-3 mr-2"
                          style={{ color: BRAND_COLORS.tertiary }}
                        />
                        <span>{program.targetPopulation}</span>
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto flex-shrink-0">
                    <div
                      className="flex items-center text-xs"
                      style={{ color: "#888888" }}
                    >
                      <PersonIcon className="h-3 w-3 mr-1" />
                      <span>
                        {program.manager.firstName} {program.manager.lastName}
                      </span>
                    </div>
                    <button
                      onClick={() => handleProgramClick(program)}
                      className="text-sm font-semibold transition-colors cursor-pointer hover:underline"
                      style={{ color: BRAND_COLORS.secondary }}
                    >
                      {locale === "es" ? "Ver más" : "Learn more"}
                    </button>
                  </div>

                  {/* Action Button */}
                  <Button
                    onClick={() => handleProgramClick(program)}
                    className="w-full mt-4 border-none py-3 font-semibold transition-all duration-300 ease-in-out hover:-translate-y-1 flex items-center justify-center gap-2 flex-shrink-0 hover:shadow-lg"
                    style={{
                      backgroundColor: "#000000",
                      color: "white",
                      borderRadius: "25px",
                    }}
                  >
                    {locale === "es" ? "Ver programa" : "View Program"}
                    <ArrowRightIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Expanded Programs Grid */}
        {showAllPrograms && remainingPrograms.length > 0 && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {remainingPrograms.map((program) => {
              const statusInfo = getStatusInfo(program.status);

              return (
                <div
                  key={program.id}
                  className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out overflow-hidden w-full h-[520px] flex flex-col hover:-translate-y-2"
                  style={{
                    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
                  }}
                >
                  {/* Image Section - Fixed Height */}
                  <div className="relative h-48 overflow-hidden flex-shrink-0">
                    {program.featuredImageUrl ? (
                      <img
                        src={program.featuredImageUrl}
                        alt={program.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col items-center justify-center">
                        <div className="text-5xl mb-2">📋</div>
                        <div className="text-gray-600 text-sm">
                          {locale === "es" ? "Programa" : "Program"}
                        </div>
                      </div>
                    )}

                    {/* Status Badge - Top Left */}
                    <div className="absolute top-4 left-4">
                      <Badge
                        className={`${statusInfo.color} border-none rounded-xl px-3 py-1 text-xs font-semibold shadow-sm`}
                      >
                        {locale === "es"
                          ? statusInfo.label.es
                          : statusInfo.label.en}
                      </Badge>
                    </div>

                    {/* Featured Badge - Top Right (if featured) */}
                    {program.featured && (
                      <div className="absolute top-4 right-4 bg-yellow-400 text-gray-900 px-3 py-1 rounded-xl flex items-center shadow-sm">
                        <StarIcon className="h-4 w-4 mr-1" />
                        <span className="text-xs font-semibold">
                          {locale === "es" ? "Destacado" : "Featured"}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content Section - Flexible Height */}
                  <div className="p-6 flex-1 flex flex-col">
                    {/* Title */}
                    <h3
                      className="text-lg font-bold mb-3 line-clamp-2 group-hover:text-primary transition-colors cursor-pointer"
                      style={{ color: "#1a1a1a", lineHeight: "1.3" }}
                      onClick={() => handleProgramClick(program)}
                    >
                      {program.title}
                    </h3>

                    {/* Description */}
                    <p
                      className="text-sm mb-4 line-clamp-3 flex-shrink-0"
                      style={{ color: "#666666", lineHeight: "1.5" }}
                    >
                      {program.description}
                    </p>

                    {/* Progress Bar */}
                    {program.progressPercentage !== undefined && (
                      <div className="mb-4 flex-shrink-0">
                        <div
                          className="flex justify-between text-xs mb-2"
                          style={{ color: "#666666" }}
                        >
                          <span>
                            {locale === "es" ? "Progreso" : "Progress"}
                          </span>
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

                    {/* Additional Details */}
                    <div className="space-y-2 mb-4 flex-shrink-0">
                      {program.region && (
                        <div
                          className="flex items-center text-xs"
                          style={{ color: "#666666" }}
                        >
                          <DotFilledIcon
                            className="h-3 w-3 mr-2"
                            style={{ color: BRAND_COLORS.secondary }}
                          />
                          <span>{program.region}</span>
                        </div>
                      )}
                      {program.targetPopulation && (
                        <div
                          className="flex items-center text-xs"
                          style={{ color: "#666666" }}
                        >
                          <PersonIcon
                            className="h-3 w-3 mr-2"
                            style={{ color: BRAND_COLORS.tertiary }}
                          />
                          <span>{program.targetPopulation}</span>
                        </div>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto flex-shrink-0">
                      <div
                        className="flex items-center text-xs"
                        style={{ color: "#888888" }}
                      >
                        <PersonIcon className="h-3 w-3 mr-1" />
                        <span>
                          {program.manager.firstName} {program.manager.lastName}
                        </span>
                      </div>
                      <button
                        onClick={() => handleProgramClick(program)}
                        className="text-sm font-semibold transition-colors cursor-pointer hover:underline"
                        style={{ color: BRAND_COLORS.secondary }}
                      >
                        {locale === "es" ? "Ver más" : "Learn more"}
                      </button>
                    </div>

                    {/* Action Button */}
                    <Button
                      onClick={() => handleProgramClick(program)}
                      className="w-full mt-4 border-none py-3 font-semibold transition-all duration-300 ease-in-out hover:-translate-y-1 flex items-center justify-center gap-2 flex-shrink-0 hover:shadow-lg"
                      style={{
                        backgroundColor: "#000000",
                        color: "white",
                        borderRadius: "25px",
                      }}
                    >
                      {locale === "es" ? "Ver programa" : "View Program"}
                      <ArrowRightIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Program Modal */}
      <ProgramModal
        program={selectedProgram}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        locale={locale}
      />
    </>
  );
}
