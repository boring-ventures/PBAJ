import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { NewsCategory } from "@prisma/client";
import { ContentTranslationHelper } from "@/lib/translation/content-translation";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = searchParams.get("limit")
      ? parseInt(searchParams.get("limit")!)
      : undefined;
    const category = searchParams.get("category");
    const featured = searchParams.get("featured");
    const locale = (searchParams.get("locale") || "es") as "es" | "en";

    const where = {
      status: "PUBLISHED" as const,
      ...(category && category !== "all"
        ? { category: category as NewsCategory }
        : {}),
      ...(featured === "true" ? { featured: true } : {}),
    };

    const news = await prisma.news.findMany({
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
        contentEs: true,
        contentEn: true,
        excerptEs: true,
        excerptEn: true,
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

    // Transform to single-language structure based on locale
    const localizedNews = news.map(newsItem => {
      const localized = {
        id: newsItem.id,
        title: locale === "es" ? newsItem.titleEs : newsItem.titleEn || newsItem.titleEs,
        content: locale === "es" ? newsItem.contentEs : newsItem.contentEn || newsItem.contentEs,
        excerpt: locale === "es" ? newsItem.excerptEs : newsItem.excerptEn || newsItem.excerptEs,
        category: newsItem.category,
        featured: newsItem.featured,
        featuredImageUrl: newsItem.featuredImageUrl,
        publishDate: newsItem.publishDate,
        createdAt: newsItem.createdAt,
        author: newsItem.author,
      };

      return localized;
    });

    // If requesting English but content is not available in English, translate from Spanish
    const needsTranslation = locale === "en";
    if (needsTranslation) {
      const translatedNews = await Promise.all(
        localizedNews.map(async (newsItem) => {
          // Only translate if English content is missing
          const originalNews = news.find(n => n.id === newsItem.id);
          const hasEnglishContent = originalNews?.titleEn || originalNews?.contentEn;

          if (!hasEnglishContent) {
            return await ContentTranslationHelper.translateNewsObject(newsItem, locale);
          }
          return newsItem;
        })
      );
      return NextResponse.json(translatedNews);
    }

    return NextResponse.json(localizedNews);
  } catch (error) {
    console.error("Error fetching public news:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
