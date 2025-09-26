import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { ContentTranslationHelper } from "@/lib/translation/content-translation";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const searchParams = request.nextUrl.searchParams;
    const locale = (searchParams.get("locale") || "es") as "es" | "en";

    const news = await prisma.news.findUnique({
      where: {
        id: id,
        status: "PUBLISHED",
      },
      select: {
        id: true,
        title: true,
        content: true,
        excerpt: true,
        category: true,
        featured: true,
        featuredImageUrl: true,
        publishDate: true,
        createdAt: true,
        author: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (!news) {
      return NextResponse.json(
        { error: "News article not found" },
        { status: 404 }
      );
    }

    // If requesting English, translate the content from Spanish (default language)
    if (locale === "en") {
      const translatedNews = await ContentTranslationHelper.translateNewsObject(
        news,
        locale
      );
      return NextResponse.json(translatedNews);
    }

    // Return Spanish content as-is
    return NextResponse.json(news);
  } catch (error) {
    console.error("Error fetching news article:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
