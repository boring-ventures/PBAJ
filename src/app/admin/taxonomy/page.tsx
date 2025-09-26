"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { TaxonomyList } from "@/components/cms/taxonomy/taxonomy-list";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface Category {
  id: string;
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  type: "NEWS" | "PROGRAM" | "PUBLICATION";
  itemCount: number;
  createdAt: Date;
}

interface TagItem {
  id: string;
  name: string;
  description?: string;
  color?: string;
  itemCount: number;
  createdAt: Date;
}

export default function TaxonomyManagement() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<TagItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTaxonomy();
  }, []);

  const fetchTaxonomy = async () => {
    try {
      const response = await fetch("/api/admin/taxonomy");
      if (response.ok) {
        const data = await response.json();

        // Map the API data to match the expected interface
        const mappedCategories = (data.categories || []).map((cat: any) => {
          const date = new Date(cat.createdAt);
          if (isNaN(date.getTime())) {
            console.warn("Invalid date for category:", cat.id, cat.createdAt);
          }
          return {
            id: cat.id,
            name: cat.name,
            description: cat.description,
            color: cat.color,
            icon: cat.iconName,
            type: cat.contentType === "GENERAL" ? "NEWS" : cat.contentType,
            itemCount: 0, // This would need to be calculated from actual usage
            createdAt: date,
          };
        });

        const mappedTags = (data.tags || []).map((tag: any) => {
          const date = new Date(tag.createdAt);
          if (isNaN(date.getTime())) {
            console.warn("Invalid date for tag:", tag.id, tag.createdAt);
          }
          return {
            id: tag.id,
            name: tag.name,
            description: undefined, // Tags don't have description in the API
            color: tag.color,
            itemCount: tag.usageCount || 0,
            createdAt: date,
          };
        });

        setCategories(mappedCategories);
        setTags(mappedTags);
      }
    } catch (error) {
      console.error("Error fetching taxonomy:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las categorías y etiquetas",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    try {
      const response = await fetch(
        `/api/admin/taxonomy?id=${categoryId}&type=category`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        await fetchTaxonomy(); // Refresh the data
        toast({
          title: "Éxito",
          description: "Categoría eliminada correctamente",
        });
      } else {
        throw new Error("Error al eliminar la categoría");
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      toast({
        title: "Error",
        description: "No se pudo eliminar la categoría",
        variant: "destructive",
      });
    }
  };

  const handleDeleteTag = async (tagId: string) => {
    try {
      const response = await fetch(`/api/admin/taxonomy?id=${tagId}&type=tag`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchTaxonomy(); // Refresh the data
        toast({
          title: "Éxito",
          description: "Etiqueta eliminada correctamente",
        });
      } else {
        throw new Error("Error al eliminar la etiqueta");
      }
    } catch (error) {
      console.error("Error deleting tag:", error);
      toast({
        title: "Error",
        description: "No se pudo eliminar la etiqueta",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Cargando taxonomía...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Additional Actions */}
      <div className="flex items-center justify-end gap-2">
        <Button asChild variant="outline">
          <Link href="/admin/taxonomy/new?type=category">
            <Plus className="mr-2 h-4 w-4" />
            Nueva Categoría
          </Link>
        </Button>
        <Button asChild>
          <Link href="/admin/taxonomy/new?type=tag">
            <Plus className="mr-2 h-4 w-4" />
            Nueva Etiqueta
          </Link>
        </Button>
      </div>

      {/* Taxonomy List Component */}
      <TaxonomyList
        categories={categories}
        tags={tags}
        onCreateCategory={() =>
          (window.location.href = "/admin/taxonomy/new?type=category")
        }
        onCreateTag={() =>
          (window.location.href = "/admin/taxonomy/new?type=tag")
        }
        onEditCategory={(category) =>
          (window.location.href = `/admin/taxonomy/edit?type=category&id=${category.id}`)
        }
        onEditTag={(tag) =>
          (window.location.href = `/admin/taxonomy/edit?type=tag&id=${tag.id}`)
        }
        onDeleteCategory={handleDeleteCategory}
        onDeleteTag={handleDeleteTag}
      />
    </div>
  );
}
