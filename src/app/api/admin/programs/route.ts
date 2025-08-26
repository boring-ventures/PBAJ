import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { programFormSchema, programFilterSchema, programBulkActionSchema } from '@/lib/validations/programs';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { hasPermission, PERMISSIONS, type Permission } from '@/lib/auth/rbac';
import { ProgramStatus, ProgramType } from '@prisma/client';
import type { UserRole } from '@prisma/client';

// Helper function for backward compatibility
const checkPermission = (role: string, permission: string) => hasPermission(role as UserRole, permission as Permission);

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user || !checkPermission(user.role || 'USER', PERMISSIONS.VIEW_PROGRAMS)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const filters = programFilterSchema.parse({
      status: searchParams.get('status') || undefined,
      type: searchParams.get('type') || undefined,
      featured: searchParams.get('featured') === 'true' ? true : 
               searchParams.get('featured') === 'false' ? false : undefined,
      search: searchParams.get('search') || undefined,
      managerId: searchParams.get('managerId') || undefined,
      region: searchParams.get('region') || undefined,
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '10'),
    });

    const where: Record<string, unknown> = {};

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.type) {
      where.type = filters.type;
    }

    if (filters.featured !== undefined) {
      where.featured = filters.featured;
    }

    if (filters.search) {
      where.OR = [
        { titleEs: { contains: filters.search, mode: 'insensitive' } },
        { titleEn: { contains: filters.search, mode: 'insensitive' } },
        { descriptionEs: { contains: filters.search, mode: 'insensitive' } },
        { descriptionEn: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    if (filters.region) {
      where.region = { contains: filters.region, mode: 'insensitive' };
    }

    const skip = (filters.page - 1) * filters.limit;

    const [programs, totalCount] = await Promise.all([
      prisma.program.findMany({
        where,
        skip,
        take: filters.limit,
        orderBy: [
          { featured: 'desc' },
          { createdAt: 'desc' }
        ],
        select: {
          id: true,
          titleEs: true,
          titleEn: true,
          descriptionEs: true,
          descriptionEn: true,
          overviewEs: true,
          overviewEn: true,
          type: true,
          status: true,
          featured: true,
          startDate: true,
          endDate: true,
          featuredImageUrl: true,
          region: true,
          budget: true,
          progressPercentage: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      prisma.program.count({ where }),
    ]);

    const totalPages = Math.ceil(totalCount / filters.limit);

    return NextResponse.json({
      programs,
      pagination: {
        currentPage: filters.page,
        totalPages,
        totalCount,
        limit: filters.limit,
      },
    });

  } catch (error) {
    console.error('Error fetching programs:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user || !checkPermission(user.role || 'USER', PERMISSIONS.CREATE_PROGRAMS)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = programFormSchema.parse(body);

    const program = await prisma.program.create({
      data: {
        ...validatedData,
        managerId: user.id,
        galleryImages: validatedData.galleryImages || [],
        documentUrls: validatedData.documentUrls || [],
      },
    });

    return NextResponse.json(program, { status: 201 });

  } catch (error) {
    console.error('Error creating program:', error);
    
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

export async function PATCH(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user || !checkPermission(user.role || 'USER', PERMISSIONS.MANAGE_PROGRAMS)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { action, programIds } = programBulkActionSchema.parse(body);

    let updateData: Record<string, unknown> = {};

    switch (action) {
      case 'activate':
        updateData = { status: ProgramStatus.ACTIVE };
        break;
      case 'pause':
        updateData = { status: ProgramStatus.ON_HOLD };
        break;
      case 'complete':
        updateData = { status: ProgramStatus.COMPLETED, progressPercentage: 100 };
        break;
      case 'feature':
        updateData = { featured: true };
        break;
      case 'unfeature':
        updateData = { featured: false };
        break;
      case 'delete':
        await prisma.program.deleteMany({
          where: {
            id: { in: programIds }
          }
        });
        return NextResponse.json({ success: true });
    }

    const updatedPrograms = await prisma.program.updateMany({
      where: {
        id: { in: programIds }
      },
      data: {
        ...updateData,
        updatedAt: new Date(),
      }
    });

    return NextResponse.json({
      success: true,
      updated: updatedPrograms.count
    });

  } catch (error) {
    console.error('Error in bulk action:', error);
    
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