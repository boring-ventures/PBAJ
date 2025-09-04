"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { 
  Calendar, 
  User, 
  Download, 
  Copy, 
  ExternalLink, 
  FileText, 
  Image, 
  Video, 
  Music, 
  Archive,
  File
} from "lucide-react";
import { format } from "date-fns";
import { es, enUS } from "date-fns/locale";
import { useLanguage } from "@/context/language-context";
import { MediaType, MediaCategory } from "@prisma/client";
import { formatFileSize, MEDIA_CATEGORY_OPTIONS } from "@/lib/validations/media";

interface ResourcesModalProps {
  resource: ResourceItem | null;
  isOpen: boolean;
  onClose: () => void;
}

interface ResourceItem {
  id: string;
  fileName: string;
  originalName: string;
  url: string;
  thumbnailUrl?: string;
  type: MediaType;
  category: MediaCategory;
  mimeType: string;
  fileSize: number;
  altText?: string;
  caption?: string;
  dimensions?: string;
  duration?: number;
  tags: string[];
  downloadCount: number;
  usageCount: number;
  isPublic: boolean;
  uploaderId: string;
  createdAt?: string;
  updatedAt: string;
  uploader?: {
    firstName?: string;
    lastName?: string;
  };
}

const FILE_TYPE_ICONS = {
  [MediaType.IMAGE]: Image,
  [MediaType.VIDEO]: Video,
  [MediaType.AUDIO]: Music,
  [MediaType.DOCUMENT]: FileText,
  [MediaType.ARCHIVE]: Archive,
};

export default function ResourcesModal({ resource, isOpen, onClose }: ResourcesModalProps) {
  const { locale } = useLanguage();

  if (!resource) return null;

  const formatDate = (date: Date) => {
    return format(date, "dd MMM yyyy", {
      locale: locale === "es" ? es : enUS,
    });
  };

  const getCategoryColor = (category?: MediaCategory) => {
    const colorMap: Record<string, string> = {
      [MediaCategory.NEWS_MEDIA]: "bg-blue-500",
      [MediaCategory.PROGRAM_MEDIA]: "bg-green-500",
      [MediaCategory.GALLERY]: "bg-purple-500",
      [MediaCategory.LIBRARY_COVER]: "bg-orange-500",
      [MediaCategory.PROFILE_AVATAR]: "bg-indigo-500",
      [MediaCategory.GENERAL]: "bg-gray-500",
    };
    return colorMap[category || ""] || "bg-gray-500";
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const FileIcon = FILE_TYPE_ICONS[resource.type];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-3xl border-none shadow-2xl" style={{ boxShadow: "0 20px 60px rgba(0, 0, 0, 0.15)" }}>
        <DialogHeader className="pb-6 border-b border-gray-100">
          <DialogTitle className="text-3xl font-bold" style={{ color: "#1a1a1a" }}>
            {resource.originalName}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
          {/* Preview */}
          <div className="space-y-6">
            <div className="relative rounded-2xl overflow-hidden shadow-lg" style={{ boxShadow: "0 8px 24px rgba(0, 0, 0, 0.08)" }}>
              {resource.type === MediaType.IMAGE ? (
                <img
                  src={resource.thumbnailUrl || resource.url}
                  alt={resource.altText || resource.originalName}
                  className="w-full h-auto max-h-96 object-contain"
                />
              ) : resource.type === MediaType.VIDEO ? (
                <video
                  src={resource.url}
                  controls
                  className="w-full h-auto max-h-96"
                />
              ) : resource.type === MediaType.AUDIO ? (
                <div className="p-8 bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center">
                  <Music className="w-20 h-20 text-gray-400 mb-4" />
                  <audio src={resource.url} controls className="w-full mt-4" />
                </div>
              ) : (
                <div className="flex items-center justify-center h-64 bg-gradient-to-br from-gray-50 to-gray-100">
                  <div className="text-center">
                    <FileIcon className="w-20 h-20 text-gray-400 mx-auto mb-4" />
                    <p className="text-sm text-gray-500 mb-4">
                      {locale === "es" ? "Vista previa no disponible" : "Preview not available"}
                    </p>
                    <Button 
                      asChild
                      className="rounded-full px-6 py-2"
                      style={{ backgroundColor: "#744C7A", color: "white" }}
                    >
                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        {locale === "es" ? "Abrir archivo" : "Open file"}
                      </a>
                    </Button>
                  </div>
                </div>
              )}
              
              {/* Category Badge Overlay */}
              <div className="absolute top-4 left-4">
                <Badge
                  className={`${getCategoryColor(resource.category)} border-none rounded-xl px-3 py-1 text-xs font-semibold shadow-sm text-white`}
                >
                  {resource.category}
                </Badge>
              </div>
            </div>
          </div>

          {/* Metadata */}
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-2xl p-6 space-y-4">
              <h3 className="text-xl font-bold" style={{ color: "#1a1a1a" }}>
                {locale === "es" ? "Información del Recurso" : "Resource Information"}
              </h3>
              
              <div className="space-y-3">
                <div>
                  <Label className="text-xs font-semibold uppercase tracking-wide" style={{ color: "#744C7A" }}>
                    {locale === "es" ? "ARCHIVO" : "FILE"}
                  </Label>
                  <p className="font-medium text-gray-800 mt-1">{resource.originalName}</p>
                </div>

                {resource.caption && (
                  <div>
                    <Label className="text-xs font-semibold uppercase tracking-wide" style={{ color: "#744C7A" }}>
                      {locale === "es" ? "DESCRIPCIÓN" : "DESCRIPTION"}
                    </Label>
                    <p className="text-gray-700 mt-1 leading-relaxed">{resource.caption}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs font-semibold uppercase tracking-wide" style={{ color: "#744C7A" }}>
                      {locale === "es" ? "TIPO" : "TYPE"}
                    </Label>
                    <p className="text-gray-700 mt-1 font-medium">{resource.type}</p>
                  </div>
                  <div>
                    <Label className="text-xs font-semibold uppercase tracking-wide" style={{ color: "#744C7A" }}>
                      {locale === "es" ? "TAMAÑO" : "SIZE"}
                    </Label>
                    <p className="text-gray-700 mt-1 font-medium">{formatFileSize(resource.fileSize)}</p>
                  </div>
                </div>

                {resource.tags.length > 0 && (
                  <div>
                    <Label className="text-xs font-semibold uppercase tracking-wide" style={{ color: "#744C7A" }}>
                      {locale === "es" ? "ETIQUETAS" : "TAGS"}
                    </Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {resource.tags.map(tag => (
                        <Badge key={tag} variant="outline" className="text-xs rounded-full px-3 py-1" style={{ borderColor: "#D93069", color: "#D93069" }}>
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Statistics */}
            <div className="bg-gray-50 rounded-2xl p-6 space-y-4">
              <h3 className="text-lg font-bold" style={{ color: "#1a1a1a" }}>
                {locale === "es" ? "Estadísticas" : "Statistics"}
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-white rounded-xl shadow-sm">
                  <Download className="h-5 w-5 mx-auto mb-2" style={{ color: "#D93069" }} />
                  <p className="text-2xl font-bold" style={{ color: "#1a1a1a" }}>{resource.downloadCount}</p>
                  <p className="text-xs text-gray-600">{locale === "es" ? "Descargas" : "Downloads"}</p>
                </div>
                <div className="text-center p-3 bg-white rounded-xl shadow-sm">
                  <File className="h-5 w-5 mx-auto mb-2" style={{ color: "#5A3B85" }} />
                  <p className="text-2xl font-bold" style={{ color: "#1a1a1a" }}>{resource.usageCount}</p>
                  <p className="text-xs text-gray-600">{locale === "es" ? "Usos" : "Uses"}</p>
                </div>
              </div>

              {resource.createdAt && (
                <div className="border-t pt-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" style={{ color: "#744C7A" }} />
                    <span>{locale === "es" ? "Creado el " : "Created on "}{formatDate(new Date(resource.createdAt))}</span>
                  </div>
                </div>
              )}

              {resource.uploader && (
                <div className="border-t pt-3">
                  <div className="flex items-center text-sm text-gray-600">
                    <User className="h-4 w-4 mr-2" style={{ color: "#744C7A" }} />
                    <span>{locale === "es" ? "Por " : "By "}{resource.uploader.firstName} {resource.uploader.lastName}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button 
                asChild 
                className="w-full py-3 font-semibold rounded-2xl transition-all duration-300 hover:shadow-lg"
                style={{ backgroundColor: "#744C7A", color: "white" }}
              >
                <a href={resource.url} download>
                  <Download className="w-5 h-5 mr-3" />
                  {locale === "es" ? "Descargar Recurso" : "Download Resource"}
                </a>
              </Button>
              
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  onClick={() => copyToClipboard(resource.url)} 
                  variant="outline" 
                  className="py-2 rounded-xl border-2 font-medium transition-all duration-300 hover:shadow-md"
                  style={{ borderColor: "#D93069", color: "#D93069" }}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  {locale === "es" ? "Copiar URL" : "Copy URL"}
                </Button>
                <Button 
                  asChild 
                  variant="outline" 
                  className="py-2 rounded-xl border-2 font-medium transition-all duration-300 hover:shadow-md"
                  style={{ borderColor: "#1BB5A0", color: "#1BB5A0" }}
                >
                  <a href={resource.url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    {locale === "es" ? "Abrir" : "Open"}
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}