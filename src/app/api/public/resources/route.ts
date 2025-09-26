import { NextRequest, NextResponse } from "next/server";
import { ResourcesService } from "@/lib/resources/resources-utils";
import { MediaType, MediaCategory } from "@prisma/client";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const rawLocale = searchParams.get("locale") || "es";
    const locale =
      rawLocale === "es" || rawLocale === "en"
        ? rawLocale
        : ("es" as "es" | "en");
    const limit = searchParams.get("limit")
      ? parseInt(searchParams.get("limit")!)
      : undefined;
    const type = searchParams.get("type");
    const category = searchParams.get("category");
    const featured = searchParams.get("featured");

    let resources: any[] = [];

    if (featured === "true") {
      resources = await ResourcesService.getFeaturedResources(
        locale,
        limit || 3
      );
    } else if (category && category !== "all") {
      resources = await ResourcesService.getResourcesByCategory(
        category as MediaCategory,
        locale,
        limit
      );
    } else if (type && type !== "all") {
      resources = await ResourcesService.getResourcesByType(
        type as MediaType,
        locale,
        limit
      );
    } else {
      resources = await ResourcesService.getPublicResources(locale, limit);
    }

    return NextResponse.json(resources);
  } catch (error) {
    console.error("Error fetching public resources:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
