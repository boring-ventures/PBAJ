import { z } from "zod";
import { OpinionCategory, OpinionStatus } from "@prisma/client";

// Schema for creating/updating opinions (single field structure)
export const opinionFormSchema = z.object({
  title: z.string().min(1, "El título es requerido").max(255),
  content: z.string().min(1, "El contenido es requerido"),
  excerpt: z.string().max(500).optional(),
  category: z.nativeEnum(OpinionCategory),
  status: z.nativeEnum(OpinionStatus),
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

export type OpinionFormData = z.infer<typeof opinionFormSchema>;

// Schema for opinion filters
export const opinionFilterSchema = z.object({
  status: z.nativeEnum(OpinionStatus).optional(),
  category: z.nativeEnum(OpinionCategory).optional(),
  featured: z.boolean().optional(),
  search: z.string().optional(),
  authorId: z.string().optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
});

export type OpinionFilterData = z.infer<typeof opinionFilterSchema>;

// Schema for bulk operations
export const opinionBulkActionSchema = z.object({
  action: z.enum(["delete", "publish", "unpublish", "feature", "unfeature"]),
  opinionIds: z.array(z.string()).min(1, "Selecciona al menos un artículo"),
});

export type OpinionBulkActionData = z.infer<typeof opinionBulkActionSchema>;
