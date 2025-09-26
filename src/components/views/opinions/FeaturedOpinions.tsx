"use client";

import { useState } from "react";
import { format } from "date-fns";
import { es, enUS } from "date-fns/locale";
import { useLanguage } from "@/context/language-context";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, User, ArrowRight } from "lucide-react";
import OpinionsModal from "./OpinionsModal";

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

interface FeaturedOpinionsProps {
  opinions?: LocalizedOpinion[];
}

export default function FeaturedOpinions({
  opinions = [],
}: FeaturedOpinionsProps) {
  const { locale } = useLanguage();
  const [selectedOpinion, setSelectedOpinion] =
    useState<LocalizedOpinion | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (opinions.length === 0) {
    return null;
  }

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

  const handleViewDetails = (opinion: LocalizedOpinion) => {
    setSelectedOpinion(opinion);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="mb-16">
        <div className="flex items-center mb-8">
          <h2 className="text-4xl font-bold" style={{ color: "#000000" }}>
            Opiniones Destacadas
          </h2>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {opinions.map((opinion) => (
            <div
              key={opinion.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              {/* Featured Image */}
              {opinion.featuredImageUrl && (
                <div className="aspect-[16/9] bg-gray-100 overflow-hidden">
                  <img
                    src={opinion.featuredImageUrl}
                    alt={opinion.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}

              <div className="p-6">
                {/* Category Badge */}
                {opinion.category && (
                  <Badge
                    className={`${getCategoryColor(opinion.category)} text-white border-none mb-3`}
                  >
                    {opinion.category}
                  </Badge>
                )}

                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                  {opinion.title}
                </h3>

                {/* Excerpt */}
                {opinion.excerpt && (
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {opinion.excerpt}
                  </p>
                )}

                {/* Meta Information */}
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                  {opinion.publishDate && (
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {formatDate(new Date(opinion.publishDate))}
                    </div>
                  )}

                  {opinion.author && (
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-1" />
                      {opinion.author.firstName} {opinion.author.lastName}
                    </div>
                  )}
                </div>

                {/* Read More Button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleViewDetails(opinion)}
                  className="w-full group"
                >
                  Leer más
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      <OpinionsModal
        opinion={selectedOpinion}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
