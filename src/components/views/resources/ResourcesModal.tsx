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
  description?: string;
  width?: number;
  height?: number;
  duration?: number;
  tags: string[];
  folder?: string;
  title?: string;
  downloadCount: number;
  usageCount: number;
  isPublic: boolean;
  isOptimized: boolean;
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
      [MediaCategory.MULTIMEDIA]: "bg-blue-500",
      [MediaCategory.DOCUMENTS]: "bg-green-500",
      [MediaCategory.EDUCATIONAL]: "bg-purple-500",
      [MediaCategory.REPORTS]: "bg-orange-500",
      [MediaCategory.GUIDES]: "bg-indigo-500",
    };
    return colorMap[category || ""] || "bg-gray-500";
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const FileIcon = FILE_TYPE_ICONS[resource.type];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900">
            {resource.title || resource.originalName}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Preview */}
          <div className="space-y-4">
            {resource.type === MediaType.IMAGE ? (
              <img
                src={resource.thumbnailUrl || resource.url}
                alt={resource.altText || resource.originalName}
                className="w-full h-auto max-h-96 object-contain rounded border"
              />
            ) : resource.type === MediaType.VIDEO ? (
              <video
                src={resource.url}
                controls
                className="w-full h-auto max-h-96 rounded border"
              />
            ) : resource.type === MediaType.AUDIO ? (
              <audio src={resource.url} controls className="w-full" />
            ) : (
              <div className="flex items-center justify-center h-64 border rounded bg-muted">
                <div className="text-center">
                  <FileIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-sm text-muted-foreground">
                    {locale === "es" ? "Vista previa no disponible" : "Preview not available"}
                  </p>
                  <Button className="mt-4" asChild>
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
          </div>

          {/* Metadata */}
          <div className="space-y-4">
            <div>
              <Label className="text-xs text-muted-foreground">
                {locale === "es" ? "ARCHIVO" : "FILE"}
              </Label>
              <p className="font-medium">{resource.originalName}</p>
            </div>

            {resource.altText && (
              <div>
                <Label className="text-xs text-muted-foreground">
                  {locale === "es" ? "TEXTO ALT" : "ALT TEXT"}
                </Label>
                <p>{resource.altText}</p>
              </div>
            )}

            {resource.caption && (
              <div>
                <Label className="text-xs text-muted-foreground">
                  {locale === "es" ? "LEYENDA" : "CAPTION"}
                </Label>
                <p>{resource.caption}</p>
              </div>
            )}

            {resource.description && (
              <div>
                <Label className="text-xs text-muted-foreground">
                  {locale === "es" ? "DESCRIPCIÓN" : "DESCRIPTION"}
                </Label>
                <p>{resource.description}</p>
              </div>
            )}

            <div>
              <Label className="text-xs text-muted-foreground">
                {locale === "es" ? "CATEGORÍA" : "CATEGORY"}
              </Label>
              <div className="flex items-center gap-2 mt-1">
                <Badge className={getCategoryColor(resource.category)}>
                  {MEDIA_CATEGORY_OPTIONS.find(opt => opt.value === resource.category)?.label}
                </Badge>
              </div>
            </div>

            <div>
              <Label className="text-xs text-muted-foreground">
                {locale === "es" ? "TIPO" : "TYPE"}
              </Label>
              <p>{resource.type}</p>
            </div>

            {resource.folder && (
              <div>
                <Label className="text-xs text-muted-foreground">
                  {locale === "es" ? "CARPETA" : "FOLDER"}
                </Label>
                <p>{resource.folder}</p>
              </div>
            )}

            {resource.tags.length > 0 && (
              <div>
                <Label className="text-xs text-muted-foreground">
                  {locale === "es" ? "ETIQUETAS" : "TAGS"}
                </Label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {resource.tags.map(tag => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div>
                <Label className="text-xs text-muted-foreground">
                  {locale === "es" ? "TAMAÑO" : "SIZE"}
                </Label>
                <p>{formatFileSize(resource.fileSize)}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">
                  {locale === "es" ? "DESCARGAS" : "DOWNLOADS"}
                </Label>
                <p>{resource.downloadCount}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">
                  {locale === "es" ? "USOS" : "USES"}
                </Label>
                <p>{resource.usageCount}</p>
              </div>
              {resource.createdAt && (
                <div>
                  <Label className="text-xs text-muted-foreground">
                    {locale === "es" ? "FECHA" : "DATE"}
                  </Label>
                  <p>{formatDate(new Date(resource.createdAt))}</p>
                </div>
              )}
            </div>

            {resource.uploader && (
              <div className="pt-2 border-t">
                <Label className="text-xs text-muted-foreground">
                  {locale === "es" ? "SUBIDO POR" : "UPLOADED BY"}
                </Label>
                <div className="flex items-center mt-1">
                  <User className="h-3 w-3 mr-2" />
                  <span>{resource.uploader.firstName} {resource.uploader.lastName}</span>
                </div>
              </div>
            )}

            <div className="flex gap-2 pt-4 border-t">
              <Button onClick={() => copyToClipboard(resource.url)} variant="outline" className="flex-1">
                <Copy className="w-4 h-4 mr-2" />
                {locale === "es" ? "Copiar URL" : "Copy URL"}
              </Button>
              <Button asChild variant="outline" className="flex-1">
                <a href={resource.url} download>
                  <Download className="w-4 h-4 mr-2" />
                  {locale === "es" ? "Descargar" : "Download"}
                </a>
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}