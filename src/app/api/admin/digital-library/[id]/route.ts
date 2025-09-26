import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { digitalLibraryFormSchema } from "@/lib/validations/digital-library";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/server";
import { hasPermission, PERMISSIONS, type Permission } from "@/lib/auth/rbac";
import type { UserRole } from "@prisma/client";

// Helper function for backward compatibility
const checkPermission = (role: string, permission: string) =>
  hasPermission(role as UserRole, permission as Permission);

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();

    if (
      !user ||
      !checkPermission(user.role || "USER", PERMISSIONS.VIEW_PUBLICATIONS)
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const publication = await prisma.digitalLibrary.findUnique({
      where: { id },
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

    if (!publication) {
      return NextResponse.json(
        { error: "Publication not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(publication);
  } catch (error) {
    console.error("Error fetching publication:", error);
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
    const user = await getCurrentUser();

    if (
      !user ||
      !checkPermission(user.role || "USER", PERMISSIONS.EDIT_PUBLICATIONS)
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = digitalLibraryFormSchema.parse(body);

    const { id } = await params;

    // Check if publication exists
    const existingPublication = await prisma.digitalLibrary.findUnique({
      where: { id },
    });

    if (!existingPublication) {
      return NextResponse.json(
        { error: "Publication not found" },
        { status: 404 }
      );
    }

    // Check if user can edit this publication (owner or admin)
    if (
      existingPublication.authorId !== user.id &&
      !checkPermission(user.role || "USER", PERMISSIONS.MANAGE_LIBRARY)
    ) {
      return NextResponse.json(
        { error: "Forbidden - You can only edit your own publications" },
        { status: 403 }
      );
    }

    const updatedPublication = await prisma.digitalLibrary.update({
      where: { id },
      data: {
        title: validatedData.title,
        description: validatedData.description,
        abstract: validatedData.abstract,
        type: validatedData.type,
        status: validatedData.status,
        featured: validatedData.featured,
        publishDate: validatedData.publishDate,
        fileUrl: validatedData.fileUrl,
        fileName: validatedData.fileName,
        fileSize: validatedData.fileSize,
        mimeType: validatedData.mimeType,
        coverImageUrl: validatedData.coverImageUrl,
        thumbnailUrl: validatedData.thumbnailUrl,
        tags: validatedData.tags || [],
        keywords: validatedData.keywords || [],
        relatedPrograms: validatedData.relatedPrograms || [],
        downloadCount: validatedData.downloadCount,
        viewCount: validatedData.viewCount,
        updatedAt: new Date(),
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

    return NextResponse.json(updatedPublication);
  } catch (error) {
    console.error("Error updating publication:", error);

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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();

    if (
      !user ||
      !checkPermission(user.role || "USER", PERMISSIONS.DELETE_PUBLICATIONS)
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const existingPublication = await prisma.digitalLibrary.findUnique({
      where: { id },
    });

    if (!existingPublication) {
      return NextResponse.json(
        { error: "Publication not found" },
        { status: 404 }
      );
    }

    // Check if user can delete this publication (owner or admin)
    if (
      existingPublication.authorId !== user.id &&
      !checkPermission(user.role || "USER", PERMISSIONS.MANAGE_LIBRARY)
    ) {
      return NextResponse.json(
        { error: "Forbidden - You can only delete your own publications" },
        { status: 403 }
      );
    }

    await prisma.digitalLibrary.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting publication:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Increment view count endpoint
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json();
    const { action } = body;

    const { id } = await params;

    if (action === "increment_view") {
      await prisma.digitalLibrary.update({
        where: { id },
        data: {
          viewCount: {
            increment: 1,
          },
        },
      });

      return NextResponse.json({ success: true });
    }

    if (action === "increment_download") {
      await prisma.digitalLibrary.update({
        where: { id },
        data: {
          downloadCount: {
            increment: 1,
          },
        },
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Error updating counters:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
