import { z } from 'zod';
import { ProgramStatus, ProgramType } from '@prisma/client';

// Schema for creating/updating programs
export const programFormSchema = z.object({
  // Primary fields (required)
  title: z.string().min(1, 'El título es requerido').max(255),
  description: z.string().min(1, 'La descripción es requerida'),
  
  // Bilingual fields (optional, will fallback to primary fields)
  titleEs: z.string().optional(),
  titleEn: z.string().optional(), 
  descriptionEs: z.string().optional(),
  descriptionEn: z.string().optional(),
  
  // Additional content
  overview: z.string().optional(),
  overviewEs: z.string().optional(),
  overviewEn: z.string().optional(),
  objectives: z.string().optional(),
  objectivesEs: z.string().optional(),
  objectivesEn: z.string().optional(),
  
  // Program metadata
  type: z.nativeEnum(ProgramType),
  status: z.nativeEnum(ProgramStatus),
  featured: z.boolean().default(false),
  
  // Dates (as Date objects or strings that can be converted to dates)
  startDate: z.union([z.date(), z.string()]).optional().transform((val) => {
    if (!val) return undefined;
    if (val instanceof Date) return val;
    const date = new Date(val);
    return isNaN(date.getTime()) ? undefined : date;
  }),
  endDate: z.union([z.date(), z.string()]).optional().transform((val) => {
    if (!val) return undefined;
    if (val instanceof Date) return val;
    const date = new Date(val);
    return isNaN(date.getTime()) ? undefined : date;
  }),
  
  // Media
  featuredImageUrl: z.string().optional(),
  galleryImages: z.array(z.string()).default([]),
  documentUrls: z.array(z.string()).default([]),
  
  // Details
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