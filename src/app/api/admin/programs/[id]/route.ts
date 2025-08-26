import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { programFormSchema } from '@/lib/validations/programs';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { hasPermission, PERMISSIONS, type Permission } from '@/lib/auth/rbac';
import type { UserRole } from '@prisma/client';

// Helper function for backward compatibility
const checkPermission = (role: string, permission: string) => hasPermission(role as UserRole, permission as Permission);

interface RouteContext {
  params: {
    id: string;
  };
}

export async function GET(request: NextRequest, { params }: RouteContext) {
  try {
    const user = await getCurrentUser();

    if (!user || !checkPermission(user.role || 'USER', PERMISSIONS.VIEW_PROGRAMS)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const program = await prisma.program.findUnique({
      where: { id: params.id },
      include: {
        manager: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    if (!program) {
      return NextResponse.json(
        { error: 'Program not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(program);

  } catch (error) {
    console.error('Error fetching program:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteContext) {
  try {
    const user = await getCurrentUser();

    if (!user || !checkPermission(user.role || 'USER', PERMISSIONS.EDIT_PROGRAMS)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = programFormSchema.parse(body);

    // Check if program exists
    const existingProgram = await prisma.program.findUnique({
      where: { id: params.id }
    });

    if (!existingProgram) {
      return NextResponse.json(
        { error: 'Program not found' },
        { status: 404 }
      );
    }

    // Check if user can edit this program (owner or admin)
    if (existingProgram.managerId !== user.id && !checkPermission(user.role || 'USER', PERMISSIONS.MANAGE_PROGRAMS)) {
      return NextResponse.json(
        { error: 'Forbidden - You can only edit your own programs' },
        { status: 403 }
      );
    }

    const updatedProgram = await prisma.program.update({
      where: { id: params.id },
      data: {
        ...validatedData,
        galleryImages: validatedData.galleryImages || [],
        documentUrls: validatedData.documentUrls || [],
        updatedAt: new Date(),
      },
      include: {
        manager: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(updatedProgram);

  } catch (error) {
    console.error('Error updating program:', error);
    
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

export async function DELETE(request: NextRequest, { params }: RouteContext) {
  try {
    const user = await getCurrentUser();

    if (!user || !checkPermission(user.role || 'USER', PERMISSIONS.DELETE_PROGRAMS)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const existingProgram = await prisma.program.findUnique({
      where: { id: params.id }
    });

    if (!existingProgram) {
      return NextResponse.json(
        { error: 'Program not found' },
        { status: 404 }
      );
    }

    // Check if user can delete this program (owner or admin)
    if (existingProgram.managerId !== user.id && !checkPermission(user.role || 'USER', PERMISSIONS.MANAGE_PROGRAMS)) {
      return NextResponse.json(
        { error: 'Forbidden - You can only delete your own programs' },
        { status: 403 }
      );
    }

    await prisma.program.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error deleting program:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}