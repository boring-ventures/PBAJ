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
        titleEs: true,
        titleEn: true,
        descriptionEs: true,
        descriptionEn: true,
        overviewEs: true,
        overviewEn: true,
        objectivesEs: true,
        objectivesEn: true,
        type: true,
        featured: true,
        featuredImageUrl: true,
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

    // Transform to single-language structure based on locale
    const localizedPrograms = programs.map(program => {
      const localized = {
        id: program.id,
        title: locale === "es" ? program.titleEs : program.titleEn || program.titleEs,
        description: locale === "es" ? program.descriptionEs : program.descriptionEn || program.descriptionEs,
        overview: locale === "es" ? program.overviewEs : program.overviewEn || program.overviewEs,
        objectives: locale === "es" ? program.objectivesEs : program.objectivesEn || program.objectivesEs,
        type: program.type,
        featured: program.featured,
        featuredImageUrl: program.featuredImageUrl,
        startDate: program.startDate,
        endDate: program.endDate,
        region: program.region,
        progressPercentage: program.progressPercentage,
        createdAt: program.createdAt,
        manager: program.manager,
      };

      return localized;
    });

    // If requesting English but content is not available in English, translate from Spanish
    const needsTranslation = locale === "en";
    if (needsTranslation) {
      const translatedPrograms = await Promise.all(
        localizedPrograms.map(async (program) => {
          // Only translate if English content is missing
          const originalProgram = programs.find(p => p.id === program.id);
          const hasEnglishContent = originalProgram?.titleEn || originalProgram?.descriptionEn;

          if (!hasEnglishContent) {
            return await ContentTranslationHelper.translateProgramObject(program, locale);
          }
          return program;
        })
      );
      return NextResponse.json(translatedPrograms);
    }

    return NextResponse.json(localizedPrograms);
  } catch (error) {
    console.error("Error fetching public programs:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
