import { z } from 'zod';
import { ProgramStatus, ProgramType } from '@prisma/client';

// Schema for creating/updating programs
export const programFormSchema = z.object({
  titleEs: z.string().min(1, 'El título en español es requerido').max(255),
  titleEn: z.string().min(1, 'El título en inglés es requerido').max(255),
  descriptionEs: z.string().min(1, 'La descripción en español es requerida'),
  descriptionEn: z.string().min(1, 'La descripción en inglés es requerida'),
  overviewEs: z.string().optional(),
  overviewEn: z.string().optional(),
  objectivesEs: z.string().optional(),
  objectivesEn: z.string().optional(),
  
  type: z.nativeEnum(ProgramType),
  status: z.nativeEnum(ProgramStatus),
  featured: z.boolean().default(false),
  
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  
  featuredImageUrl: z.string().url().optional().or(z.literal('')),
  galleryImages: z.array(z.string().url()).default([]),
  documentUrls: z.array(z.string().url()).default([]),
  
  targetPopulation: z.string().optional(),
  region: z.string().optional(),
  budget: z.number().min(0).optional(),
  progressPercentage: z.number().min(0).max(100).default(0),
});

export type ProgramFormData = z.infer<typeof programFormSchema>;

// Schema for program filters
export const programFilterSchema = z.object({
  status: z.nativeEnum(ProgramStatus).optional(),
  type: z.nativeEnum(ProgramType).optional(),
  featured: z.boolean().optional(),
  search: z.string().optional(),
  managerId: z.string().optional(),
  region: z.string().optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
});

export type ProgramFilterData = z.infer<typeof programFilterSchema>;

// Schema for bulk operations
export const programBulkActionSchema = z.object({
  action: z.enum(['delete', 'activate', 'pause', 'complete', 'feature', 'unfeature']),
  programIds: z.array(z.string()).min(1, 'Selecciona al menos un programa'),
});

export type ProgramBulkActionData = z.infer<typeof programBulkActionSchema>;