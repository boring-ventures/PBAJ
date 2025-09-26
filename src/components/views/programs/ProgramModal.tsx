"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  Cross2Icon,
  CalendarIcon,
  PersonIcon,
  StarIcon,
  ArrowRightIcon,
  DotFilledIcon,
} from "@radix-ui/react-icons";
import { FileText } from "lucide-react";
import type { LocalizedProgram } from "@/lib/content/content-utils";
import { format } from "date-fns";
import { es, enUS } from "date-fns/locale";
import { BRAND_COLORS } from "@/lib/brand-colors";

interface ProgramModalProps {
  program: LocalizedProgram | null;
  isOpen: boolean;
  onClose: () => void;
  locale: string;
}

export default function ProgramModal({
  program,
  isOpen,
  onClose,
  locale,
}: ProgramModalProps) {
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

  const renderContent = (content?: string) => {
    if (!content) return null;

    // If content contains HTML tags, render it as HTML
    if (content.includes("<") && content.includes(">")) {
      return (
        <div
          className="prose prose-sm max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-p:leading-relaxed prose-a:text-blue-600 prose-strong:text-gray-900 prose-ul:text-gray-700 prose-ol:text-gray-700 prose-li:text-gray-700"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      );
    }

    // If content is plain text, render it as paragraphs
    return (
      <div className="prose prose-sm max-w-none">
        {content.split("\n\n").map((paragraph, index) => (
          <p key={index} className="text-gray-700 leading-relaxed mb-2">
            {paragraph}
          </p>
        ))}
      </div>
    );
  };

  if (!program) return null;

  const statusInfo = getStatusInfo(program.status);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="relative">
          <DialogTitle
            className="text-2xl font-bold"
            style={{ color: BRAND_COLORS.grayDark }}
          >
            {program.title}
          </DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="absolute right-0 top-0"
          >
            <Cross2Icon className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div className="space-y-6">
          {/* Image Section */}
          <div className="relative">
            {program.featuredImageUrl ? (
              <img
                src={program.featuredImageUrl}
                alt={program.title}
                className="w-full h-64 object-cover rounded-xl"
              />
            ) : (
              <div className="w-full h-64 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex flex-col items-center justify-center">
                <div className="text-6xl mb-4">📋</div>
                <div className="text-gray-600 text-lg">
                  {locale === "es" ? "Programa" : "Program"}
                </div>
              </div>
            )}

            {/* Status Badges */}
            <div className="absolute top-4 left-4 flex gap-2">
              <Badge
                className={`${statusInfo.color} border-none rounded-xl px-3 py-1 text-xs font-semibold`}
              >
                {locale === "es" ? statusInfo.label.es : statusInfo.label.en}
              </Badge>
              {program.featured && (
                <Badge className="bg-yellow-400 text-gray-900 border-none rounded-xl px-3 py-1 text-xs font-semibold flex items-center">
                  <StarIcon className="h-3 w-3 mr-1" />
                  {locale === "es" ? "Destacado" : "Featured"}
                </Badge>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <h3
              className="text-lg font-semibold mb-3"
              style={{ color: BRAND_COLORS.grayDark }}
            >
              {locale === "es" ? "Descripción" : "Description"}
            </h3>
            <div className="text-gray-600 leading-relaxed">
              {renderContent(program.description)}
            </div>
          </div>

          {/* Progress Section */}
          {program.progressPercentage !== undefined && (
            <div>
              <h3
                className="text-lg font-semibold mb-3"
                style={{ color: BRAND_COLORS.grayDark }}
              >
                {locale === "es" ? "Progreso" : "Progress"}
              </h3>
              <div className="space-y-2">
                <div
                  className="flex justify-between text-sm"
                  style={{ color: "#666666" }}
                >
                  <span>
                    {locale === "es"
                      ? "Progreso del programa"
                      : "Program progress"}
                  </span>
                  <span>{program.progressPercentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="h-3 rounded-full transition-all duration-300"
                    style={{
                      width: `${program.progressPercentage}%`,
                      backgroundColor: BRAND_COLORS.primary,
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Program Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Timeline */}
            {(program.startDate || program.endDate) && (
              <div>
                <h3
                  className="text-lg font-semibold mb-3"
                  style={{ color: BRAND_COLORS.grayDark }}
                >
                  {locale === "es" ? "Cronograma" : "Timeline"}
                </h3>
                <div className="space-y-2">
                  {program.startDate && (
                    <div className="flex items-center text-gray-600">
                      <CalendarIcon
                        className="h-4 w-4 mr-2"
                        style={{ color: BRAND_COLORS.primary }}
                      />
                      <span>
                        {locale === "es" ? "Inicio" : "Start"}:{" "}
                        {formatDate(new Date(program.startDate))}
                      </span>
                    </div>
                  )}
                  {program.endDate && (
                    <div className="flex items-center text-gray-600">
                      <CalendarIcon
                        className="h-4 w-4 mr-2"
                        style={{ color: BRAND_COLORS.primary }}
                      />
                      <span>
                        {locale === "es" ? "Fin" : "End"}:{" "}
                        {formatDate(new Date(program.endDate))}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Location and Target */}
            {(program.region || program.targetPopulation) && (
              <div>
                <h3
                  className="text-lg font-semibold mb-3"
                  style={{ color: BRAND_COLORS.grayDark }}
                >
                  {locale === "es" ? "Detalles" : "Details"}
                </h3>
                <div className="space-y-2">
                  {program.region && (
                    <div className="flex items-center text-gray-600">
                      <DotFilledIcon
                        className="h-4 w-4 mr-2"
                        style={{ color: BRAND_COLORS.secondary }}
                      />
                      <span>{program.region}</span>
                    </div>
                  )}
                  {program.targetPopulation && (
                    <div className="flex items-center text-gray-600">
                      <PersonIcon
                        className="h-4 w-4 mr-2"
                        style={{ color: BRAND_COLORS.tertiary }}
                      />
                      <span>{program.targetPopulation}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Manager Information */}
          {/* Gallery Images */}
          {program.galleryImages && program.galleryImages.length > 0 && (
            <div className="border-t border-gray-200 pt-6">
              <h3
                className="text-lg font-semibold mb-3"
                style={{ color: BRAND_COLORS.grayDark }}
              >
                {locale === "es" ? "Galería de Imágenes" : "Image Gallery"}
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {program.galleryImages.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={image}
                      alt={`${program.title} - Image ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Documents */}
          {program.documentUrls && program.documentUrls.length > 0 && (
            <div className="border-t border-gray-200 pt-6">
              <h3
                className="text-lg font-semibold mb-3"
                style={{ color: BRAND_COLORS.grayDark }}
              >
                {locale === "es" ? "Documentos" : "Documents"}
              </h3>
              <div className="space-y-2">
                {program.documentUrls.map((doc, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 mr-3 text-gray-500" />
                      <span className="text-sm text-gray-700">
                        {locale === "es" ? "Documento" : "Document"} {index + 1}
                      </span>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.open(doc, "_blank")}
                    >
                      {locale === "es" ? "Ver" : "View"}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="border-t border-gray-200 pt-6">
            <h3
              className="text-lg font-semibold mb-3"
              style={{ color: BRAND_COLORS.grayDark }}
            >
              {locale === "es" ? "Responsable del Programa" : "Program Manager"}
            </h3>
            <div className="flex items-center text-gray-600">
              <PersonIcon
                className="h-5 w-5 mr-2"
                style={{ color: BRAND_COLORS.primary }}
              />
              <span className="font-medium">
                {program.manager.firstName} {program.manager.lastName}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-6 border-t border-gray-200">
            <Button onClick={onClose} variant="outline" className="flex-1">
              {locale === "es" ? "Cerrar" : "Close"}
            </Button>
            <Button
              className="flex-1 bg-gray-900 hover:bg-gray-800 text-white"
              style={{ backgroundColor: BRAND_COLORS.primary }}
            >
              {locale === "es" ? "Contactar" : "Contact"}
              <ArrowRightIcon className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
