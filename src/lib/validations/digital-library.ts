import { z } from "zod";
import { PublicationStatus, PublicationType } from "@prisma/client";

// Schema for creating/updating digital library publications
export const digitalLibraryFormSchema = z.object({
  // Main fields (required)
  titleEs: z.string().min(1, "El título en español es requerido").max(255),
  titleEn: z.string().min(1, "El título en inglés es requerido").max(255),
  descriptionEs: z.string().min(1, "La descripción en español es requerida"),
  descriptionEn: z.string().min(1, "La descripción en inglés es requerida"),

  // Additional content
  abstractEs: z.string().optional(),
  abstractEn: z.string().optional(),

  // Publication metadata
  type: z.nativeEnum(PublicationType),
  status: z.nativeEnum(PublicationStatus),
  featured: z.boolean().default(false),

  // Dates
  publishDate: z.preprocess((val) => {
    if (!val || val === "") return undefined;
    return new Date(val as string | number | Date);
  }, z.date().optional()),

  // File information
  fileUrl: z.string().min(1, "El archivo es requerido"),
  fileName: z.string().optional(),
  fileSize: z.number().min(0).optional(),
  mimeType: z.string().optional(),

  // Images
  coverImageUrl: z.string().optional(),
  thumbnailUrl: z.string().optional(),

  // Metadata arrays
  tags: z.array(z.string()).default([]),
  keywords: z.array(z.string()).default([]),
  relatedPrograms: z.array(z.string()).default([]),

  // Counters (for editing)
  downloadCount: z.number().min(0).default(0),
  viewCount: z.number().min(0).default(0),
});

export type DigitalLibraryFormData = z.infer<typeof digitalLibraryFormSchema>;

// Schema for digital library filters
export const digitalLibraryFilterSchema = z.object({
  status: z.nativeEnum(PublicationStatus).optional(),
  type: z.nativeEnum(PublicationType).optional(),
  featured: z.boolean().optional(),
  search: z.string().optional(),
  authors: z.string().optional(),
  tags: z.string().optional(),
  language: z.enum(["es", "en", "both"]).optional(),
  publishedAfter: z.date().optional(),
  publishedBefore: z.date().optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
});

export type DigitalLibraryFilterData = z.infer<
  typeof digitalLibraryFilterSchema
>;

// Schema for bulk operations
export const digitalLibraryBulkActionSchema = z.object({
  action: z.enum([
    "delete",
    "publish",
    "unpublish",
    "feature",
    "unfeature",
    "archive",
  ]),
  publicationIds: z
    .array(z.string())
    .min(1, "Selecciona al menos una publicación"),
});

export type DigitalLibraryBulkActionData = z.infer<
  typeof digitalLibraryBulkActionSchema
>;

// Schema for document file upload validation
export const documentUploadSchema = z.object({
  file: z.instanceof(File),
  maxSize: z.number().default(50 * 1024 * 1024), // 50MB for documents
  allowedTypes: z
    .array(z.string())
    .default([
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "text/plain",
    ]),
});

export type DocumentUploadData = z.infer<typeof documentUploadSchema>;
