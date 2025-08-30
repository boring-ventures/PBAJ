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
import { Calendar, User, MapPin, Users, ArrowRight, X } from "lucide-react";
import { format } from "date-fns";
import { es, enUS } from "date-fns/locale";
import { useLanguage } from "@/context/language-context";

interface ProgramModalProps {
  program: ProgramItem | null;
  isOpen: boolean;
  onClose: () => void;
}

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
  // Additional fields that might be available
  objectivesEs?: string;
  objectivesEn?: string;
  beneficiariesEs?: string;
  beneficiariesEn?: string;
  impactEs?: string;
  impactEn?: string;
}

export default function ProgramModal({
  program,
  isOpen,
  onClose,
}: ProgramModalProps) {
  const { locale, t } = useLanguage();

  if (!program) return null;

  const getTitle = (item: ProgramItem) => {
    return locale === "es" ? item.titleEs : item.titleEn || item.titleEs;
  };

  const getDescription = (item: ProgramItem) => {
    return locale === "es"
      ? item.descriptionEs
      : item.descriptionEn || item.descriptionEs;
  };

  const getObjectives = (item: ProgramItem) => {
    return locale === "es"
      ? item.objectivesEs
      : item.objectivesEn || item.objectivesEs;
  };

  const getBeneficiaries = (item: ProgramItem) => {
    return locale === "es"
      ? item.beneficiariesEs
      : item.beneficiariesEn || item.beneficiariesEs;
  };

  const getImpact = (item: ProgramItem) => {
    return locale === "es" ? item.impactEs : item.impactEn || item.impactEs;
  };

  const formatDate = (date: Date) => {
    return format(date, "dd MMM yyyy", {
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

  const statusInfo = getStatusLabel(program.status);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900">
            {getTitle(program)}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Featured Image */}
          {program.featuredImageUrl && (
            <div className="aspect-[16/9] bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={program.featuredImageUrl}
                alt={getTitle(program)}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Status and Type Badges */}
          <div className="flex items-center gap-3">
            <Badge className={`${statusInfo.color} text-white border-none`}>
              {locale === "es" ? statusInfo.es : statusInfo.en}
            </Badge>
            {program.type && (
              <Badge variant="outline" className="text-sm">
                {program.type}
              </Badge>
            )}
          </div>

          {/* Description */}
          {getDescription(program) && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {locale === "es" ? "Descripción" : "Description"}
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {getDescription(program)}
              </p>
            </div>
          )}

          {/* Program Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Dates */}
            {(program.startDate || program.endDate) && (
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-900 flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-blue-600" />
                  {locale === "es" ? "Fechas" : "Dates"}
                </h4>
                <div className="text-sm text-gray-700">
                  {program.startDate && (
                    <div>
                      <span className="font-medium">
                        {locale === "es" ? "Inicio:" : "Start:"}
                      </span>{" "}
                      {formatDate(new Date(program.startDate))}
                    </div>
                  )}
                  {program.endDate && (
                    <div>
                      <span className="font-medium">
                        {locale === "es" ? "Fin:" : "End:"}
                      </span>{" "}
                      {formatDate(new Date(program.endDate))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Location and Population */}
            {(program.region || program.targetPopulation) && (
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-900 flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-green-600" />
                  {locale === "es"
                    ? "Ubicación y Población"
                    : "Location & Population"}
                </h4>
                <div className="text-sm text-gray-700">
                  {program.region && (
                    <div className="flex items-center mb-1">
                      <MapPin className="h-3 w-3 mr-1 text-green-500" />
                      {program.region}
                    </div>
                  )}
                  {program.targetPopulation && (
                    <div className="flex items-center">
                      <Users className="h-3 w-3 mr-1 text-blue-500" />
                      {program.targetPopulation}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Progress Bar */}
          {program.progressPercentage !== undefined && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                {locale === "es" ? "Progreso del Programa" : "Program Progress"}
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>{locale === "es" ? "Progreso" : "Progress"}</span>
                  <span className="font-medium">
                    {program.progressPercentage}%
                  </span>
                </div>
                <Progress value={program.progressPercentage} className="h-3" />
              </div>
            </div>
          )}

          {/* Objectives */}
          {getObjectives(program) && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                {locale === "es" ? "Objetivos" : "Objectives"}
              </h4>
              <p className="text-gray-700 leading-relaxed">
                {getObjectives(program)}
              </p>
            </div>
          )}

          {/* Beneficiaries */}
          {getBeneficiaries(program) && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                {locale === "es" ? "Beneficiarios" : "Beneficiaries"}
              </h4>
              <p className="text-gray-700 leading-relaxed">
                {getBeneficiaries(program)}
              </p>
            </div>
          )}

          {/* Impact */}
          {getImpact(program) && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">
                {locale === "es" ? "Impacto Esperado" : "Expected Impact"}
              </h4>
              <p className="text-gray-700 leading-relaxed">
                {getImpact(program)}
              </p>
            </div>
          )}

          {/* Manager Information */}
          {program.manager && (
            <div className="pt-4 border-t border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
                <User className="h-4 w-4 mr-2 text-purple-600" />
                {locale === "es"
                  ? "Coordinador del Programa"
                  : "Program Manager"}
              </h4>
              <p className="text-gray-700">
                {program.manager.firstName} {program.manager.lastName}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              {locale === "es" ? "Cerrar" : "Close"}
            </button>
            <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center">
              {locale === "es"
                ? "Ver más información"
                : "View more information"}
              <ArrowRight className="h-4 w-4 ml-2" />
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
