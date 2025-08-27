import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth/server';
import { hasPermission, PERMISSIONS, type Permission } from '@/lib/auth/rbac';
import type { UserRole } from '@prisma/client';

const checkPermission = (role: string, permission: string) => hasPermission(role as UserRole, permission as Permission);

const categoryFormSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido').max(100),
  description: z.string().optional(),
  color: z.string().optional(),
  icon: z.string().optional(),
  type: z.enum(['NEWS', 'PROGRAM', 'PUBLICATION']),
});

const tagFormSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido').max(50),
  description: z.string().optional(),
  color: z.string().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user || !checkPermission(user.role || 'USER', PERMISSIONS.VIEW_SETTINGS)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // 'categories' or 'tags'

    if (type === 'categories') {
      const categories = await prisma.category.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: {
              news: true,
              programs: true,
              publications: true,
            }
          }
        }
      });

      const formattedCategories = categories.map(cat => ({
        id: cat.id,
        name: cat.name,
        description: cat.description,
        color: cat.color,
        icon: cat.icon,
        type: cat.type,
        itemCount: cat._count.news + cat._count.programs + cat._count.publications,
        createdAt: cat.createdAt,
      }));

      return NextResponse.json({ categories: formattedCategories });
    }

    if (type === 'tags') {
      const tags = await prisma.tag.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: {
              news: true,
              programs: true,
              publications: true,
            }
          }
        }
      });

      const formattedTags = tags.map(tag => ({
        id: tag.id,
        name: tag.name,
        description: tag.description,
        color: tag.color,
        itemCount: tag._count.news + tag._count.programs + tag._count.publications,
        createdAt: tag.createdAt,
      }));

      return NextResponse.json({ tags: formattedTags });
    }

    const [categories, tags] = await Promise.all([
      prisma.category.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: {
              news: true,
              programs: true,
              publications: true,
            }
          }
        }
      }),
      prisma.tag.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: {
              news: true,
              programs: true,
              publications: true,
            }
          }
        }
      })
    ]);

    const formattedCategories = categories.map(cat => ({
      id: cat.id,
      name: cat.name,
      description: cat.description,
      color: cat.color,
      icon: cat.icon,
      type: cat.type,
      itemCount: cat._count.news + cat._count.programs + cat._count.publications,
      createdAt: cat.createdAt,
    }));

    const formattedTags = tags.map(tag => ({
      id: tag.id,
      name: tag.name,
      description: tag.description,
      color: tag.color,
      itemCount: tag._count.news + tag._count.programs + tag._count.publications,
      createdAt: tag.createdAt,
    }));

    return NextResponse.json({
      categories: formattedCategories,
      tags: formattedTags,
    });

  } catch (error) {
    console.error('Error fetching taxonomy:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user || !checkPermission(user.role || 'USER', PERMISSIONS.MANAGE_SETTINGS)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { type, ...data } = body;

    if (type === 'category') {
      const validatedData = categoryFormSchema.parse(data);
      
      const category = await prisma.category.create({
        data: validatedData,
      });

      return NextResponse.json(category, { status: 201 });
    }

    if (type === 'tag') {
      const validatedData = tagFormSchema.parse(data);
      
      const tag = await prisma.tag.create({
        data: validatedData,
      });

      return NextResponse.json(tag, { status: 201 });
    }

    return NextResponse.json(
      { error: 'Invalid type. Must be "category" or "tag"' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Error creating taxonomy item:', error);
    
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

export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user || !checkPermission(user.role || 'USER', PERMISSIONS.MANAGE_SETTINGS)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { id, type, ...data } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    if (type === 'category') {
      const validatedData = categoryFormSchema.parse(data);
      
      const category = await prisma.category.update({
        where: { id },
        data: {
          ...validatedData,
          updatedAt: new Date(),
        },
      });

      return NextResponse.json(category);
    }

    if (type === 'tag') {
      const validatedData = tagFormSchema.parse(data);
      
      const tag = await prisma.tag.update({
        where: { id },
        data: {
          ...validatedData,
          updatedAt: new Date(),
        },
      });

      return NextResponse.json(tag);
    }

    return NextResponse.json(
      { error: 'Invalid type. Must be "category" or "tag"' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Error updating taxonomy item:', error);
    
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

export async function DELETE(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user || !checkPermission(user.role || 'USER', PERMISSIONS.MANAGE_SETTINGS)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const type = searchParams.get('type');

    if (!id || !type) {
      return NextResponse.json(
        { error: 'ID and type are required' },
        { status: 400 }
      );
    }

    if (type === 'category') {
      const existingCategory = await prisma.category.findUnique({ where: { id } });
      if (!existingCategory) {
        return NextResponse.json({ error: 'Category not found' }, { status: 404 });
      }

      await prisma.category.delete({ where: { id } });
      return NextResponse.json({ success: true, message: 'Category deleted successfully' });
    }

    if (type === 'tag') {
      const existingTag = await prisma.tag.findUnique({ where: { id } });
      if (!existingTag) {
        return NextResponse.json({ error: 'Tag not found' }, { status: 404 });
      }

      await prisma.tag.delete({ where: { id } });
      return NextResponse.json({ success: true, message: 'Tag deleted successfully' });
    }

    return NextResponse.json(
      { error: 'Invalid type. Must be "category" or "tag"' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Error deleting taxonomy item:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}