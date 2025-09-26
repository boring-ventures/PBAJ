import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/server";
import { newsFormSchema } from "@/lib/validations/news";
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

    const news = await prisma.news.findUnique({
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

    if (!news) {
      return NextResponse.json({ error: "News not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: news,
    });
  } catch (error) {
    console.error("Error fetching news:", error);
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

    const existingNews = await prisma.news.findUnique({ where: { id } });
    if (!existingNews) {
      return NextResponse.json({ error: "News not found" }, { status: 404 });
    }

    const updatedNews = await prisma.news.update({
      where: { id },
      data: {
        titleEs: data.titleEs,
        titleEn: data.titleEn,
        contentEs: data.contentEs,
        contentEn: data.contentEn,
        excerptEs: data.excerptEs,
        excerptEn: data.excerptEn,
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
    console.error("Error updating news:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
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

    const existingNews = await prisma.news.findUnique({ where: { id } });
    if (!existingNews) {
      return NextResponse.json({ error: "News not found" }, { status: 404 });
    }

    const updatedNews = await prisma.news.update({
      where: { id },
      data: {
        ...(body.titleEs && { titleEs: body.titleEs }),
        ...(body.titleEn && { titleEn: body.titleEn }),
        ...(body.contentEs && { contentEs: body.contentEs }),
        ...(body.contentEn && { contentEn: body.contentEn }),
        ...(body.excerptEs !== undefined && { excerptEs: body.excerptEs }),
        ...(body.excerptEn !== undefined && { excerptEn: body.excerptEn }),
        ...(body.category && { category: body.category }),
        ...(body.status && { status: body.status }),
        ...(body.featured !== undefined && { featured: body.featured }),
        ...(body.featuredImageUrl !== undefined && {
          featuredImageUrl: body.featuredImageUrl,
        }),
        ...(body.publishDate !== undefined && {
          publishDate: body.publishDate,
        }),
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
    console.error("Error updating news:", error);
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

    const existingNews = await prisma.news.findUnique({ where: { id } });
    if (!existingNews) {
      return NextResponse.json({ error: "News not found" }, { status: 404 });
    }

    await prisma.news.delete({ where: { id } });

    return NextResponse.json({
      success: true,
      message: "News deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting news:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
