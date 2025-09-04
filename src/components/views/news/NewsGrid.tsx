"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, ArrowRight, User } from "lucide-react";
import { ChevronDownIcon, ChevronUpIcon } from "@radix-ui/react-icons";
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
  const [showAllNews, setShowAllNews] = useState(false);

  const toggleShowAllNews = () => {
    setShowAllNews(!showAllNews);
  };

  // Show only first 6 news initially
  const initialNews = news.slice(0, 6);
  const remainingNews = news.slice(6);

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
        <div className="flex justify-end mb-8">
          <Button
            onClick={toggleShowAllNews}
            className="flex items-center gap-2 rounded-full px-6 py-3 font-semibold transition-all duration-300"
            style={{ 
              backgroundColor: "#000000",
              color: "white"
            }}
          >
            {showAllNews ? (
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

        {/* Initial News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {initialNews.map((article) => (
            <div
              key={article.id}
              className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out overflow-hidden w-full h-[520px] flex flex-col hover:-translate-y-2"
              style={{
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
              }}
            >
              {/* Image Section - Fixed Height */}
              <div className="relative h-48 overflow-hidden flex-shrink-0">
                {article.featuredImageUrl ? (
                  <img
                    src={article.featuredImageUrl}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col items-center justify-center">
                    <div className="text-5xl mb-2">📰</div>
                    <div className="text-gray-600 text-sm">
                      {locale === "es" ? "Noticia" : "News"}
                    </div>
                  </div>
                )}

                {/* Category Badge - Top Left */}
                {article.category && (
                  <div className="absolute top-4 left-4">
                    <Badge
                      className={`${getCategoryColor(article.category)} border-none rounded-xl px-3 py-1 text-xs font-semibold shadow-sm text-white`}
                    >
                      {article.category}
                    </Badge>
                  </div>
                )}

                {/* New Badge - Top Right */}
                {article.publishDate &&
                  new Date(article.publishDate) >
                    new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) && (
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-red-500 text-white border-none rounded-xl px-3 py-1 text-xs font-semibold shadow-sm">
                        {locale === "es" ? "Nuevo" : "New"}
                      </Badge>
                    </div>
                  )}
              </div>

              {/* Content Section - Flexible Height */}
              <div className="p-6 flex-1 flex flex-col">
                {/* Title */}
                <h3
                  className="text-lg font-bold mb-3 line-clamp-2 group-hover:text-primary transition-colors cursor-pointer"
                  style={{ color: "#1a1a1a", lineHeight: "1.3" }}
                  onClick={() => handleViewDetails(article)}
                >
                  {article.title}
                </h3>

                {/* Excerpt */}
                {article.excerpt && (
                  <p
                    className="text-sm mb-4 line-clamp-3 flex-shrink-0"
                    style={{ color: "#666666", lineHeight: "1.5" }}
                  >
                    {cleanContent(article.excerpt)}
                  </p>
                )}

                {/* Meta Information */}
                <div className="space-y-2 mb-4 flex-shrink-0">
                  {article.publishDate && (
                    <div
                      className="flex items-center text-xs"
                      style={{ color: "#666666" }}
                    >
                      <Calendar className="h-3 w-3 mr-2" />
                      <span>{formatDate(new Date(article.publishDate))}</span>
                    </div>
                  )}
                  {article.author && (
                    <div
                      className="flex items-center text-xs"
                      style={{ color: "#666666" }}
                    >
                      <User className="h-3 w-3 mr-2" />
                      <span>
                        {article.author.firstName} {article.author.lastName}
                      </span>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto flex-shrink-0">
                  <div
                    className="flex items-center text-xs"
                    style={{ color: "#888888" }}
                  >
                    <span>
                      {article.publishDate && formatDate(new Date(article.publishDate))}
                    </span>
                  </div>
                  <button
                    onClick={() => handleViewDetails(article)}
                    className="text-sm font-semibold transition-colors cursor-pointer hover:underline"
                    style={{ color: "#D93069" }}
                  >
                    {locale === "es" ? "Ver más" : "Learn more"}
                  </button>
                </div>

                {/* Action Button */}
                <Button
                  onClick={() => handleViewDetails(article)}
                  className="w-full mt-4 border-none py-3 font-semibold transition-all duration-300 ease-in-out hover:-translate-y-1 flex items-center justify-center gap-2 flex-shrink-0 hover:shadow-lg"
                  style={{
                    backgroundColor: "#000000",
                    color: "white",
                    borderRadius: "25px",
                  }}
                >
                  {locale === "es" ? "Ver detalles" : "View details"}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Expanded News Grid */}
        {showAllNews && remainingNews.length > 0 && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {remainingNews.map((article) => (
              <div
                key={article.id}
                className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out overflow-hidden w-full h-[520px] flex flex-col hover:-translate-y-2"
                style={{
                  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
                }}
              >
                {/* Image Section - Fixed Height */}
                <div className="relative h-48 overflow-hidden flex-shrink-0">
                  {article.featuredImageUrl ? (
                    <img
                      src={article.featuredImageUrl}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col items-center justify-center">
                      <div className="text-5xl mb-2">📰</div>
                      <div className="text-gray-600 text-sm">
                        {locale === "es" ? "Noticia" : "News"}
                      </div>
                    </div>
                  )}

                  {/* Category Badge - Top Left */}
                  {article.category && (
                    <div className="absolute top-4 left-4">
                      <Badge
                        className={`${getCategoryColor(article.category)} border-none rounded-xl px-3 py-1 text-xs font-semibold shadow-sm text-white`}
                      >
                        {article.category}
                      </Badge>
                    </div>
                  )}

                  {/* New Badge - Top Right */}
                  {article.publishDate &&
                    new Date(article.publishDate) >
                      new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) && (
                      <div className="absolute top-4 right-4">
                        <Badge className="bg-red-500 text-white border-none rounded-xl px-3 py-1 text-xs font-semibold shadow-sm">
                          {locale === "es" ? "Nuevo" : "New"}
                        </Badge>
                      </div>
                    )}
                </div>

                {/* Content Section - Flexible Height */}
                <div className="p-6 flex-1 flex flex-col">
                  {/* Title */}
                  <h3
                    className="text-lg font-bold mb-3 line-clamp-2 group-hover:text-primary transition-colors cursor-pointer"
                    style={{ color: "#1a1a1a", lineHeight: "1.3" }}
                    onClick={() => handleViewDetails(article)}
                  >
                    {article.title}
                  </h3>

                  {/* Excerpt */}
                  {article.excerpt && (
                    <p
                      className="text-sm mb-4 line-clamp-3 flex-shrink-0"
                      style={{ color: "#666666", lineHeight: "1.5" }}
                    >
                      {cleanContent(article.excerpt)}
                    </p>
                  )}

                  {/* Meta Information */}
                  <div className="space-y-2 mb-4 flex-shrink-0">
                    {article.publishDate && (
                      <div
                        className="flex items-center text-xs"
                        style={{ color: "#666666" }}
                      >
                        <Calendar className="h-3 w-3 mr-2" />
                        <span>{formatDate(new Date(article.publishDate))}</span>
                      </div>
                    )}
                    {article.author && (
                      <div
                        className="flex items-center text-xs"
                        style={{ color: "#666666" }}
                      >
                        <User className="h-3 w-3 mr-2" />
                        <span>
                          {article.author.firstName} {article.author.lastName}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto flex-shrink-0">
                    <div
                      className="flex items-center text-xs"
                      style={{ color: "#888888" }}
                    >
                      <span>
                        {article.publishDate && formatDate(new Date(article.publishDate))}
                      </span>
                    </div>
                    <button
                      onClick={() => handleViewDetails(article)}
                      className="text-sm font-semibold transition-colors cursor-pointer hover:underline"
                      style={{ color: "#D93069" }}
                    >
                      {locale === "es" ? "Ver más" : "Learn more"}
                    </button>
                  </div>

                  {/* Action Button */}
                  <Button
                    onClick={() => handleViewDetails(article)}
                    className="w-full mt-4 border-none py-3 font-semibold transition-all duration-300 ease-in-out hover:-translate-y-1 flex items-center justify-center gap-2 flex-shrink-0 hover:shadow-lg"
                    style={{
                      backgroundColor: "#000000",
                      color: "white",
                      borderRadius: "25px",
                    }}
                  >
                    {locale === "es" ? "Ver detalles" : "View details"}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

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
