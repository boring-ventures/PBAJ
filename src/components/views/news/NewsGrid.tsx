"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, ArrowRight, User } from "lucide-react";
import { format } from "date-fns";
import { es, enUS } from "date-fns/locale";
import NewsModal from "./NewsModal";

interface NewsGridProps {
  news?: LocalizedNews[];
  currentPage?: number;
  totalPages?: number;
  totalResults?: number;
}

interface LocalizedNews {
  id: string;
  title: string;
  content?: string;
  excerpt?: string;
  featuredImageUrl?: string;
  category?: string;
  publishDate?: string;
  author?: {
    firstName?: string;
    lastName?: string;
  };
}

export default function NewsGrid({
  news = [],
  currentPage = 1,
  totalPages = 1,
  totalResults = 0,
}: NewsGridProps) {
  const params = useParams();
  const locale = (params?.locale as string) || "es";
  const [selectedNews, setSelectedNews] = useState<LocalizedNews | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const formatDate = (date: Date) => {
    return format(date, "dd MMM yyyy", {
      locale: locale === "es" ? es : enUS,
    });
  };

  const getCategoryColor = (category?: string) => {
    const colorMap: Record<string, string> = {
      POLICY: "bg-blue-500",
      EDUCATION: "bg-green-500",
      HEALTH: "bg-red-500",
      ENVIRONMENT: "bg-emerald-500",
      CULTURE: "bg-purple-500",
      TECHNOLOGY: "bg-indigo-500",
      SOCIAL: "bg-pink-500",
      ECONOMY: "bg-orange-500",
    };
    return colorMap[category || ""] || "bg-gray-500";
  };

  const cleanContent = (content?: string) => {
    if (!content) return "";
    // Remove HTML tags and clean the content
    return content.replace(/<[^>]*>/g, "").trim();
  };

  const handleViewDetails = (newsItem: LocalizedNews) => {
    setSelectedNews(newsItem);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedNews(null);
  };

  if (!news || news.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-muted-foreground mb-4">
          {locale === "es" ? "No se encontraron noticias" : "No news found"}
        </div>
        <Button variant="outline">
          {locale === "es" ? "Volver" : "Go back"}
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-12">
        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {(news || []).map((article) => (
            <Card
              key={article.id}
              className="group hover:shadow-lg transition-all duration-300 overflow-hidden h-full flex flex-col"
            >
              <CardHeader className="p-0">
                {article.featuredImageUrl ? (
                  <div className="aspect-[4/3] bg-muted relative overflow-hidden">
                    <img
                      src={article.featuredImageUrl}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                    {/* Category Badge */}
                    <div className="absolute top-4 left-4">
                      <Badge className={getCategoryColor(article.category)}>
                        {article.category}
                      </Badge>
                    </div>

                    {/* Time indicator for recent articles */}
                    {article.publishDate &&
                      new Date(article.publishDate) >
                        new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) && (
                        <div className="absolute top-4 right-4">
                          <Badge className="bg-red-500 text-white">
                            {locale === "es" ? "Nuevo" : "New"}
                          </Badge>
                        </div>
                      )}
                  </div>
                ) : (
                  <div className="aspect-[4/3] bg-gradient-to-br from-primary/10 to-secondary/10 flex flex-col items-center justify-center">
                    <div className="text-muted-foreground text-center">
                      <div className="text-4xl mb-2">📰</div>
                      <div className="text-sm">
                        {locale === "es" ? "Sin imagen" : "No image"}
                      </div>
                    </div>
                  </div>
                )}
              </CardHeader>

              <CardContent className="p-6 flex-1 flex flex-col">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                    {article.title}
                  </h3>

                  {article.excerpt && (
                    <p className="text-muted-foreground text-sm line-clamp-3 mb-4 leading-relaxed">
                      {cleanContent(article.excerpt)}
                    </p>
                  )}

                  {/* Meta Information */}
                  <div className="space-y-2 text-xs text-muted-foreground">
                    {article.publishDate && (
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-2" />
                        {formatDate(new Date(article.publishDate))}
                      </div>
                    )}

                    {article.author && (
                      <div className="flex items-center">
                        <User className="h-3 w-3 mr-2" />
                        {article.author.firstName} {article.author.lastName}
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Button */}
                <div className="mt-4 pt-4 border-t border-border">
                  <Button
                    variant="ghost"
                    className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                    onClick={() => handleViewDetails(article)}
                  >
                    {locale === "es" ? "Ver detalles" : "View details"}
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center space-x-2">
            <Button
              variant="outline"
              disabled={currentPage <= 1}
              className="px-4 py-2"
            >
              {locale === "es" ? "Anterior" : "Previous"}
            </Button>
            <span className="px-4 py-2 text-muted-foreground">
              {locale === "es" ? "Página" : "Page"} {currentPage}{" "}
              {locale === "es" ? "de" : "of"} {totalPages}
            </span>
            <Button
              variant="outline"
              disabled={currentPage >= totalPages}
              className="px-4 py-2"
            >
              {locale === "es" ? "Siguiente" : "Next"}
            </Button>
          </div>
        )}
      </div>

      {/* News Details Modal */}
      <NewsModal
        news={selectedNews}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </>
  );
}
