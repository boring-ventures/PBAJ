import { z } from 'zod';
import { PublicationCategory, PublicationStatus, PublicationType } from '@prisma/client';

// Schema for creating/updating digital library publications
export const digitalLibraryFormSchema = z.object({
  title: z.string().min(1, 'El título es requerido').max(255),
  description: z.string().min(1, 'La descripción es requerida'),
  abstract: z.string().optional(),
  
  type: z.nativeEnum(PublicationType),
  
  category: z.nativeEnum(PublicationCategory),
  status: z.nativeEnum(PublicationStatus),
  featured: z.boolean().default(false),
  
  publishDate: z.date().optional(),
  
  fileUrl: z.string().url('Debe ser una URL válida'),
  fileName: z.string().optional(),
  fileSize: z.number().min(0).default(0),
  mimeType: z.string().optional(),
  
  coverImageUrl: z.string().url().optional().or(z.literal('')),
  thumbnailUrl: z.string().url().optional().or(z.literal('')),
  
  authors: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  keywords: z.array(z.string()).default([]),
  
  isbn: z.string().optional(),
  doi: z.string().optional(),
  citationFormat: z.string().optional(),
  
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