import prisma from "@/lib/prisma";
import type { Locale } from "../../../i18n";
import { MediaType, MediaCategory } from "@prisma/client";
import { getLocalizedContent } from "@/lib/i18n/dictionary";

// Types for our media resources with localized fields
export interface LocalizedResource {
  id: string;
  fileName: string;
  originalName: string;
  url: string;
  thumbnailUrl?: string;
  type: MediaType;
  category: MediaCategory;
  mimeType: string;
  fileSize: number;
  altText?: string;
  caption?: string;
  dimensions?: string;
  duration?: number;
  tags: string[];
  downloadCount: number;
  usageCount: number;
  isPublic: boolean;
  uploaderId: string;
  createdAt: Date;
  updatedAt: Date;
  uploader: {
    id: string;
    firstName?: string | null;
    lastName?: string | null;
  };
}

// Resources content utilities
export class ResourcesService {
  static async getPublicResources(
    locale: Locale,
    limit?: number
  ): Promise<LocalizedResource[]> {
    const resources = await prisma.mediaAsset.findMany({
      where: {
        isPublic: true,
      },
      include: {
        uploader: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
    });

    return resources.map((item) => ({
      id: item.id,
      fileName: item.fileName,
      originalName: item.originalName,
      url: item.url,
      thumbnailUrl: item.thumbnailUrl ?? undefined,
      type: item.type,
      category: item.category,
      mimeType: item.mimeType,
      fileSize: item.fileSize,
      altText: getLocalizedContent(item, locale, "altText"),
      caption: getLocalizedContent(item, locale, "caption"),
      dimensions: item.dimensions ?? undefined,
      duration: item.duration ?? undefined,
      tags: item.tags,
      downloadCount: item.downloadCount,
      usageCount: item.usageCount,
      isPublic: item.isPublic,
      uploaderId: item.uploaderId,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      uploader: item.uploader,
    }));
  }

  static async getFeaturedResources(
    locale: Locale,
    limit = 3
  ): Promise<LocalizedResource[]> {
    const resources = await prisma.mediaAsset.findMany({
      where: {
        isPublic: true,
        // We'll use download count and usage count as indicators of "featured" content
        OR: [{ downloadCount: { gte: 10 } }, { usageCount: { gte: 5 } }],
      },
      include: {
        uploader: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: [
        { downloadCount: "desc" },
        { usageCount: "desc" },
        { createdAt: "desc" },
      ],
      take: limit,
    });

    return resources.map((item) => ({
      id: item.id,
      fileName: item.fileName,
      originalName: item.originalName,
      url: item.url,
      thumbnailUrl: item.thumbnailUrl ?? undefined,
      type: item.type,
      category: item.category,
      mimeType: item.mimeType,
      fileSize: item.fileSize,
      altText: getLocalizedContent(item, locale, "altText"),
      caption: getLocalizedContent(item, locale, "caption"),
      dimensions: item.dimensions ?? undefined,
      duration: item.duration ?? undefined,
      tags: item.tags,
      downloadCount: item.downloadCount,
      usageCount: item.usageCount,
      isPublic: item.isPublic,
      uploaderId: item.uploaderId,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      uploader: item.uploader,
    }));
  }

  static async getResourcesByCategory(
    category: MediaCategory,
    locale: Locale,
    limit?: number
  ): Promise<LocalizedResource[]> {
    const resources = await prisma.mediaAsset.findMany({
      where: {
        isPublic: true,
        category,
      },
      include: {
        uploader: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
    });

    return resources.map((item) => ({
      id: item.id,
      fileName: item.fileName,
      originalName: item.originalName,
      url: item.url,
      thumbnailUrl: item.thumbnailUrl ?? undefined,
      type: item.type,
      category: item.category,
      mimeType: item.mimeType,
      fileSize: item.fileSize,
      altText: getLocalizedContent(item, locale, "altText"),
      caption: getLocalizedContent(item, locale, "caption"),
      dimensions: item.dimensions ?? undefined,
      duration: item.duration ?? undefined,
      tags: item.tags,
      downloadCount: item.downloadCount,
      usageCount: item.usageCount,
      isPublic: item.isPublic,
      uploaderId: item.uploaderId,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      uploader: item.uploader,
    }));
  }

  static async getResourcesByType(
    type: MediaType,
    locale: Locale,
    limit?: number
  ): Promise<LocalizedResource[]> {
    const resources = await prisma.mediaAsset.findMany({
      where: {
        isPublic: true,
        type,
      },
      include: {
        uploader: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
    });

    return resources.map((item) => ({
      id: item.id,
      fileName: item.fileName,
      originalName: item.originalName,
      url: item.url,
      thumbnailUrl: item.thumbnailUrl ?? undefined,
      type: item.type,
      category: item.category,
      mimeType: item.mimeType,
      fileSize: item.fileSize,
      altText: getLocalizedContent(item, locale, "altText"),
      caption: getLocalizedContent(item, locale, "caption"),
      dimensions: item.dimensions ?? undefined,
      duration: item.duration ?? undefined,
      tags: item.tags,
      downloadCount: item.downloadCount,
      usageCount: item.usageCount,
      isPublic: item.isPublic,
      uploaderId: item.uploaderId,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      uploader: item.uploader,
    }));
  }

  static async getResourceById(
    id: string,
    locale: Locale
  ): Promise<LocalizedResource | null> {
    const resource = await prisma.mediaAsset.findUnique({
      where: {
        id,
        isPublic: true, // Only allow access to public resources
      },
      include: {
        uploader: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (!resource) return null;

    return {
      id: resource.id,
      fileName: resource.fileName,
      originalName: resource.originalName,
      url: resource.url,
      thumbnailUrl: resource.thumbnailUrl ?? undefined,
      type: resource.type,
      category: resource.category,
      mimeType: resource.mimeType,
      fileSize: resource.fileSize,
      altText: getLocalizedContent(resource, locale, "altText"),
      caption: getLocalizedContent(resource, locale, "caption"),
      dimensions: resource.dimensions ?? undefined,
      duration: resource.duration ?? undefined,
      tags: resource.tags,
      downloadCount: resource.downloadCount,
      usageCount: resource.usageCount,
      isPublic: resource.isPublic,
      uploaderId: resource.uploaderId,
      createdAt: resource.createdAt,
      updatedAt: resource.updatedAt,
      uploader: resource.uploader,
    };
  }

  static async searchResources(
    query: string,
    locale: Locale,
    filters: {
      type?: MediaType;
      category?: MediaCategory;
      tags?: string[];
    } = {}
  ): Promise<LocalizedResource[]> {
    const whereClause: any = {
      isPublic: true,
      OR: [
        { originalName: { contains: query, mode: "insensitive" } },
        { fileName: { contains: query, mode: "insensitive" } },
        { altText: { contains: query, mode: "insensitive" } },
        { caption: { contains: query, mode: "insensitive" } },
        { tags: { hasSome: [query] } },
      ],
    };

    if (filters.type) {
      whereClause.type = filters.type;
    }

    if (filters.category) {
      whereClause.category = filters.category;
    }

    if (filters.tags && filters.tags.length > 0) {
      whereClause.tags = { hasSome: filters.tags };
    }

    const resources = await prisma.mediaAsset.findMany({
      where: whereClause,
      include: {
        uploader: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: [{ downloadCount: "desc" }, { createdAt: "desc" }],
      take: 50,
    });

    return resources.map((item) => ({
      id: item.id,
      fileName: item.fileName,
      originalName: item.originalName,
      url: item.url,
      thumbnailUrl: item.thumbnailUrl ?? undefined,
      type: item.type,
      category: item.category,
      mimeType: item.mimeType,
      fileSize: item.fileSize,
      altText: getLocalizedContent(item, locale, "altText"),
      caption: getLocalizedContent(item, locale, "caption"),
      dimensions: item.dimensions ?? undefined,
      duration: item.duration ?? undefined,
      tags: item.tags,
      downloadCount: item.downloadCount,
      usageCount: item.usageCount,
      isPublic: item.isPublic,
      uploaderId: item.uploaderId,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      uploader: item.uploader,
    }));
  }

  static async incrementDownloadCount(id: string): Promise<void> {
    await prisma.mediaAsset.update({
      where: { id },
      data: {
        downloadCount: {
          increment: 1,
        },
      },
    });
  }

  static async incrementUsageCount(id: string): Promise<void> {
    await prisma.mediaAsset.update({
      where: { id },
      data: {
        usageCount: {
          increment: 1,
        },
      },
    });
  }

  static async getPopularTags(limit = 20): Promise<string[]> {
    const resources = await prisma.mediaAsset.findMany({
      where: {
        isPublic: true,
      },
      select: {
        tags: true,
      },
    });

    const tagCounts: Record<string, number> = {};

    resources.forEach((resource) => {
      resource.tags.forEach((tag) => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });

    return Object.entries(tagCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit)
      .map(([tag]) => tag);
  }

  static async getAvailableFolders(): Promise<string[]> {
    // Folder field doesn't exist in current schema
    return [];
  }
}
