import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { contentScheduleSchema, scheduleFilterSchema, batchScheduleSchema } from '@/lib/validations/scheduling';
import { SchedulingService } from '@/lib/services/scheduling';
import { getCurrentUser } from '@/lib/auth';
import { hasPermission, PERMISSIONS, type Permission } from '@/lib/auth/rbac';
import type { UserRole } from '@prisma/client';

// Helper function for backward compatibility
const checkPermission = (role: string, permission: string) => hasPermission(role as UserRole, permission as Permission);

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user || !checkPermission(user.role || 'USER', PERMISSIONS.VIEW_ANALYTICS)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const filters = scheduleFilterSchema.parse({
      contentType: searchParams.get('contentType') || undefined,
      status: searchParams.get('status') || undefined,
      action: searchParams.get('action') || undefined,
      scheduledAfter: searchParams.get('scheduledAfter') ? new Date(searchParams.get('scheduledAfter')!) : undefined,
      scheduledBefore: searchParams.get('scheduledBefore') ? new Date(searchParams.get('scheduledBefore')!) : undefined,
      createdBy: searchParams.get('createdBy') || undefined,
      search: searchParams.get('search') || undefined,
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '10'),
    });

    const result = await SchedulingService.getSchedules({
      contentType: filters.contentType,
      status: filters.status,
      page: filters.page,
      limit: filters.limit,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      schedules: result.schedules,
      pagination: result.pagination,
    });

  } catch (error) {
    console.error('Error fetching schedules:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    
    // Check if it's a batch schedule request
    if (body.contentIds && Array.isArray(body.contentIds)) {
      const validatedData = batchScheduleSchema.parse(body);
      
      const result = await SchedulingService.batchScheduleContent(
        validatedData.contentIds,
        validatedData.contentType,
        validatedData.scheduledDate,
        validatedData.action,
        user.id,
        validatedData.staggerInterval
      );

      if (!result.success) {
        return NextResponse.json(
          { error: result.error },
          { status: 500 }
        );
      }

      return NextResponse.json({ 
        success: true, 
        scheduled: result.count 
      }, { status: 201 });
    }

    // Single schedule request
    const validatedData = contentScheduleSchema.omit({ 
      status: true, 
      executedAt: true, 
      failureReason: true 
    }).parse({
      ...body,
      createdBy: user.id,
    });

    const result = await SchedulingService.scheduleContent(validatedData);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json(result.schedule, { status: 201 });

  } catch (error) {
    console.error('Error creating schedule:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}