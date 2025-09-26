import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/server";
import { opinionFormSchema } from "@/lib/validations/opinions";
import { canAccessAdmin } from "@/lib/auth/rbac";
import prisma from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getCurrentUser();

    if (!user || !canAccessAdmin(user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const opinion = await prisma.opinion.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
          },
        },
      },
    });

    if (!opinion) {
      return NextResponse.json({ error: "Opinion not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: opinion,
    });
  } catch (error) {
    console.error("Error fetching opinion:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getCurrentUser();

    if (!user || !canAccessAdmin(user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Validar datos
    const validationResult = opinionFormSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validationResult.error.errors,
        },
        { status: 400 }
      );
    }

    const data = validationResult.data;

    // Verificar que la opinión existe
    const existingOpinion = await prisma.opinion.findUnique({ where: { id } });
    if (!existingOpinion) {
      return NextResponse.json({ error: "Opinion not found" }, { status: 404 });
    }

    // Actualizar opinión
    const opinion = await prisma.opinion.update({
      where: { id },
      data: {
        title: data.title,
        content: data.content,
        excerpt: data.excerpt,
        category: data.category,
        status: data.status,
        featured: data.featured,
        featuredImageUrl: data.featuredImageUrl,
        publishDate: data.publishDate,
      },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatarUrl: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: opinion,
    });
  } catch (error) {
    console.error("Error updating opinion:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getCurrentUser();

    if (!user || !canAccessAdmin(user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verificar que la opinión existe
    const existingOpinion = await prisma.opinion.findUnique({ where: { id } });
    if (!existingOpinion) {
      return NextResponse.json({ error: "Opinion not found" }, { status: 404 });
    }

    // Eliminar opinión
    await prisma.opinion.delete({ where: { id } });

    return NextResponse.json({
      success: true,
      message: "Opinion deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting opinion:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
