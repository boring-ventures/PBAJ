"use client";

import { useState } from "react";
import { useLanguage } from "@/context/language-context";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, ArrowRight, User } from "lucide-react";
import { format } from "date-fns";
import { es, enUS } from "date-fns/locale";
import NewsModal from "./NewsModal";

interface FeaturedNewsProps {
  news?: LocalizedNews[];
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

export default function FeaturedNews({ news = [] }: FeaturedNewsProps) {
  const { locale } = useLanguage();
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

  const handleViewDetails = (newsItem: LocalizedNews) => {
    setSelectedNews(newsItem);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedNews(null);
  };

  if (!news || news.length === 0) {
    return null;
  }

  return (
    <>
      <div className="mb-16">
        <div className="flex items-center mb-8">
          <h2 className="text-6xl font-bold" style={{ color: "#000000" }}>
            {locale === "es" ? "Noticias Destacadas" : "Featured News"}
          </h2>
        </div>

        {/* Single Row Layout for Featured News */}
        <div className="flex gap-6 overflow-x-auto pb-4">
          {news.map((article, index) => (
            <div
              key={article.id}
              className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out overflow-hidden w-80 h-[520px] flex flex-col hover:-translate-y-2 flex-shrink-0"
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
                  onClick={() => handleViewDetails(article)}
                >
                  {article.title}
                </h3>

                {/* Description */}
                {article.excerpt && (
                  <div
                    className="text-sm mb-4 line-clamp-3 flex-shrink-0"
                    style={{ color: "#666666", lineHeight: "1.5" }}
                  >
                    {renderContent(article.excerpt)}
                  </div>
                )}

                {/* Additional Details */}
                <div className="space-y-2 mb-4 flex-shrink-0">
                  {article.publishDate && (
                    <div
                      className="flex items-center text-xs"
                      style={{ color: "#666666" }}
                    >
                      <Calendar
                        className="h-3 w-3 mr-2"
                        style={{ color: "#D93069" }}
                      />
                      <span>{formatDate(new Date(article.publishDate))}</span>
                    </div>
                  )}
                  {article.author && (
                    <div
                      className="flex items-center text-xs"
                      style={{ color: "#666666" }}
                    >
                      <User
                        className="h-3 w-3 mr-2"
                        style={{ color: "#5A3B85" }}
                      />
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
                    <Calendar className="h-3 w-3 mr-1" />
                    <span>
                      {article.publishDate &&
                        formatDate(new Date(article.publishDate))}
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
                  {locale === "es" ? "Ver noticia" : "View News"}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
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
