"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, ArrowRight, ExternalLink } from "lucide-react";
import { format } from "date-fns";
import { es, enUS } from "date-fns/locale";
import { useLanguage } from "@/context/language-context";

interface NewsModalProps {
  news: NewsItem | null;
  isOpen: boolean;
  onClose: () => void;
}

interface NewsItem {
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

export default function NewsModal({ news, isOpen, onClose }: NewsModalProps) {
  const { locale } = useLanguage();

  if (!news) return null;

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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900">
            {news.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Featured Image */}
          {news.featuredImageUrl && (
            <div className="aspect-[16/9] bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={news.featuredImageUrl}
                alt={news.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Meta Information */}
          <div className="flex items-center gap-4 text-sm text-gray-600 border-b border-gray-200 pb-4">
            {news.category && (
              <Badge
                className={`${getCategoryColor(news.category)} text-white border-none`}
              >
                {news.category}
              </Badge>
            )}

            {news.publishDate && (
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                {formatDate(new Date(news.publishDate))}
              </div>
            )}

            {news.author && (
              <div className="flex items-center">
                <User className="h-4 w-4 mr-2" />
                {news.author.firstName} {news.author.lastName}
              </div>
            )}
          </div>

          {/* Excerpt */}
          {news.excerpt && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {locale === "es" ? "Resumen" : "Summary"}
              </h3>
              <p className="text-gray-700 leading-relaxed text-lg">
                {news.excerpt}
              </p>
            </div>
          )}

          {/* Content */}
          {news.content && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {locale === "es" ? "Contenido" : "Content"}
              </h3>
              <div className="text-gray-700 leading-relaxed">
                {renderContent(news.content)}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              {locale === "es" ? "Cerrar" : "Close"}
            </button>
            <a
              href={`/news/${news.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              {locale === "es" ? "Leer completo" : "Read full article"}
              <ExternalLink className="h-4 w-4 ml-2" />
            </a>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
