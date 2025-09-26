import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { OpinionStatus } from "@prisma/client";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const featured = searchParams.get("featured") === "true";
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const locale = searchParams.get("locale") || "es";

    const skip = (page - 1) * limit;

    // Construir filtros
    const where: any = {
      status: OpinionStatus.PUBLISHED,
    };

    if (featured) {
      where.featured = true;
    }

    if (category) {
      where.category = category;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { content: { contains: search, mode: "insensitive" } },
        { excerpt: { contains: search, mode: "insensitive" } },
      ];
    }

    const [opinions, totalCount] = await Promise.all([
      prisma.opinion.findMany({
        where,
        skip,
        take: limit,
        orderBy: { publishDate: "desc" },
        include: {
          author: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              avatarUrl: true,
            },
          },
        },
      }),
      prisma.opinion.count({ where }),
    ]);

    return NextResponse.json(opinions);
  } catch (error) {
    console.error("Error in GET /api/public/opinions:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
