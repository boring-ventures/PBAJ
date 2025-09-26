import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/server";
import { opinionFormSchema } from "@/lib/validations/opinions";
import { canAccessAdmin } from "@/lib/auth/rbac";
import prisma from "@/lib/prisma";
import { OpinionStatus, OpinionCategory } from "@prisma/client";

// GET - Obtener lista de opiniones
export async function GET(request: NextRequest) {
  try {
    console.log("🔍 Getting current user...");
    const user = await getCurrentUser();
    console.log("👤 User result:", {
      found: !!user,
      role: user?.role || "none",
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    if (!canAccessAdmin(user.role)) {
      console.log(
        "🚫 Access denied - insufficient privileges. Required admin permissions for role:",
        user.role
      );
      return NextResponse.json(
        { error: "Insufficient privileges" },
        { status: 403 }
      );
    }

    console.log("✅ User authenticated and authorized");

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status") as OpinionStatus | null;
    const category = searchParams.get("category") as OpinionCategory | null;
    const search = searchParams.get("search");

    const skip = (page - 1) * limit;

    // Construir filtros
    const where: any = {};
    if (status) where.status = status;
    if (category) where.category = category;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { content: { contains: search, mode: "insensitive" } },
        { excerpt: { contains: search, mode: "insensitive" } },
      ];
    }

    console.log("🔍 Querying database...");
    const [opinions, totalCount] = await Promise.all([
      prisma.opinion.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
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
      }),
      prisma.opinion.count({ where }),
    ]);

    console.log(`✅ Retrieved ${opinions.length} opinions`);

    return NextResponse.json({
      success: true,
      data: opinions,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error("Error in GET /api/admin/opinions:", error);
    console.error("Full error details:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined,
    });

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}

// POST - Crear nueva opinión
export async function POST(request: NextRequest) {
  try {
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

    // Crear opinión en la base de datos
    const opinion = await prisma.opinion.create({
      data: {
        title: data.title,
        content: data.content,
        excerpt: data.excerpt,
        category: data.category,
        status: data.status,
        featured: data.featured,
        featuredImageUrl: data.featuredImageUrl,
        publishDate: data.publishDate,
        authorId: user.id,
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

    return NextResponse.json(
      {
        success: true,
        data: opinion,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in POST /api/admin/opinions:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT - Actualizar opinión existente
export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || !canAccessAdmin(user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Opinion ID is required" },
        { status: 400 }
      );
    }

    // Validar datos
    const validationResult = opinionFormSchema.safeParse(updateData);
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
    console.error("Error in PUT /api/admin/opinions:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar opinión
export async function DELETE(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || !canAccessAdmin(user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Opinion ID is required" },
        { status: 400 }
      );
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
    console.error("Error in DELETE /api/admin/opinions:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
