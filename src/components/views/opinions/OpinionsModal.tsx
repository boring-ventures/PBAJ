"use client";

import { format } from "date-fns";
import { es, enUS } from "date-fns/locale";
import { useLanguage } from "@/context/language-context";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Calendar, User } from "lucide-react";

interface LocalizedOpinion {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  category?: string;
  featuredImageUrl?: string;
  publishDate?: string;
  author?: {
    firstName?: string;
    lastName?: string;
  };
}

interface OpinionsModalProps {
  opinion: LocalizedOpinion | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function OpinionsModal({
  opinion,
  isOpen,
  onClose,
}: OpinionsModalProps) {
  const { locale } = useLanguage();

  if (!opinion) return null;

  const formatDate = (date: Date) => {
    return format(date, "dd MMM yyyy", {
      locale: locale === "es" ? es : enUS,
    });
  };

  const getCategoryColor = (category?: string) => {
    const colorMap: Record<string, string> = {
      ANALYSIS: "bg-blue-500",
      COMMENTARY: "bg-green-500",
      EDITORIAL: "bg-red-500",
      PERSPECTIVE: "bg-purple-500",
      REVIEW: "bg-orange-500",
      OPINION_PIECE: "bg-indigo-500",
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
            {opinion.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Featured Image */}
          {opinion.featuredImageUrl && (
            <div className="aspect-[16/9] bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={opinion.featuredImageUrl}
                alt={opinion.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Meta Information */}
          <div className="flex items-center gap-4 text-sm text-gray-600 border-b border-gray-200 pb-4">
            {opinion.category && (
              <Badge
                className={`${getCategoryColor(opinion.category)} text-white border-none`}
              >
                {opinion.category}
              </Badge>
            )}

            {opinion.publishDate && (
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                {formatDate(new Date(opinion.publishDate))}
              </div>
            )}

            {opinion.author && (
              <div className="flex items-center">
                <User className="h-4 w-4 mr-2" />
                {opinion.author.firstName} {opinion.author.lastName}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="space-y-4">{renderContent(opinion.content)}</div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
