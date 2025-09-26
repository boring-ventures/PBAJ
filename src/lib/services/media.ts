import {
  MediaAssetFormData,
  getFileType,
  validateFile,
} from "@/lib/validations/media";
import prisma from "@/lib/prisma";
import { MediaType, MediaCategory } from "@prisma/client";

// Interface for upload result
interface UploadResult {
  success: boolean;
  fileUrl?: string;
  thumbnailUrl?: string;
  error?: string;
  metadata?: {
    width?: number;
    height?: number;
    duration?: number;
    [key: string]: unknown;
  };
}

// Interface for media asset
interface MediaAsset {
  id: string;
  fileName: string;
  originalName: string;
  url: string;
  thumbnailUrl?: string;
  type: MediaType;
  category: MediaCategory;
  mimeType: string;
  fileSize: number;
  altTextEs?: string;
  altTextEn?: string;
  captionEs?: string;
  captionEn?: string;
  dimensions?: string;
  duration?: number;
  tags: string[];
  metadata?: any;
  isPublic: boolean;
  downloadCount: number;
  uploaderId: string;
  createdAt: Date;
  updatedAt: Date;
}

// Service class for handling media operations
export class MediaService {
  /**
   * Upload a file to storage and create media asset record
   */
  static async uploadFile(
    file: File,
    uploaderId: string,
    options: {
      category?: MediaCategory;
      altText?: string;
      caption?: string;
      tags?: string[];
      isPublic?: boolean;
    } = {}
  ): Promise<{ success: boolean; asset?: MediaAsset; error?: string }> {
    try {
      // Validate file
      const validation = validateFile(file);
      if (!validation.valid) {
        return { success: false, error: validation.error };
      }

      // Determine file type and category
      const fileType = getFileType(file.type);
      if (!fileType) {
        return { success: false, error: "Unsupported file type" };
      }

      const mediaType = this.getMediaTypeFromFileType(fileType);
      const category = options.category || MediaCategory.GENERAL;

      // Generate unique filename
      const timestamp = Date.now();
      const randomId = Math.random().toString(36).substring(2);
      const extension = file.name.split(".").pop() || "";
      const filename = `${timestamp}_${randomId}.${extension}`;

      // In a real implementation, you would upload to storage (Supabase Storage, AWS S3, etc.)
      // For now, we'll simulate the upload process
      const uploadResult = await this.simulateFileUpload(
        file,
        filename,
        fileType
      );

      if (!uploadResult.success) {
        return { success: false, error: uploadResult.error };
      }

      // Create media asset record in database
      const mediaAsset = await prisma.mediaAsset.create({
        data: {
          fileName: filename,
          originalName: file.name,
          url: uploadResult.fileUrl!,
          thumbnailUrl: uploadResult.thumbnailUrl,
          type: mediaType,
          category,
          mimeType: file.type,
          fileSize: file.size,
          altText: options.altText,
          caption: options.caption,
          dimensions:
            uploadResult.metadata?.width && uploadResult.metadata?.height
              ? `${uploadResult.metadata.width}x${uploadResult.metadata.height}`
              : undefined,
          duration: uploadResult.metadata?.duration,
          tags: options.tags || [],
          metadata: uploadResult.metadata as any,
          isPublic: options.isPublic || false,
          uploaderId,
        },
      });

      return { success: true, asset: mediaAsset as MediaAsset };
    } catch (error) {
      console.error("Error uploading file:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  /**
   * Get media assets with filtering and pagination
   */
  static async getMediaAssets(
    filters: {
      type?: MediaType;
      category?: MediaCategory;
      search?: string;
      tags?: string[];
      isPublic?: boolean;
      uploaderId?: string;
      page?: number;
      limit?: number;
      sortBy?: "createdAt" | "fileName" | "fileSize" | "downloadCount";
      sortOrder?: "asc" | "desc";
    } = {}
  ) {
    try {
      const {
        type,
        category,
        search,
        tags,
        isPublic,
        uploaderId,
        page = 1,
        limit = 20,
        sortBy = "createdAt",
        sortOrder = "desc",
      } = filters;

      const where: Record<string, unknown> = {};

      if (type) where.type = type;
      if (category) where.category = category;
      if (isPublic !== undefined) where.isPublic = isPublic;
      if (uploaderId) where.uploaderId = uploaderId;

      if (search) {
        where.OR = [
          { fileName: { contains: search, mode: "insensitive" } },
          { originalName: { contains: search, mode: "insensitive" } },
          { altTextEs: { contains: search, mode: "insensitive" } },
          { altTextEn: { contains: search, mode: "insensitive" } },
          { captionEs: { contains: search, mode: "insensitive" } },
          { captionEn: { contains: search, mode: "insensitive" } },
        ];
      }

      if (tags && tags.length > 0) {
        where.tags = { hasSome: tags };
      }

      const skip = (page - 1) * limit;

      const [assets, totalCount] = await Promise.all([
        prisma.mediaAsset.findMany({
          where,
          skip,
          take: limit,
          orderBy: { [sortBy]: sortOrder },
          include: {
            uploader: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                avatarUrl: true,
              },
            },
          },
        }),
        prisma.mediaAsset.count({ where }),
      ]);

      const totalPages = Math.ceil(totalCount / limit);

      return {
        success: true,
        assets,
        pagination: {
          currentPage: page,
          totalPages,
          totalCount,
          limit,
        },
      };
    } catch (error) {
      console.error("Error fetching media assets:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        assets: [],
        pagination: { currentPage: 1, totalPages: 0, totalCount: 0, limit: 20 },
      };
    }
  }

  /**
   * Update media asset
   */
  static async updateMediaAsset(
    assetId: string,
    updates: Partial<MediaAssetFormData>,
    _userId: string
  ) {
    try {
      // Check if asset exists and user has permission
      const existingAsset = await prisma.mediaAsset.findUnique({
        where: { id: assetId },
      });

      if (!existingAsset) {
        return { success: false, error: "Media asset not found" };
      }

      // For now, allow any authenticated user to update
      // In a real app, you might want more granular permissions

      const updatedAsset = await prisma.mediaAsset.update({
        where: { id: assetId },
        data: {
          ...updates,
          updatedAt: new Date(),
        },
      });

      return { success: true, asset: updatedAsset };
    } catch (error) {
      console.error("Error updating media asset:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  /**
   * Delete media asset
   */
  static async deleteMediaAsset(assetId: string, _userId: string) {
    try {
      const existingAsset = await prisma.mediaAsset.findUnique({
        where: { id: assetId },
      });

      if (!existingAsset) {
        return { success: false, error: "Media asset not found" };
      }

      // Check permissions (owner or admin)
      // For now, allow any authenticated user to delete
      // In a real app, you might want more granular permissions

      // Delete from storage (simulated)
      await this.simulateFileDelete(existingAsset.url);

      // Delete from database
      await prisma.mediaAsset.delete({
        where: { id: assetId },
      });

      return { success: true };
    } catch (error) {
      console.error("Error deleting media asset:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  /**
   * Bulk operations on media assets
   */
  static async bulkOperation(
    action: "delete" | "move" | "tag" | "untag" | "public" | "private",
    assetIds: string[],
    userId: string,
    options: {
      targetFolder?: string;
      tags?: string[];
    } = {}
  ) {
    try {
      let updateData: Record<string, unknown> = {};

      switch (action) {
        case "delete":
          const deletedCount = await prisma.mediaAsset.deleteMany({
            where: { id: { in: assetIds } },
          });
          return { success: true, affected: deletedCount.count };

        case "public":
          updateData = { isPublic: true };
          break;

        case "private":
          updateData = { isPublic: false };
          break;

        case "tag":
          if (options.tags && options.tags.length > 0) {
            // This is a simplified approach - in reality you'd need to handle array operations properly
            const assets = await prisma.mediaAsset.findMany({
              where: { id: { in: assetIds } },
              select: { id: true, tags: true },
            });

            const updates = assets.map((asset) => ({
              where: { id: asset.id },
              data: {
                tags: [...new Set([...asset.tags, ...options.tags!])],
                updatedAt: new Date(),
              },
            }));

            await Promise.all(
              updates.map((update) => prisma.mediaAsset.update(update))
            );

            return { success: true, affected: updates.length };
          }
          break;

        case "untag":
          if (options.tags && options.tags.length > 0) {
            const assets = await prisma.mediaAsset.findMany({
              where: { id: { in: assetIds } },
              select: { id: true, tags: true },
            });

            const updates = assets.map((asset) => ({
              where: { id: asset.id },
              data: {
                tags: asset.tags.filter((tag) => !options.tags!.includes(tag)),
                updatedAt: new Date(),
              },
            }));

            await Promise.all(
              updates.map((update) => prisma.mediaAsset.update(update))
            );

            return { success: true, affected: updates.length };
          }
          break;
      }

      if (Object.keys(updateData).length > 0) {
        const updatedCount = await prisma.mediaAsset.updateMany({
          where: { id: { in: assetIds } },
          data: {
            ...updateData,
            updatedAt: new Date(),
          },
        });

        return { success: true, affected: updatedCount.count };
      }

      return { success: false, error: "Invalid bulk operation" };
    } catch (error) {
      console.error("Error in bulk operation:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  /**
   * Get media asset by ID
   */
  static async getMediaAssetById(assetId: string) {
    try {
      const asset = await prisma.mediaAsset.findUnique({
        where: { id: assetId },
        include: {
          uploader: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              avatarUrl: true,
            },
          },
        },
      });

      if (!asset) {
        return { success: false, error: "Media asset not found" };
      }

      return { success: true, asset };
    } catch (error) {
      console.error("Error fetching media asset:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  /**
   * Increment usage count for a media asset
   */
  static async incrementUsageCount(assetId: string) {
    try {
      // Note: usageCount field doesn't exist in MediaAsset model
      // await prisma.mediaAsset.update({
      //   where: { id: assetId },
      //   data: {
      //     usageCount: { increment: 1 },
      //   },
      // });

      return { success: true };
    } catch (error) {
      console.error("Error incrementing usage count:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  /**
   * Get media statistics
   */
  static async getMediaStatistics(userId?: string) {
    try {
      const where = userId ? { uploaderId: userId } : {};

      const [totalAssets, totalSize, typeStats, categoryStats] =
        await Promise.all([
          prisma.mediaAsset.count({ where }),
          prisma.mediaAsset.aggregate({
            where,
            _sum: { fileSize: true },
          }),
          prisma.mediaAsset.groupBy({
            by: ["type"],
            where,
            _count: true,
          }),
          prisma.mediaAsset.groupBy({
            by: ["category"],
            where,
            _count: true,
          }),
        ]);

      return {
        success: true,
        statistics: {
          totalAssets,
          totalSize: totalSize._sum.fileSize || 0,
          byType: typeStats.map((stat) => ({
            type: stat.type,
            count: stat._count,
          })),
          byCategory: categoryStats.map((stat) => ({
            category: stat.category,
            count: stat._count,
          })),
        },
      };
    } catch (error) {
      console.error("Error fetching media statistics:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  // Private helper methods

  private static getMediaTypeFromFileType(fileType: string): MediaType {
    switch (fileType) {
      case "image":
        return MediaType.IMAGE;
      case "video":
        return MediaType.VIDEO;
      case "audio":
        return MediaType.AUDIO;
      case "document":
        return MediaType.DOCUMENT;
      case "archive":
        return MediaType.ARCHIVE;
      default:
        return MediaType.DOCUMENT;
    }
  }

  private static async simulateFileUpload(
    file: File,
    filename: string,
    fileType: string
  ): Promise<UploadResult> {
    // In a real implementation, this would:
    // 1. Upload to Supabase Storage, AWS S3, or similar
    // 2. Generate thumbnails for images/videos
    // 3. Extract metadata (dimensions, duration, etc.)
    // 4. Optimize files if needed

    return new Promise((resolve) => {
      // Simulate upload delay
      setTimeout(() => {
        // Simulate successful upload
        const baseUrl = "https://example.com/media"; // Replace with actual storage URL
        const fileUrl = `${baseUrl}/${filename}`;

        let thumbnailUrl: string | undefined;
        let metadata: { width?: number; height?: number; duration?: number } =
          {};

        // Simulate thumbnail generation for images
        if (fileType === "image") {
          thumbnailUrl = `${baseUrl}/thumbnails/${filename}`;
          metadata = { width: 800, height: 600 }; // Simulated dimensions
        }

        // Simulate duration extraction for video/audio
        if (fileType === "video" || fileType === "audio") {
          metadata = { duration: 120 }; // Simulated 2-minute duration
          if (fileType === "video") {
            metadata.width = 1920;
            metadata.height = 1080;
            thumbnailUrl = `${baseUrl}/thumbnails/${filename}.jpg`;
          }
        }

        resolve({
          success: true,
          fileUrl,
          thumbnailUrl,
          metadata,
        });
      }, 1000); // Simulate 1-second upload
    });
  }

  private static async simulateFileDelete(fileUrl: string): Promise<void> {
    // In a real implementation, this would delete the file from storage
    console.log(`Simulating deletion of file: ${fileUrl}`);
    return Promise.resolve();
  }
}
