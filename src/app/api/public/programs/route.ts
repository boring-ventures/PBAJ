import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { ProgramType } from "@prisma/client"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : undefined
    const type = searchParams.get("type")
    const featured = searchParams.get("featured")

    const where = {
      status: "ACTIVE" as const,
      ...(type && type !== "all" ? { type: type as ProgramType } : {}),
      ...(featured === "true" ? { featured: true } : {})
    }

    const programs = await prisma.program.findMany({
      where,
      orderBy: [
        { featured: "desc" },
        { startDate: "desc" },
        { createdAt: "desc" }
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
            lastName: true
          }
        }
      }
    })

    return NextResponse.json(programs)
  } catch (error) {
    console.error("Error fetching public programs:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}