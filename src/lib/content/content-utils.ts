import prisma from "@/lib/prisma";
import type { Locale } from "../../../i18n";
import { getLocalizedContent } from "@/lib/i18n/dictionary";

// Types for our content models with localized fields
export interface LocalizedNews {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  category: string;
  status: string;
  featured: boolean;
  featuredImageUrl?: string;
  publishDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  author: {
    id: string;
    firstName?: string;
    lastName?: string;
  };
}

export interface LocalizedProgram {
  id: string;
  title: string;
  description: string;
  overview?: string;
  objectives?: string;
  type: string;
  status: string;
  featured: boolean;
  startDate?: Date;
  endDate?: Date;
  featuredImageUrl?: string;
  galleryImages: string[];
  documentUrls: string[];
  targetPopulation?: string;
  region?: string;
  budget?: number;
  progressPercentage?: number;
  createdAt: Date;
  updatedAt: Date;
  manager: {
    id: string;
    firstName?: string;
    lastName?: string;
  };
}

export interface LocalizedPublication {
  id: string;
  title: string;
  description: string;
  abstract?: string;
  type: string;
  status: string;
  featured: boolean;
  fileUrl: string;
  fileName: string;
  fileSize?: number;
  mimeType?: string;
  coverImageUrl?: string;
  thumbnailUrl?: string;
  tags: string[];
  keywords: string[];
  publishDate?: Date;
  isbn?: string;
  doi?: string;
  citationFormat?: string;
  downloadCount: number;
  viewCount: number;
  createdAt: Date;
  updatedAt: Date;
  author: {
    id: string;
    firstName?: string;
    lastName?: string;
  };
  relatedPrograms: string[];
}

export interface LocalizedCategory {
  id: string;
  name: string;
  description?: string;
  slug: string;
  contentType: string;
  color?: string;
  iconName?: string;
  isActive: boolean;
  sortOrder: number;
}

export interface LocalizedTag {
  id: string;
  name: string;
  slug: string;
  contentType: string;
  color?: string;
  usageCount: number;
  isActive: boolean;
}

// Utility function to transform database content to localized format
function localizeContent<T extends Record<string, any>>(
  content: T,
  locale: Locale,
  fields: string[]
): T {
  const localized = { ...content } as T;

  fields.forEach((field) => {
    (localized as any)[field] = getLocalizedContent(content, locale, field);
  });

  return localized;
}

// News content utilities
export class NewsService {
  static async getPublishedNews(
    locale: Locale,
    limit?: number
  ): Promise<LocalizedNews[]> {
    const news = await prisma.news.findMany({
      where: {
        status: "PUBLISHED",
        publishDate: {
          lte: new Date(),
        },
      },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: {
        publishDate: "desc",
      },
      take: limit,
    });

    return news.map((item) =>
      localizeContent(item, locale, ["title", "content", "excerpt"])
    ) as unknown as LocalizedNews[];
  }

  static async getFeaturedNews(
    locale: Locale,
    limit = 3
  ): Promise<LocalizedNews[]> {
    const news = await prisma.news.findMany({
      where: {
        status: "PUBLISHED",
        featured: true,
        publishDate: {
          lte: new Date(),
        },
      },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: {
        publishDate: "desc",
      },
      take: limit,
    });

    return news.map((item) =>
      localizeContent(item, locale, ["title", "content", "excerpt"])
    ) as unknown as LocalizedNews[];
  }

  static async getNewsByCategory(
    category: string,
    locale: Locale,
    limit?: number
  ): Promise<LocalizedNews[]> {
    const news = await prisma.news.findMany({
      where: {
        status: "PUBLISHED",
        category: category as any,
        publishDate: {
          lte: new Date(),
        },
      },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: {
        publishDate: "desc",
      },
      take: limit,
    });

    return news.map((item) =>
      localizeContent(item, locale, ["title", "content", "excerpt"])
    ) as unknown as LocalizedNews[];
  }

  static async getNewsById(
    id: string,
    locale: Locale
  ): Promise<LocalizedNews | null> {
    const news = await prisma.news.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (!news) return null;

    return localizeContent(news, locale, ["title", "content", "excerpt"]) as unknown as LocalizedNews;
  }
}

// Programs content utilities
export class ProgramsService {
  static async getActivePrograms(
    locale: Locale,
    limit?: number
  ): Promise<LocalizedProgram[]> {
    const programs = await prisma.program.findMany({
      where: {
        status: "ACTIVE",
      },
      include: {
        manager: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: {
        startDate: "desc",
      },
      take: limit,
    });

    return programs.map((item) =>
      localizeContent(item, locale, [
        "title",
        "description",
        "overview",
        "objectives",
      ])
    ) as unknown as LocalizedProgram[];
  }

  static async getFeaturedPrograms(
    locale: Locale,
    limit = 3
  ): Promise<LocalizedProgram[]> {
    const programs = await prisma.program.findMany({
      where: {
        status: "ACTIVE",
        featured: true,
      },
      include: {
        manager: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: [{ featured: "desc" }, { startDate: "desc" }],
      take: limit,
    });

    return programs.map((item) =>
      localizeContent(item, locale, [
        "title",
        "description",
        "overview",
        "objectives",
      ])
    ) as unknown as LocalizedProgram[];
  }

  static async getProgramsByType(
    type: string,
    locale: Locale,
    limit?: number
  ): Promise<LocalizedProgram[]> {
    const programs = await prisma.program.findMany({
      where: { type: type as any },
      include: {
        manager: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: {
        startDate: "desc",
      },
      take: limit,
    });

    return programs.map((item) =>
      localizeContent(item, locale, [
        "title",
        "description",
        "overview",
        "objectives",
      ])
    ) as unknown as LocalizedProgram[];
  }

  static async getProgramById(
    id: string,
    locale: Locale
  ): Promise<LocalizedProgram | null> {
    const program = await prisma.program.findUnique({
      where: { id },
      include: {
        manager: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (!program) return null;

    return localizeContent(program, locale, [
      "title",
      "description",
      "overview",
      "objectives",
    ]) as unknown as LocalizedProgram;
  }
}

// Digital Library utilities
export class LibraryService {
  static async getPublishedPublications(
    locale: Locale,
    limit?: number
  ): Promise<LocalizedPublication[]> {
    const publications = await prisma.digitalLibrary.findMany({
      where: {
        status: "PUBLISHED",
      },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: {
        publishDate: "desc",
      },
      take: limit,
    });

    return publications.map((item) =>
      localizeContent(item, locale, ["title", "description", "abstract"])
    ) as unknown as LocalizedPublication[];
  }

  static async getFeaturedPublications(
    locale: Locale,
    limit = 3
  ): Promise<LocalizedPublication[]> {
    const publications = await prisma.digitalLibrary.findMany({
      where: {
        status: "PUBLISHED",
        featured: true,
      },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: {
        publishDate: "desc",
      },
      take: limit,
    });

    return publications.map((item) =>
      localizeContent(item, locale, ["title", "description", "abstract"])
    ) as unknown as LocalizedPublication[];
  }

  static async getPublicationsByType(
    type: string,
    locale: Locale,
    limit?: number
  ): Promise<LocalizedPublication[]> {
    const publications = await prisma.digitalLibrary.findMany({
      where: {
        type: type as any,
        status: "PUBLISHED",
      },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: {
        publishDate: "desc",
      },
      take: limit,
    });

    return publications.map((item) =>
      localizeContent(item, locale, ["title", "description", "abstract"])
    ) as unknown as LocalizedPublication[];
  }

  static async getPublicationById(
    id: string,
    locale: Locale
  ): Promise<LocalizedPublication | null> {
    const publication = await prisma.digitalLibrary.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (!publication) return null;

    return localizeContent(publication, locale, [
      "title",
      "description",
      "abstract",
    ]) as unknown as LocalizedPublication;
  }

  static async incrementDownloadCount(id: string): Promise<void> {
    await prisma.digitalLibrary.update({
      where: { id },
      data: {
        downloadCount: {
          increment: 1,
        },
      },
    });
  }

  static async incrementViewCount(id: string): Promise<void> {
    await prisma.digitalLibrary.update({
      where: { id },
      data: {
        viewCount: {
          increment: 1,
        },
      },
    });
  }
}

// Categories and Tags utilities
export class CategoryService {
  static async getActiveCategories(
    contentType: string,
    locale: Locale
  ): Promise<LocalizedCategory[]> {
    const categories = await prisma.category.findMany({
      where: {
        contentType: contentType as any,
        isActive: true,
      },
      orderBy: {
        sortOrder: "asc",
      },
    });

    return categories.map((item) =>
      localizeContent(item, locale, ["name", "description"])
    ) as unknown as LocalizedCategory[];
  }
}

export class TagService {
  static async getActiveTags(
    contentType: string,
    locale: Locale,
    limit?: number
  ): Promise<LocalizedTag[]> {
    const tags = await prisma.tag.findMany({
      where: {
        contentType: contentType as any,
        isActive: true,
      },
      orderBy: {
        usageCount: "desc",
      },
      take: limit,
    });

    return tags.map((item) => localizeContent(item, locale, ["name"]));
  }

  static async getPopularTags(
    locale: Locale,
    limit = 10
  ): Promise<LocalizedTag[]> {
    const tags = await prisma.tag.findMany({
      where: {
        isActive: true,
        usageCount: {
          gt: 0,
        },
      },
      orderBy: {
        usageCount: "desc",
      },
      take: limit,
    });

    return tags.map((item) => localizeContent(item, locale, ["name"]));
  }
}

// Search utilities
export class SearchService {
  static async searchContent(
    query: string,
    locale: Locale,
    contentTypes: ("news" | "programs" | "publications")[] = [
      "news",
      "programs",
      "publications",
    ]
  ): Promise<{
    news: LocalizedNews[];
    programs: LocalizedProgram[];
    publications: LocalizedPublication[];
  }> {
    const results = {
      news: [] as LocalizedNews[],
      programs: [] as LocalizedProgram[],
      publications: [] as LocalizedPublication[],
    };

    if (contentTypes.includes("news")) {
      const news = await prisma.news.findMany({
        where: {
          status: "PUBLISHED",
          OR: [
            { titleEs: { contains: query, mode: "insensitive" } },
            { titleEn: { contains: query, mode: "insensitive" } },
            { contentEs: { contains: query, mode: "insensitive" } },
            { contentEn: { contains: query, mode: "insensitive" } },
          ],
        },
        include: {
          author: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
        },
        take: 5,
      });

      results.news = news.map((item) =>
        localizeContent(item, locale, ["title", "content", "excerpt"])
      );
    }

    if (contentTypes.includes("programs")) {
      const programs = await prisma.program.findMany({
        where: {
          OR: [
            { titleEs: { contains: query, mode: "insensitive" } },
            { titleEn: { contains: query, mode: "insensitive" } },
            { descriptionEs: { contains: query, mode: "insensitive" } },
            { descriptionEn: { contains: query, mode: "insensitive" } },
          ],
        },
        include: {
          manager: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
        },
        take: 5,
      });

      results.programs = programs.map((item) =>
        localizeContent(item, locale, [
          "title",
          "description",
          "overview",
          "objectives",
        ])
      );
    }

    if (contentTypes.includes("publications")) {
      const publications = await prisma.digitalLibrary.findMany({
        where: {
          status: "PUBLISHED",
          OR: [
            { titleEs: { contains: query, mode: "insensitive" } },
            { titleEn: { contains: query, mode: "insensitive" } },
            { descriptionEs: { contains: query, mode: "insensitive" } },
            { descriptionEn: { contains: query, mode: "insensitive" } },
            { tags: { hasSome: [query] } },
            { keywords: { hasSome: [query] } },
          ],
        },
        include: {
          author: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
        },
        take: 5,
      });

      results.publications = publications.map((item) =>
        localizeContent(item, locale, ["title", "description", "abstract"])
      );
    }

    return results;
  }
}
