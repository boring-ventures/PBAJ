import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/server";
import { newsFormSchema } from "@/lib/validations/news";
import { canAccessAdmin } from "@/lib/auth/rbac";
import prisma from "@/lib/prisma";
import { NewsStatus, NewsCategory } from "@prisma/client";

// GET - Obtener lista de noticias
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
    const status = searchParams.get("status") as NewsStatus | null;
    const category = searchParams.get("category") as NewsCategory | null;
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
    const [news, totalCount] = await Promise.all([
      prisma.news.findMany({
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
      prisma.news.count({ where }),
    ]);

    console.log(`✅ Retrieved ${news.length} news articles`);

    return NextResponse.json({
      success: true,
      data: news,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error("Error in GET /api/admin/news:", error);
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

// POST - Crear nueva noticia
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || !canAccessAdmin(user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Validar datos
    const validationResult = newsFormSchema.safeParse(body);
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

    // Crear noticia en la base de datos
    const news = await prisma.news.create({
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
        data: news,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in POST /api/admin/news:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT - Actualizar noticia existente
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
        { error: "News ID is required" },
        { status: 400 }
      );
    }

    // Validar datos
    const validationResult = newsFormSchema.safeParse(updateData);
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

    // Verificar que la noticia existe
    const existingNews = await prisma.news.findUnique({ where: { id } });
    if (!existingNews) {
      return NextResponse.json({ error: "News not found" }, { status: 404 });
    }

    // Actualizar noticia
    const updatedNews = await prisma.news.update({
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
        updatedAt: new Date(),
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
      data: updatedNews,
    });
  } catch (error) {
    console.error("Error in PUT /api/admin/news:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar noticia
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
        { error: "News ID is required" },
        { status: 400 }
      );
    }

    // Verificar que la noticia existe
    const existingNews = await prisma.news.findUnique({ where: { id } });
    if (!existingNews) {
      return NextResponse.json({ error: "News not found" }, { status: 404 });
    }

    // Eliminar noticia
    await prisma.news.delete({ where: { id } });

    return NextResponse.json({
      success: true,
      message: "News deleted successfully",
    });
  } catch (error) {
    console.error("Error in DELETE /api/admin/news:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
