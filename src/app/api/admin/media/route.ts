import { NextRequest, NextResponse } from "next/server";
import { MediaService } from "@/lib/services/media";
import { MediaUploadService } from "@/lib/services/media-upload";
import { mediaFilterSchema, fileUploadSchema } from "@/lib/validations/media";
import { getCurrentUser } from "@/lib/auth/server";
import { MediaCategory } from "@prisma/client";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const queryParams = Object.fromEntries(searchParams.entries());

    // Convert strings to appropriate types
    const parsedParams = {
      ...queryParams,
      page: queryParams.page ? parseInt(queryParams.page) : 1,
      limit: queryParams.limit ? parseInt(queryParams.limit) : 20,
      tags: queryParams.tags ? queryParams.tags.split(",") : undefined,
      isPublic: queryParams.isPublic
        ? queryParams.isPublic === "true"
        : undefined,
    };

    // Validate filters
    const validatedFilters = mediaFilterSchema.safeParse(parsedParams);
    if (!validatedFilters.success) {
      return NextResponse.json(
        { error: "Invalid filters", details: validatedFilters.error.errors },
        { status: 400 }
      );
    }

    const result = await MediaService.getMediaAssets(validatedFilters.data);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      assets: result.assets,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error("Error in GET /api/admin/media:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Parse additional fields with bilingual support
    const category =
      (formData.get("category") as MediaCategory) || MediaCategory.GENERAL;
    const altTextEs = (formData.get("altTextEs") as string) || undefined;
    const altTextEn = (formData.get("altTextEn") as string) || undefined;
    const captionEs = (formData.get("captionEs") as string) || undefined;
    const captionEn = (formData.get("captionEn") as string) || undefined;
    const isPublic = formData.get("isPublic") === "true";
    const optimize = formData.get("optimize") !== "false";

    // Parse tags
    const tagsString = formData.get("tags") as string;
    let tags: string[] = [];
    try {
      tags = tagsString ? JSON.parse(tagsString) : [];
    } catch {
      tags = tagsString ? tagsString.split(",").map((tag) => tag.trim()) : [];
    }

    // Validate file using Zod schema
    const validation = fileUploadSchema.safeParse({
      file,
      category,
      altText: altTextEs || altTextEn,
      caption: captionEs || captionEn,
      tags,
      isPublic,
    });

    if (!validation.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validation.error.issues,
        },
        { status: 400 }
      );
    }

    // Upload with optimization and compression
    const result = await MediaUploadService.uploadWithOptimization(
      file,
      user.id,
      {
        category,
        altTextEs,
        altTextEn,
        captionEs,
        captionEn,
        tags,
        isPublic,
        optimize,
      }
    );

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || "Upload failed" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      asset: result.asset,
      optimizedUrls: result.optimizedUrls,
    });
  } catch (error) {
    console.error("Error in POST /api/admin/media:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}
