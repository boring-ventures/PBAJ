"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, ArrowRight, User, Download, Eye, FileText, Image, Video, Music, Archive } from "lucide-react";
import { format } from "date-fns";
import { es, enUS } from "date-fns/locale";
import { MediaType, MediaCategory } from "@prisma/client";
import { formatFileSize } from "@/lib/validations/media";
import ResourcesModal from "./ResourcesModal";

interface FeaturedResourcesProps {
  resources?: LocalizedResource[];
}

interface LocalizedResource {
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

export default function FeaturedResources({ resources = [] }: FeaturedResourcesProps) {
  const params = useParams();
  const locale = (params?.locale as string) || "es";
  const [selectedResource, setSelectedResource] = useState<LocalizedResource | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const handleViewDetails = (resource: LocalizedResource) => {
    setSelectedResource(resource);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedResource(null);
  };

  if (!resources || resources.length === 0) {
    return null;
  }

  return (
    <>
      <div className="mb-16">
        <div className="flex items-center mb-8">
          <h2
            className="text-6xl font-bold"
            style={{ color: "#000000" }}
          >
            {locale === "es" ? "Recursos Destacados" : "Featured Resources"}
          </h2>
        </div>

        {/* Single Row Layout for Featured Resources */}
        <div className="flex gap-6 overflow-x-auto pb-4">
          {resources.map((resource, index) => {
            const FileIcon = FILE_TYPE_ICONS[resource.type];
            
            return (
              <div
                key={resource.id}
                className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out overflow-hidden w-80 h-[520px] flex flex-col hover:-translate-y-2 flex-shrink-0"
                style={{
                  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
                }}
              >
                {/* Image Section - Fixed Height */}
                <div className="relative h-48 overflow-hidden flex-shrink-0">
                  {resource.thumbnailUrl || resource.type === MediaType.IMAGE ? (
                    <img
                      src={resource.thumbnailUrl || resource.url}
                      alt={resource.altText || resource.originalName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col items-center justify-center">
                      <FileIcon className="w-16 h-16 text-gray-500 mb-2" />
                      <div className="text-gray-600 text-sm text-center px-4">
                        {resource.originalName}
                      </div>
                    </div>
                  )}

                  {/* Category Badge - Top Left */}
                  <div className="absolute top-4 left-4">
                    <Badge
                      className={`${getCategoryColor(resource.category)} border-none rounded-xl px-3 py-1 text-xs font-semibold shadow-sm text-white`}
                    >
                      {resource.category}
                    </Badge>
                  </div>

                  {/* Featured Badge - Top Right */}
                  <div className="absolute top-4 right-4 bg-yellow-400 text-gray-900 px-3 py-1 rounded-xl flex items-center shadow-sm">
                    <span className="text-xs font-semibold">
                      {locale === "es" ? "Destacado" : "Featured"}
                    </span>
                  </div>
                </div>

                {/* Content Section - Flexible Height */}
                <div className="p-6 flex-1 flex flex-col">
                  {/* Title */}
                  <h3
                    className="text-lg font-bold mb-3 line-clamp-2 group-hover:text-primary transition-colors cursor-pointer"
                    style={{ color: "#1a1a1a", lineHeight: "1.3" }}
                    onClick={() => handleViewDetails(resource)}
                  >
                    {resource.originalName}
                  </h3>

                  {/* Description */}
                  {resource.caption && (
                    <p
                      className="text-sm mb-4 line-clamp-3 flex-shrink-0"
                      style={{ color: "#666666", lineHeight: "1.5" }}
                    >
                      {resource.caption}
                    </p>
                  )}

                  {/* Additional Details */}
                  <div className="space-y-2 mb-4 flex-shrink-0">
                    <div
                      className="flex items-center text-xs"
                      style={{ color: "#666666" }}
                    >
                      <Download className="h-3 w-3 mr-2" style={{ color: "#D93069" }} />
                      <span>{formatFileSize(resource.fileSize)} • {locale === "es" ? "Descargas" : "Downloads"}: {resource.downloadCount}</span>
                    </div>
                    {resource.uploader && (
                      <div
                        className="flex items-center text-xs"
                        style={{ color: "#666666" }}
                      >
                        <User className="h-3 w-3 mr-2" style={{ color: "#5A3B85" }} />
                        <span>{resource.uploader.firstName} {resource.uploader.lastName}</span>
                      </div>
                    )}
                  </div>

                  {/* Tags */}
                  {resource.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4 flex-shrink-0">
                      {resource.tags.slice(0, 3).map(tag => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {resource.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{resource.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto flex-shrink-0">
                    <div
                      className="flex items-center text-xs"
                      style={{ color: "#888888" }}
                    >
                      <Calendar className="h-3 w-3 mr-1" />
                      <span>
                        {resource.createdAt && formatDate(new Date(resource.createdAt))}
                      </span>
                    </div>
                    <button
                      onClick={() => handleViewDetails(resource)}
                      className="text-sm font-semibold transition-colors cursor-pointer hover:underline"
                      style={{ color: "#D93069" }}
                    >
                      {locale === "es" ? "Ver más" : "Learn more"}
                    </button>
                  </div>

                  {/* Action Button */}
                  <Button
                    onClick={() => handleViewDetails(resource)}
                    className="w-full mt-4 border-none py-3 font-semibold transition-all duration-300 ease-in-out hover:-translate-y-1 flex items-center justify-center gap-2 flex-shrink-0 hover:shadow-lg"
                    style={{
                      backgroundColor: "#000000",
                      color: "white",
                      borderRadius: "25px",
                    }}
                  >
                    {locale === "es" ? "Ver recurso" : "View Resource"}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Resources Details Modal */}
      <ResourcesModal
        resource={selectedResource}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </>
  );
}