import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { PublicationType } from "@prisma/client";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = searchParams.get("limit")
      ? parseInt(searchParams.get("limit")!)
      : undefined;
    const type = searchParams.get("type");
    const featured = searchParams.get("featured");

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
        titleEs: true,
        titleEn: true,
        descriptionEs: true,
        descriptionEn: true,
        abstractEs: true,
        abstractEn: true,
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

    return NextResponse.json(publications);
  } catch (error) {
    console.error("Error fetching public digital library:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
