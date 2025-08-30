import { ContentScheduleData, RecurringScheduleData } from '@/lib/validations/scheduling';
import prisma from '@/lib/prisma';
import { NewsStatus, ProgramStatus, PublicationStatus } from '@prisma/client';

// Type definitions for content types
type ContentType = 'news' | 'program' | 'publication';
type ContentStatus = NewsStatus | ProgramStatus | PublicationStatus;

interface ScheduleExecutionResult {
  success: boolean;
  error?: string;
  contentId: string;
  action: string;
}

// Service class for handling content scheduling
export class SchedulingService {
  /**
   * Schedule content for future publication
   */
  static async scheduleContent(scheduleData: Omit<ContentScheduleData, 'status' | 'executedAt' | 'failureReason'>) {
    try {
      const schedule = await prisma.contentSchedule.create({
        data: {
          contentId: scheduleData.contentId,
          contentType: scheduleData.contentType.toUpperCase() as any,
          action: scheduleData.action.toUpperCase() as any,
          scheduledDate: scheduleData.scheduledDate,
          timezone: scheduleData.timezone,
          createdById: scheduleData.createdBy,
          status: 'PENDING',
          metadata: scheduleData.metadata ? JSON.parse(JSON.stringify(scheduleData.metadata)) : undefined,
        },
      });

      return { success: true, schedule };
    } catch (error) {
      console.error('Error scheduling content:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Cancel a scheduled content action
   */
  static async cancelSchedule(scheduleId: string, _userId: string) {
    try {
      const schedule = await prisma.contentSchedule.findUnique({
        where: { id: scheduleId },
      });

      if (!schedule) {
        return { success: false, error: 'Schedule not found' };
      }

      if (schedule.status !== 'PENDING') {
        return { success: false, error: 'Can only cancel pending schedules' };
      }

      await prisma.contentSchedule.update({
        where: { id: scheduleId },
        data: {
          status: 'CANCELLED',
          updatedAt: new Date(),
        },
      });

      return { success: true };
    } catch (error) {
      console.error('Error cancelling schedule:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Execute a scheduled action
   */
  static async executeScheduledAction(scheduleId: string): Promise<ScheduleExecutionResult> {
    try {
      const schedule = await prisma.contentSchedule.findUnique({
        where: { id: scheduleId },
      });

      if (!schedule) {
        return {
          success: false,
          error: 'Schedule not found',
          contentId: '',
          action: '',
        };
      }

      if (schedule.status !== 'PENDING') {
        return {
          success: false,
          error: 'Schedule is not pending',
          contentId: schedule.contentId,
          action: schedule.action,
        };
      }

      // Execute the action based on content type and action
      const result = await this.performContentAction(
        schedule.contentType.toLowerCase() as ContentType,
        schedule.contentId,
        schedule.action.toLowerCase() as 'publish' | 'unpublish' | 'archive'
      );

      // Update schedule status
      await prisma.contentSchedule.update({
        where: { id: scheduleId },
        data: {
          status: result.success ? 'EXECUTED' : 'FAILED',
          executedAt: new Date(),
          failureReason: result.success ? undefined : result.error,
          updatedAt: new Date(),
        },
      });

      return {
        success: result.success,
        error: result.error,
        contentId: schedule.contentId,
        action: schedule.action,
      };
    } catch (error) {
      console.error('Error executing scheduled action:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        contentId: '',
        action: '',
      };
    }
  }

  /**
   * Get pending schedules that should be executed
   */
  static async getPendingSchedules(limit = 100) {
    try {
      const now = new Date();
      
      const schedules = await prisma.contentSchedule.findMany({
        where: {
          status: 'PENDING',
          scheduledDate: {
            lte: now,
          },
        },
        orderBy: {
          scheduledDate: 'asc',
        },
        take: limit,
      });

      return { success: true, schedules };
    } catch (error) {
      console.error('Error fetching pending schedules:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        schedules: [] 
      };
    }
  }

  /**
   * Process all pending schedules (for cron job)
   */
  static async processPendingSchedules() {
    const { success, schedules } = await this.getPendingSchedules();
    
    if (!success || !schedules) {
      return { processed: 0, errors: ['Failed to fetch pending schedules'] };
    }

    const results = await Promise.all(
      schedules.map(schedule => this.executeScheduledAction(schedule.id))
    );

    const processed = results.filter(r => r.success).length;
    const errors = results.filter(r => !r.success).map(r => r.error || 'Unknown error');

    return { processed, errors };
  }

  /**
   * Create recurring schedules
   */
  static async createRecurringSchedule(
    baseSchedule: Omit<ContentScheduleData, 'scheduledDate' | 'status' | 'executedAt' | 'failureReason'>,
    recurrencePattern: RecurringScheduleData,
    startDate: Date
  ) {
    try {
      const schedules: ContentScheduleData[] = [];
      const dates = this.generateRecurringDates(startDate, recurrencePattern);

      for (const date of dates) {
        schedules.push({
          ...baseSchedule,
          scheduledDate: date,
          status: 'PENDING',
          metadata: {
            ...baseSchedule.metadata,
            isRecurring: true,
            recurrencePattern,
          },
        });
      }

      const createdSchedules = await prisma.contentSchedule.createMany({
        data: schedules.map(schedule => ({
          contentId: schedule.contentId,
          contentType: schedule.contentType.toUpperCase() as any,
          action: schedule.action.toUpperCase() as any,
          scheduledDate: schedule.scheduledDate,
          timezone: schedule.timezone,
          createdById: schedule.createdBy,
          status: 'PENDING',
          metadata: schedule.metadata ? JSON.parse(JSON.stringify(schedule.metadata)) : undefined,
        })),
      });

      return { success: true, count: createdSchedules.count };
    } catch (error) {
      console.error('Error creating recurring schedule:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Generate dates for recurring schedules
   */
  private static generateRecurringDates(startDate: Date, pattern: RecurringScheduleData): Date[] {
    const dates: Date[] = [];
    const currentDate = new Date(startDate);
    const endDate = pattern.endDate || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000); // Default to 1 year
    const maxOccurrences = pattern.maxOccurrences || 50; // Default limit

    let occurrences = 0;

    while (currentDate <= endDate && occurrences < maxOccurrences) {
      dates.push(new Date(currentDate));
      occurrences++;

      // Calculate next occurrence based on pattern
      switch (pattern.pattern) {
        case 'daily':
          currentDate.setDate(currentDate.getDate() + pattern.interval);
          break;
        case 'weekly':
          currentDate.setDate(currentDate.getDate() + (7 * pattern.interval));
          break;
        case 'monthly':
          currentDate.setMonth(currentDate.getMonth() + pattern.interval);
          break;
        case 'yearly':
          currentDate.setFullYear(currentDate.getFullYear() + pattern.interval);
          break;
      }

      // Handle specific days of week for weekly patterns
      if (pattern.pattern === 'weekly' && pattern.daysOfWeek?.length) {
        // Find next matching day of week
        const targetDays = pattern.daysOfWeek.sort();
        const currentDay = currentDate.getDay();
        
        let nextDay = targetDays.find(day => day > currentDay);
        if (!nextDay) {
          nextDay = targetDays[0];
          currentDate.setDate(currentDate.getDate() + (7 - currentDay + nextDay));
        } else {
          currentDate.setDate(currentDate.getDate() + (nextDay - currentDay));
        }
      }
    }

    return dates;
  }

  /**
   * Perform the actual content action (publish, unpublish, archive)
   */
  private static async performContentAction(
    contentType: ContentType,
    contentId: string,
    action: 'publish' | 'unpublish' | 'archive'
  ): Promise<{ success: boolean; error?: string }> {
    try {
      switch (contentType) {
        case 'news':
          await prisma.news.update({
            where: { id: contentId },
            data: {
              status: action === 'publish' ? NewsStatus.PUBLISHED 
                    : action === 'unpublish' ? NewsStatus.DRAFT 
                    : NewsStatus.ARCHIVED
            },
          });
          break;

        case 'program':
          await prisma.program.update({
            where: { id: contentId },
            data: {
              status: action === 'publish' ? ProgramStatus.ACTIVE 
                    : action === 'unpublish' ? ProgramStatus.PLANNING 
                    : ProgramStatus.CANCELLED
            },
          });
          break;

        case 'publication':
          await prisma.digitalLibrary.update({
            where: { id: contentId },
            data: {
              status: action === 'publish' ? PublicationStatus.PUBLISHED 
                    : action === 'unpublish' ? PublicationStatus.DRAFT 
                    : PublicationStatus.ARCHIVED
            },
          });
          break;

        default:
          return { success: false, error: `Unknown content type: ${contentType}` };
      }

      return { success: true };
    } catch (error) {
      console.error(`Error performing ${action} on ${contentType}:`, error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  /**
   * Get content schedules with filtering
   */
  static async getSchedules(filters: {
    contentType?: ContentType;
    status?: 'PENDING' | 'EXECUTED' | 'FAILED' | 'CANCELLED';
    page?: number;
    limit?: number;
  } = {}) {
    try {
      const { contentType, status, page = 1, limit = 10 } = filters;
      const skip = (page - 1) * limit;

      const where: Record<string, unknown> = {};
      if (contentType) where.contentType = contentType;
      if (status) where.status = status;

      const [schedules, totalCount] = await Promise.all([
        prisma.contentSchedule.findMany({
          where,
          orderBy: {
            scheduledDate: 'asc',
          },
          skip,
          take: limit,
        }),
        prisma.contentSchedule.count({ where }),
      ]);

      const totalPages = Math.ceil(totalCount / limit);

      return {
        success: true,
        schedules,
        pagination: {
          currentPage: page,
          totalPages,
          totalCount,
          limit,
        },
      };
    } catch (error) {
      console.error('Error fetching schedules:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        schedules: [],
        pagination: { currentPage: 1, totalPages: 0, totalCount: 0, limit: 10 }
      };
    }
  }

  /**
   * Batch schedule multiple content items
   */
  static async batchScheduleContent(
    contentIds: string[],
    contentType: ContentType,
    scheduledDate: Date,
    action: 'publish' | 'unpublish' | 'archive',
    createdBy: string,
    staggerInterval = 0 // minutes between each execution
  ) {
    try {
      const schedules = contentIds.map((contentId, index) => ({
        contentId,
        contentType,
        scheduledDate: new Date(scheduledDate.getTime() + (index * staggerInterval * 60 * 1000)),
        action,
        status: 'PENDING',
        createdById: createdBy,
        timezone: 'America/La_Paz',
      }));

      const result = await prisma.contentSchedule.createMany({
        data: schedules,
      });

      return { success: true, count: result.count };
    } catch (error) {
      console.error('Error batch scheduling content:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }
}