import { z } from 'zod';
import { PublicationCategory, PublicationStatus } from '@prisma/client';

// Schema for creating/updating digital library publications
export const digitalLibraryFormSchema = z.object({
  titleEs: z.string().min(1, 'El título en español es requerido').max(255),
  titleEn: z.string().min(1, 'El título en inglés es requerido').max(255),
  descriptionEs: z.string().min(1, 'La descripción en español es requerida'),
  descriptionEn: z.string().min(1, 'La descripción en inglés es requerida'),
  summaryEs: z.string().optional(),
  summaryEn: z.string().optional(),
  
  category: z.nativeEnum(PublicationCategory),
  status: z.nativeEnum(PublicationStatus),
  featured: z.boolean().default(false),
  
  publishDate: z.date().optional(),
  
  fileUrl: z.string().url('Debe ser una URL válida'),
  fileSize: z.number().min(0).optional(),
  fileType: z.string().optional(),
  pageCount: z.number().min(0).optional(),
  
  coverImageUrl: z.string().url().optional().or(z.literal('')),
  
  authors: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  
  isbn: z.string().optional(),
  doi: z.string().optional(),
  language: z.enum(['es', 'en', 'both']).default('both'),
  
  downloadCount: z.number().min(0).default(0),
  viewCount: z.number().min(0).default(0),
});

export type DigitalLibraryFormData = z.infer<typeof digitalLibraryFormSchema>;

// Schema for digital library filters
export const digitalLibraryFilterSchema = z.object({
  status: z.nativeEnum(PublicationStatus).optional(),
  category: z.nativeEnum(PublicationCategory).optional(),
  featured: z.boolean().optional(),
  search: z.string().optional(),
  authors: z.string().optional(),
  tags: z.string().optional(),
  language: z.enum(['es', 'en', 'both']).optional(),
  publishedAfter: z.date().optional(),
  publishedBefore: z.date().optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
});

export type DigitalLibraryFilterData = z.infer<typeof digitalLibraryFilterSchema>;

// Schema for bulk operations
export const digitalLibraryBulkActionSchema = z.object({
  action: z.enum(['delete', 'publish', 'unpublish', 'feature', 'unfeature', 'archive']),
  publicationIds: z.array(z.string()).min(1, 'Selecciona al menos una publicación'),
});

export type DigitalLibraryBulkActionData = z.infer<typeof digitalLibraryBulkActionSchema>;

// Schema for file upload validation
export const fileUploadSchema = z.object({
  file: z.instanceof(File),
  maxSize: z.number().default(10 * 1024 * 1024), // 10MB default
  allowedTypes: z.array(z.string()).default(['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']),
});

export type FileUploadData = z.infer<typeof fileUploadSchema>;