import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { NewsCategory } from "@prisma/client"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : undefined
    const category = searchParams.get("category")
    const featured = searchParams.get("featured")

    const where = {
      status: "PUBLISHED" as const,
      ...(category && category !== "all" ? { category: category as NewsCategory } : {}),
      ...(featured === "true" ? { featured: true } : {})
    }

    const news = await prisma.news.findMany({
      where,
      orderBy: [
        { featured: "desc" },
        { publishDate: "desc" },
        { createdAt: "desc" }
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
            lastName: true
          }
        }
      }
    })

    return NextResponse.json(news)
  } catch (error) {
    console.error("Error fetching public news:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}