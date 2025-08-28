import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  digitalLibraryFormSchema,
  digitalLibraryFilterSchema,
  digitalLibraryBulkActionSchema,
} from "@/lib/validations/digital-library";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/server";
import { hasPermission, PERMISSIONS, type Permission } from "@/lib/auth/rbac";
import { PublicationStatus } from "@prisma/client";
import type { UserRole } from "@prisma/client";

// Helper function for backward compatibility
const checkPermission = (role: string, permission: string) =>
  hasPermission(role as UserRole, permission as Permission);

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (
      !user ||
      !checkPermission(user.role || "USER", PERMISSIONS.VIEW_PUBLICATIONS)
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const filters = digitalLibraryFilterSchema.parse({
      status: searchParams.get("status") || undefined,
      category: searchParams.get("category") || undefined,
      featured:
        searchParams.get("featured") === "true"
          ? true
          : searchParams.get("featured") === "false"
            ? false
            : undefined,
      search: searchParams.get("search") || undefined,
      authors: searchParams.get("authors") || undefined,
      tags: searchParams.get("tags") || undefined,
      language: searchParams.get("language") || undefined,
      publishedAfter: searchParams.get("publishedAfter")
        ? new Date(searchParams.get("publishedAfter")!)
        : undefined,
      publishedBefore: searchParams.get("publishedBefore")
        ? new Date(searchParams.get("publishedBefore")!)
        : undefined,
      page: parseInt(searchParams.get("page") || "1"),
      limit: parseInt(searchParams.get("limit") || "10"),
    });

    const where: Record<string, unknown> = {};

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.category) {
      where.category = filters.category;
    }

    if (filters.featured !== undefined) {
      where.featured = filters.featured;
    }

    if (filters.language && filters.language !== "both") {
      where.language = filters.language;
    }

    if (filters.search) {
      where.OR = [
        { titleEs: { contains: filters.search, mode: "insensitive" } },
        { titleEn: { contains: filters.search, mode: "insensitive" } },
        { descriptionEs: { contains: filters.search, mode: "insensitive" } },
        { descriptionEn: { contains: filters.search, mode: "insensitive" } },
        { abstractEs: { contains: filters.search, mode: "insensitive" } },
        { abstractEn: { contains: filters.search, mode: "insensitive" } },
      ];
    }

    if (filters.authors) {
      where.authors = { has: filters.authors };
    }

    if (filters.tags) {
      where.tags = { has: filters.tags };
    }

    if (filters.publishedAfter || filters.publishedBefore) {
      where.publishDate = {};
      if (filters.publishedAfter) {
        (where.publishDate as Record<string, Date>).gte =
          filters.publishedAfter;
      }
      if (filters.publishedBefore) {
        (where.publishDate as Record<string, Date>).lte =
          filters.publishedBefore;
      }
    }

    const skip = (filters.page - 1) * filters.limit;

    const [publications, totalCount] = await Promise.all([
      prisma.digitalLibrary.findMany({
        where,
        skip,
        take: filters.limit,
        orderBy: [
          { featured: "desc" },
          { publishDate: "desc" },
          { createdAt: "desc" },
        ],
        select: {
          id: true,
          titleEs: true,
          titleEn: true,
          descriptionEs: true,
          descriptionEn: true,
          abstractEs: true,
          abstractEn: true,
          type: true,
          status: true,
          featured: true,
          publishDate: true,
          fileUrl: true,
          fileName: true,
          fileSize: true,
          mimeType: true,
          coverImageUrl: true,
          thumbnailUrl: true,
          tags: true,
          keywords: true,
          isbn: true,
          doi: true,
          citationFormat: true,
          downloadCount: true,
          viewCount: true,
          createdAt: true,
          updatedAt: true,
          author: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
      }),
      prisma.digitalLibrary.count({ where }),
    ]);

    const totalPages = Math.ceil(totalCount / filters.limit);

    return NextResponse.json({
      publications,
      pagination: {
        currentPage: filters.page,
        totalPages,
        totalCount,
        limit: filters.limit,
      },
    });
  } catch (error) {
    console.error("Error fetching publications:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (
      !user ||
      !checkPermission(user.role || "USER", PERMISSIONS.CREATE_PUBLICATIONS)
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    console.log("Received POST body:", JSON.stringify(body, null, 2));
    console.log("Body keys:", Object.keys(body));
    console.log("Required fields in body:", {
      title: body.title,
      description: body.description,
      type: body.type,
      status: body.status,
      fileUrl: body.fileUrl,
    });

    const validatedData = digitalLibraryFormSchema.parse(body);

    const publication = await prisma.digitalLibrary.create({
      data: {
        titleEs: validatedData.titleEs || validatedData.title || "",
        titleEn: validatedData.titleEn || validatedData.title || "",
        descriptionEs:
          validatedData.descriptionEs || validatedData.description || "",
        descriptionEn:
          validatedData.descriptionEn || validatedData.description || "",
        abstractEs: validatedData.abstractEs,
        abstractEn: validatedData.abstractEn,
        type: validatedData.type,
        status: validatedData.status,
        featured: validatedData.featured || false,
        publishDate: validatedData.publishDate,
        fileUrl: validatedData.fileUrl,
        fileName: validatedData.fileName || "",
        fileSize: validatedData.fileSize,
        mimeType: validatedData.mimeType,
        coverImageUrl: validatedData.coverImageUrl,
        thumbnailUrl: validatedData.thumbnailUrl,
        tags: validatedData.tags || [],
        keywords: validatedData.keywords || [],
        relatedPrograms: validatedData.relatedPrograms || [],
        downloadCount: validatedData.downloadCount || 0,
        viewCount: validatedData.viewCount || 0,
        authorId: user.id,
      },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    return NextResponse.json(publication, { status: 201 });
  } catch (error) {
    console.error("Error creating publication:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (
      !user ||
      !checkPermission(user.role || "USER", PERMISSIONS.MANAGE_LIBRARY)
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { action, publicationIds } =
      digitalLibraryBulkActionSchema.parse(body);

    let updateData: Record<string, unknown> = {};

    switch (action) {
      case "publish":
        updateData = { status: PublicationStatus.PUBLISHED };
        break;
      case "unpublish":
        updateData = { status: PublicationStatus.DRAFT };
        break;
      case "archive":
        updateData = { status: PublicationStatus.ARCHIVED };
        break;
      case "feature":
        updateData = { featured: true };
        break;
      case "unfeature":
        updateData = { featured: false };
        break;
      case "delete":
        await prisma.digitalLibrary.deleteMany({
          where: {
            id: { in: publicationIds },
          },
        });
        return NextResponse.json({ success: true });
    }

    const updatedPublications = await prisma.digitalLibrary.updateMany({
      where: {
        id: { in: publicationIds },
      },
      data: {
        ...updateData,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      updated: updatedPublications.count,
    });
  } catch (error) {
    console.error("Error in bulk action:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
