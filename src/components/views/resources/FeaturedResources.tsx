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
      [MediaCategory.MULTIMEDIA]: "bg-blue-500",
      [MediaCategory.DOCUMENTS]: "bg-green-500",
      [MediaCategory.EDUCATIONAL]: "bg-purple-500",
      [MediaCategory.REPORTS]: "bg-orange-500",
      [MediaCategory.GUIDES]: "bg-indigo-500",
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
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                {locale === "es" ? "Recursos Destacados" : "Featured Resources"}
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl">
                {locale === "es"
                  ? "Los recursos más relevantes y utilizados de nuestra biblioteca"
                  : "The most relevant and used resources from our library"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {resources.map((resource, index) => {
              const FileIcon = FILE_TYPE_ICONS[resource.type];
              
              return (
                <Card
                  key={resource.id}
                  className={`group hover:shadow-lg transition-all duration-300 overflow-hidden ${
                    index === 0 && resources.length >= 3
                      ? "lg:col-span-2 lg:row-span-2"
                      : ""
                  }`}
                >
                  <CardHeader className="p-0">
                    {resource.thumbnailUrl || resource.type === MediaType.IMAGE ? (
                      <div
                        className={`bg-muted relative overflow-hidden ${
                          index === 0 && resources.length >= 3
                            ? "aspect-[2/1]"
                            : "aspect-[4/3]"
                        }`}
                      >
                        <img
                          src={resource.thumbnailUrl || resource.url}
                          alt={resource.altText || resource.originalName}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                        {/* Category Badge */}
                        <div className="absolute top-4 left-4">
                          <Badge className={getCategoryColor(resource.category)}>
                            {resource.category}
                          </Badge>
                        </div>

                        {/* File type badge */}
                        <div className="absolute top-4 right-4">
                          <Badge className="bg-white/80 text-black">
                            {resource.type}
                          </Badge>
                        </div>

                        {/* Featured Badge for main resource */}
                        {index === 0 && resources.length >= 3 && (
                          <div className="absolute bottom-4 right-4">
                            <Badge className="bg-yellow-500 text-yellow-950">
                              {locale === "es" ? "Destacado" : "Featured"}
                            </Badge>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div
                        className={`bg-gradient-to-br from-primary/10 to-secondary/10 flex flex-col items-center justify-center relative ${
                          index === 0 && resources.length >= 3
                            ? "aspect-[2/1]"
                            : "aspect-[4/3]"
                        }`}
                      >
                        <FileIcon className="w-16 h-16 text-muted-foreground mb-2" />
                        <div className="text-muted-foreground text-center">
                          <div className="text-sm">
                            {resource.originalName}
                          </div>
                        </div>

                        {/* Category Badge */}
                        <div className="absolute top-4 left-4">
                          <Badge className={getCategoryColor(resource.category)}>
                            {resource.category}
                          </Badge>
                        </div>

                        {/* File type badge */}
                        <div className="absolute top-4 right-4">
                          <Badge variant="secondary">
                            {resource.type}
                          </Badge>
                        </div>

                        {/* Featured Badge for main resource */}
                        {index === 0 && resources.length >= 3 && (
                          <div className="absolute bottom-4 right-4">
                            <Badge className="bg-yellow-500 text-yellow-950">
                              {locale === "es" ? "Destacado" : "Featured"}
                            </Badge>
                          </div>
                        )}
                      </div>
                    )}
                  </CardHeader>

                  <CardContent className="p-6 flex-1 flex flex-col">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                        {resource.title || resource.originalName}
                      </h3>

                      {resource.description && (
                        <p className="text-muted-foreground text-sm line-clamp-3 mb-4 leading-relaxed">
                          {resource.description}
                        </p>
                      )}

                      {/* Resource Information */}
                      <div className="space-y-2 text-xs text-muted-foreground">
                        <div className="flex items-center justify-between">
                          <span>{formatFileSize(resource.fileSize)}</span>
                          <span>{locale === "es" ? "Descargas" : "Downloads"}: {resource.downloadCount}</span>
                        </div>

                        {resource.createdAt && (
                          <div className="flex items-center">
                            <Calendar className="h-3 w-3 mr-2" />
                            {formatDate(new Date(resource.createdAt))}
                          </div>
                        )}

                        {resource.uploader && (
                          <div className="flex items-center">
                            <User className="h-3 w-3 mr-2" />
                            {resource.uploader.firstName} {resource.uploader.lastName}
                          </div>
                        )}
                      </div>

                      {/* Tags */}
                      {resource.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-3">
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
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-4 pt-4 border-t border-border flex gap-2">
                      <Button
                        variant="ghost"
                        className="flex-1 group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                        onClick={() => handleViewDetails(resource)}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        {locale === "es" ? "Ver" : "View"}
                      </Button>
                      <Button
                        variant="outline"
                        asChild
                        className="flex-1"
                      >
                        <a
                          href={resource.url}
                          download
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Download className="mr-2 h-4 w-4" />
                          {locale === "es" ? "Descargar" : "Download"}
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Resources Details Modal */}
      <ResourcesModal
        resource={selectedResource}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </>
  );
}