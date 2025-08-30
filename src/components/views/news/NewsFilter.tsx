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
import type { LocalizedCategory } from "@/lib/content/content-utils";

interface NewsFilterProps {
  categories?: LocalizedCategory[];
}

export default function NewsFilter({ categories = [] }: NewsFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  const locale = (params?.locale as string) || "es";

  const currentCategory = searchParams?.get("category") || "all";

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

    router.push(`/${locale}/news${query}`);
  };

  const newsCategories = [
    {
      value: "all",
      label: locale === "es" ? "Todas las categorías" : "All categories",
    },
    { value: "PROGRAMS", label: locale === "es" ? "Programas" : "Programs" },
    { value: "CAMPAIGNS", label: locale === "es" ? "Campañas" : "Campaigns" },
    {
      value: "ACHIEVEMENTS",
      label: locale === "es" ? "Logros" : "Achievements",
    },
    { value: "EVENTS", label: locale === "es" ? "Eventos" : "Events" },
    {
      value: "PARTNERSHIPS",
      label: locale === "es" ? "Alianzas" : "Partnerships",
    },
    {
      value: "RESEARCH",
      label: locale === "es" ? "Investigación" : "Research",
    },
    { value: "COMMUNITY", label: locale === "es" ? "Comunidad" : "Community" },
    { value: "POLICY", label: locale === "es" ? "Políticas" : "Policy" },
  ];

  // Add categories from database if available
  const allCategories = [
    ...newsCategories,
    ...(categories || []).map((cat) => ({
      value: cat.slug,
      label: cat.name,
    })),
  ];

  // Remove duplicates
  const uniqueCategories = allCategories.filter(
    (cat, index, self) => index === self.findIndex((c) => c.value === cat.value)
  );

  const activeFilters = [];
  if (currentCategory !== "all") {
    const categoryLabel = uniqueCategories.find(
      (c) => c.value === currentCategory
    )?.label;
    if (categoryLabel)
      activeFilters.push({ key: "category", label: categoryLabel });
  }

  return (
    <div className="space-y-4">
      <div>
        {/* Category Filter */}
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
            {uniqueCategories.map((category) => (
              <SelectItem key={category.value} value={category.value}>
                {category.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
              onClick={() => router.push(`/${locale}/news`)}
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
              value: "PROGRAMS",
              label: locale === "es" ? "Programas" : "Programs",
            },
            {
              value: "CAMPAIGNS",
              label: locale === "es" ? "Campañas" : "Campaigns",
            },
            {
              value: "ACHIEVEMENTS",
              label: locale === "es" ? "Logros" : "Achievements",
            },
            { value: "EVENTS", label: locale === "es" ? "Eventos" : "Events" },
          ].map((quickFilter) => (
            <button
              key={quickFilter.value}
              onClick={() => handleFilterChange("category", quickFilter.value)}
              className={`text-xs px-3 py-1 rounded-full transition-colors ${
                currentCategory === quickFilter.value
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
