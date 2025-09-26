import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { PublicationType } from "@prisma/client";
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
      status: "PUBLISHED" as const,
      ...(type && type !== "all" ? { type: type as PublicationType } : {}),
      ...(featured === "true" ? { featured: true } : {}),
    };

    const publications = await prisma.digitalLibrary.findMany({
      where,
      orderBy: [
        { featured: "desc" },
        { publishDate: "desc" },
        { createdAt: "desc" },
      ],
      take: limit,
      select: {
        id: true,
        title: true,
        description: true,
        abstract: true,
        type: true,
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
        author: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    // If requesting English, translate the content from Spanish (default language)
    if (locale === "en") {
      const translatedPublications = await Promise.all(
        publications.map(async (publication) => {
          return await ContentTranslationHelper.translateLibraryObject(
            publication,
            locale
          );
        })
      );
      return NextResponse.json(translatedPublications);
    }

    // Return Spanish content as-is
    return NextResponse.json(publications);
  } catch (error) {
    console.error("Error fetching public digital library:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
