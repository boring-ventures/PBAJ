import { z } from 'zod';

// Schema for content scheduling
export const contentScheduleSchema = z.object({
  contentId: z.string().min(1, 'Content ID is required'),
  contentType: z.enum(['news', 'program', 'publication'], {
    errorMap: () => ({ message: 'Content type must be news, program, or publication' })
  }),
  scheduledDate: z.date({
    required_error: 'Scheduled date is required',
    invalid_type_error: 'Invalid date format'
  }).refine(date => date > new Date(), {
    message: 'Scheduled date must be in the future'
  }),
  timezone: z.string().default('America/La_Paz'),
  action: z.enum(['publish', 'unpublish', 'archive'], {
    errorMap: () => ({ message: 'Action must be publish, unpublish, or archive' })
  }),
  status: z.enum(['pending', 'executed', 'failed', 'cancelled']).default('pending'),
  executedAt: z.date().optional(),
  failureReason: z.string().optional(),
  createdBy: z.string().min(1, 'Creator ID is required'),
  metadata: z.record(z.unknown()).optional(),
});

export type ContentScheduleData = z.infer<typeof contentScheduleSchema>;

// Schema for recurring schedule patterns
export const recurringScheduleSchema = z.object({
  pattern: z.enum(['daily', 'weekly', 'monthly', 'yearly']),
  interval: z.number().min(1, 'Interval must be at least 1').default(1),
  daysOfWeek: z.array(z.number().min(0).max(6)).optional(), // 0 = Sunday, 6 = Saturday
  dayOfMonth: z.number().min(1).max(31).optional(),
  monthOfYear: z.number().min(1).max(12).optional(),
  endDate: z.date().optional(),
  maxOccurrences: z.number().min(1).optional(),
});

export type RecurringScheduleData = z.infer<typeof recurringScheduleSchema>;

// Schema for batch scheduling
export const batchScheduleSchema = z.object({
  contentIds: z.array(z.string()).min(1, 'At least one content item is required'),
  contentType: z.enum(['news', 'program', 'publication']),
  scheduledDate: z.date().refine(date => date > new Date(), {
    message: 'Scheduled date must be in the future'
  }),
  action: z.enum(['publish', 'unpublish', 'archive']),
  timezone: z.string().default('America/La_Paz'),
  staggerInterval: z.number().min(0).default(0), // Minutes between each execution
});

export type BatchScheduleData = z.infer<typeof batchScheduleSchema>;

// Schema for scheduling filters
export const scheduleFilterSchema = z.object({
  contentType: z.enum(['news', 'program', 'publication']).optional(),
  status: z.enum(['pending', 'executed', 'failed', 'cancelled']).optional(),
  action: z.enum(['publish', 'unpublish', 'archive']).optional(),
  scheduledAfter: z.date().optional(),
  scheduledBefore: z.date().optional(),
  createdBy: z.string().optional(),
  search: z.string().optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(10),
});

export type ScheduleFilterData = z.infer<typeof scheduleFilterSchema>;

// Schema for updating schedule status
export const scheduleUpdateSchema = z.object({
  status: z.enum(['pending', 'executed', 'failed', 'cancelled']),
  executedAt: z.date().optional(),
  failureReason: z.string().optional(),
});

export type ScheduleUpdateData = z.infer<typeof scheduleUpdateSchema>;

// Helper function to validate timezone
export const validateTimezone = (timezone: string): boolean => {
  try {
    Intl.DateTimeFormat(undefined, { timeZone: timezone });
    return true;
  } catch {
    return false;
  }
};

// Common timezone options for Bolivia
export const BOLIVIA_TIMEZONES = [
  { value: 'America/La_Paz', label: 'La Paz (BOT)' },
  { value: 'America/Santa_Cruz', label: 'Santa Cruz (BOT)' },
] as const;

// Scheduling presets
export const SCHEDULING_PRESETS = {
  'in-1-hour': {
    label: 'En 1 hora',
    getDate: () => new Date(Date.now() + 60 * 60 * 1000)
  },
  'in-4-hours': {
    label: 'En 4 horas',
    getDate: () => new Date(Date.now() + 4 * 60 * 60 * 1000)
  },
  'tomorrow-9am': {
    label: 'Mañana a las 9:00 AM',
    getDate: () => {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(9, 0, 0, 0);
      return tomorrow;
    }
  },
  'next-week': {
    label: 'Próxima semana',
    getDate: () => {
      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 7);
      nextWeek.setHours(9, 0, 0, 0);
      return nextWeek;
    }
  },
  'next-month': {
    label: 'Próximo mes',
    getDate: () => {
      const nextMonth = new Date();
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      nextMonth.setHours(9, 0, 0, 0);
      return nextMonth;
    }
  }
} as const;