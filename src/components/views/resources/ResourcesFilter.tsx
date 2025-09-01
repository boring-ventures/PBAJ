"use client";

import { useRouter, useSearchParams, useParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { MediaType, MediaCategory } from "@prisma/client";

interface ResourcesFilterProps {
  categories?: any[];
}

export default function ResourcesFilter({ categories = [] }: ResourcesFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  const locale = (params?.locale as string) || "es";

  const currentCategory = searchParams?.get("category") || "all";
  const currentType = searchParams?.get("type") || "all";

  const handleFilterChange = (key: string, value: string) => {
    const current = new URLSearchParams(
      Array.from(searchParams?.entries() || [])
    );

    if (value && value !== "all") {
      current.set(key, value);
    } else {
      current.delete(key);
    }

    // Reset to first page when filtering
    current.delete("page");

    const search = current.toString();
    const query = search ? `?${search}` : "";

    router.push(`/${locale}/resources${query}`);
  };

  const mediaCategories = [
    {
      value: "all",
      label: locale === "es" ? "Todas las categorías" : "All categories",
    },
    { 
      value: MediaCategory.MULTIMEDIA, 
      label: locale === "es" ? "Multimedia" : "Multimedia" 
    },
    { 
      value: MediaCategory.DOCUMENTS, 
      label: locale === "es" ? "Documentos" : "Documents" 
    },
    {
      value: MediaCategory.EDUCATIONAL,
      label: locale === "es" ? "Educativo" : "Educational",
    },
    { 
      value: MediaCategory.REPORTS, 
      label: locale === "es" ? "Reportes" : "Reports" 
    },
    {
      value: MediaCategory.GUIDES,
      label: locale === "es" ? "Guías" : "Guides",
    },
  ];

  const mediaTypes = [
    {
      value: "all",
      label: locale === "es" ? "Todos los tipos" : "All types",
    },
    { 
      value: MediaType.IMAGE, 
      label: locale === "es" ? "Imágenes" : "Images" 
    },
    { 
      value: MediaType.VIDEO, 
      label: locale === "es" ? "Videos" : "Videos" 
    },
    { 
      value: MediaType.AUDIO, 
      label: locale === "es" ? "Audio" : "Audio" 
    },
    { 
      value: MediaType.DOCUMENT, 
      label: locale === "es" ? "Documentos" : "Documents" 
    },
    { 
      value: MediaType.ARCHIVE, 
      label: locale === "es" ? "Archivos" : "Archives" 
    },
  ];

  const activeFilters = [];
  if (currentCategory !== "all") {
    const categoryLabel = mediaCategories.find(
      (c) => c.value === currentCategory
    )?.label;
    if (categoryLabel)
      activeFilters.push({ key: "category", label: categoryLabel });
  }

  if (currentType !== "all") {
    const typeLabel = mediaTypes.find(
      (t) => t.value === currentType
    )?.label;
    if (typeLabel)
      activeFilters.push({ key: "type", label: typeLabel });
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Category Filter */}
        <div>
          <label className="text-sm font-medium text-muted-foreground mb-2 block">
            {locale === "es" ? "Categoría" : "Category"}
          </label>
          <Select
            value={currentCategory}
            onValueChange={(value) => handleFilterChange("category", value)}
          >
            <SelectTrigger>
              <SelectValue
                placeholder={
                  locale === "es" ? "Seleccionar categoría" : "Select category"
                }
              />
            </SelectTrigger>
            <SelectContent>
              {mediaCategories.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Type Filter */}
        <div>
          <label className="text-sm font-medium text-muted-foreground mb-2 block">
            {locale === "es" ? "Tipo de archivo" : "File type"}
          </label>
          <Select
            value={currentType}
            onValueChange={(value) => handleFilterChange("type", value)}
          >
            <SelectTrigger>
              <SelectValue
                placeholder={
                  locale === "es" ? "Seleccionar tipo" : "Select type"
                }
              />
            </SelectTrigger>
            <SelectContent>
              {mediaTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Active Filters */}
      {activeFilters.length > 0 && (
        <div className="space-y-2">
          <div className="text-sm font-medium text-muted-foreground">
            {locale === "es" ? "Filtros activos:" : "Active filters:"}
          </div>
          <div className="flex flex-wrap gap-2">
            {activeFilters.map((filter) => (
              <Badge
                key={filter.key}
                variant="secondary"
                className="flex items-center gap-2"
              >
                {filter.label}
                <button
                  onClick={() => handleFilterChange(filter.key, "all")}
                  className="text-muted-foreground hover:text-foreground ml-1"
                >
                  ×
                </button>
              </Badge>
            ))}
            <button
              onClick={() => router.push(`/${locale}/resources`)}
              className="text-xs text-primary hover:text-primary/80 transition-colors"
            >
              {locale === "es" ? "Limpiar todo" : "Clear all"}
            </button>
          </div>
        </div>
      )}

      {/* Quick Filter Buttons */}
      <div className="space-y-2">
        <div className="text-sm font-medium text-muted-foreground">
          {locale === "es" ? "Filtros rápidos:" : "Quick filters:"}
        </div>
        <div className="flex flex-wrap gap-2">
          {[
            {
              value: MediaType.IMAGE,
              label: locale === "es" ? "Imágenes" : "Images",
            },
            {
              value: MediaType.VIDEO,
              label: locale === "es" ? "Videos" : "Videos",
            },
            {
              value: MediaType.DOCUMENT,
              label: locale === "es" ? "Documentos" : "Documents",
            },
            { 
              value: MediaType.AUDIO, 
              label: locale === "es" ? "Audio" : "Audio" 
            },
          ].map((quickFilter) => (
            <button
              key={quickFilter.value}
              onClick={() => handleFilterChange("type", quickFilter.value)}
              className={`text-xs px-3 py-1 rounded-full transition-colors ${
                currentType === quickFilter.value
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              {quickFilter.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}