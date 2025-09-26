import { z } from "zod";
import { NewsCategory, NewsStatus } from "@prisma/client";

// Schema for creating/updating news
export const newsFormSchema = z.object({
  titleEs: z.string().min(1, "El título en español es requerido").max(255),
  titleEn: z.string().min(1, "El título en inglés es requerido").max(255),
  contentEs: z.string().min(1, "El contenido en español es requerido"),
  contentEn: z.string().min(1, "El contenido en inglés es requerido"),
  excerptEs: z.string().max(500).optional(),
  excerptEn: z.string().max(500).optional(),
  category: z.nativeEnum(NewsCategory),
  status: z.nativeEnum(NewsStatus),
  featured: z.boolean().default(false),
  featuredImageUrl: z.string().url().optional().or(z.literal("")),
  publishDate: z
    .union([z.string(), z.date()])
    .optional()
    .transform((val) => {
      if (!val) return undefined;
      if (typeof val === "string") {
        const date = new Date(val);
        return isNaN(date.getTime()) ? undefined : date;
      }
      return val;
    }),
});

export type NewsFormData = z.infer<typeof newsFormSchema>;

// Schema for news filters
export const newsFilterSchema = z.object({
  status: z.nativeEnum(NewsStatus).optional(),
  category: z.nativeEnum(NewsCategory).optional(),
  featured: z.boolean().optional(),
  search: z.string().optional(),
  authorId: z.string().optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
});

export type NewsFilterData = z.infer<typeof newsFilterSchema>;

// Schema for bulk operations
export const newsBulkActionSchema = z.object({
  action: z.enum(["delete", "publish", "unpublish", "feature", "unfeature"]),
  newsIds: z.array(z.string()).min(1, "Selecciona al menos un artículo"),
});

export type NewsBulkActionData = z.infer<typeof newsBulkActionSchema>;
