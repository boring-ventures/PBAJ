"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DownloadIcon,
  EyeOpenIcon,
  FileTextIcon,
  CalendarIcon,
} from "@radix-ui/react-icons";
import type { LocalizedPublication } from "@/lib/content/content-utils";
import { format } from "date-fns";
import { es, enUS } from "date-fns/locale";

interface FeaturedPublicationsProps {
  publications: LocalizedPublication[];
}

export default function FeaturedPublications({
  publications,
}: FeaturedPublicationsProps) {
  const params = useParams();
  const locale = params.locale as string;

  const formatDate = (date: Date) => {
    return format(date, "MMM yyyy", {
      locale: locale === "es" ? es : enUS,
    });
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "";
    const sizes = ["Bytes", "KB", "MB", "GB"];
    if (bytes === 0) return "0 Byte";
    const i = parseInt(String(Math.floor(Math.log(bytes) / Math.log(1024))));
    return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i];
  };

  const getTypeIcon = (type: string) => {
    return FileTextIcon; // Could be expanded with different icons per type
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      RESEARCH: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      REPORT:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      GUIDE:
        "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
      PUBLICATION:
        "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
      MANUAL:
        "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200",
    };
    return (
      colors[type] ||
      "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    );
  };

  if (publications.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-secondary/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              {locale === "es"
                ? "Publicaciones Destacadas"
                : "Featured Publications"}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl">
              {locale === "es"
                ? "Las publicaciones más relevantes y accedidas de nuestra biblioteca digital"
                : "The most relevant and accessed publications from our digital library"}
            </p>
          </div>

          <Button asChild variant="outline">
            <Link href={`/${locale}/library`}>
              {locale === "es" ? "Ver todas" : "View all"}
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {publications.map((publication) => {
            const IconComponent = getTypeIcon(publication.type);

            return (
              <Card
                key={publication.id}
                className="group hover:shadow-lg transition-all duration-300 overflow-hidden h-full flex flex-col"
              >
                <CardHeader className="p-0">
                  {publication.coverImageUrl ? (
                    <div className="aspect-[3/4] bg-muted relative overflow-hidden">
                      <img
                        src={publication.coverImageUrl}
                        alt={publication.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                      {/* Type Badge */}
                      <div className="absolute top-4 left-4">
                        <Badge className={getTypeColor(publication.type)}>
                          {publication.type}
                        </Badge>
                      </div>

                      {/* Featured Badge */}
                      <div className="absolute top-4 right-4">
                        <Badge className="bg-yellow-500 text-yellow-950">
                          {locale === "es" ? "Destacado" : "Featured"}
                        </Badge>
                      </div>
                    </div>
                  ) : (
                    <div className="aspect-[3/4] bg-gradient-to-br from-primary/10 to-secondary/10 flex flex-col items-center justify-center">
                      <IconComponent className="h-16 w-16 text-primary mb-4" />
                      <div className="text-muted-foreground text-sm text-center px-4">
                        {publication.fileName || publication.title}
                      </div>
                    </div>
                  )}
                </CardHeader>

                <CardContent className="p-6 flex-1 flex flex-col">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                      <Link href={`/${locale}/library/${publication.id}`}>
                        {publication.title}
                      </Link>
                    </h3>

                    {publication.description && (
                      <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                        {publication.description}
                      </p>
                    )}

                    {/* Publication Details */}
                    <div className="space-y-2 mb-4">
                      {publication.publishDate && (
                        <div className="flex items-center text-xs text-muted-foreground">
                          <CalendarIcon className="h-3 w-3 mr-2" />
                          <span>
                            {formatDate(new Date(publication.publishDate))}
                          </span>
                        </div>
                      )}

                      {publication.fileSize && (
                        <div className="text-xs text-muted-foreground">
                          📄 {formatFileSize(publication.fileSize)}
                        </div>
                      )}

                      {publication.author && (
                        <div className="text-xs text-muted-foreground">
                          ✍️ {publication.author.firstName}{" "}
                          {publication.author.lastName}
                        </div>
                      )}
                    </div>

                    {/* Tags */}
                    {publication.tags && publication.tags.length > 0 && (
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-1">
                          {publication.tags.slice(0, 2).map((tag, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="text-xs"
                            >
                              {tag}
                            </Badge>
                          ))}
                          {publication.tags.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{publication.tags.length - 2}
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Footer Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-border mt-auto">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <EyeOpenIcon className="h-3 w-3" />
                        <span>{publication.viewCount}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <DownloadIcon className="h-3 w-3" />
                        <span>{publication.downloadCount}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" asChild>
                        <Link href={`/${locale}/library/${publication.id}`}>
                          {locale === "es" ? "Ver" : "View"}
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
