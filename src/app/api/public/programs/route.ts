import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { ProgramType } from "@prisma/client";
import { ContentTranslationHelper } from "@/lib/translation/content-translation";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = searchParams.get("limit")
      ? parseInt(searchParams.get("limit")!)
      : undefined;
    const type = searchParams.get("type");
    const featured = searchParams.get("featured");
    const locale = (searchParams.get("locale") || "es") as "es" | "en";

    const where = {
      status: "ACTIVE" as const,
      ...(type && type !== "all" ? { type: type as ProgramType } : {}),
      ...(featured === "true" ? { featured: true } : {}),
    };

    const programs = await prisma.program.findMany({
      where,
      orderBy: [
        { featured: "desc" },
        { startDate: "desc" },
        { createdAt: "desc" },
      ],
      take: limit,
      select: {
        id: true,
        title: true,
        description: true,
        overview: true,
        objectives: true,
        type: true,
        featured: true,
        featuredImageUrl: true,
        galleryImages: true,
        documentUrls: true,
        targetPopulation: true,
        startDate: true,
        endDate: true,
        region: true,
        progressPercentage: true,
        createdAt: true,
        manager: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    // If requesting English, translate the content from Spanish (default language)
    if (locale === "en") {
      const translatedPrograms = await Promise.all(
        programs.map(async (program) => {
          return await ContentTranslationHelper.translateProgramObject(
            program,
            locale
          );
        })
      );
      return NextResponse.json(translatedPrograms);
    }

    // Return Spanish content as-is
    return NextResponse.json(programs);
  } catch (error) {
    console.error("Error fetching public programs:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
