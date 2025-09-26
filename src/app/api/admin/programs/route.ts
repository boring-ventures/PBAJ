import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  programFormSchema,
  programFilterSchema,
  programBulkActionSchema,
} from "@/lib/validations/programs";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth/server";
import { hasPermission, PERMISSIONS, type Permission } from "@/lib/auth/rbac";
import { ProgramStatus } from "@prisma/client";
import type { UserRole } from "@prisma/client";

// Helper function for backward compatibility
const checkPermission = (role: string, permission: string) =>
  hasPermission(role as UserRole, permission as Permission);

export async function GET(request: NextRequest) {
  try {
    console.log("GET /api/admin/programs - Starting request");

    const user = await getCurrentUser();
    console.log("User:", user ? { id: user.id, role: user.role } : "No user");

    if (
      !user ||
      !checkPermission(user.role || "USER", PERMISSIONS.VIEW_PROGRAMS)
    ) {
      console.log("Unauthorized access attempt");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    console.log("Search params:", Object.fromEntries(searchParams.entries()));

    const filters = programFilterSchema.parse({
      status: searchParams.get("status") || undefined,
      type: searchParams.get("type") || undefined,
      featured:
        searchParams.get("featured") === "true"
          ? true
          : searchParams.get("featured") === "false"
            ? false
            : undefined,
      search: searchParams.get("search") || undefined,
      managerId: searchParams.get("managerId") || undefined,
      region: searchParams.get("region") || undefined,
      page: parseInt(searchParams.get("page") || "1"),
      limit: parseInt(searchParams.get("limit") || "10"),
    });

    console.log("Parsed filters:", filters);

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
        { titleEs: { contains: filters.search, mode: "insensitive" } },
        { titleEn: { contains: filters.search, mode: "insensitive" } },
        { descriptionEs: { contains: filters.search, mode: "insensitive" } },
        { descriptionEn: { contains: filters.search, mode: "insensitive" } },
        { overviewEs: { contains: filters.search, mode: "insensitive" } },
        { overviewEn: { contains: filters.search, mode: "insensitive" } },
        { objectivesEs: { contains: filters.search, mode: "insensitive" } },
        { objectivesEn: { contains: filters.search, mode: "insensitive" } },
      ];
    }

    if (filters.region) {
      where.region = { contains: filters.region, mode: "insensitive" };
    }

    const skip = (filters.page - 1) * filters.limit;
    console.log(
      "Database query - where:",
      where,
      "skip:",
      skip,
      "take:",
      filters.limit
    );

    const [programs, totalCount] = await Promise.all([
      prisma.program.findMany({
        where,
        skip,
        take: filters.limit,
        orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
        select: {
          id: true,
          titleEs: true,
          titleEn: true,
          descriptionEs: true,
          descriptionEn: true,
          overviewEs: true,
          overviewEn: true,
          objectivesEs: true,
          objectivesEn: true,
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

    console.log(
      "Database query results - programs count:",
      programs.length,
      "total count:",
      totalCount
    );

    const totalPages = Math.ceil(totalCount / filters.limit);

    // Para compatibilidad con el frontend, devolver solo los programas como array
    // Si necesitas paginación, descomenta las siguientes líneas:
    // return NextResponse.json({
    //   programs,
    //   pagination: {
    //     currentPage: filters.page,
    //     totalPages,
    //     totalCount,
    //     limit: filters.limit,
    //   },
    // });

    console.log("Returning programs:", programs.length);
    return NextResponse.json(programs);
  } catch (error) {
    console.error("Error in GET /api/admin/programs:", error);

    if (error instanceof z.ZodError) {
      console.error("Validation error:", error.errors);
      return NextResponse.json(
        {
          error: "Validation error",
          details: error.errors,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
        stack:
          process.env.NODE_ENV === "development"
            ? error instanceof Error
              ? error.stack
              : undefined
            : undefined,
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (
      !user ||
      !checkPermission(user.role || "USER", PERMISSIONS.CREATE_PROGRAMS)
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = programFormSchema.parse(body);

    const program = await prisma.program.create({
      data: {
        titleEs: validatedData.titleEs || "",
        titleEn: validatedData.titleEn || "",
        descriptionEs: validatedData.descriptionEs || "",
        descriptionEn: validatedData.descriptionEn || "",
        overviewEs: validatedData.overviewEs,
        overviewEn: validatedData.overviewEn,
        objectivesEs: validatedData.objectivesEs,
        objectivesEn: validatedData.objectivesEn,
        type: validatedData.type,
        status: validatedData.status,
        featured: validatedData.featured || false,
        startDate: validatedData.startDate,
        endDate: validatedData.endDate,
        featuredImageUrl: validatedData.featuredImageUrl,
        galleryImages: validatedData.galleryImages || [],
        documentUrls: validatedData.documentUrls || [],
        targetPopulation: validatedData.targetPopulation,
        region: validatedData.region,
        budget: validatedData.budget,
        progressPercentage: validatedData.progressPercentage || 0,
        managerId: user.id,
      },
      include: {
        manager: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    return NextResponse.json(program, { status: 201 });
  } catch (error) {
    console.error("Error creating program:", error);

    if (error instanceof z.ZodError) {
      const errorMessages = error.errors
        .map((e) => `${e.path.join(".")}: ${e.message}`)
        .join(", ");
      return NextResponse.json(
        {
          error: "Error de validación",
          message: `Errores de validación: ${errorMessages}`,
          details: error.errors,
        },
        { status: 400 }
      );
    }

    if (error instanceof Error) {
      return NextResponse.json(
        {
          error: "Error interno del servidor",
          message: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        error: "Error interno del servidor",
        message: "Error desconocido al crear el programa",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (
      !user ||
      !checkPermission(user.role || "USER", PERMISSIONS.MANAGE_PROGRAMS)
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { action, programIds } = programBulkActionSchema.parse(body);

    let updateData: Record<string, unknown> = {};

    switch (action) {
      case "activate":
        updateData = { status: ProgramStatus.ACTIVE };
        break;
      case "pause":
        updateData = { status: ProgramStatus.PAUSED };
        break;
      case "complete":
        updateData = {
          status: ProgramStatus.COMPLETED,
          progressPercentage: 100,
        };
        break;
      case "feature":
        updateData = { featured: true };
        break;
      case "unfeature":
        updateData = { featured: false };
        break;
      case "delete":
        await prisma.program.deleteMany({
          where: {
            id: { in: programIds },
          },
        });
        return NextResponse.json({ success: true });
    }

    const updatedPrograms = await prisma.program.updateMany({
      where: {
        id: { in: programIds },
      },
      data: {
        ...updateData,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      updated: updatedPrograms.count,
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
