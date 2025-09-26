"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface OpinionsFilterProps {
  categories?: string[];
}

const opinionCategories = [
  { value: "ANALYSIS", label: "Análisis", color: "bg-blue-500" },
  { value: "COMMENTARY", label: "Comentario", color: "bg-green-500" },
  { value: "EDITORIAL", label: "Editorial", color: "bg-red-500" },
  { value: "PERSPECTIVE", label: "Perspectiva", color: "bg-purple-500" },
  { value: "REVIEW", label: "Reseña", color: "bg-orange-500" },
  {
    value: "OPINION_PIECE",
    label: "Artículo de Opinión",
    color: "bg-indigo-500",
  },
];

export default function OpinionsFilter({
  categories = [],
}: OpinionsFilterProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
  };

  return (
    <div className="flex flex-wrap justify-center gap-2">
      {opinionCategories.map((category) => (
        <Button
          key={category.value}
          variant={
            selectedCategories.includes(category.value) ? "default" : "outline"
          }
          size="sm"
          onClick={() => toggleCategory(category.value)}
          className={`${
            selectedCategories.includes(category.value)
              ? category.color
              : "bg-white hover:bg-gray-50"
          } text-white border-none`}
        >
          {category.label}
        </Button>
      ))}

      {selectedCategories.length > 0 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearFilters}
          className="text-gray-500 hover:text-gray-700"
        >
          <X className="h-4 w-4 mr-1" />
          Limpiar
        </Button>
      )}
    </div>
  );
}
