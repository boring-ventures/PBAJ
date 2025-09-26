import prisma from "@/lib/prisma";
import type { Locale } from "../../../i18n";
import { getLocalizedContent } from "@/lib/i18n/dictionary";
import {
  translateIfNeeded,
  useTranslator,
} from "@/lib/translation/content-translation";

// Types for our content models
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
    firstName?: string | null;
    lastName?: string | null;
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
    firstName?: string | null;
    lastName?: string | null;
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
    firstName?: string | null;
    lastName?: string | null;
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

    // Auto-translate content if needed
    const translatedNews = await Promise.all(
      news.map(async (item) => {
        // const translatedItem = await translateIfNeeded(
        //   item,
        //   locale,
        //   process.env.ENABLE_AUTO_TRANSLATION === "true"
        // );
        const translatedItem = item;

        return {
          id: item.id,
          title: getLocalizedContent(
            translatedItem as Record<string, unknown>,
            locale,
            "title"
          ),
          content: getLocalizedContent(
            translatedItem as Record<string, unknown>,
            locale,
            "content"
          ),
          excerpt: getLocalizedContent(
            translatedItem as Record<string, unknown>,
            locale,
            "excerpt"
          ),
          category: item.category,
          status: item.status,
          featured: item.featured,
          featuredImageUrl: item.featuredImageUrl ?? undefined,
          publishDate: item.publishDate ?? undefined,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
          author: item.author,
        };
      })
    );

    return translatedNews;
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

    // Auto-translate content if needed
    const translatedNews = await Promise.all(
      news.map(async (item) => {
        // const translatedItem = await translateIfNeeded(
        //   item,
        //   locale,
        //   process.env.ENABLE_AUTO_TRANSLATION === "true"
        // );
        const translatedItem = item;

        return {
          id: item.id,
          title: getLocalizedContent(
            translatedItem as Record<string, unknown>,
            locale,
            "title"
          ),
          content: getLocalizedContent(
            translatedItem as Record<string, unknown>,
            locale,
            "content"
          ),
          excerpt: getLocalizedContent(
            translatedItem as Record<string, unknown>,
            locale,
            "excerpt"
          ),
          category: item.category,
          status: item.status,
          featured: item.featured,
          featuredImageUrl: item.featuredImageUrl ?? undefined,
          publishDate: item.publishDate ?? undefined,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
          author: item.author,
        };
      })
    );

    return translatedNews;
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

    return news.map((item) => ({
      id: item.id,
      title: getLocalizedContent(item, locale, "title"),
      content: getLocalizedContent(item, locale, "content"),
      excerpt: getLocalizedContent(item, locale, "excerpt"),
      category: item.category,
      status: item.status,
      featured: item.featured,
      featuredImageUrl: item.featuredImageUrl ?? undefined,
      publishDate: item.publishDate ?? undefined,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      author: item.author,
    }));
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

    return {
      id: news.id,
      title: getLocalizedContent(news, locale, "title"),
      content: getLocalizedContent(news, locale, "content"),
      excerpt: getLocalizedContent(news, locale, "excerpt"),
      category: news.category,
      status: news.status,
      featured: news.featured,
      featuredImageUrl: news.featuredImageUrl ?? undefined,
      publishDate: news.publishDate ?? undefined,
      createdAt: news.createdAt,
      updatedAt: news.updatedAt,
      author: news.author,
    };
  }
}

// Programs content utilities
export class ProgramsService {
  static async getActivePrograms(
    locale: Locale,
    limit?: number
  ): Promise<LocalizedProgram[]> {
    try {
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

      return programs.map((item) => ({
        id: item.id,
        title: getLocalizedContent(item, locale, "title"),
        description: getLocalizedContent(item, locale, "description"),
        overview: getLocalizedContent(item, locale, "overview"),
        objectives: getLocalizedContent(item, locale, "objectives"),
        type: item.type,
        status: item.status,
        featured: item.featured,
        startDate: item.startDate ?? undefined,
        endDate: item.endDate ?? undefined,
        featuredImageUrl: item.featuredImageUrl ?? undefined,
        galleryImages: item.galleryImages,
        documentUrls: item.documentUrls,
        targetPopulation: item.targetPopulation ?? undefined,
        region: item.region ?? undefined,
        budget: item.budget ?? undefined,
        progressPercentage: item.progressPercentage ?? undefined,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        manager: item.manager,
      }));
    } catch (error) {
      console.error("Error fetching active programs:", error);
      return [];
    }
  }

  static async getFeaturedPrograms(
    locale: Locale,
    limit = 3
  ): Promise<LocalizedProgram[]> {
    try {
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

      return programs.map((item) => ({
        id: item.id,
        title: getLocalizedContent(item, locale, "title"),
        description: getLocalizedContent(item, locale, "description"),
        overview: getLocalizedContent(item, locale, "overview"),
        objectives: getLocalizedContent(item, locale, "objectives"),
        type: item.type,
        status: item.status,
        featured: item.featured,
        startDate: item.startDate ?? undefined,
        endDate: item.endDate ?? undefined,
        featuredImageUrl: item.featuredImageUrl ?? undefined,
        galleryImages: item.galleryImages,
        documentUrls: item.documentUrls,
        targetPopulation: item.targetPopulation ?? undefined,
        region: item.region ?? undefined,
        budget: item.budget ?? undefined,
        progressPercentage: item.progressPercentage ?? undefined,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        manager: item.manager,
      }));
    } catch (error) {
      console.error("Error fetching featured programs:", error);
      return [];
    }
  }

  static async getProgramsByType(
    type: string,
    locale: Locale,
    limit?: number
  ): Promise<LocalizedProgram[]> {
    try {
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

      return programs.map((item) => ({
        id: item.id,
        title: getLocalizedContent(item, locale, "title"),
        description: getLocalizedContent(item, locale, "description"),
        overview: getLocalizedContent(item, locale, "overview"),
        objectives: getLocalizedContent(item, locale, "objectives"),
        type: item.type,
        status: item.status,
        featured: item.featured,
        startDate: item.startDate ?? undefined,
        endDate: item.endDate ?? undefined,
        featuredImageUrl: item.featuredImageUrl ?? undefined,
        galleryImages: item.galleryImages,
        documentUrls: item.documentUrls,
        targetPopulation: item.targetPopulation ?? undefined,
        region: item.region ?? undefined,
        budget: item.budget ?? undefined,
        progressPercentage: item.progressPercentage ?? undefined,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        manager: item.manager,
      }));
    } catch (error) {
      console.error("Error fetching programs by type:", error);
      return [];
    }
  }

  static async getProgramById(
    id: string,
    locale: Locale
  ): Promise<LocalizedProgram | null> {
    try {
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

      return {
        id: program.id,
        title: getLocalizedContent(program, locale, "title"),
        description: getLocalizedContent(program, locale, "description"),
        overview: getLocalizedContent(program, locale, "overview"),
        objectives: getLocalizedContent(program, locale, "objectives"),
        type: program.type,
        status: program.status,
        featured: program.featured,
        startDate: program.startDate ?? undefined,
        endDate: program.endDate ?? undefined,
        featuredImageUrl: program.featuredImageUrl ?? undefined,
        galleryImages: program.galleryImages,
        documentUrls: program.documentUrls,
        targetPopulation: program.targetPopulation ?? undefined,
        region: program.region ?? undefined,
        budget: program.budget ?? undefined,
        progressPercentage: program.progressPercentage ?? undefined,
        createdAt: program.createdAt,
        updatedAt: program.updatedAt,
        manager: program.manager,
      };
    } catch (error) {
      console.error("Error fetching program by id:", error);
      return null;
    }
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

    return publications.map((item) => ({
      id: item.id,
      title: getLocalizedContent(item, locale, "title"),
      description: getLocalizedContent(item, locale, "description"),
      abstract: getLocalizedContent(item, locale, "abstract"),
      type: item.type,
      status: item.status,
      featured: item.featured,
      fileUrl: item.fileUrl,
      fileName: item.fileName,
      fileSize: item.fileSize ?? undefined,
      mimeType: item.mimeType ?? undefined,
      coverImageUrl: item.coverImageUrl ?? undefined,
      thumbnailUrl: item.thumbnailUrl ?? undefined,
      tags: item.tags,
      keywords: item.keywords,
      publishDate: item.publishDate ?? undefined,
      isbn: item.isbn ?? undefined,
      doi: item.doi ?? undefined,
      citationFormat: item.citationFormat ?? undefined,
      downloadCount: item.downloadCount,
      viewCount: item.viewCount,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      author: item.author,
      relatedPrograms: item.relatedPrograms,
    }));
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

    return tags.map((item) => ({
      id: item.id,
      name: getLocalizedContent(item, locale, "name"),
      slug: item.slug,
      contentType: item.contentType,
      color: item.color ?? undefined,
      usageCount: item.usageCount,
      isActive: item.isActive,
    }));
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

    return tags.map((item) => ({
      id: item.id,
      name: getLocalizedContent(item, locale, "name"),
      slug: item.slug,
      contentType: item.contentType,
      color: item.color ?? undefined,
      usageCount: item.usageCount,
      isActive: item.isActive,
    }));
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
            { title: { contains: query, mode: "insensitive" } },
            { content: { contains: query, mode: "insensitive" } },
            { excerpt: { contains: query, mode: "insensitive" } },
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

      results.news = news.map((item) => ({
        id: item.id,
        title: getLocalizedContent(item, locale, "title"),
        content: getLocalizedContent(item, locale, "content"),
        excerpt: getLocalizedContent(item, locale, "excerpt"),
        category: item.category,
        status: item.status,
        featured: item.featured,
        featuredImageUrl: item.featuredImageUrl ?? undefined,
        publishDate: item.publishDate ?? undefined,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        author: item.author,
      }));
    }

    if (contentTypes.includes("programs")) {
      const programs = await prisma.program.findMany({
        where: {
          OR: [
            { title: { contains: query, mode: "insensitive" } },
            { description: { contains: query, mode: "insensitive" } },
            { overview: { contains: query, mode: "insensitive" } },
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

      results.programs = programs.map((item) => ({
        id: item.id,
        title: getLocalizedContent(item, locale, "title"),
        description: getLocalizedContent(item, locale, "description"),
        overview: getLocalizedContent(item, locale, "overview"),
        objectives: getLocalizedContent(item, locale, "objectives"),
        type: item.type,
        status: item.status,
        featured: item.featured,
        startDate: item.startDate ?? undefined,
        endDate: item.endDate ?? undefined,
        featuredImageUrl: item.featuredImageUrl ?? undefined,
        galleryImages: item.galleryImages,
        documentUrls: item.documentUrls,
        targetPopulation: item.targetPopulation ?? undefined,
        region: item.region ?? undefined,
        budget: item.budget ?? undefined,
        progressPercentage: item.progressPercentage ?? undefined,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        manager: item.manager,
      }));
    }

    if (contentTypes.includes("publications")) {
      const publications = await prisma.digitalLibrary.findMany({
        where: {
          status: "PUBLISHED",
          OR: [
            { title: { contains: query, mode: "insensitive" } },
            { description: { contains: query, mode: "insensitive" } },
            { abstract: { contains: query, mode: "insensitive" } },
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

      results.publications = publications.map((item) => ({
        id: item.id,
        title: getLocalizedContent(item, locale, "title"),
        description: getLocalizedContent(item, locale, "description"),
        abstract: getLocalizedContent(item, locale, "abstract"),
        type: item.type,
        status: item.status,
        featured: item.featured,
        fileUrl: item.fileUrl,
        fileName: item.fileName,
        fileSize: item.fileSize ?? undefined,
        mimeType: item.mimeType ?? undefined,
        coverImageUrl: item.coverImageUrl ?? undefined,
        thumbnailUrl: item.thumbnailUrl ?? undefined,
        tags: item.tags,
        keywords: item.keywords,
        publishDate: item.publishDate ?? undefined,
        isbn: item.isbn ?? undefined,
        doi: item.doi ?? undefined,
        citationFormat: item.citationFormat ?? undefined,
        downloadCount: item.downloadCount,
        viewCount: item.viewCount,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        author: item.author,
        relatedPrograms: item.relatedPrograms,
      }));
    }

    return results;
  }
}
